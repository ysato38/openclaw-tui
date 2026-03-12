import { DashboardState } from '../core/types.js';

const base: DashboardState = {
  now: new Date().toLocaleString('ja-JP'),
  agents: [
    { name: 'main', online: true, heartbeatSecAgo: 120, focus: 'orchestration' },
    { name: 'dev', online: true, heartbeatSecAgo: 40, focus: 'TUI skeleton' },
    { name: 'intel', online: true, heartbeatSecAgo: 85, focus: 'data feeds' },
    { name: 'philo', online: true, heartbeatSecAgo: 55, focus: 'UX narratives' },
    { name: 'pulse', online: true, heartbeatSecAgo: 15, focus: 'monitoring' }
  ],
  tasks: [
    { id: 42, title: 'Mission Control TUI', column: 'PROGRESS' },
    { id: 36, title: 'claude code usage audit', column: 'REVIEW' },
    { id: 43, title: 'intel feed panel', column: 'OPEN' }
  ],
  activity: [
    { ts: '15:00', agent: 'main', message: 'issue #42 orchestrating' },
    { ts: '15:01', agent: 'dev', message: 'scaffold started' }
  ],
  health: { cpu: 62, mem: 45, dsk: 78, tokensToday: '1.2M', gatewayUp: true }
};

const rand = (min: number, max: number) => Math.max(min, Math.min(max, Math.round(min + Math.random() * (max - min))));

export const nextState = (prev?: DashboardState): DashboardState => {
  const s = prev ?? base;
  const now = new Date();
  const hhmm = now.toTimeString().slice(0, 5);
  const tickMsg = [
    'heartbeat complete',
    'issue synced',
    'commit pushed',
    'feed refreshed',
    'health check ok'
  ][Math.floor(Math.random() * 5)];

  return {
    ...s,
    now: now.toLocaleString('ja-JP'),
    agents: s.agents.map((a) => ({ ...a, heartbeatSecAgo: Math.max(0, a.heartbeatSecAgo + rand(-10, 15)) })),
    activity: [{ ts: hhmm, agent: s.agents[rand(0, s.agents.length - 1)]!.name, message: tickMsg }, ...s.activity].slice(0, 8),
    health: {
      ...s.health,
      cpu: rand(35, 88),
      mem: rand(30, 75),
      dsk: s.health.dsk,
      gatewayUp: true
    }
  };
};

export const initialState = base;
