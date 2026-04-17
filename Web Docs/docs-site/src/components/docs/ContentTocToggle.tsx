'use client';

import { List } from 'lucide-react';
import { useEffect, useState } from 'react';

const TOC_OPEN_STORAGE_KEY = 'docs.toc.open';
const TOC_TOGGLE_EVENT = 'docs-toc-toggle';
const TOC_STATE_EVENT = 'docs-toc-state-change';

export function ContentTocToggle() {
  const [isOpen, setIsOpen] = useState(false);

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

    const onTocStateChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ isOpen?: boolean }>;

      if (typeof customEvent.detail?.isOpen === 'boolean') {
        setIsOpen(customEvent.detail.isOpen);
      }
    };

    window.addEventListener(TOC_STATE_EVENT, onTocStateChange as EventListener);

    return () => {
      window.removeEventListener(TOC_STATE_EVENT, onTocStateChange as EventListener);
    };
  }, []);

  const toggleToc = () => {
    if (typeof window === 'undefined') {
      return;
    }

    setIsOpen((open) => !open);
    window.dispatchEvent(new CustomEvent(TOC_TOGGLE_EVENT));
  };

  return (
    <div className="content-toc-toggle-wrap">
      <button
        type="button"
        className="content-toc-toggle-button"
        data-open={isOpen}
        aria-label={isOpen ? 'Hide in page content sidebar' : 'Show in page content sidebar'}
        aria-expanded={isOpen}
        aria-controls="docs-page-content-toc"
        onClick={toggleToc}
      >
        <List size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
