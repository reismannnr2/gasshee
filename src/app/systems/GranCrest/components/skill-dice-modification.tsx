import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import Chapter from '../../../common/components/chapter';
import SortableList, { ListDef, RowDef } from '../../../features/sortable/sortable-list';
import { InputDef } from '../../../features/user-input/user-input';
import {
  SkillModification,
  addSkillModificationAtom,
  removeSkillModificationAtom,
  setSkillModificationDescriptionFamily,
  setSkillModificationDiceFamily,
  setSkillModificationNameFamily,
  setSkillModificationValueFamily,
  skillFromNameFamily,
  skillModificationAtom,
  skillModificationDescriptionFamily,
  skillModificationDiceFamily,
  skillModificationFamily,
  skillModificationNameFamily,
  skillModificationValueFamily,
  skillStatFamily,
  statModificatioValueFamily,
  statModificationDiceFamily,
} from '../states/skill-set';
import { statSumAtomFamily } from '../states/stats';
import styles from './skill-dice-modification.module.scss';

export default function SkillDiceModification() {
  return (
    <Chapter title="判定修正(技能)" tooltip="対象の技能を使用する判定を修正します">
      <SortableList add={add} from={from} layout={layout} listDef={listDef} remove={remove} rowDef={rowDef} to={to} />
    </Chapter>
  );
}
const layout = styles.layout;
const from = {
  skillModificationDiceFamily,
  skillModificationDescriptionFamily,
  skillModificationValueFamily,
  skillModificationAtom,
  statSumAtomFamily,
  skillModificationNameFamily,
  skillStatFamily,
  skillFromNameFamily,
  skillModificationFamily,
  statModificationDiceFamily,
  statModificatioValueFamily,
};
const to = {
  setSkillModificationValueFamily,
  setSkillModificationDescriptionFamily,
  setSkillModificationDiceFamily,
  skillModificationAtom,
  setSkillModificationNameFamily,
};

const args = atomFamily(
  (item: SkillModification) => atom(item.id),
  (a, b) => a.id === b.id,
);
type From = typeof from;
type To = typeof to;
type Args = string;

const listDef: ListDef<SkillModification, From, To> = {
  from: (from: From) => from.skillModificationAtom,
  to: (to: To) => to.skillModificationAtom,
};

const add = () => addSkillModificationAtom;
const remove = () => removeSkillModificationAtom;

const inputDefs: InputDef<From, To, Args>[] = [
  {
    title: '技能',
    fn: () =>
      atom({
        type: 'text',
        title: '技能',
        from: (from, id) => from.skillModificationNameFamily(id),
        to: (to, id) => to.setSkillModificationNameFamily(id),
      }),
  },
  {
    title: 'ダイス',
    fn: () =>
      atom({
        type: 'number',
        title: 'ダイス',
        from: (from, id) => from.skillModificationDiceFamily(id),
        to: (to, id) => to.setSkillModificationDiceFamily(id),
      }),
  },
  {
    title: '固定値',
    fn: () =>
      atom({
        type: 'number',
        title: '固定値',
        from: (from, id) => from.skillModificationValueFamily(id),
        to: (to, id) => to.setSkillModificationValueFamily(id),
      }),
  },
  {
    title: '判定値',
    fn: () =>
      atom({
        type: 'readonly',
        title: '判定値',
        from: (from, id) =>
          atom((get) => {
            const mod = get(from.skillModificationFamily(id));
            if (!mod) {
              return '';
            }
            const skillName = get(from.skillModificationNameFamily(mod.id));
            const skill = get(from.skillFromNameFamily(skillName));
            if (!skill) {
              return '';
            }
            const statName = get(from.skillStatFamily(skillName));
            const dice =
              get(from.skillModificationDiceFamily(id)) + get(from.statModificationDiceFamily(statName)) + skill.レベル;
            const fixed =
              get(from.skillModificationValueFamily(id)) +
              get(from.statSumAtomFamily(statName)) +
              get(from.statModificatioValueFamily(statName));
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
        from: (from, statName) => from.skillModificationDescriptionFamily(statName),
        to: (to, statName) => to.setSkillModificationDescriptionFamily(statName),
      }),
  },
];

const rowDef: RowDef<SkillModification, From, To, Args> = {
  inputDefs,
  args,
};
