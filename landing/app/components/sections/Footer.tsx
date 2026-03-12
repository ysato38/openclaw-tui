export function Footer() {
  return (
    <footer className="section mt-16 text-sm text-muted">
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-800 py-6 md:flex-row">
        <span>© {new Date().getFullYear()} OpenClaw-TUI</span>
        <div className="flex gap-4">
          <a href="https://github.com/ysato38/openclaw-tui">GitHub</a>
          <a href="https://opensource.org/licenses/MIT">License</a>
        </div>
      </div>
    </footer>
  );
}
