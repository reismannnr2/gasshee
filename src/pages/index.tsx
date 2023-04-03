import BaseLayout from '../components/layout/base-layout';
import NoSSR from '../components/no-ssr';
import AbilityTable from '../systems/gcr/ability-table';
import ArmorTable from '../systems/gcr/armor-table';
import SkillModificationTable from '../systems/gcr/skill-modification-table';
import SkillTable from '../systems/gcr/skill-table';
import styles from './index.module.scss';

export default function Home() {
  return (
    <BaseLayout>
      <NoSSR>
        <div className={styles['main-container']}>
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
            <ArmorTable />
          </section>
          <section>Hoge</section>
          <div id="test" />
        </div>
      </NoSSR>
    </BaseLayout>
  );
}
