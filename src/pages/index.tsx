import BaseLayout from '../components/base-layout';
import NoSSR from '../components/no-ssr';
import AbilityTable from '../systems/gcr/ability-table';
import SkillModificationTable from '../systems/gcr/skill-modification-table';
import SkillTable from '../systems/gcr/skill-table';

export default function Home() {
  return (
    <BaseLayout>
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
      <style jsx>{`
        section:not(:last-of-type) {
          margin-bottom: 1rem;
        }
      `}</style>
    </BaseLayout>
  );
}
