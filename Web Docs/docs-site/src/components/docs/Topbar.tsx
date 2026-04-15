import Link from 'next/link';

export function DocsTopbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/75 bg-page/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-docs items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/docs" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-content-center rounded-xl bg-brand text-sm font-semibold text-white shadow-soft transition-transform group-hover:-translate-y-[1px]">
            D
          </span>
          <div className="leading-tight">
            <p className="font-display text-[15px] font-semibold tracking-tight text-ink">
              Docs Starter
            </p>
            <p className="text-xs text-muted">Reusable Tailwind template</p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <label className="flex min-w-[280px] items-center gap-2 rounded-xl border border-line/85 bg-panel/80 px-3 py-2 text-sm text-muted">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              className="w-full bg-transparent text-sm text-ink outline-none"
              placeholder="Search docs (wire to your index later)"
              readOnly
            />
          </label>

          <span className="rounded-lg border border-brand/20 bg-brand/10 px-2 py-1 text-xs font-medium text-brand">
            template v1
          </span>
        </div>
      </div>
    </header>
  );
}
