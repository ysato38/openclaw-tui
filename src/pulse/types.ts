export type Severity = 'ok' | 'warn' | 'critical';

export type ResourceSnapshot = {
  cpuPercent: number;
  memPercent: number;
  diskPercent: number;
  tokensToday?: string;
};

export type AgentHeartbeat = {
  name: string;
  online: boolean;
  heartbeatSecAgo: number;
  lastUpdatedAt?: string;
};

export type GatewayStatus = {
  up: boolean;
  host: string;
  port: number;
  checkedAt: string;
};

export type LogRotationStatus = {
  oversizedFiles: Array<{ path: string; sizeMb: number }>;
  totalLogMb: number;
};

export type DiskTrendPoint = {
  ts: string;
  diskPercent: number;
};

export type AlertItem = {
  id: string;
  severity: Exclude<Severity, 'ok'>;
  title: string;
  detail?: string;
  bell?: boolean;
};

export type MonitoringSnapshot = {
  now: string;
  resources: ResourceSnapshot;
  gateway: GatewayStatus;
  agents: AgentHeartbeat[];
  logs: LogRotationStatus;
  diskTrend: DiskTrendPoint[];
  alerts: AlertItem[];
};
