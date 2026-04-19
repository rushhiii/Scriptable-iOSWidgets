'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Ellipsis, ExternalLink, Menu } from 'lucide-react';
import { SearchCommand } from './SearchCommand';
import { TopbarAnnouncement } from './TopbarAnnouncement';

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

const BRAND_WORDMARK_LIGHT_URL = '/logo_light.png';
const BRAND_WORDMARK_DARK_URL = '/logo_dark.png';

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
  const activePathname = pathname || '/docs/home';
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isOverflowMenuOpen, setIsOverflowMenuOpen] = useState(false);
  const [openOverflowParent, setOpenOverflowParent] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpenDropdown(null);
    setIsOverflowMenuOpen(false);
    setOpenOverflowParent(null);
  }, [activePathname]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current) {
        return;
      }

      if (!navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setIsOverflowMenuOpen(false);
        setOpenOverflowParent(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setIsOverflowMenuOpen(false);
        setOpenOverflowParent(null);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleSidebarToggle = () => {
    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(new CustomEvent('docs-sidebar-toggle'));
  };

  return (
    <div className="topbar">
      <TopbarAnnouncement />

      <div className="topbar-inner">
        <div className="topbar-left">
          <button
            type="button"
            className="sidebar-toggle-button"
            onClick={handleSidebarToggle}
            aria-label="Toggle navigation sidebar"
          >
            <Menu size={19} aria-hidden="true" />
          </button>

          {/* {currentDocSlugPath ? (
            <DocPageActions
              slugPath={currentDocSlugPath}
              className="topbar-doc-actions doc-page-actions-topbar"
              triggerClassName="topbar-doc-actions-trigger"
              menuClassName="topbar-doc-actions-menu"
              triggerLabel="Page content actions"
            />
          ) : null} */}

          <Link className="brand" href="/docs/home">
            {/* <span className="brand-mark" aria-hidden="true">
              <img src="/favicon.ico" alt="" />
            </span> */}
            {/* <span className="brand-name">Scriptable iOS Widgets</span> */}
            <span className="brand-wordmark" aria-hidden="true">
              <img
                alt="Logo"
                loading="eager"
                className="brand-wordmark-image brand-wordmark-image-light"
                src={BRAND_WORDMARK_LIGHT_URL}
              />
              <img
                alt="Logo"
                loading="eager"
                className="brand-wordmark-image brand-wordmark-image-dark"
                src={BRAND_WORDMARK_DARK_URL}
              />
            </span>
          </Link>
        </div>

        <div className="topbar-center">
          <div className="topbar-search-cluster">
            <SearchCommand />
            <a
              className="topbar-repo-icon-link"
              href="https://github.com/rushhiii/Scriptable-IOSWidgets"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit GitHub repository"
            >
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="topbar-right">
          <div className="topnav-actions" ref={navRef}>
            <nav className="topnav" aria-label="Top navigation">
              {topNav.map((item) => {
                const isActive = isTopItemActive(activePathname, item);
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
                        setIsOverflowMenuOpen(false);
                        setOpenOverflowParent(null);
                        setOpenDropdown((current) => (current === item.href ? null : item.href));
                      }}
                    >
                      <span>{item.title}</span>
                      <ChevronDown className="topnav-caret" aria-hidden="true" size={15} />
                    </button>

                    <div className="topnav-dropdown" data-open={isOpen} role="menu" aria-label={`${item.title} menu`}>
                      {item.children.map((child) => {
                        const childActive = isActivePath(activePathname, child.href);

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

            <div className="topnav-overflow">
              <button
                type="button"
                className="topnav-overflow-toggle"
                aria-label={isOverflowMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-haspopup="menu"
                aria-expanded={isOverflowMenuOpen}
                data-open={isOverflowMenuOpen}
                onClick={() => {
                  setOpenDropdown(null);
                  setOpenOverflowParent(null);
                  setIsOverflowMenuOpen((current) => !current);
                }}
              >
                <Ellipsis size={19} aria-hidden="true" />
                <ChevronDown className="topnav-overflow-toggle-caret" size={14} aria-hidden="true" />
              </button>

              <div className="topnav-overflow-menu" data-open={isOverflowMenuOpen} role="menu" aria-label="Top navigation menu">
                {topNav.map((item) => {
                  const isActive = isTopItemActive(activePathname, item);

                  if (!hasChildren(item)) {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="topnav-overflow-link"
                        data-active={isActive}
                        role="menuitem"
                        onClick={() => {
                          setIsOverflowMenuOpen(false);
                          setOpenOverflowParent(null);
                        }}
                      >
                        {item.title}
                      </Link>
                    );
                  }

                  const isOverflowParentOpen = openOverflowParent === item.href;

                  return (
                    <div key={item.href} className="topnav-overflow-item topnav-overflow-item-parent">
                      <button
                        type="button"
                        className="topnav-overflow-link topnav-overflow-parent-link"
                        data-active={isActive}
                        data-open={isOverflowParentOpen}
                        aria-haspopup="menu"
                        aria-expanded={isOverflowParentOpen}
                        onClick={() => {
                          setOpenOverflowParent((current) => (current === item.href ? null : item.href));
                        }}
                      >
                        <span>{item.title}</span>
                        <ChevronRight className="topnav-overflow-caret" size={14} aria-hidden="true" />
                      </button>

                      <div
                        className="topnav-overflow-submenu"
                        data-open={isOverflowParentOpen}
                        role="menu"
                        aria-label={`${item.title} links`}
                      >
                        {item.children.map((child) => {
                          const childActive = isActivePath(activePathname, child.href);

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="topnav-overflow-link"
                              data-active={childActive}
                              role="menuitem"
                              onClick={() => {
                                setIsOverflowMenuOpen(false);
                                setOpenOverflowParent(null);
                              }}
                            >
                              {child.title}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <a
                  className="topnav-overflow-link topnav-overflow-link-external"
                  href="https://github.com/rushhiii/Scriptable-IOSWidgets"
                  target="_blank"
                  rel="noreferrer"
                  role="menuitem"
                  onClick={() => {
                    setIsOverflowMenuOpen(false);
                    setOpenOverflowParent(null);
                  }}
                >
                  Visit Repo
                </a>
              </div>
            </div>
          </div>

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
