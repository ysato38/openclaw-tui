export type AgentStatus = { name: string; online: boolean; heartbeatSecAgo: number; focus: string };
export type TaskItem = { id: number; title: string; column: 'OPEN' | 'PROGRESS' | 'REVIEW' };
export type ActivityItem = { ts: string; agent: string; message: string };
export type SystemHealth = { cpu: number; mem: number; dsk: number; tokensToday: string; gatewayUp: boolean };

export type DashboardState = {
  now: string;
  agents: AgentStatus[];
  tasks: TaskItem[];
  activity: ActivityItem[];
  health: SystemHealth;
};
