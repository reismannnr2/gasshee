import PageBase from './common/page-base';
import Gcr from './systems/gcr/components/gcr';

export default function Home() {
  return (
    <div id="root">
      <PageBase>
        <Gcr />
      </PageBase>
    </div>
  );
}
