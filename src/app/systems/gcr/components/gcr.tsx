'use client';
import NoSSR from '../../../common/components/no-ssr';
import BaseInfo from './base-info';
import styles from './gcr.module.scss';
import SkillTable from './skill-table';

export default function Gcr() {
  return (
    <NoSSR>
      <main className={styles.main}>
        <BaseInfo />
        <SkillTable />
      </main>
    </NoSSR>
  );
}
