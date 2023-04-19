import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { nanoid } from 'nanoid';
import { useMemo } from 'react';
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

const skillSetFamily = atomFamily((statName: StatName) => atom((get) => get(skillSetAtom)[statName]));
const updateSkillAtom = atom(null, (_, set, { statName, skill }: { statName: StatName; skill: SkillItem }) => {
  set(skillSetAtom, (prev) => {
    const items = prev[statName];
    const index = items.findIndex((s) => s.id === skill.id);
    if (index === -1) {
      return {
        ...prev,
        [statName]: [...items, skill],
      };
    }
    const nextItems = items.slice();
    nextItems[index] = skill;
    return {
      ...prev,
      [statName]: nextItems,
    };
  });
});

export function useSkillSetValue(): SkillSet {
  return useAtomValue(skillSetAtom);
}
export function useSkillSetWithName(statName: StatName) {
  return useAtomValue(skillSetFamily(statName));
}
export function useUpdateSkillSet() {
  return useSetAtom(skillSetAtom);
}

export function useUpdateSkill(statName: StatName) {
  const updateSkill = useSetAtom(updateSkillAtom);
  return useMemo(
    () => ({
      addNewItem: () => {
        updateSkill({ statName, skill: { id: nanoid(), 技能名: '', レベル: 2 } });
      },
      update: (skill: SkillItem) => updateSkill({ statName, skill }),
    }),
    [statName, updateSkill],
  );
}

export function findSkillItem(skillName: string, skillSet: SkillSet) {
  if (skillName in skillSet) {
    return {
      item: {
        id: nanoid(),
        技能名: skillName,
        レベル: 2,
      },
      referTo: skillName,
    };
  }
  for (const statName of STAT_NAMES) {
    const item = skillSet[statName].find((s) => s.技能名 === skillName);
    if (item) {
      return {
        item,
        referTo: statName,
      };
    }
  }
}
