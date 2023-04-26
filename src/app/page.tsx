import Search from './features/search/search';
import styles from './page.module.scss';

export default function Home() {
  return (
    <div id="root">
      <h1 className={styles.header}>test</h1>
      <Search />
    </div>
  );
}
