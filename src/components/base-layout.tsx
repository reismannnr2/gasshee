import React from 'react';
import styles from './base-layout.module.scss';

export default function BaseLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className={styles.base}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.title}>gasshee</span>
    </header>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <span>icons by icon8</span>
    </footer>
  );
}
