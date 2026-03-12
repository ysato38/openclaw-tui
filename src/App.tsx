import React, { useEffect, useMemo, useState } from 'react';
import { useApp, useInput } from 'ink';
import { Dashboard } from './components/Dashboard.js';
import { DashboardState } from './core/types.js';
import { ThemeName, nextTheme } from './theme/themes.js';
import { applyAlerts } from './pulse/alerts.js';
import { collectMonitoringSnapshot } from './pulse/monitor.js';
import { createIssueFeed, IssueFeedItem } from './data/github/issueFeed.js';

const MAX_PANELS = 5;
const MAX_ACTIVITY = 8;

const DEFAULT_AGENTS = ['main', 'dev', 'intel', 'philo', 'pulse', 'ui-ux'];

const initialState: DashboardState = {
  now: new Date().toLocaleString('ja-JP'),
  agents: DEFAULT_AGENTS.map((name) => ({ name, online: false, heartbeatSecAgo: Number.POSITIVE_INFINITY, focus: 'runtime' })),
  tasks: [],
  activity: [{ ts: new Date().toTimeString().slice(0, 5), agent: 'system', message: 'dashboard booting...' }],
  health: { cpu: 0, mem: 0, dsk: 0, tokensToday: process.env.OPENCLAW_TOKENS_TODAY ?? 'N/A', gatewayUp: false }
};

const appendActivity = (s: DashboardState, agent: string, message: string): DashboardState => ({
  ...s,
  activity: [{ ts: new Date().toTimeString().slice(0, 5), agent, message }, ...s.activity].slice(0, MAX_ACTIVITY)
});

const parseCommand = (raw: string): { cmd: string; args: string[] } => {
  const [cmd = '', ...args] = raw.trim().split(/\s+/);
  return { cmd: cmd.toLowerCase(), args };
};

const focusForAgent = (name: string): string => {
  switch (name) {
    case 'main':
      return 'orchestration';
    case 'dev':
      return 'implementation';
    case 'intel':
      return 'research';
    case 'philo':
      return 'reasoning';
    case 'pulse':
      return 'monitoring';
    case 'ui-ux':
      return 'design';
    default:
      return 'runtime';
  }
};

const toActivityFromIssues = (issues: IssueFeedItem[]): Array<{ ts: string; agent: string; message: string }> =>
  issues.slice(0, 4).map((i) => ({
    ts: new Date(i.updatedAt).toTimeString().slice(0, 5),
    agent: i.assignees[0] ?? 'github',
    message: `#${i.id} ${i.title}`
  }));

export const App: React.FC = () => {
  const { exit } = useApp();
  const [state, setState] = useState<DashboardState>(initialState);
  const [theme, setTheme] = useState<ThemeName>('cyberpunk');
  const [focus, setFocus] = useState(0);
  const [commandMode, setCommandMode] = useState(false);
  const [commandText, setCommandText] = useState('');
  const [konamiBuffer, setKonamiBuffer] = useState('');

  const issueFeed = useMemo(
    () =>
      createIssueFeed({
        owner: process.env.OPENCLAW_TASKS_OWNER ?? 'ysato38',
        repo: process.env.OPENCLAW_TASKS_REPO ?? 'claw-tasks',
        token: process.env.GITHUB_TOKEN,
        pollIntervalMs: 20_000,
        perPage: 30,
        onUpdate: (issues) => {
          setState((s) => ({
            ...s,
            tasks: issues.slice(0, 30).map((i) => ({ id: i.id, title: i.title, column: i.column })),
            activity: [...toActivityFromIssues(issues), ...s.activity].slice(0, MAX_ACTIVITY)
          }));
        },
        onError: (error) => {
          setState((s) => appendActivity(s, 'github', `issue feed error: ${error.message.slice(0, 80)}`));
        }
      }),
    []
  );

  useEffect(() => {
    let active = true;
    let trend: Array<{ ts: string; diskPercent: number }> = [];

    const tick = async () => {
      try {
        const snapshot = applyAlerts(
          await collectMonitoringSnapshot(trend, {
            tokensToday: process.env.OPENCLAW_TOKENS_TODAY ?? 'N/A'
          })
        );
        trend = snapshot.diskTrend;
        if (!active) return;

        setState((s) => ({
          ...s,
          now: new Date().toLocaleString('ja-JP'),
          agents: snapshot.agents.map((a) => ({
            name: a.name,
            online: a.online,
            heartbeatSecAgo: Number.isFinite(a.heartbeatSecAgo) ? a.heartbeatSecAgo : Number.MAX_SAFE_INTEGER,
            focus: focusForAgent(a.name)
          })),
          health: {
            ...s.health,
            cpu: snapshot.resources.cpuPercent,
            mem: snapshot.resources.memPercent,
            dsk: snapshot.resources.diskPercent,
            gatewayUp: snapshot.gateway.up
          }
        }));
      } catch (error) {
        if (!active) return;
        const msg = error instanceof Error ? error.message : String(error);
        setState((s) => appendActivity(s, 'monitor', `monitor fallback: ${msg.slice(0, 80)}`));
      }
    };

    const id = setInterval(() => {
      void tick();
    }, 3000);

    issueFeed.start();
    void tick();

    return () => {
      active = false;
      clearInterval(id);
      issueFeed.stop();
    };
  }, [issueFeed]);

  useInput((input, key) => {
    if (key.ctrl && input === 'c') return exit();

    if (commandMode) {
      if (key.return) {
        const raw = commandText;
        const { cmd, args } = parseCommand(raw);

        if (cmd === 'quit' || cmd === 'q') {
          return exit();
        }

        if (cmd === 'theme' && args[0]) {
          const t = args[0].toLowerCase() as ThemeName;
          if (t === 'cyberpunk' || t === 'retro' || t === 'minimal') {
            setTheme(t);
            setState((s) => appendActivity(s, 'system', `theme -> ${t}`));
          } else {
            setState((s) => appendActivity(s, 'system', `unknown theme: ${args[0]}`));
          }
        } else if (cmd === 'help') {
          setState((s) => appendActivity(s, 'system', 'commands: :theme <cyberpunk|retro|minimal>, :focus <0-4>, :quit'));
        } else if (cmd === 'focus' && args[0]) {
          const idx = Number(args[0]);
          if (Number.isInteger(idx) && idx >= 0 && idx < MAX_PANELS) {
            setFocus(idx);
            setState((s) => appendActivity(s, 'system', `focus -> ${idx}`));
          }
        } else if (raw.trim() !== '') {
          setState((s) => appendActivity(s, 'system', `unknown command: ${raw.trim()}`));
        }

        setCommandMode(false);
        setCommandText('');
        return;
      }
      if (key.escape) {
        setCommandMode(false);
        setCommandText('');
        return;
      }
      if (key.backspace || key.delete) {
        setCommandText((t) => t.slice(0, -1));
        return;
      }
      if (input) setCommandText((t) => t + input);
      return;
    }

    if (input === 'q') return exit();
    if (input === ':') return setCommandMode(true);
    if (input === 't') return setTheme((t) => nextTheme(t));

    if (key.shift && key.tab) return setFocus((f) => (f - 1 + MAX_PANELS) % MAX_PANELS);
    if (key.tab) return setFocus((f) => (f + 1) % MAX_PANELS);

    if (input === 'h' || input === 'k') return setFocus((f) => (f - 1 + MAX_PANELS) % MAX_PANELS);
    if (input === 'j' || input === 'l') return setFocus((f) => (f + 1) % MAX_PANELS);

    const keyToken = key.upArrow
      ? 'U'
      : key.downArrow
        ? 'D'
        : key.leftArrow
          ? 'L'
          : key.rightArrow
            ? 'R'
            : input.toLowerCase();
    const next = (konamiBuffer + keyToken).slice(-10);
    setKonamiBuffer(next);

    if (next === 'UUDDLRLRBA') {
      setState((s) => appendActivity(s, 'system', '🎉 Konami unlocked: Mission Deep Space'));
      process.stdout.write('\x07');
    }
  });

  return <Dashboard state={state} themeName={theme} focusIndex={focus} commandMode={commandMode} commandText={commandText} />;
};
