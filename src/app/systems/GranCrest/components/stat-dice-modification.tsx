import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import SortableList, { ListDef, RowDef } from '../../../features/sortable/sortable-list';
import { InputDef } from '../../../features/user-input/user-input';
import {
  StatModification,
  setStatModificationDescriptionFamily,
  setStatModificationDiceFamily,
  setStatModificationValueFamily,
  statModificatioDescriptionFamily,
  statModificatioValueFamily,
  statModificationAtom,
  statModificationDiceFamily,
} from '../states/skill-set';
import { StatName, statSumAtomFamily } from '../states/stats';

import styles from './stat-dice-modification.module.scss';

export default function StatDiceModification() {
  return (
    <SortableList
      add={add}
      disableSort={true}
      from={from}
      layout={layout}
      listDef={listDef}
      remove={remove}
      rowDef={rowDef}
      to={to}
    />
  );
}
const layout = styles.layout;
const from = {
  statModificationDiceFamily,
  statModificatioDescriptionFamily,
  statModificatioValueFamily,
  statModificationAtom,
  statSumAtomFamily,
};
const to = {
  setStatModificationValueFamily,
  setStatModificationDescriptionFamily,
  setStatModificationDiceFamily,
  statModificationAtom,
};

const args = atomFamily(
  (item: StatModification) => atom(item.能力値),
  (a, b) => a.id === b.id,
);
type From = typeof from;
type To = typeof to;
type Args = StatName;

const listDef: ListDef<StatModification, From, To> = {
  from: (from: From) => from.statModificationAtom,
  to: (to: To) => to.statModificationAtom,
};

const add = () =>
  atom(null, () => {
    return;
  });
const remove = add;

const inputDefs: InputDef<From, To, Args>[] = [
  {
    title: '',
    fn: () =>
      atom({
        type: 'readonly',
        title: '能力値',
        from: (_, statName) => atom(statName),
        spanProps: { className: styles['readonly-cell'] },
      }),
  },
  {
    title: 'ダイス',
    fn: () =>
      atom({
        type: 'number',
        title: 'ダイス',
        from: (from, statName) => from.statModificationDiceFamily(statName),
        to: (to, statName) => to.setStatModificationDiceFamily(statName),
      }),
  },
  {
    title: '固定値',
    fn: () =>
      atom({
        type: 'number',
        title: '固定値',
        from: (from, statName) => from.statModificatioValueFamily(statName),
        to: (to, statName) => to.setStatModificationValueFamily(statName),
      }),
  },
  {
    title: '判定値',
    fn: () =>
      atom({
        type: 'readonly',
        title: '判定値',
        from: (from, statName) =>
          atom((get) => {
            const dice = 2 + get(from.statModificationDiceFamily(statName));
            const fixed = get(from.statModificatioValueFamily(statName)) + get(from.statSumAtomFamily(statName));
            return `${dice}D+${fixed}`;
          }),
        spanProps: { className: styles['readonly-cell'] },
      }),
  },
  {
    title: '備考',
    fn: () =>
      atom({
        type: 'text',
        title: '備考',
        from: (from, statName) => from.statModificatioDescriptionFamily(statName),
        to: (to, statName) => to.setStatModificationDescriptionFamily(statName),
      }),
  },
];

const rowDef: RowDef<StatModification, From, To, Args> = {
  inputDefs,
  args,
};
