'use client';

import { MoonStar, Sun } from 'lucide-react';
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
      className="theme-toggle"
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb" aria-hidden="true">
          {isDark ? (
            <MoonStar className="theme-toggle-icon" strokeWidth={1.8} />
          ) : (
            <Sun className="theme-toggle-icon" strokeWidth={1.8} />
          )}
        </span>
      </span>
    </button>
  );
}
