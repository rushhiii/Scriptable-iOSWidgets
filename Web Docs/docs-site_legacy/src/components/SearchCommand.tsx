"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type SearchHeading = {
  depth: number;
  title: string;
};

type SearchItem = {
  title: string;
  summary: string;
  headings: SearchHeading[];
  href: string;
  section: string;
};

function normalizeHref(href: string) {
  if (href === "/" || href.startsWith("http") || href.includes("#")) {
    return href;
  }
  return href.endsWith("/") ? href : `${href}/`;
}

function scoreItem(item: SearchItem, query: string) {
  const lower = query.toLowerCase();
  let score = 0;
  if (item.title.toLowerCase().includes(lower)) score += 3;
  if (item.summary.toLowerCase().includes(lower)) score += 2;
  if (item.headings.some((heading) => heading.title.toLowerCase().includes(lower))) {
    score += 1;
  }
  return score;
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open && items.length === 0) {
      fetch("/search-index.json")
        .then((res) => res.json())
        .then((data: SearchItem[]) => setItems(data))
        .catch(() => setItems([]));
    }
  }, [open, items.length]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (!modalRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return items.slice(0, 6);
    }
    return items
      .map((item) => ({ item, score: scoreItem(item, trimmed) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((entry) => entry.item);
  }, [items, query]);

  return (
    <>
      <button className="search-trigger" type="button" onClick={() => setOpen(true)}>
        <Search className="search-icon" aria-hidden="true" size={16} />
        <span className="search-text">Search...</span>
        <span className="search-kbd" aria-hidden="true">
          <span className="search-kbd-key">Ctrl</span>
          <span className="search-kbd-key">K</span>
        </span>
      </button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="search-overlay"
        >
          <div
            ref={modalRef}
            className="search-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="search-input-row">
              <div className="search-input-shell">
                <Search className="search-input-icon" aria-hidden="true" size={18} />
                <input
                  ref={inputRef}
                  placeholder="Search..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="search-input"
                />
                <button
                  className="search-esc"
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close search dialog"
                >
                  Esc
                </button>
              </div>
            </div>
            <div className="search-results">
              {results.length ? (
                results.map((item) => (
                  <Link
                    key={item.href}
                    href={normalizeHref(item.href)}
                    onClick={() => setOpen(false)}
                    className="search-result"
                  >
                    <div className="search-result-title">{item.title}</div>
                    <div className="search-result-meta">{item.summary || item.section}</div>
                  </Link>
                ))
              ) : (
                <div className="search-empty">
                  No results yet. Try another search.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
