'use client';
import Maybe from '../../../common/components/maybe';
import NoSSR from '../../../common/components/no-ssr';
import StoreSheet from '../../../features/storage/store-sheet';
import { gcrSheetAtom } from '../states/sheet';
import BaseInfo from './base-info';
import styles from './gcr.module.scss';
import GrowthList from './growth-list';
import SkillTable from './skill-table';

export default function Gcr() {
  return (
    <NoSSR>
      <main className={styles.main}>
        <Maybe test={true}>
          <StoreSheet sheetAtom={gcrSheetAtom} />
        </Maybe>
        <Maybe test={false}>
          <BaseInfo />
          <SkillTable />
          <GrowthList />
        </Maybe>
      </main>
    </NoSSR>
  );
}
