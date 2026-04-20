'use client';

import type { TocItem } from '@/lib/docs';
import { List, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

type TocProps = {
  items: TocItem[];
};

const TOC_OPEN_STORAGE_KEY = 'docs.toc.open';
const TOC_TOGGLE_EVENT = 'docs-toc-toggle';
const TOC_STATE_EVENT = 'docs-toc-state-change';

export function DocsToc({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const tocRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(TOC_OPEN_STORAGE_KEY);

    if (stored === '0') {
      setIsOpen(false);
      return;
    }

    if (stored === '1') {
      setIsOpen(true);
      return;
    }

    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(TOC_OPEN_STORAGE_KEY, isOpen ? '1' : '0');
    window.dispatchEvent(new CustomEvent(TOC_STATE_EVENT, { detail: { isOpen } }));
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const onTocToggle = () => {
      setIsOpen((open) => !open);
    };

    window.addEventListener(TOC_TOGGLE_EVENT, onTocToggle as EventListener);

    return () => {
      window.removeEventListener(TOC_TOGGLE_EVENT, onTocToggle as EventListener);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!items.length) {
      return;
    }

    const hashTarget =
      typeof window !== 'undefined' && window.location.hash
        ? decodeURIComponent(window.location.hash.slice(1))
        : null;
    const initialActiveId = hashTarget && items.some((item) => item.id === hashTarget) ? hashTarget : items[0].id;
    setActiveId(initialActiveId);

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -65% 0px',
        threshold: 0.2,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [items]);

  useEffect(() => {
    const tocElement = tocRef.current;

    if (!tocElement || typeof window === 'undefined') {
      return;
    }

    const stickyModeQuery = window.matchMedia('(min-width: 1021px)');
    const DESKTOP_GAP_PX = 46;
    const MEDIUM_TOP_GAP_PX = 0;
    const MEDIUM_BOTTOM_GAP_PX = 0;
    const MIN_TOC_HEIGHT_PX = 0;
    let rafId = 0;

    const updateTocBounds = () => {
      rafId = 0;

      if (!stickyModeQuery.matches) {
        tocElement.style.removeProperty('--toc-sticky-top');
        tocElement.style.removeProperty('--toc-dynamic-max-height');
        return;
      }

      const nav = document.querySelector<HTMLElement>('.site-nav');
      const footer = document.querySelector<HTMLElement>('.docs-footer');
      const viewportHeight = window.innerHeight;
      const isDesktopWidth = window.innerWidth >= 1280;
      const topGapPx = isDesktopWidth ? DESKTOP_GAP_PX : MEDIUM_TOP_GAP_PX;
      const bottomGapPx = isDesktopWidth ? DESKTOP_GAP_PX : MEDIUM_BOTTOM_GAP_PX;

      const navBottom = Math.max(nav?.getBoundingClientRect().bottom ?? 0, 0);
      const footerTop = Math.min(footer?.getBoundingClientRect().top ?? viewportHeight, viewportHeight);

      const stickyTop = Math.min(Math.max(navBottom + topGapPx, topGapPx), viewportHeight - bottomGapPx);
      const maxHeightByViewport = viewportHeight - stickyTop - bottomGapPx;
      const maxHeightByFooter = footerTop - stickyTop - bottomGapPx;
      const nextMaxHeight = Math.max(MIN_TOC_HEIGHT_PX, Math.min(maxHeightByViewport, maxHeightByFooter));

      tocElement.style.setProperty('--toc-sticky-top', `${Math.round(stickyTop)}px`);
      tocElement.style.setProperty('--toc-dynamic-max-height', `${Math.round(nextMaxHeight)}px`);
    };

    const queueUpdate = () => {
      if (rafId !== 0) {
        return;
      }

      rafId = window.requestAnimationFrame(updateTocBounds);
    };

    queueUpdate();
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);

    const onViewportModeChange = () => {
      queueUpdate();
    };

    if (typeof stickyModeQuery.addEventListener === 'function') {
      stickyModeQuery.addEventListener('change', onViewportModeChange);
    } else {
      stickyModeQuery.addListener(onViewportModeChange);
    }

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

      if (typeof stickyModeQuery.removeEventListener === 'function') {
        stickyModeQuery.removeEventListener('change', onViewportModeChange);
      } else {
        stickyModeQuery.removeListener(onViewportModeChange);
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  if (!items.length) {
    return null;
  }

  const closeToc = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="toc-drawer-backdrop"
        data-open={isOpen}
        aria-label="Close in page content sidebar"
        onClick={closeToc}
      />

      <aside ref={tocRef} id="docs-page-content-toc" className="toc" data-open={isOpen}>
        <div className="toc-header">
          <div className="toc-title">
            <List className="toc-title-icon" size={13} strokeWidth={1.8} aria-hidden="true" />
            <span>On This Page</span>
          </div>

          <button
            type="button"
            className="toc-drawer-close"
            aria-label="Close in page content sidebar"
            onClick={closeToc}
          >
            <X size={16} strokeWidth={1.9} aria-hidden="true" />
          </button>
        </div>

        <div className="toc-panel" data-open={isOpen}>
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <a
                key={`${item.id}-${item.depth}`}
                href={`#${item.id}`}
                className="toc-link"
                data-active={isActive}
                aria-current={isActive ? 'true' : undefined}
                style={{ paddingLeft: item.depth === 3 ? '1.7rem' : undefined }}
                onClick={closeToc}
              >
                {item.text}
              </a>
            );
          })}
        </div>

        <div className="toc-theme-toggle-wrap" aria-label="Theme controls">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
