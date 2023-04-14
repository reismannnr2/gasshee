'use client';
import NoSSR from '../../common/components/no-ssr';
import styles from './gcr.module.scss';

export default function Gcr() {
  return (
    <NoSSR>
      <main className={styles.main}>hoge</main>
    </NoSSR>
  );
}
