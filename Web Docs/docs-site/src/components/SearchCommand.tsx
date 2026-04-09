"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

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
      <button className="action-button" type="button" onClick={() => setOpen(true)}>
        Search
        <span style={{ color: "var(--text-3)", fontSize: "0.8rem" }}>Ctrl K</span>
      </button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.35)",
            display: "grid",
            placeItems: "center",
            zIndex: 100,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              width: "min(720px, 92vw)",
              background: "var(--surface)",
              borderRadius: "24px",
              border: "1px solid var(--border)",
              padding: "1.5rem",
              boxShadow: "var(--shadow)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
              <input
                ref={inputRef}
                placeholder="Search docs, widgets, and setup guides"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                style={{
                  flex: 1,
                  padding: "0.85rem 1rem",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-soft)",
                  color: "var(--text-1)",
                  fontSize: "1rem",
                }}
              />
              <button className="action-button" type="button" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {results.length ? (
                results.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "grid",
                      gap: "0.2rem",
                      padding: "0.85rem 1rem",
                      borderRadius: "16px",
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>
                      {item.summary || item.section}
                    </div>
                  </Link>
                ))
              ) : (
                <div style={{ color: "var(--text-3)", fontSize: "0.95rem" }}>
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
