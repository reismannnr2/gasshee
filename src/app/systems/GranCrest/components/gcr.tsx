'use client';
import Maybe from '../../../common/components/maybe';
import NoSSR from '../../../common/components/no-ssr';
import AbilityList from './ability-list';
import ArmieTable from './armie-table';
import ArmorList from './armor-list';
import BaseInfo from './base-info';
import ExtraText from './extra-text';
import styles from './gcr.module.scss';
import GrowthList from './growth-list';
import LifepathList from './lifepath-list';
import SkillDiceModification from './skill-dice-modification';
import SkillTable from './skill-table';
import StatDiceModification from './stat-dice-modification';
import StatTable from './stat-table';
import SubStatTable from './substat-table';

export default function Gcr() {
  return (
    <NoSSR>
      <main className={styles.main}>
        <Maybe test={true}>
          <BaseInfo />
          <StatTable />
          <SubStatTable />
          <SkillTable />
          <StatDiceModification />
          <SkillDiceModification />
          <AbilityList />
          <ArmieTable />
          <ArmorList />
          <GrowthList />
          <LifepathList />
          <ExtraText />
        </Maybe>
      </main>
    </NoSSR>
  );
}
