'use client';

import { useEffect, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';

export function FloatingThemeToggle() {
  const floatingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const floating = floatingRef.current;

    if (!floating || typeof window === 'undefined') {
      return;
    }

    // const FOOTER_GAP_PX = 18;
    const FOOTER_GAP_PX = 0;
    let rafId = 0;

    const updateFloatingOffset = () => {
      rafId = 0;

      const footer = document.querySelector<HTMLElement>('.docs-footer');
      const viewportHeight = window.innerHeight;
      const footerTop = footer?.getBoundingClientRect().top ?? viewportHeight + FOOTER_GAP_PX;
      const liftOffset = Math.max(0, viewportHeight - footerTop + FOOTER_GAP_PX);

      floating.style.setProperty('--theme-floating-lift', `${Math.round(liftOffset)}px`);
    };

    const queueUpdate = () => {
      if (rafId !== 0) {
        return;
      }

      rafId = window.requestAnimationFrame(updateFloatingOffset);
    };

    queueUpdate();
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);

    let resizeObserver: ResizeObserver | undefined;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(queueUpdate);

      const footer = document.querySelector<HTMLElement>('.docs-footer');
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

  return (
    <div ref={floatingRef} className="docs-theme-floating" aria-label="Theme controls">
      <ThemeToggle />
    </div>
  );
}
