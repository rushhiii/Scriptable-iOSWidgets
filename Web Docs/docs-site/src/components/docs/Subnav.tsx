'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download, Home, LayoutGrid, List, SlidersHorizontal, type LucideIcon } from 'lucide-react';

const subnavLinks = [
  { title: 'Overview', href: '/docs/home', icon: 'home' },
  { title: 'Installation', href: '/docs/installation', icon: 'download' },
  { title: 'Usage', href: '/docs/usage', icon: 'sliders' },
  { title: 'Widgets', href: '/docs/widgets', icon: 'grid' },
  { title: 'Changelog', href: '/docs/changelog', icon: 'list' },
] as const;

function normalizePath(path: string): string {
  const noHash = path.split('#')[0];
  const noQuery = noHash.split('?')[0];
  const trimmed = noQuery.replace(/\/+$/, '');

  if (!trimmed) {
    return '/';
  }

  if (trimmed === '/docs') {
    return '/docs/home';
  }

  return trimmed;
}

function isActivePath(pathname: string, href: string): boolean {
  const current = normalizePath(pathname);
  const target = normalizePath(href);

  if (target === '/docs/home') {
    return current === '/docs/home';
  }

  return current === target || current.startsWith(`${target}/`);
}

function Icon({
  name,
  size = 15,
}: {
  name: 'home' | 'download' | 'sliders' | 'grid' | 'list';
  size?: number;
}) {
  const iconMap: Record<'home' | 'download' | 'sliders' | 'grid' | 'list', LucideIcon> = {
    home: Home,
    download: Download,
    sliders: SlidersHorizontal,
    grid: LayoutGrid,
    list: List,
  };

  const IconComponent = iconMap[name];
  return <IconComponent size={size} strokeWidth={1.8} aria-hidden="true" />;
}

export function DocsSubnav() {
  const pathname = usePathname();

  return (
    <div className="subnav">
      <div className="subnav-inner">
        <div className="subnav-label">Scriptable iOSWidgets Docs</div>

        <nav className="subnav-links" aria-label="Section navigation">
          {subnavLinks.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="subnav-link"
                data-active={isActive}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden="true">
                  <Icon name={item.icon} size={15} />
                </span>
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
