import clsx from 'clsx';
import { useState } from 'react';
import { typedEntries } from '../../commons/object-utils';
import styles from './stats-table.module.scss';
interface Stats {
  筋力: string;
  反射: string;
  感覚: string;
  知力: string;
  精神: string;
  共感: string;
}

const baseStats: Stats = {
  筋力: '10',
  反射: '12',
  感覚: '13',
  知力: '9',
  精神: '7',
  共感: '12',
};
const emptyStats: Stats = {
  筋力: '',
  反射: '',
  感覚: '',
  知力: '',
  精神: '',
  共感: '',
};

interface SubStats {
  HP: string;
  MP: string;
  移動: string;
  行動: string;
}

const baseSubStats: SubStats = {
  HP: '10',
  MP: '10',
  移動: '10',
  行動: '10',
};
const emptySubStats: SubStats = {
  HP: '',
  MP: '',
  移動: '',
  行動: '',
};

export default function StatsTable() {
  return (
    <div className={styles.container}>
      <BaseStatTable />
      <SubStatsTable />
    </div>
  );
}
const statsList: [string, Stats, boolean, boolean][] = [
  ['ワークス', baseStats, true, false],
  ['初期ボーナス', emptyStats, false, false],
  ['成長', emptyStats, false, false],
  ['その他', emptyStats, false, false],
  ['基本値', baseStats, true, true],
  ['スタイル', baseStats, true, false],
  ['その他', emptyStats, false, false],
  ['計', baseStats, true, true],
];
function BaseStatTable() {
  return (
    <table className={styles['base-table']}>
      <thead>
        <tr>
          <th className={styles['row-title']} />
          {Object.keys(baseStats).map((key) => (
            <th key={key} className={styles.item}>
              {key}
            </th>
          ))}
          <th>備考</th>
        </tr>
      </thead>
      <tbody>
        {statsList.map(([title, init, readonly, summary]) => (
          <StatsRow key={title} init={init} readonly={readonly} summary={summary} title={title} />
        ))}
      </tbody>
    </table>
  );
}

function StatsRow({
  title,
  readonly,
  init,
  summary,
}: {
  title: string;
  readonly?: boolean;
  init: Stats;
  summary?: boolean;
}) {
  const [stats, setStats] = useState<Stats>(init);
  return (
    <tr className={clsx({ [styles['summray-row']]: summary })}>
      <th className={styles['row-title']}>{title}</th>
      {typedEntries(stats).map(([key, value]) => (
        <td key={key}>
          <input
            readOnly={readonly}
            type="text"
            value={value}
            onChange={(e) => {
              if (readonly) {
                return;
              }
              setStats((stats) => ({ ...stats, [key]: e.target.value }));
            }}
          />
        </td>
      ))}
      <td>
        <input className={styles.long} type="text" />
      </td>
    </tr>
  );
}

const subStats: [string, SubStats, boolean, boolean][] = [
  ['ワークス', baseSubStats, true, false],
  ['スタイル', baseSubStats, true, false],
  ['ベース値', emptySubStats, false, false],
  ['その他', emptySubStats, false, false],
  ['基本値', baseSubStats, true, true],
  ['計', baseSubStats, true, true],
];

// table for Substats just like BaseStatTable
function SubStatsTable() {
  return (
    <table className={styles['sub-table']}>
      <thead>
        <tr>
          <th className={styles['row-title']} />
          {Object.keys(baseSubStats).map((key) => (
            <th key={key} className={styles.item}>
              {key}
            </th>
          ))}
          <th>備考</th>
        </tr>
      </thead>
      <tbody>
        {subStats.map(([title, init, readonly, summary]) => (
          <SubStatsRow key={title} init={init} readonly={readonly} summary={summary} title={title} />
        ))}
      </tbody>
    </table>
  );
}

// table row for Substats just like StatsRow
function SubStatsRow({
  title,
  readonly,
  init,
  summary,
}: {
  title: string;
  readonly?: boolean;
  init: SubStats;
  summary?: boolean;
}) {
  const [stats, setStats] = useState<SubStats>(init);
  return (
    <tr className={clsx({ [styles['summray-row']]: summary })}>
      <th className={styles['row-title']}>{title}</th>
      {typedEntries(stats).map(([key, value]) => (
        <td key={key}>
          <input
            readOnly={readonly}
            type="text"
            value={value}
            onChange={(e) => {
              if (readonly) {
                return;
              }
              setStats((stats) => ({ ...stats, [key]: e.target.value }));
            }}
          />
        </td>
      ))}
      <td>
        <input className={styles.long} type="text" />
      </td>
    </tr>
  );
}
