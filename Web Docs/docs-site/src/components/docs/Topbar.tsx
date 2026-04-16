'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { SearchCommand } from './SearchCommand';

type TopNavChild = {
  title: string;
  href: string;
};

type TopNavItem = {
  title: string;
  href: string;
  children?: TopNavChild[];
};

const topNav: TopNavItem[] = [
  { title: 'Home', href: '/docs/home' },
  {
    title: 'Product',
    href: '/docs/widgets',
    children: [
      { title: 'Overview', href: '/docs/home' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Usage', href: '/docs/usage' },
      { title: 'Widgets', href: '/docs/widgets' },
    ],
  },
  { title: 'Changelog', href: '/docs/changelog' },
];

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

function hasChildren(item: TopNavItem): item is TopNavItem & { children: TopNavChild[] } {
  return Array.isArray(item.children) && item.children.length > 0;
}

function isTopItemActive(pathname: string, item: TopNavItem): boolean {
  if (isActivePath(pathname, item.href)) {
    return true;
  }

  if (!hasChildren(item)) {
    return false;
  }

  return item.children.some((child) => isActivePath(pathname, child.href));
}

export function DocsTopbar() {
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

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <Link className="brand" href="/docs/home">
            <span className="brand-mark" aria-hidden="true">
              <img src="/favicon.ico" alt="" />
            </span>
            <span>Scriptable iOS Widgets</span>
          </Link>
        </div>

        <div className="topbar-center">
          <SearchCommand />
        </div>

        <div className="topbar-right">
          <nav className="topnav" aria-label="Top navigation" ref={navRef}>
            {topNav.map((item) => {
              const isActive = isTopItemActive(pathname, item);
              const isOpen = openDropdown === item.href;

              if (!hasChildren(item)) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="topnav-link"
                    data-active={isActive}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{item.title}</span>
                  </Link>
                );
              }

              return (
                <div
                  key={item.href}
                  className="topnav-item topnav-item-dropdown"
                  onMouseEnter={() => setOpenDropdown(item.href)}
                  onMouseLeave={() => {
                    setOpenDropdown((current) => (current === item.href ? null : current));
                  }}
                >
                  <button
                    type="button"
                    className="topnav-link topnav-link-dropdown"
                    data-active={isActive}
                    data-open={isOpen}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={() => {
                      setOpenDropdown((current) => (current === item.href ? null : item.href));
                    }}
                  >
                    <span>{item.title}</span>
                    <ChevronDown className="topnav-caret" aria-hidden="true" size={14} />
                  </button>

                  <div className="topnav-dropdown" data-open={isOpen} role="menu" aria-label={`${item.title} menu`}>
                    {item.children.map((child) => {
                      const childActive = isActivePath(pathname, child.href);

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="topnav-dropdown-link"
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
            })}
          </nav>

          <a
            className="action-button action-button-primary"
            href="https://github.com/rushhiii/Scriptable-IOSWidgets"
            target="_blank"
            rel="noreferrer"
          >
            Visit Repo
          </a>
        </div>
      </div>
    </div>
  );
}
