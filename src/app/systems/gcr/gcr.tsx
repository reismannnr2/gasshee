'use client';
import NoSSR from '../../common/components/no-ssr';
import DataList from './data-list';
import styles from './gcr.module.scss';
import SkillModificationList from './skill-modification-list';
import SkillTable from './skill-table';

export default function Gcr() {
  return (
    <NoSSR>
      <main className={styles.main}>
        <SkillTable />
        <SkillModificationList />
        <DataList />
      </main>
    </NoSSR>
  );
}
