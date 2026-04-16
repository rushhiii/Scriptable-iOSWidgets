'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ChevronDown, Download, Home, Info, LayoutGrid, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type SubnavResourceLink = {
  title: string;
  href: string;
};

type SubnavItem = {
  title: string;
  href: string;
  icon?: 'home' | 'download' | 'book' | 'grid' | 'info';
  children?: SubnavResourceLink[];
};

type DocsSubnavProps = {
  resourcesLinks: SubnavResourceLink[];
};

const baseSubnavLinks = [
  { title: 'Overview', href: '/docs/home', icon: 'home' },
  { title: 'Installation', href: '/docs/installation', icon: 'download' },
  { title: 'Usage', href: '/docs/usage', icon: 'book' },
  { title: 'Widgets', href: '/docs/widgets', icon: 'grid' },
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

function hasChildren(item: SubnavItem): item is SubnavItem & { children: SubnavResourceLink[] } {
  return Array.isArray(item.children) && item.children.length > 0;
}

function isSubnavItemActive(pathname: string, item: SubnavItem): boolean {
  if (isActivePath(pathname, item.href)) {
    return true;
  }

  if (!hasChildren(item)) {
    return false;
  }

  return item.children.some((child) => isActivePath(pathname, child.href));
}

function Icon({
  name,
  size = 15,
}: {
  name: 'home' | 'download' | 'book' | 'grid' | 'info';
  size?: number;
}) {
  const iconMap: Record<'home' | 'download' | 'book' | 'grid' | 'info', LucideIcon> = {
    home: Home,
    download: Download,
    book: BookOpen,
    grid: LayoutGrid,
    info: Info,
  };

  const IconComponent = iconMap[name];
  return <IconComponent size={size} strokeWidth={1.8} aria-hidden="true" />;
}

export function DocsSubnav({ resourcesLinks }: DocsSubnavProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current) {
        return;
      }

      if (!navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const subnavLinks = useMemo<SubnavItem[]>(() => {
    const fallbackResources: SubnavResourceLink[] = [{ title: 'Changelog', href: '/docs/changelog' }];
    const resolvedResources = resourcesLinks.length > 0 ? resourcesLinks : fallbackResources;

    return [
      ...baseSubnavLinks,
      {
        title: 'Resources',
        href: resolvedResources[0]?.href || '/docs/changelog',
        icon: 'info',
        children: resolvedResources,
      },
    ];
  }, [resourcesLinks]);

  return (
    <div className="subnav">
      <div className="subnav-inner">
        <div className="subnav-label">Scriptable iOSWidgets Docs</div>

        <nav className="subnav-links" aria-label="Section navigation" ref={navRef}>
          {subnavLinks.map((item) => {
            const isActive = isSubnavItemActive(pathname, item);
            const isOpen = openDropdown === item.href;

            if (hasChildren(item)) {
              return (
                <div
                  key={item.href}
                  className="subnav-item subnav-item-dropdown"
                  onMouseEnter={() => setOpenDropdown(item.href)}
                  onMouseLeave={() => {
                    setOpenDropdown((current) => (current === item.href ? null : current));
                  }}
                >
                  <button
                    type="button"
                    className="subnav-link subnav-link-dropdown"
                    data-active={isActive}
                    data-open={isOpen}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={() => {
                      setOpenDropdown((current) => (current === item.href ? null : item.href));
                    }}
                  >
                    {item.icon ? (
                      <span className="nav-icon" aria-hidden="true">
                        <Icon name={item.icon} size={15} />
                      </span>
                    ) : null}
                    <span>{item.title}</span>
                    <ChevronDown className="subnav-caret" aria-hidden="true" size={14} />
                  </button>

                  <div className="subnav-dropdown" data-open={isOpen} role="menu" aria-label={`${item.title} menu`}>
                    {item.children.map((child) => {
                      const childActive = isActivePath(pathname, child.href);

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="subnav-dropdown-link"
                          data-active={childActive}
                          role="menuitem"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="subnav-link"
                data-active={isActive}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon ? (
                  <span className="nav-icon" aria-hidden="true">
                    <Icon name={item.icon} size={15} />
                  </span>
                ) : null}
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
