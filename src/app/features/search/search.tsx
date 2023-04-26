'use client';
import Filters from './filters';
import styles from './search.module.scss';
export default function Search() {
  return (
    <main className={styles.main}>
      <Filters />
    </main>
  );
}
