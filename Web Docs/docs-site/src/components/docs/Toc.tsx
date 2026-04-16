'use client';

import type { TocItem } from '@/lib/docs';
import { useEffect, useRef, useState } from 'react';

type TocProps = {
  items: TocItem[];
};

export function DocsToc({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const tocRef = useRef<HTMLElement | null>(null);

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
        // rootMargin: '0px 0px 0% 0px',
        threshold: .2,
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

    // const GAP_PX = 16;
    // const MIN_TOC_HEIGHT_PX = 140;
    const GAP_PX = 46;
    const MIN_TOC_HEIGHT_PX = 0;
    let rafId = 0;

    const updateTocBounds = () => {
      rafId = 0;

      const nav = document.querySelector<HTMLElement>('.site-nav');
      const footer = document.querySelector<HTMLElement>('.docs-footer');
      const viewportHeight = window.innerHeight;

      const navBottom = Math.max(nav?.getBoundingClientRect().bottom ?? 0, 0);
      const footerTop = Math.min(footer?.getBoundingClientRect().top ?? viewportHeight, viewportHeight);

      const stickyTop = Math.min(Math.max(navBottom + GAP_PX, GAP_PX), viewportHeight - GAP_PX);
      const maxHeightByViewport = viewportHeight - stickyTop - GAP_PX;
      const maxHeightByFooter = footerTop - stickyTop - GAP_PX;
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
  }, []);

  if (!items.length) {
    return null;
  }

  return (
    <aside ref={tocRef} className="toc">
      {/* <div className="toc-title">On this page</div> */}
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
          >
            {item.text}
          </a>
        );
      })}
    </aside>
  );
}
