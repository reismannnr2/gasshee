import Image from 'next/image';
import Link from 'next/link';
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
      <Link href="/">
        <span className={styles.title}>gasshee</span>
        <Image alt="Site Icon" className={styles.icon} height={32} src="/favicon.ico" width={32} />
      </Link>
      <ul className={styles['system-list']}>
        <li>
          <Link href="/systems/GranCrest">GranCrest</Link>
        </li>
      </ul>
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
