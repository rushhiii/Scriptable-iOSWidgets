 'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const topLinks = [
  { label: 'Home', href: '/docs' },
  { label: 'Installation', href: '/docs/installation' },
  { label: 'Widgets', href: '/docs/widgets' },
  { label: 'Changelog', href: '/docs/changelog' },
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
    <div className="topbar">
      <div className="topbar-inner">
        <Link href="/docs" className="topbar-brand">
          <span className="topbar-brand-mark" aria-hidden="true">
            S
          </span>
          <span className="topbar-brand-text">Scriptable iOS Widgets</span>
        </Link>

        <div className="topbar-search" role="search" aria-label="Search docs">
          <span className="topbar-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <span className="topbar-search-text">Search docs</span>
          <span className="topbar-search-shortcut" aria-hidden="true">
            <span>Ctrl</span>
            <span>K</span>
          </span>
        </div>

        <div className="topbar-actions">
          <nav className="topnav" aria-label="Top navigation">
            {topLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx('topnav-link', isActivePath(pathname, item.href) && 'topnav-link-active')}
                aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            className="topbar-repo"
            href="https://github.com/rushhiii/Scriptable-IOSWidgets"
            target="_blank"
            rel="noreferrer"
          >
            Visit Repo
          </a>

          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
