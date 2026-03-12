import React, { useMemo } from 'react';
import { Text } from 'ink';
import quotesData from '../../data/quotes.json';

type QuoteCategory = 'focus' | 'courage' | 'gratitude';

type Quote = {
  text: string;
  author: string;
  category: QuoteCategory;
};

type QuoteWidgetProps = {
  category?: QuoteCategory;
};

const quotes = quotesData as Quote[];

const pickQuote = (category?: QuoteCategory): Quote => {
  const pool = category ? quotes.filter((q) => q.category === category) : quotes;
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return selected ?? quotes[0]!;
};

export const QuoteWidget: React.FC<QuoteWidgetProps> = ({ category }) => {
  const quote = useMemo(() => pickQuote(category), [category]);
  const icon = quote.category === 'focus' ? '🧭' : quote.category === 'courage' ? '🔥' : '🙏';

  return <Text>{`${icon} 今日の一言: 「${quote.text}」 — ${quote.author}`}</Text>;
};
