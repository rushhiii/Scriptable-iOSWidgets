'use client';

import type { TocItem } from '@/lib/docs';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type TocProps = {
  items: TocItem[];
};

export function DocsToc({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!items.length) {
      return;
    }

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

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="toc surface-card sticky top-[110px] max-h-[calc(100vh-8rem)] overflow-auto p-4 xl:block">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">On this page</p>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Headings will appear here as you add sections.</p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {items.map((item) => (
            <li key={`${item.id}-${item.depth}`}>
              <a
                href={`#${item.id}`}
                className={clsx(
                  'block rounded-lg border border-transparent py-1 text-sm text-muted transition-colors hover:text-ink',
                  activeId === item.id && 'border-brand/60 bg-brand/15 text-ink',
                  item.depth === 3 ? 'pl-4' : 'pl-0'
                )}
                aria-current={activeId === item.id ? 'true' : undefined}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
