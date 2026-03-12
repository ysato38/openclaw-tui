import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { execSync } from 'node:child_process';
import { AgentHeartbeat, DiskTrendPoint, GatewayStatus, LogRotationStatus, MonitoringSnapshot, ResourceSnapshot } from './types.js';

// Pulse monitoring collector for Mission Control TUI
export type MonitorOptions = {
  gatewayHost?: string;
  gatewayPort?: number;
  agentNames?: string[];
  openclawHome?: string;
  logWarnMb?: number;
  diskTrendSize?: number;
  tokensToday?: string;
};

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export const readResources = (tokensToday = 'N/A'): ResourceSnapshot => {
  const [l1] = os.loadavg();
  const cpuPercent = clamp(Math.round((l1 / Math.max(os.cpus().length, 1)) * 100));

  const total = os.totalmem();
  const free = os.freemem();
  const memPercent = clamp(Math.round(((total - free) / total) * 100));

  let diskPercent = 0;
  try {
    const out = execSync('df -k / | tail -1', { encoding: 'utf-8' }).trim();
    // Filesystem 1024-blocks Used Available Capacity Mounted on
    const cols = out.split(/\s+/);
    const cap = cols[4]?.replace('%', '');
    diskPercent = clamp(Number(cap || 0));
  } catch {
    diskPercent = 0;
  }

  return { cpuPercent, memPercent, diskPercent, tokensToday };
};

export const checkGateway = async (host = '127.0.0.1', port = 18789, timeoutMs = 800): Promise<GatewayStatus> => {
  const checkedAt = new Date().toISOString();

  const up = await new Promise<boolean>((resolve) => {
    const socket = new net.Socket();
    let done = false;

    const close = (ok: boolean) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve(ok);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => close(true));
    socket.once('timeout', () => close(false));
    socket.once('error', () => close(false));
    socket.connect(port, host);
  });

  return { up, host, port, checkedAt };
};

export const readAgentHeartbeats = (openclawHome = path.join(os.homedir(), '.openclaw'), agentNames = ['main', 'dev', 'intel', 'philo', 'pulse']): AgentHeartbeat[] => {
  const now = Date.now();

  return agentNames.map((name) => {
    const p = path.join(openclawHome, 'agents', name, 'sessions', 'sessions.json');

    try {
      const st = fs.statSync(p);
      const ageSec = Math.max(0, Math.floor((now - st.mtimeMs) / 1000));
      return {
        name,
        online: ageSec < 7200,
        heartbeatSecAgo: ageSec,
        lastUpdatedAt: new Date(st.mtimeMs).toISOString()
      };
    } catch {
      return {
        name,
        online: false,
        heartbeatSecAgo: Number.POSITIVE_INFINITY
      };
    }
  });
};

const listFiles = (dir: string): string[] => {
  try {
    return fs.readdirSync(dir).map((f) => path.join(dir, f));
  } catch {
    return [];
  }
};

export const readLogRotationStatus = (openclawHome = path.join(os.homedir(), '.openclaw'), warnMb = 100): LogRotationStatus => {
  const logDir = path.join(openclawHome, 'logs');
  const files = listFiles(logDir);

  let totalBytes = 0;
  const oversized: Array<{ path: string; sizeMb: number }> = [];

  for (const f of files) {
    try {
      const st = fs.statSync(f);
      if (!st.isFile()) continue;
      totalBytes += st.size;
      const sizeMb = st.size / (1024 * 1024);
      if (sizeMb >= warnMb) oversized.push({ path: f, sizeMb: Number(sizeMb.toFixed(1)) });
    } catch {
      // noop
    }
  }

  return {
    oversizedFiles: oversized.sort((a, b) => b.sizeMb - a.sizeMb),
    totalLogMb: Number((totalBytes / (1024 * 1024)).toFixed(1))
  };
};

export const pushDiskTrend = (prev: DiskTrendPoint[], diskPercent: number, size = 30): DiskTrendPoint[] => {
  const point = { ts: new Date().toTimeString().slice(0, 8), diskPercent };
  return [...prev, point].slice(-size);
};

export const collectMonitoringSnapshot = async (
  prevTrend: DiskTrendPoint[] = [],
  opts: MonitorOptions = {}
): Promise<MonitoringSnapshot> => {
  const resources = readResources(opts.tokensToday ?? 'N/A');
  const gateway = await checkGateway(opts.gatewayHost, opts.gatewayPort);
  const agents = readAgentHeartbeats(opts.openclawHome, opts.agentNames);
  const logs = readLogRotationStatus(opts.openclawHome, opts.logWarnMb);
  const diskTrend = pushDiskTrend(prevTrend, resources.diskPercent, opts.diskTrendSize ?? 30);

  return {
    now: new Date().toISOString(),
    resources,
    gateway,
    agents,
    logs,
    diskTrend,
    alerts: []
  };
};
