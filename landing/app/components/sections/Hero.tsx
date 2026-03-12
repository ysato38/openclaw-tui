'use client';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <header className="section pt-12 md:pt-20">
      <div className="panel p-6 md:p-10">
        <nav className="mb-8 flex items-center justify-between">
          <span className="text-lg font-semibold">OpenClaw-TUI</span>
          <button className="rounded-lg border border-slate-700 px-3 py-2 text-sm md:hidden" aria-label="menu">☰</button>
          <div className="hidden gap-6 text-sm text-muted md:flex">
            <a href="#features">Features</a><a href="#themes">Themes</a><a href="#start">Getting Started</a>
          </div>
        </nav>
        <motion.h1
          className="text-3xl font-bold leading-tight md:text-5xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          Real-time monitoring for<br />
          <span className="text-accent">multi AI agents</span>
        </motion.h1>
        <p className="mt-5 max-w-2xl text-muted">OpenClawの稼働状況・Issue・リソースをターミナルUIで可視化。軽快な操作感で、複数エージェントの連携を一目で把握できます。</p>
      </div>
    </header>
  );
}
