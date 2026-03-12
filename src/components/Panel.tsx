import React, { PropsWithChildren } from 'react';
import { Box, Text } from 'ink';
import { Theme } from '../theme/themes.js';

type Props = PropsWithChildren<{ title: string; theme: Theme; focused?: boolean; width?: number; height?: number }>;

export const Panel: React.FC<Props> = ({ title, theme, focused, width, height, children }) => (
  <Box
    borderStyle="round"
    borderColor={focused ? theme.accent : theme.border}
    flexDirection="column"
    width={width}
    height={height}
    paddingX={1}
  >
    <Text color={focused ? theme.accent : theme.title}>{title}</Text>
    {children}
  </Box>
);
