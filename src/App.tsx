import React, { useEffect, useState } from 'react';
import { useApp, useInput } from 'ink';
import { Dashboard } from './components/Dashboard.js';
import { DashboardState } from './core/types.js';
import { initialState, nextState } from './data/mockStream.js';
import { ThemeName, nextTheme } from './theme/themes.js';

const MAX_PANELS = 5;

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

  useInput((input, key) => {
    if (key.ctrl && input === 'c') return exit();

    if (commandMode) {
      if (key.return) {
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

    if (key.tab) return setFocus((f) => (f + 1) % MAX_PANELS);
    if (key.shift && key.tab) return setFocus((f) => (f - 1 + MAX_PANELS) % MAX_PANELS);

    if (input === 'h' || input === 'k') return setFocus((f) => (f - 1 + MAX_PANELS) % MAX_PANELS);
    if (input === 'j' || input === 'l') return setFocus((f) => (f + 1) % MAX_PANELS);

    const next = (konamiBuffer + input).slice(-10);
    setKonamiBuffer(next);
    if (next.includes('uuddlrlrba')) {
      setState((s) => ({ ...s, activity: [{ ts: new Date().toTimeString().slice(0, 5), agent: 'system', message: '🎉 Konami unlocked: Mission Deep Space' }, ...s.activity].slice(0, 8) }));
    }
  });

  return <Dashboard state={state} themeName={theme} focusIndex={focus} commandMode={commandMode} commandText={commandText} />;
};
