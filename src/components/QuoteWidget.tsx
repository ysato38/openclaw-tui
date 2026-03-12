import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text } from 'ink';
import quotes from '../data/quotes.json';
import { Theme } from '../theme/themes.js';

type QuoteCategory = 'focus' | 'courage' | 'gratitude';

type Quote = {
  text: string;
  author: string;
  category: QuoteCategory;
};

const QUOTES = quotes as Quote[];
const REFRESH_MS = 60_000;

type Props = {
  theme: Theme;
};

const pickRandom = (pool: Quote[]) => pool[Math.floor(Math.random() * pool.length)] ?? pool[0];

export const QuoteWidget: React.FC<Props> = ({ theme }) => {
  const [current, setCurrent] = useState<Quote>(() => pickRandom(QUOTES));

  useEffect(() => {
    const id = setInterval(() => setCurrent(pickRandom(QUOTES)), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  const icon = useMemo(() => {
    switch (current.category) {
      case 'focus':
        return '🧭';
      case 'courage':
        return '🔥';
      case 'gratitude':
        return '🙏';
      default:
        return '✨';
    }
  }, [current.category]);

  return (
    <Box marginTop={1} borderStyle="single" borderColor={theme.border} paddingX={1} justifyContent="space-between">
      <Text color={theme.title}>TODAY'S QUOTE</Text>
      <Text color={theme.accent}>{icon} “{current.text}” — {current.author}</Text>
    </Box>
  );
};
