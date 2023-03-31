import BaseLayout from '../components/layout/base-layout';
import NoSSR from '../components/no-ssr';
import AbilityTable from '../systems/gcr/ability-table';
import SkillModificationTable from '../systems/gcr/skill-modification-table';
import SkillTable from '../systems/gcr/skill-table';
import styles from './index.module.scss';

export default function Home() {
  return (
    <BaseLayout>
      <div className={styles['main-container']}>
        <section>
          <NoSSR>
            <SkillTable />
          </NoSSR>
        </section>
        <section>
          <NoSSR>
            <SkillModificationTable />
          </NoSSR>
        </section>
        <section>
          <NoSSR>
            <AbilityTable />
          </NoSSR>
        </section>
        <section>Hoge</section>
        <div id="test" />
      </div>
    </BaseLayout>
  );
}
