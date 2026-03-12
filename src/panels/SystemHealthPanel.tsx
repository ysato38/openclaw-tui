import React from 'react';
import { Box, Text } from 'ink';
import { MonitoringSnapshot } from '../pulse/types.js';

type Props = {
  snapshot: MonitoringSnapshot;
  focused?: boolean;
  titleColor?: string;
  textColor?: string;
  okColor?: string;
  warnColor?: string;
};

const bar = (v: number, width = 10): string => {
  const clamped = Math.max(0, Math.min(100, v));
  const fill = Math.round((clamped / 100) * width);
  return `${'▓'.repeat(fill)}${'░'.repeat(Math.max(0, width - fill))} ${clamped}%`;
};

export const SystemHealthPanel: React.FC<Props> = ({
  snapshot,
  focused = false,
  titleColor = 'cyan',
  textColor = 'white',
  okColor = 'green',
  warnColor = 'yellow'
}) => {
  const { resources, gateway, logs, alerts } = snapshot;

  return (
    <Box borderStyle="round" borderColor={focused ? titleColor : 'gray'} flexDirection="column" paddingX={1} paddingY={0}>
      <Text color={titleColor}>📊 SYSTEM HEALTH</Text>
      <Text color={textColor}>CPU: {bar(resources.cpuPercent)}</Text>
      <Text color={textColor}>MEM: {bar(resources.memPercent)}</Text>
      <Text color={textColor}>DSK: {bar(resources.diskPercent)}</Text>
      <Text color={textColor}>Tokens today: {resources.tokensToday ?? 'N/A'}</Text>
      <Text color={gateway.up ? okColor : warnColor}>Gateway: {gateway.up ? '✅ UP' : '❌ DOWN'}</Text>
      <Text color={textColor}>Logs: {logs.totalLogMb}MB total / oversized {logs.oversizedFiles.length}</Text>
      <Text color={alerts.length === 0 ? okColor : warnColor}>Alerts: {alerts.length === 0 ? 'none' : alerts.length}</Text>
    </Box>
  );
};
