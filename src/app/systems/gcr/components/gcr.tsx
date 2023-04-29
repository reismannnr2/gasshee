'use client';
import NoSSR from '../../../common/components/no-ssr';
import styles from './gcr.module.scss';
import SkillTable from './skill-table';

export default function Gcr() {
  return (
    <NoSSR>
      <main className={styles.main}>
        <SkillTable />
      </main>
    </NoSSR>
  );
}
