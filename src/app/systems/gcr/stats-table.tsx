import styles from './stats-table.module.scss';
import PlainTable from '../../features/plain-table/plain-table';
import { STAT_NAMES } from './states/stats';

export default function StatsTable() {
  return <PlainTable ex={ex} item={item} layout={layout} rows={rows} setter={setter} title={title} titles={titles} />;
}

const title = '能力基本値テーブル';
const titles = STAT_NAMES;
const layout = styles.layout;
const rows: never[] = [];
const item = {};
const setter = () => ({});
const ex = {};
