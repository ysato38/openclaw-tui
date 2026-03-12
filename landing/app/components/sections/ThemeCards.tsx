import { MotionIn } from './MotionIn';

const themes = ['Neon Cyan', 'Deep Violet', 'Monochrome'];

export function ThemeCards() {
  return (
    <section id="themes" className="section mt-12 md:mt-20">
      <MotionIn><h2 className="mb-5 text-2xl font-semibold">Theme Showcase</h2></MotionIn>
      <div className="grid gap-4 md:grid-cols-3">
        {themes.map((t, i) => (
          <MotionIn key={t} delay={i * 0.08}>
            <article className="panel p-4">
              <h3 className="mb-3 text-sm font-medium text-muted">{t}</h3>
              <div className="space-y-2 font-mono text-xs">
                <div className="rounded bg-slate-900 p-2">agent:main ▊ active</div>
                <div className="rounded bg-slate-900 p-2">issue:#45 ▊ in-progress</div>
                <div className="rounded bg-slate-900 p-2">cpu: 34% mem: 68%</div>
              </div>
            </article>
          </MotionIn>
        ))}
      </div>
    </section>
  );
}
