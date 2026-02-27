import React, { useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink, FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import styles from './CustomNavbar.module.css';

const navLinks = [
  { href: '/docs/', label: 'Home' },
  { href: '/docs/overview', label: 'Overview' },
  { href: '/docs/installation', label: 'Installation' },
  { href: 'https://github.com/rushhiii/Scriptable-IOSWidgets', label: 'GitHub', external: true },
];


export default function CustomNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <img
          src="https://raw.githubusercontent.com/rushhiii/Scriptable-iOSWidgets/dd745134a5b46c44529d629a6fa9f0229980b3fe/.assets/favicon_sr.png"
          alt="Scriptable iOS Widgets Logo"
          className={styles.logo}
        />
        <span className={styles.title}>Scriptable iOS Widgets</span>
      </div>
      <div className={styles.right}>
        {navLinks.map(link => (
          <a
            key={link.href}
            href={link.href}
            className={
              styles.link +
              (currentPath === link.href.replace(/https?:\/\/.*/, '') ? ' ' + styles.active : '')
            }
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
          >
            {link.label}
            {link.external && <FiExternalLink style={{ color: 'gray', marginLeft: '0.25em', fontSize: '1em', verticalAlign: '-0.1em'}} />}
          </a>
        ))}
        <span className={styles.vline} />
        <ThemeToggle />
        <span className={styles.vline} />
        <a href="https://github.com/rushhiii" className={styles.iconBtn} title="GitHub Profile" target="_blank" rel="noopener noreferrer">
          <FaGithub />
        </a>
      </div>
      {/* Hamburger button: show menu or cross depending on drawer state */}
      <button
        className={drawerOpen ? styles.hamburger + ' ' + styles.open : styles.hamburger}
        onClick={() => setDrawerOpen(drawerOpen ? false : true)}
        aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
      >
        {drawerOpen ? <FiX className={styles.hamburgerIcon} /> : <FiMenu className={styles.hamburgerIcon} />}
      </button>
      {/* Overlay for closing drawer - render before drawer, z-index: 8 */}
      {drawerOpen && (
        <div className={styles.drawerOverlay} onClick={() => setDrawerOpen(false)} />
      )}
      {/* Mobile Drawer - z-index: 9 */}
      <div className={drawerOpen ? styles.mobileDrawer + ' ' + styles.open : styles.mobileDrawer}>
        <div className={styles.mobileNavLinks}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={
                styles.mobileNavLink +
                (currentPath === link.href.replace(/https?:\/\/.*/, '') ? ' ' + styles.active : '')
              }
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              onClick={() => setDrawerOpen(false)}
            >
              {link.label}
              {link.external && <FiExternalLink style={{marginLeft: '0.2em', fontSize: '1em', verticalAlign: '-0.1em'}} />}
            </a>
          ))}
        </div>
        <div className={styles.mobileNavFooter}>
          <ThemeToggle />
          <a href="https://github.com/rushhiii" className={styles.mobileNavIconBtn} title="GitHub Profile" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
        </div>
      </div>
    </nav>
  );
}
