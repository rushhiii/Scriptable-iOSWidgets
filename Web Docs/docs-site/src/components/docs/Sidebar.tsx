'use client';

import type { NavSection } from '@/lib/docs';
import { inferDocIconName, type DocIconName } from '@/lib/doc-icons';
import { getStoredTranslateLanguage, onTranslateLanguageChange, openTranslatedPage } from '@/lib/google-translate';
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
  Globe,
  Home,
  LayoutGrid,
  List,
  Map,
  Rocket,
  SlidersHorizontal,
  X,
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

type LanguageOption = {
  locale: string;
  label: string;
  targetLang: string;
};

type SidebarNavContext = 'overview' | 'installation' | 'usage' | 'widgets' | 'resources';

const SIDEBAR_SCROLL_KEY = 'docs.sidebar.scrollTop';
const TABLET_MAX_WIDTH = 1020;
const SIDEBAR_LOGO_LIGHT_URL = '/logo_light.png';
const SIDEBAR_LOGO_DARK_URL = '/logo_dark.png';

const languageOptions: LanguageOption[] = [
  { locale: 'en-US', label: '🇺🇸 English', targetLang: 'en' },
  { locale: 'fr-FR', label: '🇫🇷 Français', targetLang: 'fr' },
  { locale: 'zh-CN', label: '🇨🇳 中文', targetLang: 'zh-CN' },
  { locale: 'ja-JP', label: '🇯🇵 日本語', targetLang: 'ja' },

  // { locale: 'en-US', label: 'us English', targetLang: 'en' },
  // { locale: 'fr-FR', label: 'FR Français', targetLang: 'fr' },
  // { locale: 'zh-CN', label: 'CN 中文', targetLang: 'zh-CN' },
  // { locale: 'ja-JP', label: 'JP 日本語', targetLang: 'ja' },
];

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
  const sidebarContainerRef = useRef<HTMLElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const [isTabletSidebarOpen, setIsTabletSidebarOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [activeLocale, setActiveLocale] = useState<string>('en-US');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
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

  const closeTabletSidebar = useCallback(() => {
    setIsTabletSidebarOpen(false);
    setIsLanguageMenuOpen(false);
  }, []);

  const activeSidebarContext = useMemo<SidebarNavContext>(() => {
    if (isActivePath(currentPathname, '/docs/widgets')) {
      return 'widgets';
    }

    if (isActivePath(currentPathname, '/docs/usage')) {
      return 'usage';
    }

    if (isActivePath(currentPathname, '/docs/installation')) {
      return 'installation';
    }

    const resourcesSection = navigation.find((entry) => entry.section === 'Resources');
    const isResourcesPage = resourcesSection?.pages.some((page) => isActivePath(currentPathname, toDocHref(page.slugPath))) ?? false;

    if (isResourcesPage) {
      return 'resources';
    }

    return 'overview';
  }, [currentPathname, navigation]);

  const visibleNavigation = useMemo<NavSection[]>(() => {
    const getStartedSection = navigation.find((entry) => entry.section === 'Get Started');
    const widgetsSection = navigation.find((entry) => entry.section === 'Widgets');
    const resourcesSection = navigation.find((entry) => entry.section === 'Resources');

    const buildGetStartedSubset = (matcher: (slugPath: string) => boolean): NavSection[] => {
      if (!getStartedSection) {
        return [];
      }

      const pages = getStartedSection.pages.filter((page) => matcher(page.slugPath));

      if (pages.length === 0) {
        return [];
      }

      return [{
        ...getStartedSection,
        pages,
      }];
    };

    switch (activeSidebarContext) {
      case 'widgets':
        return widgetsSection ? [widgetsSection] : navigation;
      case 'resources':
        return resourcesSection ? [resourcesSection] : navigation;
      case 'installation': {
        const subset = buildGetStartedSubset((slugPath) => slugPath === 'installation' || slugPath.startsWith('installation/'));
        return subset.length > 0 ? subset : navigation;
      }
      case 'usage': {
        const subset = buildGetStartedSubset((slugPath) => slugPath === 'usage' || slugPath.startsWith('usage/'));
        return subset.length > 0 ? subset : navigation;
      }
      case 'overview':
      default: {
        return navigation;
      }
    }
  }, [activeSidebarContext, navigation]);

  const widgetGroup = useMemo(() => {
    const section = visibleNavigation.find((entry) => entry.section.toLowerCase() === 'widgets');
    if (!section) {
      return null;
    }
    return buildWidgetGroup(section);
  }, [visibleNavigation]);

  const [isWidgetOpen, setIsWidgetOpen] = useState(true);

  const toggleSection = useCallback((sectionName: string) => {
    setOpenSections((current) => ({
      ...current,
      [sectionName]: !(current[sectionName] ?? true),
    }));
  }, []);

  useEffect(() => {
    closeTabletSidebar();
  }, [pathname, closeTabletSidebar]);

  useEffect(() => {
    const syncActiveLocale = (targetLang: string) => {
      const syncedLanguage = languageOptions.find((language) => language.targetLang === targetLang);

      if (syncedLanguage) {
        setActiveLocale(syncedLanguage.locale);
      }
    };

    syncActiveLocale(getStoredTranslateLanguage());

    return onTranslateLanguageChange(syncActiveLocale);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const tabletQuery = window.matchMedia(`(max-width: ${TABLET_MAX_WIDTH}px)`);

    const onSidebarToggle = () => {
      if (!tabletQuery.matches) {
        return;
      }

      setIsTabletSidebarOpen((open) => !open);
    };

    const onResize = () => {
      if (!tabletQuery.matches) {
        setIsTabletSidebarOpen(false);
      }
    };

    window.addEventListener('docs-sidebar-toggle', onSidebarToggle as EventListener);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('docs-sidebar-toggle', onSidebarToggle as EventListener);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!languageMenuRef.current) {
        return;
      }

      if (!languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsLanguageMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!widgetGroup) {
      return;
    }

    const hasActiveChild = widgetGroup.children.some((child) => isActivePath(currentPathname, child.href));
    if (isActivePath(currentPathname, widgetGroup.href) || hasActiveChild) {
      setIsWidgetOpen(true);
    }
  }, [currentPathname, widgetGroup]);

  useEffect(() => {
    setOpenSections((current) => {
      const next: Record<string, boolean> = {};

      visibleNavigation.forEach((section) => {
        const isWidgetSection = section.section.toLowerCase() === 'widgets' && widgetGroup;
        const hasActiveEntry = isWidgetSection
          ? isActivePath(currentPathname, widgetGroup.href)
            || widgetGroup.children.some((child) => isActivePath(currentPathname, child.href))
          : section.pages.some((page) => isActivePath(currentPathname, toDocHref(page.slugPath)));

        const currentValue = current[section.section];

        if (hasActiveEntry) {
          next[section.section] = true;
        } else if (typeof currentValue === 'boolean') {
          next[section.section] = currentValue;
        } else {
          next[section.section] = true;
        }
      });

      const currentKeys = Object.keys(current);
      const nextKeys = Object.keys(next);
      const isSameState = currentKeys.length === nextKeys.length
        && nextKeys.every((key) => current[key] === next[key]);

      return isSameState ? current : next;
    });
  }, [currentPathname, visibleNavigation, widgetGroup]);

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

  useEffect(() => {
    const sidebarElement = sidebarContainerRef.current;

    if (!sidebarElement || typeof window === 'undefined') {
      return;
    }

    const GAP_PX = 30;
    const MIN_SIDEBAR_HEIGHT_PX = 140;
    let rafId = 0;

    const updateSidebarBounds = () => {
      rafId = 0;

      const nav = document.querySelector<HTMLElement>('.site-nav');
      const footer = document.querySelector<HTMLElement>('.docs-footer');
      const viewportHeight = window.innerHeight;

      const navBottom = Math.max(nav?.getBoundingClientRect().bottom ?? 0, 0);
      const footerTop = Math.min(footer?.getBoundingClientRect().top ?? viewportHeight, viewportHeight);

      const stickyTop = Math.min(Math.max(navBottom + GAP_PX, GAP_PX), viewportHeight - GAP_PX);
      const maxHeightByViewport = viewportHeight - stickyTop - GAP_PX;
      const maxHeightByFooter = footerTop - stickyTop - GAP_PX;
      const nextMaxHeight = Math.max(MIN_SIDEBAR_HEIGHT_PX, Math.min(maxHeightByViewport, maxHeightByFooter));

      sidebarElement.style.setProperty('--sidebar-sticky-top', `${Math.round(stickyTop)}px`);
      sidebarElement.style.setProperty('--sidebar-dynamic-max-height', `${Math.round(nextMaxHeight)}px`);
      syncScrollTopVisibility();
    };

    const queueUpdate = () => {
      if (rafId !== 0) {
        return;
      }

      rafId = window.requestAnimationFrame(updateSidebarBounds);
    };

    queueUpdate();
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);

    let resizeObserver: ResizeObserver | undefined;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(queueUpdate);

      const nav = document.querySelector<HTMLElement>('.site-nav');
      const footer = document.querySelector<HTMLElement>('.docs-footer');

      if (nav) {
        resizeObserver.observe(nav);
      }

      if (footer) {
        resizeObserver.observe(footer);
      }
    }

    return () => {
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [syncScrollTopVisibility]);

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
    closeTabletSidebar();
  }, [closeTabletSidebar, persistScrollPosition]);

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
    <>
      <button
        type="button"
        className="sidebar-tablet-backdrop"
        data-open={isTabletSidebarOpen}
        aria-label="Close sidebar"
        onClick={closeTabletSidebar}
      />

      <aside
        ref={sidebarContainerRef}
        className="sidebar"
        data-tablet-open={isTabletSidebarOpen}
        onClickCapture={handleClickCapture}
      >
        <button
          type="button"
          className="sidebar-tablet-close"
          aria-label="Close sidebar"
          onClick={closeTabletSidebar}
        >
          <X size={16} strokeWidth={1.9} aria-hidden="true" />
        </button>

        <div className="sidebar-tablet-header">
          <Link href="/docs/home" className="sidebar-tablet-brand" onClick={closeTabletSidebar}>
            <span className="sidebar-tablet-brand-mark" aria-hidden="true">
              <img className="sidebar-tablet-brand-logo sidebar-tablet-brand-logo-light" src={SIDEBAR_LOGO_LIGHT_URL} alt="" />
              <img className="sidebar-tablet-brand-logo sidebar-tablet-brand-logo-dark" src={SIDEBAR_LOGO_DARK_URL} alt="" />
            </span>
          </Link>

          <div className="sidebar-tablet-language-wrap" ref={languageMenuRef}>
            <button
              type="button"
              className="sidebar-tablet-language"
              data-open={isLanguageMenuOpen}
              aria-label="Open language options"
              aria-haspopup="menu"
              aria-expanded={isLanguageMenuOpen}
              onClick={() => setIsLanguageMenuOpen((open) => !open)}
            >
              <Globe size={20} aria-hidden="true" />
              <ChevronDown className="sidebar-tablet-language-caret" size={15} aria-hidden="true" />
            </button>

            <div className="sidebar-tablet-language-menu" data-open={isLanguageMenuOpen} role="menu" aria-label="Sidebar language menu">
              {languageOptions.map((language) => {
                const isSelected = language.locale === activeLocale;

                return (
                  <button
                    key={language.locale}
                    type="button"
                    className="sidebar-tablet-language-option"
                    data-active={isSelected}
                    role="menuitemradio"
                    aria-checked={isSelected}
                    onClick={() => {
                      setActiveLocale(language.locale);
                      setIsLanguageMenuOpen(false);
                      openTranslatedPage(language.targetLang);
                    }}
                  >
                    {language.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

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
          {visibleNavigation.map((section, sectionIndex) => {
            const isWidgetSection = section.section.toLowerCase() === 'widgets' && widgetGroup;
            const isSectionOpen = openSections[section.section] ?? true;
            const sectionItemsId = `sidebar-section-items-${sectionIndex}`;

            if (isWidgetSection) {
              const groupIsActive = isExactPath(currentPathname, widgetGroup.href);

              return (
                <div key={section.section} className="sidebar-section" data-open={isSectionOpen}>
                  <button
                    type="button"
                    className="sidebar-title sidebar-section-toggle"
                    data-open={isSectionOpen}
                    aria-expanded={isSectionOpen}
                    aria-controls={sectionItemsId}
                    onClick={() => toggleSection(section.section)}
                  >
                    <span className="sidebar-section-hover-bg" aria-hidden="true" />
                    <span className="sidebar-section-title-text">{section.section}</span>
                    <ChevronRight className="sidebar-section-caret" size={14} aria-hidden="true" />
                  </button>
                  <div id={sectionItemsId} className="sidebar-section-items" data-open={isSectionOpen}>
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
              <div key={section.section} className="sidebar-section" data-open={isSectionOpen}>
                <button
                  type="button"
                  className="sidebar-title sidebar-section-toggle"
                  data-open={isSectionOpen}
                  aria-expanded={isSectionOpen}
                  aria-controls={sectionItemsId}
                  onClick={() => toggleSection(section.section)}
                >
                  <span className="sidebar-section-hover-bg" aria-hidden="true" />
                  <span className="sidebar-section-title-text">{section.section}</span>
                  <ChevronRight className="sidebar-section-caret" size={14} aria-hidden="true" />
                </button>
                <div id={sectionItemsId} className="sidebar-section-items" data-open={isSectionOpen}>
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
    </>
  );
}
