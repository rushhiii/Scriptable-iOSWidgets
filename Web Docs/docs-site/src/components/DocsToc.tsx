"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/docs";

export function DocsToc({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!headings.length) {
      return;
    }

    const elements = headings
      .map((heading) => document.getElementById(heading.slug))
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
        rootMargin: "0px 0px -65% 0px",
        threshold: 0.2,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (!headings.length) {
    return null;
  }

  return (
    <aside className="toc">
      <div className="toc-title">On this page</div>
      {headings.map((heading) => {
        const isActive = activeId === heading.slug;
        return (
          <a
            key={heading.slug}
            className="toc-link"
            href={`#${heading.slug}`}
            data-active={isActive}
            aria-current={isActive ? "true" : undefined}
            style={{ paddingLeft: heading.depth === 3 ? "1rem" : undefined }}
          >
            {heading.title}
          </a>
        );
      })}
    </aside>
  );
}
