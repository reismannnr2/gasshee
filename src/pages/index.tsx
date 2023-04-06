import BaseLayout from '../components/layout/base-layout';
import NoSSR from '../components/no-ssr';
import AbilityTable from '../systems/gcr/ability-table';
import ArmorTable from '../systems/gcr/armor-table';
import MagicTable from '../systems/gcr/magic-table';
import SkillModificationTable from '../systems/gcr/skill-modification-table';
import SkillTable from '../systems/gcr/skill-table';
import StatsTable from '../systems/gcr/stats-table';
import styles from './index.module.scss';

export default function Home() {
  return (
    <BaseLayout>
      <NoSSR>
        <div className={styles['main-container']}>
          <section>
            <StatsTable />
          </section>
          <section>
            <SkillTable />
          </section>
          <section>
            <SkillModificationTable />
          </section>
          <section>
            <AbilityTable />
          </section>
          <section>
            <MagicTable />
          </section>
          <section>
            <ArmorTable />
          </section>
          <section>Hoge</section>
          <div id="test" />
        </div>
      </NoSSR>
    </BaseLayout>
  );
}
