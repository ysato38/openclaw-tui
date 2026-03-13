import { MotionIn } from './MotionIn';

export function CTA() {
  return (
    <section className="section mt-12 md:mt-20">
      <MotionIn>
        <div className="panel p-8 text-center">
          <h2 className="text-2xl font-bold">OpenClaw-TUIで運用を見える化</h2>
          <p className="mt-3 text-muted">まずはGitHubを確認して、ローカルで起動してみてください。</p>
          <a className="mt-5 inline-block rounded-xl bg-accent px-5 py-3 font-semibold text-slate-900" href="https://github.com/ysato38/openclaw-tui" target="_blank">View on GitHub</a>
        </div>
      </MotionIn>
    </section>
  );
}
