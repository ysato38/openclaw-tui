import React from 'react';
import { Box, Text } from 'ink';
import { DashboardState } from '../core/types.js';
import { ThemeName, getTheme } from '../theme/themes.js';
import { Panel } from './Panel.js';
import { QuoteWidget } from './QuoteWidget.js';

type Props = { state: DashboardState; themeName: ThemeName; focusIndex: number; commandMode: boolean; commandText: string };

const bar = (value: number) => '▓'.repeat(Math.round(value / 20)) + '░'.repeat(5 - Math.round(value / 20));

export const Dashboard: React.FC<Props> = ({ state, themeName, focusIndex, commandMode, commandText }) => {
  const theme = getTheme(themeName);
  const byCol = (col: 'OPEN' | 'PROGRESS' | 'REVIEW') => state.tasks.filter((t) => t.column === col).map((t) => `#${t.id}`).join(', ') || '-';

  return (
    <Box flexDirection="column">
      <Box borderStyle="single" borderColor={theme.border} paddingX={1}>
        <Text color={theme.title}>⚡ OPENCLAW MISSION CONTROL [{theme.name}]</Text>
        <Text>  {state.now}</Text>
      </Box>

      <QuoteWidget theme={theme} />

      <Box>
        <Box flexDirection="column" width="35%">
          <Panel title="🟢 AGENT STATUS" theme={theme} focused={focusIndex === 0}>
            {state.agents.map((a) => (
              <Text key={a.name} color={a.online ? theme.ok : theme.warn}>
                {a.name.padEnd(6)} ♥ {Math.floor(a.heartbeatSecAgo / 60)}m ago  focus: {a.focus}
              </Text>
            ))}
          </Panel>

          <Panel title="📊 SYSTEM HEALTH" theme={theme} focused={focusIndex === 3}>
            <Text>CPU: {bar(state.health.cpu)} {state.health.cpu}%</Text>
            <Text>MEM: {bar(state.health.mem)} {state.health.mem}%</Text>
            <Text>DSK: {bar(state.health.dsk)} {state.health.dsk}%</Text>
            <Text>Tokens today: {state.health.tokensToday}</Text>
            <Text>Gateway: {state.health.gatewayUp ? '✅ UP' : '❌ DOWN'}</Text>
          </Panel>
        </Box>

        <Box flexDirection="column" width="65%">
          <Panel title="📋 TASK BOARD" theme={theme} focused={focusIndex === 1}>
            <Text>OPEN: {byCol('OPEN')}</Text>
            <Text>PROGRESS: {byCol('PROGRESS')}</Text>
            <Text>REVIEW: {byCol('REVIEW')}</Text>
          </Panel>

          <Panel title="💬 AGENT ACTIVITY LOG" theme={theme} focused={focusIndex === 2}>
            {state.activity.map((a, i) => (
              <Text key={`${a.ts}-${i}`}>{a.ts} {a.agent}: {a.message}</Text>
            ))}
          </Panel>

          <Panel title="> COMMAND INPUT" theme={theme} focused={focusIndex === 4}>
            <Text>{commandMode ? `:${commandText}` : '(Tab: agents/tasks/log/health/cmd, : palette, t theme, q quit)'}</Text>
          </Panel>
        </Box>
      </Box>
    </Box>
  );
};
