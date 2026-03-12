import React, { useEffect, useState } from 'react';
import { useApp, useInput } from 'ink';
import { Dashboard } from './components/Dashboard.js';
import { DashboardState } from './core/types.js';
import { initialState, nextState } from './data/mockStream.js';
import { ThemeName, nextTheme } from './theme/themes.js';
import { applyAlerts } from './pulse/alerts.js';
import { collectMonitoringSnapshot } from './pulse/monitor.js';

const MAX_PANELS = 5;

const appendActivity = (s: DashboardState, agent: string, message: string): DashboardState => ({
  ...s,
  activity: [{ ts: new Date().toTimeString().slice(0, 5), agent, message }, ...s.activity].slice(0, 8)
});

const parseCommand = (raw: string): { cmd: string; args: string[] } => {
  const [cmd = '', ...args] = raw.trim().split(/\s+/);
  return { cmd: cmd.toLowerCase(), args };
};

export const App: React.FC = () => {
  const { exit } = useApp();
  const [state, setState] = useState<DashboardState>(initialState);
  const [theme, setTheme] = useState<ThemeName>('cyberpunk');
  const [focus, setFocus] = useState(0);
  const [commandMode, setCommandMode] = useState(false);
  const [commandText, setCommandText] = useState('');
  const [konamiBuffer, setKonamiBuffer] = useState('');

  useEffect(() => {
    const id = setInterval(() => setState((s) => nextState(s)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let active = true;
    let trend: Array<{ ts: string; diskPercent: number }> = [];

    const tick = async () => {
      try {
        const snapshot = applyAlerts(await collectMonitoringSnapshot(trend, { tokensToday: state.health.tokensToday }));
        trend = snapshot.diskTrend;
        if (!active) return;

        setState((s) => ({
          ...s,
          agents: s.agents.map((a) => {
            const hb = snapshot.agents.find((x) => x.name === a.name);
            return hb
              ? { ...a, online: hb.online, heartbeatSecAgo: Number.isFinite(hb.heartbeatSecAgo) ? hb.heartbeatSecAgo : a.heartbeatSecAgo }
              : a;
          }),
          health: {
            ...s.health,
            cpu: snapshot.resources.cpuPercent,
            mem: snapshot.resources.memPercent,
            dsk: snapshot.resources.diskPercent,
            gatewayUp: snapshot.gateway.up
          }
        }));
      } catch {
        // ignore: monitor failures should not kill TUI
      }
    };

    const id = setInterval(() => {
      void tick();
    }, 3000);
    void tick();

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [state.health.tokensToday]);

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
