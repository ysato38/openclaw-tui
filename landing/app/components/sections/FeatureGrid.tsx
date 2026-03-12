import { MotionIn } from './MotionIn';

const items = [
  ['Realtime Feed', 'Issue/ログ/通知をリアルタイム表示'],
  ['Agent Health', 'CPU/メモリ/待機状態を監視'],
  ['Task Routing', 'agent間のタスク振り分けを可視化'],
  ['Keyboard-first', 'マウス不要の高速オペレーション']
];

export function FeatureGrid() {
  return (
    <section id="features" className="section mt-12 md:mt-20">
      <MotionIn>
        <h2 className="mb-5 text-2xl font-semibold">Features</h2>
      </MotionIn>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(([title, desc], i) => (
          <MotionIn key={title} delay={i * 0.08}>
            <article className="panel p-5">
              <h3 className="font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted">{desc}</p>
            </article>
          </MotionIn>
        ))}
      </div>
    </section>
  );
}
