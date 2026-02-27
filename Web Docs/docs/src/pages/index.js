import React from 'react';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home() {
  return (
    <main className={styles.heroMain}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1>
            <span className={styles.gradientText}>Scriptable iOS Widgets</span>
            <br />
            Beautiful <br />
            Custom Widgets
          </h1>
          <p className={styles.subtitle}>
            A curated collection of powerful iOS widgets built with Scriptable – bringing more functionality and beauty to your home screen.
          </p>
          <div className={styles.buttonRow}>
            <Link className={styles.exploreButton} to="/docs/Widget%20Library">
              Explore Widgets
            </Link>
            <Link className={styles.ghButton} to="https://github.com/rushii404/Scriptable-IOSWidgets" target="_blank">
              View on GitHub
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img
            src="img/landing-widgets.png"
            alt="Scriptable iOS Widgets Gallery"
            className={styles.image}
          />
        </div>
      </div>
    </main>
  );
}
