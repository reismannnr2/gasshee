import PageBase from './common/page-base';
import Search from './features/search/search';

export default function Home() {
  return (
    <div id="root">
      <PageBase>
        <Search />
      </PageBase>
    </div>
  );
}
