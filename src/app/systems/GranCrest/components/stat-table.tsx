import { Atom, WritableAtom, atom } from 'jotai';
import Chapter from '../../../common/components/chapter';
import PlainTable, { RowDef } from '../../../features/plain-table/plain-table';
import { NumberInputDef, ReadonlyDef } from '../../../features/user-input/user-input';
import { growthSumAtomFamily } from '../states/misc';
import {
  STAT_NAMES,
  StatName,
  baseSumAtomFamily,
  baseSumDescriptionAtom,
  bonusDescriptionAtom,
  bonusStatAtomFamily,
  extraBaseDescriptionAtom,
  extraBaseStatAtomFamily,
  extraStatAtomFamily,
  extraStatDescriptionAtom,
  growthSumDescriptionAtom,
  setBonusStatAtomFamily,
  setExtraBaseStatAtomFamily,
  setExtraStatAtomFamily,
  setStyleStatAtomFamily,
  setWorksStatAtomFamily,
  statSumAtomFamily,
  statSumDescriptionAtom,
  styleStatAtomFamily,
  styleStatDescriptionAtom,
  worksDescriptionAtom,
  worksStatAtomFamily,
} from '../states/stats';
import styles from './stat-table.module.scss';
export default function StatTable() {
  return (
    <Chapter title="メインステータス">
      <PlainTable from={from} layout={layout} rowDefs={rowDefs} title={title} titles={titles} to={to} />
    </Chapter>
  );
}

const layout = styles.layout;
const title = '能力値';
const titles = ['', ...STAT_NAMES, '備考'];

const from = {
  worksStatAtomFamily,
  bonusStatAtomFamily,
  worksDescriptionAtom,
  bonusDescriptionAtom,
  extraBaseStatAtomFamily,
  extraBaseDescriptionAtom,
  growthSumDescriptionAtom,
  growthSumAtomFamily,
  baseSumDescriptionAtom,
  baseSumAtomFamily,
  styleStatAtomFamily,
  styleStatDescriptionAtom,
  extraStatAtomFamily,
  extraStatDescriptionAtom,
  statSumAtomFamily,
  statSumDescriptionAtom,
};
const to = {
  setWorksStatAtomFamily,
  setBonusStatAtomFamily,
  worksDescriptionAtom,
  bonusDescriptionAtom,
  setExtraBaseStatAtomFamily,
  extraBaseDescriptionAtom,
  growthSumDescriptionAtom,
  baseSumDescriptionAtom,
  baseSumAtomFamily,
  setStyleStatAtomFamily,
  styleStatDescriptionAtom,
  extraStatDescriptionAtom,
  setExtraStatAtomFamily,
  statSumDescriptionAtom,
};
type From = typeof from;
type To = typeof to;

const createRowDef = (
  title: string,
  from: (statName: StatName) => (from: From) => Atom<number>,
  to: (statName: StatName) => (to: To) => WritableAtom<unknown, [number], void>,
  descriptionFrom: (from: From) => Atom<string>,
  descriptionTo: (to: To) => WritableAtom<unknown, [string], void>,
): RowDef<From, To, unknown> => ({
  title,
  showRowtitle: true,
  cellDefs: [
    ...STAT_NAMES.map((title) => ({
      title,
      inputDefs: [
        {
          title,
          fn: () =>
            atom(() => {
              const def: NumberInputDef<From, To, unknown> = {
                type: 'number',
                title,
                from: from(title),
                to: to(title),
              };
              return def;
            }),
        },
      ],
      args: () => atom(null),
    })),
    {
      title: '備考',
      inputDefs: [
        {
          title: '備考',
          fn: () =>
            atom(() => ({
              type: 'text',
              title: '備考',
              from: descriptionFrom,
              to: descriptionTo,
            })),
        },
      ],
      args: () => atom(null),
    },
  ],
});

const worksRowDef: RowDef<From, To, unknown> = createRowDef(
  'ワークス',
  (title) => (from) => from.worksStatAtomFamily(title),
  (title) => (to) => to.setWorksStatAtomFamily(title),
  (from) => from.worksDescriptionAtom,
  (to) => to.worksDescriptionAtom,
);
const bonusRowDef: RowDef<From, To, unknown> = createRowDef(
  '初期ボーナス',
  (title) => (from) => from.bonusStatAtomFamily(title),
  (title) => (to) => to.setBonusStatAtomFamily(title),
  (from) => from.bonusDescriptionAtom,
  (to) => to.bonusDescriptionAtom,
);
const extraBaseRowDef: RowDef<From, To, unknown> = createRowDef(
  '基本値修正',
  (title) => (from) => from.extraBaseStatAtomFamily(title),
  (title) => (to) => to.setExtraBaseStatAtomFamily(title),
  (from) => from.extraBaseDescriptionAtom,
  (to) => to.extraBaseDescriptionAtom,
);
const growthSumRowDef: RowDef<From, To, unknown> = {
  title: '成長分',
  showRowtitle: true,
  cellDefs: [
    ...STAT_NAMES.map((title) => ({
      title,
      inputDefs: [
        {
          title,
          fn: () =>
            atom(() => {
              const def: ReadonlyDef<From, unknown> = {
                type: 'readonly',
                title,
                from: (from) => from.growthSumAtomFamily(title),
              };
              return def;
            }),
        },
      ],
      args: () => atom(null),
    })),
    {
      title: '備考',
      inputDefs: [
        {
          title: '備考',
          fn: () =>
            atom(() => ({
              type: 'text',
              title: '備考',
              from: (from) => from.growthSumDescriptionAtom,
              to: (to) => to.growthSumDescriptionAtom,
            })),
        },
      ],
      args: () => atom(null),
    },
  ],
};
const baseSumRowDef: RowDef<From, To, unknown> = {
  title: '基本値合計',
  showRowtitle: true,
  cellDefs: [
    ...STAT_NAMES.map((title) => ({
      title,
      inputDefs: [
        {
          title,
          fn: () =>
            atom(() => {
              const def: ReadonlyDef<From, unknown> = {
                type: 'readonly',
                title,
                from: (from) => from.baseSumAtomFamily(title),
              };
              return def;
            }),
        },
      ],
      args: () => atom(null),
    })),
    {
      title: '備考',
      inputDefs: [
        {
          title: '備考',
          fn: () =>
            atom(() => ({
              type: 'text',
              title: '備考',
              from: (from) => from.baseSumDescriptionAtom,
              to: (to) => to.baseSumDescriptionAtom,
            })),
        },
      ],
      args: () => atom(null),
    },
  ],
};
const styleRowDef: RowDef<From, To, unknown> = createRowDef(
  'スタイル',
  (title) => (from) => from.styleStatAtomFamily(title),
  (title) => (to) => to.setStyleStatAtomFamily(title),
  (from) => from.styleStatDescriptionAtom,
  (to) => to.styleStatDescriptionAtom,
);
const extraStatRowDef: RowDef<From, To, unknown> = createRowDef(
  '能力値修正',
  (title) => (from) => from.extraStatAtomFamily(title),
  (title) => (to) => to.setExtraStatAtomFamily(title),
  (from) => from.extraStatDescriptionAtom,
  (to) => to.extraStatDescriptionAtom,
);
const statRowDef: RowDef<From, To, unknown> = {
  title: '能力値合計',
  showRowtitle: true,
  cellDefs: [
    ...STAT_NAMES.map((title) => ({
      title,
      inputDefs: [
        {
          title,
          fn: () =>
            atom(() => {
              const def: ReadonlyDef<From, unknown> = {
                type: 'readonly',
                title,
                from: (from) => from.statSumAtomFamily(title),
              };
              return def;
            }),
        },
      ],
      args: () => atom(null),
    })),
    {
      title: '備考',
      inputDefs: [
        {
          title: '備考',
          fn: () =>
            atom(() => ({
              type: 'text',
              title: '備考',
              from: (from) => from.statSumDescriptionAtom,
              to: (to) => to.statSumDescriptionAtom,
            })),
        },
      ],
      args: () => atom(null),
    },
  ],
};
const rowDefs: RowDef<From, To, unknown>[] = [
  worksRowDef,
  bonusRowDef,
  growthSumRowDef,
  extraBaseRowDef,
  baseSumRowDef,
  styleRowDef,
  extraStatRowDef,
  statRowDef,
];
