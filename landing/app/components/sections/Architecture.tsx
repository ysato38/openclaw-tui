import { MotionIn } from './MotionIn';

export function Architecture() {
  return (
    <section className="section mt-12 md:mt-20">
      <MotionIn>
        <div className="panel p-6">
          <h2 className="text-2xl font-semibold">Architecture</h2>
          <p className="mt-3 text-muted">OpenClaw Gateway → Multi Agents → GitHub/Slack/Nodes を TUI で統合表示。イベント駆動で遅延を最小化。</p>
        </div>
      </MotionIn>
    </section>
  );
}
