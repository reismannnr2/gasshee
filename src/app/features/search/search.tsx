'use client';
import Filters from './filters';
import styles from './search.module.scss';
import UnitList from './unit-list';
export default function Search() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <Filters />
      </section>
      <section className={styles.section}>
        <UnitList />
      </section>
    </main>
  );
}
