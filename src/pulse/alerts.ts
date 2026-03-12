import { AlertItem, MonitoringSnapshot } from './types.js';

const ago = (sec: number): string => {
  if (!Number.isFinite(sec)) return 'unknown';
  if (sec < 60) return `${sec}s ago`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
};

export const evaluateAlerts = (s: MonitoringSnapshot): AlertItem[] => {
  const out: AlertItem[] = [];

  if (!s.gateway.up) {
    out.push({
      id: 'gateway-down',
      severity: 'critical',
      title: 'Gateway is DOWN',
      detail: `${s.gateway.host}:${s.gateway.port} not reachable`,
      bell: true
    });
  }

  if (s.resources.cpuPercent >= 90) {
    out.push({ id: 'cpu-hot', severity: 'warn', title: `High CPU ${s.resources.cpuPercent}%` });
  }
  if (s.resources.memPercent >= 90) {
    out.push({ id: 'mem-hot', severity: 'warn', title: `High MEM ${s.resources.memPercent}%` });
  }
  if (s.resources.diskPercent >= 90) {
    out.push({
      id: 'disk-critical',
      severity: 'critical',
      title: `Disk critical ${s.resources.diskPercent}%`,
      bell: true
    });
  } else if (s.resources.diskPercent >= 80) {
    out.push({ id: 'disk-warn', severity: 'warn', title: `Disk high ${s.resources.diskPercent}%` });
  }

  s.agents.filter((a) => !a.online).forEach((a) => {
    out.push({
      id: `agent-offline-${a.name}`,
      severity: 'warn',
      title: `Agent offline: ${a.name}`,
      detail: `last heartbeat ${ago(a.heartbeatSecAgo)}`
    });
  });

  if (s.logs.oversizedFiles.length > 0) {
    out.push({
      id: 'logs-oversized',
      severity: 'warn',
      title: `Large log files detected (${s.logs.oversizedFiles.length})`,
      detail: s.logs.oversizedFiles.slice(0, 2).map((f) => `${f.path.split('/').pop()} ${f.sizeMb}MB`).join(', ')
    });
  }

  return out;
};

export const applyAlerts = (s: MonitoringSnapshot): MonitoringSnapshot => ({
  ...s,
  alerts: evaluateAlerts(s)
});

export const shouldRingBell = (alerts: AlertItem[]): boolean => alerts.some((a) => a.bell || a.severity === 'critical');
