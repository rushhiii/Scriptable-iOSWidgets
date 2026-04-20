'use client';

import { getStoredTranslateLanguage, onTranslateLanguageChange, openTranslatedPage } from '@/lib/google-translate';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Check, ChevronDown, Download, Globe, Home, Info, LayoutGrid, type LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

type LanguageOption = {
  locale: string;
  label: string;
  targetLang: string;
};

const languageOptions: LanguageOption[] = [
  { locale: 'en-US', label: '🇺🇸 English', targetLang: 'en' },
  { locale: 'fr-FR', label: '🇫🇷 Français', targetLang: 'fr' },
  { locale: 'zh-CN', label: '🇨🇳 中文', targetLang: 'zh-CN' },
  { locale: 'ja-JP', label: '🇯🇵 日本語', targetLang: 'ja' },
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
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [activeLocale, setActiveLocale] = useState<string>('en-US');
  const [useHoverMenus, setUseHoverMenus] = useState(false);
  const [useCenteredMobileDropdown, setUseCenteredMobileDropdown] = useState(false);
  const [mobileDropdownTop, setMobileDropdownTop] = useState(0);
  const subnavRef = useRef<HTMLDivElement | null>(null);
  const mobileDropdownRef = useRef<HTMLDivElement | null>(null);
  const subnavLinksRef = useRef<HTMLElement | null>(null);
  const lastSubnavScrollLeftRef = useRef(0);
  const [subnavScrollState, setSubnavScrollState] = useState({
    hasOverflow: false,
    canScrollLeft: false,
    canScrollRight: false,
  });

  const setOpenDropdownWithScrollLock = useCallback((nextValue: string | null | ((current: string | null) => string | null)) => {
    const linksElement = subnavLinksRef.current;

    if (linksElement) {
      lastSubnavScrollLeftRef.current = linksElement.scrollLeft;
    }

    setOpenDropdown(nextValue);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setIsLanguageMenuOpen(false);
  }, [pathname]);

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
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const syncHoverMode = () => {
      setUseHoverMenus(mediaQuery.matches);
    };

    syncHoverMode();
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncHoverMode);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', syncHoverMode);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(max-width: 700px)');
    const syncCenteredMobileDropdown = () => {
      setUseCenteredMobileDropdown(mediaQuery.matches);
    };

    syncCenteredMobileDropdown();
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncCenteredMobileDropdown);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', syncCenteredMobileDropdown);
      }
    };
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!subnavRef.current) {
        return;
      }

      const eventTarget = event.target as Node;
      const clickedInsideSubnav = subnavRef.current.contains(eventTarget);
      const clickedInsideMobileDropdown = mobileDropdownRef.current?.contains(eventTarget) ?? false;

      if (!clickedInsideSubnav && !clickedInsideMobileDropdown) {
        setOpenDropdownWithScrollLock(null);
        setIsLanguageMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenDropdownWithScrollLock(null);
        setIsLanguageMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [setOpenDropdownWithScrollLock]);

  const updateMobileDropdownTop = useCallback(() => {
    const siteNavElement = subnavRef.current?.closest('.site-nav');

    if (!(siteNavElement instanceof HTMLElement)) {
      return;
    }

    const nextTop = Math.max(0, Math.round(siteNavElement.getBoundingClientRect().bottom));
    setMobileDropdownTop((current) => (Math.abs(current - nextTop) < 1 ? current : nextTop));
  }, []);

  useEffect(() => {
    if (!useCenteredMobileDropdown) {
      return;
    }

    updateMobileDropdownTop();

    const onViewportChange = () => {
      updateMobileDropdownTop();
    };

    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, { passive: true });

    return () => {
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange);
    };
  }, [useCenteredMobileDropdown, updateMobileDropdownTop]);

  useEffect(() => {
    if (!useCenteredMobileDropdown || !openDropdown) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      updateMobileDropdownTop();
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [openDropdown, useCenteredMobileDropdown, updateMobileDropdownTop]);

  const updateSubnavScrollState = useCallback(() => {
    const linksElement = subnavLinksRef.current;

    if (!linksElement) {
      return;
    }

    lastSubnavScrollLeftRef.current = linksElement.scrollLeft;
    const maxScrollLeft = Math.max(0, linksElement.scrollWidth - linksElement.clientWidth);
    const hasOverflow = maxScrollLeft > 1;
    const canScrollLeft = linksElement.scrollLeft > 1;
    const canScrollRight = linksElement.scrollLeft < maxScrollLeft - 1;

    setSubnavScrollState((current) => {
      if (
        current.hasOverflow === hasOverflow
        && current.canScrollLeft === canScrollLeft
        && current.canScrollRight === canScrollRight
      ) {
        return current;
      }

      return {
        hasOverflow,
        canScrollLeft,
        canScrollRight,
      };
    });
  }, []);

  useEffect(() => {
    const linksElement = subnavLinksRef.current;

    if (!linksElement) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      const nextScrollLeft = lastSubnavScrollLeftRef.current;

      if (Math.abs(linksElement.scrollLeft - nextScrollLeft) > 1) {
        linksElement.scrollLeft = nextScrollLeft;
        updateSubnavScrollState();
      }
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [openDropdown, updateSubnavScrollState]);

  useEffect(() => {
    const linksElement = subnavLinksRef.current;

    if (!linksElement) {
      return;
    }

    const onScroll = () => {
      updateSubnavScrollState();
    };

    updateSubnavScrollState();

    linksElement.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateSubnavScrollState);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(() => {
        updateSubnavScrollState();
      });

      resizeObserver.observe(linksElement);
    }

    return () => {
      linksElement.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateSubnavScrollState);
      resizeObserver?.disconnect();
    };
  }, [updateSubnavScrollState]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      updateSubnavScrollState();
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [pathname, openDropdown, isLanguageMenuOpen, activeLocale, resourcesLinks, updateSubnavScrollState]);

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

  const activeLanguage = useMemo(
    () => languageOptions.find((language) => language.locale === activeLocale) ?? languageOptions[0],
    [activeLocale]
  );

  const openSubnavItem = useMemo(() => {
    if (!openDropdown) {
      return null;
    }

    const matchingItem = subnavLinks.find((item) => item.href === openDropdown);
    if (!matchingItem || !hasChildren(matchingItem)) {
      return null;
    }

    return matchingItem;
  }, [openDropdown, subnavLinks]);

  return (
    <div className="subnav">
      <div className="subnav-inner" ref={subnavRef}>
        <div className="subnav-label">Scriptable iOSWidgets Docs</div>

        <nav
          className="subnav-links"
          ref={subnavLinksRef}
          data-dropdown-open={openDropdown ? 'true' : 'false'}
          data-scroll-overflow={subnavScrollState.hasOverflow ? 'true' : 'false'}
          data-scroll-left={subnavScrollState.canScrollLeft ? 'true' : 'false'}
          data-scroll-right={subnavScrollState.canScrollRight ? 'true' : 'false'}
          aria-label="Section navigation"
        >
          {subnavLinks.map((item) => {
            const isActive = isSubnavItemActive(pathname, item);
            const isOpen = openDropdown === item.href;

            if (hasChildren(item)) {
              return (
                <div
                  key={item.href}
                  className="subnav-item subnav-item-dropdown"
                  data-open={isOpen}
                  onMouseEnter={() => {
                    if (!useHoverMenus) {
                      return;
                    }
                    setOpenDropdownWithScrollLock(item.href);
                    setIsLanguageMenuOpen(false);
                  }}
                  onMouseLeave={() => {
                    if (!useHoverMenus) {
                      return;
                    }
                    setOpenDropdownWithScrollLock((current) => (current === item.href ? null : current));
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
                      setIsLanguageMenuOpen(false);
                      setOpenDropdownWithScrollLock((current) => (current === item.href ? null : item.href));
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

                  {!useCenteredMobileDropdown ? (
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
                            onClick={() => {
                              setOpenDropdownWithScrollLock(null);
                              setIsLanguageMenuOpen(false);
                            }}
                          >
                            {child.title}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
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

        <div className="subnav-actions">
          <div
            className="subnav-item subnav-item-dropdown subnav-language-switcher"
            onMouseEnter={() => {
              if (!useHoverMenus) {
                return;
              }
              setIsLanguageMenuOpen(true);
              setOpenDropdownWithScrollLock(null);
            }}
            onMouseLeave={() => {
              if (!useHoverMenus) {
                return;
              }
              setIsLanguageMenuOpen(false);
            }}
          >
            <button
              type="button"
              className="subnav-link subnav-link-dropdown subnav-language-trigger"
              data-open={isLanguageMenuOpen}
              aria-haspopup="menu"
              aria-expanded={isLanguageMenuOpen}
              onClick={() => {
                setOpenDropdownWithScrollLock(null);
                setIsLanguageMenuOpen((current) => !current);
              }}
            >
              <span className="subnav-language-icon" aria-hidden="true">
                <Globe size={14} />
              </span>
              <span className="subnav-language-label">{activeLanguage.label}</span>
              <ChevronDown className="subnav-caret" aria-hidden="true" size={14} />
            </button>

            <div className="subnav-dropdown subnav-language-dropdown" data-open={isLanguageMenuOpen} role="menu" aria-label="Language menu">
              {languageOptions.map((language) => {
                const isSelected = language.locale === activeLocale;

                return (
                  <button
                    key={language.locale}
                    type="button"
                    className="subnav-dropdown-link subnav-language-option"
                    data-active={isSelected}
                    role="menuitemradio"
                    aria-checked={isSelected}
                    onClick={() => {
                      setActiveLocale(language.locale);
                      setIsLanguageMenuOpen(false);
                      openTranslatedPage(language.targetLang);
                    }}
                  >
                    <span>{language.label}</span>
                    {isSelected ? <Check className="subnav-language-check" aria-hidden="true" size={14} /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {useCenteredMobileDropdown && openSubnavItem ? (
        <div
          className="subnav-mobile-dropdown-backdrop"
          role="presentation"
          style={{ top: mobileDropdownTop }}
          onClick={() => {
            setOpenDropdownWithScrollLock(null);
            setIsLanguageMenuOpen(false);
          }}
        >
          <div
            ref={mobileDropdownRef}
            className="subnav-dropdown subnav-mobile-dropdown"
            data-open="true"
            role="menu"
            aria-label={`${openSubnavItem.title} menu`}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {openSubnavItem.children.map((child) => {
              const childActive = isActivePath(pathname, child.href);

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className="subnav-dropdown-link"
                  data-active={childActive}
                  role="menuitem"
                  onClick={() => {
                    setOpenDropdownWithScrollLock(null);
                    setIsLanguageMenuOpen(false);
                  }}
                >
                  {child.title}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
