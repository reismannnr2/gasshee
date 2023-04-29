import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { nanoid } from 'nanoid';
import { STAT_NAMES, StatName } from './stats';

export type SkillItem = {
  id: string;
  fixed?: boolean;
  技能名: string;
  レベル: number;
};
export type SkillSet = {
  [key in StatName]: SkillItem[];
};

const skillSetAtom = atom<SkillSet>({
  筋力: [
    { id: nanoid(), 技能名: '格闘', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '力技', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '重武器', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '水泳', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '頑健', レベル: 2, fixed: true },
  ],
  反射: [
    { id: nanoid(), 技能名: '軽武器', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '運動', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '隠密', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '回避', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '騎乗', レベル: 2, fixed: true },
  ],
  感覚: [
    { id: nanoid(), 技能名: '射撃', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '手業', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '知覚', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '霊感', レベル: 2, fixed: true },
  ],
  知力: [
    { id: nanoid(), 技能名: '治療', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '混沌知識', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '聖印知識', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '軍略知識', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '専門知識:', レベル: 2 },
  ],
  精神: [
    { id: nanoid(), 技能名: '意志', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '聖印', レベル: 2, fixed: true },
  ],
  共感: [
    { id: nanoid(), 技能名: '話術', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '感性', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '情報収集', レベル: 2, fixed: true },
    { id: nanoid(), 技能名: '芸術:', レベル: 2 },
  ],
});

export const skillSetFamily = atomFamily((statName: StatName) => atom((get) => get(skillSetAtom)[statName]));
export const updateSkillSetFamily = atomFamily((statName: StatName) =>
  atom(null, (get, set, transform: (prev: SkillItem[]) => SkillItem[]) => {
    const skillSet = get(skillSetAtom);
    const prev = skillSet[statName];
    const next = transform(prev);
    set(skillSetAtom, { ...skillSet, [statName]: next });
  }),
);

export const skillFamily = atomFamily((skillId: string) =>
  atom((get) => {
    const skillSet = get(skillSetAtom);
    for (const skills of Object.values(skillSet)) {
      for (const skill of skills) {
        if (skill.id === skillId) {
          return skill;
        }
      }
    }
  }),
);
export const skillNameFamily = atomFamily((skillId: string) => atom((get) => get(skillFamily(skillId))?.技能名 || ''));
export const updateSkillFamily = atomFamily((skillId: string) =>
  atom(null, (get, set, update: (prev: SkillItem) => SkillItem) => {
    const skillSet = get(skillSetAtom);
    for (const statName of STAT_NAMES) {
      const list = skillSet[statName];
      for (const [index, item] of list.entries()) {
        if (item.id === skillId) {
          const next = list.slice();
          next[index] = update(item);
          set(skillSetAtom, { ...skillSet, [statName]: next });
          return;
        }
      }
    }
  }),
);
export const updateSkillNameFamily = atomFamily((skillId: string) =>
  atom(null, (_, set, name: string) => {
    set(updateSkillFamily(skillId), (prev) => ({ ...prev, 技能名: name }));
  }),
);
export const updateSkillLevelFamily = atomFamily((skillId: string) =>
  atom(null, (_, set, level: number) => {
    set(updateSkillFamily(skillId), (prev) => ({ ...prev, レベル: level }));
  }),
);

export const addNewSkillFamily = atomFamily((statName: StatName) =>
  atom(null, (get, set) => {
    const skillSet = get(skillSetAtom);
    const next = skillSet[statName].slice();
    next.push({ id: nanoid(), 技能名: '', レベル: 2 });
    set(skillSetAtom, { ...skillSet, [statName]: next });
  }),
);
