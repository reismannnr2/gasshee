import { nanoid } from 'nanoid';
import SortableList from '../../features/sortable/sortable-list';
import { InputDef } from '../../features/user-input/user-input';
import styles from './skill-modification-list.module.scss';
import {
  SkillModification,
  useSkillModificationsValue,
  useUpdateSkillModifications,
} from './states/skill-modification';
import { SkillSet, findSkillItem, useSkillSetValue } from './states/skill-set';
export default function SkillModificationList() {
  const items = useSkillModificationsValue();
  const setter = useUpdateSkillModifications();
  const skillSet = useSkillSetValue();
  const ex: [SkillSet, SkillModification[]] = [skillSet, items];
  return <SortableList defs={defs} ex={ex} grids={grids} initialize={initialize} items={items} setter={setter} />;
}

const grids = styles.grids;
const initialize = (): SkillModification => ({
  id: nanoid(),
  技能: '',
  ダイス: 0,
  修正値: 0,
  備考: '',
});
const defs: InputDef<SkillModification, [SkillSet, SkillModification[]]>[] = [
  {
    type: 'text',
    title: '技能',
    from: (state) => state.技能,
    to: (prev, value) => ({ ...prev, 技能: value }),
    inputProps: {
      list: 'skill-set',
    },
  },
  {
    title: '参照',
    fn: (item, [skillSet]) => {
      const result = findSkillItem(item.技能, skillSet);
      if (!result) {
        return {
          type: 'empty',
          title: '参照',
        };
      }
      return {
        type: 'readonly',
        title: '参照',
        from: () => result.referTo,
      };
    },
  },
  {
    type: 'number',
    title: 'ダイス',
    from: (state) => (state.ダイス ? state.ダイス.toString() : ''),
    to: (prev, value) => ({ ...prev, ダイス: value }),
  },
  {
    type: 'number',
    title: '修正値',
    from: (state) => (state.修正値 ? state.修正値.toString() : ''),
    to: (prev, value) => ({ ...prev, 修正値: value }),
  },
  {
    title: '判定値',
    fn: (item, [skillSet, items]) => {
      const result = findSkillItem(item.技能, skillSet);
      if (!result) {
        return {
          type: 'empty',
          title: '判定値',
        };
      }
      const statItem = items.find((i) => i.技能 === result.referTo && i.id !== item.id);
      const extraDice = statItem ? statItem.ダイス : 0;
      const extraMod = statItem ? statItem.修正値 : 0;
      return {
        type: 'readonly',
        title: '判定値',
        from: (item) => {
          const dice = extraDice + (item.ダイス ? item.ダイス : 0);
          const mod = extraMod + (item.修正値 ? item.修正値 : 0);
          const modValue = mod;
          const sign = modValue >= 0 ? '+' : '';
          const value = `${result.item.レベル + dice}D${sign}${modValue}`;
          return value;
        },
      };
    },
  },
  {
    type: 'text',
    title: '備考',
    from: (state) => state.備考,
    to: (prev, value) => ({ ...prev, 備考: value }),
  },
];
