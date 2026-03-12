import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenClaw-TUI | Real-time AI Agent Monitoring',
  description: 'OpenClawのマルチAIエージェントをリアルタイム監視するTUIダッシュボード',
  openGraph: {
    title: 'OpenClaw-TUI',
    description: 'Real-time terminal dashboard for OpenClaw agent orchestration',
    url: 'https://openclaw-tui.vercel.app',
    siteName: 'OpenClaw-TUI',
    type: 'website'
  },
  alternates: { canonical: 'https://openclaw-tui.vercel.app' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
