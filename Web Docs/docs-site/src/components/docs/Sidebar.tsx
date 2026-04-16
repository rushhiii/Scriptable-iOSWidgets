'use client';

import type { NavSection } from '@/lib/docs';
import { inferDocIconName, type DocIconName } from '@/lib/doc-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Blocks,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  FileText,
  Home,
  LayoutGrid,
  List,
  Map,
  Rocket,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

type SidebarProps = {
  navigation: NavSection[];
  currentSlugPath: string;
};

type IconName = DocIconName | 'chevron';

type WidgetGroup = {
  href: string;
  title: string;
  children: Array<{ href: string; title: string }>;
};

const SIDEBAR_SCROLL_KEY = 'docs.sidebar.scrollTop';

function toDocHref(slugPath: string): string {
  return `/docs/${slugPath}`;
}

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

function isExactPath(pathname: string, href: string): boolean {
  return normalizePath(pathname) === normalizePath(href);
}

function isActivePath(pathname: string, href: string): boolean {
  const current = normalizePath(pathname);
  const target = normalizePath(href);

  if (target === '/docs/home') {
    return current === '/docs/home';
  }

  return current === target || current.startsWith(`${target}/`);
}

function Icon({ name, size = 14 }: { name: IconName; size?: number }) {
  const iconMap: Record<IconName, LucideIcon> = {
    home: Home,
    rocket: Rocket,
    download: Download,
    sliders: SlidersHorizontal,
    grid: LayoutGrid,
    list: List,
    book: BookOpen,
    blocks: Blocks,
    map: Map,
    file: FileText,
    chevron: ChevronRight,
  };

  const IconComponent = iconMap[name];
  return <IconComponent size={size} strokeWidth={1.8} aria-hidden="true" />;
}

function buildWidgetGroup(section: NavSection): WidgetGroup | null {
  if (section.pages.length === 0) {
    return null;
  }

  const groupPage = section.pages.find((page) => page.slugPath === 'widgets') ?? section.pages[0];
  const children = section.pages
    .filter((page) => page.slugPath !== groupPage.slugPath)
    .map((page) => ({
      href: toDocHref(page.slugPath),
      title: page.title,
    }));

  return {
    href: toDocHref(groupPage.slugPath),
    title: groupPage.title,
    children,
  };
}

export function DocsSidebar({ navigation, currentSlugPath }: SidebarProps) {
  const pathname = usePathname();
  const currentPathname = pathname || toDocHref(currentSlugPath);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const syncScrollTopVisibility = useCallback(() => {
    const sidebar = sidebarRef.current;

    if (!sidebar) {
      return;
    }

    const canScrollUp = sidebar.scrollTop > 20;
    const canScrollDown = sidebar.scrollTop + sidebar.clientHeight < sidebar.scrollHeight - 20;

    setShowScrollTop((prev) => (prev === canScrollUp ? prev : canScrollUp));
    setShowScrollBottom((prev) => (prev === canScrollDown ? prev : canScrollDown));
  }, []);

  const persistScrollPosition = useCallback(() => {
    const sidebar = sidebarRef.current;

    if (!sidebar || typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(sidebar.scrollTop));
  }, []);

  const restoreScrollPosition = useCallback(() => {
    const sidebar = sidebarRef.current;

    if (!sidebar || typeof window === 'undefined') {
      return;
    }

    const storedValue = window.sessionStorage.getItem(SIDEBAR_SCROLL_KEY);

    if (!storedValue) {
      return;
    }

    const parsed = Number(storedValue);

    if (!Number.isFinite(parsed) || parsed < 0) {
      return;
    }

    sidebar.scrollTop = parsed;
    syncScrollTopVisibility();
  }, [syncScrollTopVisibility]);

  const handleSidebarScroll = useCallback(() => {
    persistScrollPosition();
    syncScrollTopVisibility();
  }, [persistScrollPosition, syncScrollTopVisibility]);

  const widgetGroup = useMemo(() => {
    const section = navigation.find((entry) => entry.section.toLowerCase() === 'widgets');
    if (!section) {
      return null;
    }
    return buildWidgetGroup(section);
  }, [navigation]);

  const [isWidgetOpen, setIsWidgetOpen] = useState(true);

  useEffect(() => {
    if (!widgetGroup) {
      return;
    }

    const hasActiveChild = widgetGroup.children.some((child) => isActivePath(currentPathname, child.href));
    if (isActivePath(currentPathname, widgetGroup.href) || hasActiveChild) {
      setIsWidgetOpen(true);
    }
  }, [currentPathname, widgetGroup]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    restoreScrollPosition();

    const raf1 = window.requestAnimationFrame(() => {
      restoreScrollPosition();

      window.requestAnimationFrame(() => {
        restoreScrollPosition();
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
    };
  }, [pathname, isWidgetOpen, restoreScrollPosition]);

  useEffect(() => {
    const sidebar = sidebarRef.current;

    if (!sidebar || typeof window === 'undefined') {
      return;
    }

    handleSidebarScroll();
    sidebar.addEventListener('scroll', handleSidebarScroll, { passive: true });

    return () => {
      persistScrollPosition();
      sidebar.removeEventListener('scroll', handleSidebarScroll);
    };
  }, [handleSidebarScroll, persistScrollPosition]);

  useEffect(() => {
    return () => {
      persistScrollPosition();
    };
  }, [pathname, persistScrollPosition]);

  const handleClickCapture = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as Element | null;

    if (!target) {
      return;
    }

    const anchor = target.closest('a[href]');

    if (!anchor) {
      return;
    }

    persistScrollPosition();
  }, [persistScrollPosition]);

  const handleScrollTopClick = useCallback(() => {
    const sidebar = sidebarRef.current;

    if (!sidebar) {
      return;
    }

    sidebar.scrollTo({ top: 0, behavior: 'smooth' });
    window.sessionStorage.setItem(SIDEBAR_SCROLL_KEY, '0');
    setShowScrollTop(false);
    setShowScrollBottom(sidebar.scrollHeight > sidebar.clientHeight);
  }, []);

  const handleScrollBottomClick = useCallback(() => {
    const sidebar = sidebarRef.current;

    if (!sidebar) {
      return;
    }

    const targetTop = sidebar.scrollHeight - sidebar.clientHeight;
    sidebar.scrollTo({ top: targetTop, behavior: 'smooth' });
    window.sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(targetTop));
    setShowScrollTop(true);
    setShowScrollBottom(false);
  }, []);

  return (
    <aside className="sidebar" onClickCapture={handleClickCapture}>
      <button
        type="button"
        className="sidebar-scroll-arrow sidebar-scroll-arrow-top"
        data-visible={showScrollTop}
        aria-label="Scroll sidebar to top"
        onClick={handleScrollTopClick}
      >
        <ChevronUp size={20} strokeWidth={1.9} aria-hidden="true" />
      </button>

      <div className="sidebar-scroll-content" ref={sidebarRef}>
        {navigation.map((section) => {
          const isWidgetSection = section.section.toLowerCase() === 'widgets' && widgetGroup;

          if (isWidgetSection) {
            const groupIsActive = isExactPath(currentPathname, widgetGroup.href);

            return (
              <div key={section.section} className="sidebar-section">
                <div className="sidebar-title">{section.section}</div>
                <div className="sidebar-section-items">
                  <div className="sidebar-group" data-open={isWidgetOpen} data-active={groupIsActive}>
                    <div className="sidebar-group-row">
                      <Link
                        href={widgetGroup.href}
                        className="sidebar-link sidebar-link-group"
                        data-active={groupIsActive}
                      >
                        <span className="sidebar-item-icon" aria-hidden="true">
                          <Icon name="grid" size={14} />
                        </span>
                        <span>{widgetGroup.title}</span>
                      </Link>
                      <button
                        type="button"
                        className="sidebar-group-toggle"
                        data-open={isWidgetOpen}
                        aria-expanded={isWidgetOpen}
                        aria-label={`${isWidgetOpen ? 'Collapse' : 'Expand'} ${widgetGroup.title}`}
                        onClick={() => setIsWidgetOpen((open) => !open)}
                      >
                        <Icon name="chevron" size={14} />
                      </button>
                    </div>

                    <div className="sidebar-children">
                      {widgetGroup.children.map((child) => {
                        const isCurrent = isExactPath(currentPathname, child.href);

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="sidebar-sublink"
                            data-active={isCurrent}
                            aria-current={isCurrent ? 'page' : undefined}
                          >
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={section.section} className="sidebar-section">
              <div className="sidebar-title">{section.section}</div>
              <div className="sidebar-section-items">
                {section.pages.map((page) => {
                  const href = toDocHref(page.slugPath);
                  const isCurrent = isExactPath(currentPathname, href);
                  const icon = inferDocIconName(section.section, page.slugPath);

                  return (
                    <Link
                      key={page.slugPath}
                      href={href}
                      className="sidebar-link"
                      data-active={isCurrent}
                      aria-current={isCurrent ? 'page' : undefined}
                    >
                      {icon ? (
                        <span className="sidebar-item-icon" aria-hidden="true">
                          <Icon name={icon} size={14} />
                        </span>
                      ) : null}
                      <span>{page.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="sidebar-scroll-arrow sidebar-scroll-arrow-bottom"
        data-visible={showScrollBottom}
        aria-label="Scroll sidebar to bottom"
        onClick={handleScrollBottomClick}
      >
        <ChevronDown size={20} strokeWidth={1.9} aria-hidden="true" />
      </button>
    </aside>
  );
}
