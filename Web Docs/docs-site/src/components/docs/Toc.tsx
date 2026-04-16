'use client';

import type { TocItem } from '@/lib/docs';
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

    return () => {
      observer.disconnect();
    };
  }, [items]);

  if (!items.length) {
    return null;
  }

  return (
    <aside className="toc">
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
            style={{ paddingLeft: item.depth === 3 ? '1rem' : undefined }}
          >
            {item.text}
          </a>
        );
      })}
    </aside>
  );
}
