'use client';
import { useState } from 'react';
import { MotionIn } from './MotionIn';

const cmd = `npm i -g openclaw-tui\nopenclaw-tui auth login\nopenclaw-tui`;

export function GettingStarted() {
  const [done, setDone] = useState(false);
  return (
    <section id="start" className="section mt-12 md:mt-20">
      <MotionIn>
        <h2 className="mb-5 text-2xl font-semibold">Getting Started</h2>
      </MotionIn>
      <MotionIn delay={0.08}>
        <div className="panel p-5">
          <pre className="overflow-x-auto rounded bg-slate-950 p-4 text-sm text-slate-100">{cmd}</pre>
          <button
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-slate-900"
            onClick={async () => {
              await navigator.clipboard.writeText(cmd);
              setDone(true);
              setTimeout(() => setDone(false), 1800);
            }}
          >
            {done ? 'Copied!' : 'Copy Commands'}
          </button>
        </div>
      </MotionIn>
    </section>
  );
}
