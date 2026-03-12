import { Hero } from './components/sections/Hero';
import { FeatureGrid } from './components/sections/FeatureGrid';
import { ThemeCards } from './components/sections/ThemeCards';
import { Architecture } from './components/sections/Architecture';
import { GettingStarted } from './components/sections/GettingStarted';
import { CTA } from './components/sections/CTA';
import { Footer } from './components/sections/Footer';

const ldJson = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'OpenClaw-TUI',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Linux, Windows',
  url: 'https://github.com/ysato38/openclaw-tui'
};

export default function Home() {
  return (
    <main className="pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
      <Hero />
      <FeatureGrid />
      <ThemeCards />
      <Architecture />
      <GettingStarted />
      <CTA />
      <Footer />
    </main>
  );
}
