'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AlertCircle, X } from 'lucide-react';
import { docsAnnouncement } from '@/lib/docs-announcement';

export function TopbarAnnouncement() {
  const pathname = usePathname();
  const [isDismissed, setIsDismissed] = useState(!docsAnnouncement.enabled);
  const [isAtTop, setIsAtTop] = useState(true);
  const storageKey = `docs-announcement-dismissed:${docsAnnouncement.id}`;

  useEffect(() => {
    if (!docsAnnouncement.enabled || typeof window === 'undefined') {
      setIsDismissed(true);
      return;
    }

    const dismissedValue = '1';
    const notDismissedValue = '0';

    try {
      const storedValue = window.localStorage.getItem(storageKey);
      const dismissed = storedValue === dismissedValue;

      if (storedValue !== dismissedValue && storedValue !== notDismissedValue) {
        window.localStorage.setItem(storageKey, notDismissedValue);
      }

      setIsDismissed(dismissed);
    } catch {
      setIsDismissed(false);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncAtTop = () => {
      setIsAtTop(window.scrollY <= 8);
    };

    syncAtTop();
    window.addEventListener('scroll', syncAtTop, { passive: true });

    return () => {
      window.removeEventListener('scroll', syncAtTop);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setIsAtTop(window.scrollY <= 8);
  }, [pathname]);

  const handleDismiss = () => {
    const dismissedValue = '1';

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(storageKey, dismissedValue);
      } catch {
        // Ignore storage errors and still hide for this session.
      }
    }

    setIsDismissed(true);
  };

  const shouldRender = docsAnnouncement.enabled && Boolean(docsAnnouncement.message) && !isDismissed;

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className="topbar-announcement"
      data-visible={isAtTop ? 'true' : 'false'}
      role="status"
      aria-live="polite"
      aria-hidden={!isAtTop}
    >
      <div className="topbar-announcement-inner">
        <div className="topbar-announcement-content">
          <span className="topbar-announcement-icon" aria-hidden="true">
            <AlertCircle size={16} />
          </span>

          <p className="topbar-announcement-text">
            {docsAnnouncement.message}
            {docsAnnouncement.linkHref && docsAnnouncement.linkLabel ? (
              <>
                {' '}
                <a
                  className="topbar-announcement-link"
                  href={docsAnnouncement.linkHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {docsAnnouncement.linkLabel}
                </a>
              </>
            ) : null}
          </p>
        </div>

        <button
          type="button"
          className="topbar-announcement-dismiss"
          aria-label="Dismiss update"
          onClick={handleDismiss}
        >
          <X size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
