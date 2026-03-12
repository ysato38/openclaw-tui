import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0f1c',
        card: '#131a2a',
        accent: '#22d3ee',
        text: '#e2e8f0',
        muted: '#94a3b8'
      }
    }
  },
  plugins: []
};

export default config;
