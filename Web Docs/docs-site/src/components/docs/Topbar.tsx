'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const topLinks = [
  { label: 'Home', href: '/docs/getting-started' },
  { label: 'Guides', href: '/docs/guides/content-architecture' },
  { label: 'Components', href: '/docs/components/callouts-and-tips' },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DocsTopbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line/35 bg-page/90 backdrop-blur-xl">
      <div className="mx-auto grid h-16 w-full max-w-docs grid-cols-[auto_1fr_auto] items-center gap-3 px-4 md:h-[74px] md:gap-6 md:px-8">
        <Link href="/docs/getting-started" className="group flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 place-content-center rounded-xl border border-brand/60 bg-brand/20 font-display text-sm font-semibold text-ink transition group-hover:border-brand group-hover:bg-brand/30">
            S
          </span>
          <span className="hidden font-display text-[15px] font-semibold tracking-tight text-ink sm:inline">
            Scriptable iOS Widgets
          </span>
        </Link>

        <button
          type="button"
          className="mx-auto hidden h-10 w-full max-w-[430px] items-center justify-between rounded-xl border border-line/45 bg-panel/65 px-3 text-sm text-muted md:flex"
        >
          <span className="inline-flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            Search docs
          </span>
          <span className="inline-flex items-center gap-1 text-xs">
            <span className="kbd-key rounded border border-line/60 px-1.5 py-0.5">Ctrl</span>
            <span className="kbd-key rounded border border-line/60 px-1.5 py-0.5">K</span>
          </span>
        </button>

        <div className="flex items-center justify-end gap-2 md:gap-3">
          <nav className="hidden items-center gap-1 lg:flex">
            {topLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'rounded-lg px-3 py-2 text-sm transition-colors',
                  isActivePath(pathname, item.href)
                    ? 'bg-brand/20 text-brand'
                    : 'text-muted hover:bg-panel/70 hover:text-ink'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            className="hidden rounded-lg border border-brand/65 bg-brand/20 px-3 py-2 text-sm font-medium text-ink transition hover:bg-brand/30 md:inline-block"
            href="https://github.com/rushhiii/Scriptable-IOSWidgets"
            target="_blank"
            rel="noreferrer"
          >
            Visit Repo
          </a>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
