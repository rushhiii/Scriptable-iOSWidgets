'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as ThemeMode | undefined) || 'dark';
    setTheme(current);
  }, []);

  const isDark = theme === 'dark';

  function toggleTheme() {
    const nextTheme: ThemeMode = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('docs-theme', nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="grid h-9 w-14 place-items-center rounded-full border border-line/60 bg-panel/80 text-ink transition hover:border-brand/70"
    >
      <span
        className={`relative flex h-6 w-11 items-center rounded-full px-1 transition-colors ${
          isDark ? 'bg-brand/35' : 'bg-line/40'
        }`}
      >
        <span
          className={`absolute h-4 w-4 rounded-full bg-panelStrong shadow transition-transform ${
            isDark ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}
