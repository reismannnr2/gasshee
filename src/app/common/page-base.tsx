import React from 'react';
import styles from './page-base.module.scss';

export type Props = {
  children?: React.ReactNode;
};

export default function PageBase({ children }: Props) {
  return (
    <div className={styles.base}>
      <Header />
      <div className={styles.main}>{children}</div>
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