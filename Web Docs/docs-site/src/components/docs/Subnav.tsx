'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const subnavLinks = [
  { label: 'Home', href: '/docs' },
  { label: 'Getting Started', href: '/docs/getting-started' },
  { label: 'Installation', href: '/docs/installation' },
  { label: 'Widgets', href: '/docs/widgets' },
  { label: 'Changelog', href: '/docs/changelog' },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/docs') {
    return pathname === '/docs' || pathname.startsWith('/docs/');
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DocsSubnav() {
  const pathname = usePathname();

  return (
    <div className="subnav">
      <div className="subnav-inner">
        <div className="subnav-label">Scriptable iOS Widgets Docs</div>

        <nav className="subnav-links" aria-label="Section navigation">
          {subnavLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx('subnav-link', isActivePath(pathname, item.href) && 'subnav-link-active')}
              aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}