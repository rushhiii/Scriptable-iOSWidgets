import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { LuCircle, LuMoon, LuSun } from 'react-icons/lu';
import styles from './CustomNavbar.module.css';

export default function ThemeToggle() {
  const { colorMode, setColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  return (
    <button
      className={styles.themeToggle}
      onClick={() => setColorMode(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      type="button"
    >
      <span className={styles.themeTrack}>
        <span
          className={styles.themeThumb}
          style={{ left: isDark ? 'calc(100% - 1.4rem)' : 'calc(100% - 2.799rem)' }}
        >
          {isDark ? <LuMoon /> : <LuSun />}
          {/* {isDark ? <LuCircle /> : <LuSun />} */}
        </span>
      </span>
    </button>
  );
}
