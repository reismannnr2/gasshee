import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { nanoid } from 'nanoid';
import { doWithTransition } from '../../../common/functions/react-util';
import { typedEntries } from '../../../common/functions/strictly-typed';
import { STAT_NAMES, StatName } from './stats';

export type GcrSkillItem = {
  id: string;
  固定?: boolean;
  技能名: string;
  レベル: number;
};
export type GcrSkillSet = {
  [key in StatName]: GcrSkillItem[];
};

export const skillSetAtom = atom<GcrSkillSet>({
  筋力: [
    { id: nanoid(), 技能名: '格闘', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '力技', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '重武器', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '水泳', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '頑健', レベル: 2, 固定: true },
  ],
  反射: [
    { id: nanoid(), 技能名: '軽武器', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '運動', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '隠密', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '回避', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '騎乗', レベル: 2, 固定: true },
  ],
  感覚: [
    { id: nanoid(), 技能名: '射撃', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '手業', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '知覚', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '霊感', レベル: 2, 固定: true },
  ],
  知力: [
    { id: nanoid(), 技能名: '治療', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '混沌知識', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '聖印知識', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '軍略知識', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '専門知識:', レベル: 2 },
  ],
  精神: [
    { id: nanoid(), 技能名: '意志', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '聖印', レベル: 2, 固定: true },
  ],
  共感: [
    { id: nanoid(), 技能名: '話術', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '感性', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '情報収集', レベル: 2, 固定: true },
    { id: nanoid(), 技能名: '芸術:', レベル: 2 },
  ],
});

export const skillSetFamily = atomFamily((statName: StatName) => atom((get) => get(skillSetAtom)[statName]));
export const updateSkillSetFamily = atomFamily((statName: StatName) =>
  atom(null, (get, set, transform: (prev: GcrSkillItem[]) => GcrSkillItem[]) => {
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
export const skillFromNameFamily = atomFamily((skillName: string) =>
  atom((get) => {
    const skillSet = get(skillSetAtom);
    for (const skills of Object.values(skillSet)) {
      for (const skill of skills) {
        if (skill.技能名 === skillName) {
          return skill;
        }
      }
    }
  }),
);

export const skillStatFamily = atomFamily((skillName: string) =>
  atom((get) => {
    const skillSet = get(skillSetAtom);
    for (const [statName, skills] of typedEntries(skillSet)) {
      for (const skill of skills) {
        if (skill.技能名 === skillName) {
          return statName;
        }
      }
    }
    return '筋力';
  }),
);
export const skillNameFamily = atomFamily((skillId: string) => atom((get) => get(skillFamily(skillId))?.技能名 || ''));
export const updateSkillFamily = atomFamily((skillId: string) =>
  atom(null, (get, set, update: (prev: GcrSkillItem) => GcrSkillItem) => {
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
    doWithTransition(() => set(skillSetAtom, { ...skillSet, [statName]: next }));
  }),
);

export const allSkillNamesAtom = atom((get) => {
  const skillSet = get(skillSetAtom);
  const names = new Set<string>();
  for (const skills of Object.values(skillSet)) {
    for (const skill of skills) {
      names.add(skill.技能名);
    }
  }
  return names;
});

export type StatModification = {
  id: string;
  能力値: StatName;
  ダイス: number;
  固定値: number;
  備考: string;
};

export const statModificationAtom = atom<StatModification[]>([
  { id: 'str', 能力値: '筋力', ダイス: 0, 固定値: 0, 備考: '' },
  { id: 'ref', 能力値: '反射', ダイス: 0, 固定値: 0, 備考: '' },
  { id: 'sen', 能力値: '感覚', ダイス: 0, 固定値: 0, 備考: '' },
  { id: 'int', 能力値: '知力', ダイス: 0, 固定値: 0, 備考: '' },
  { id: 'mnd', 能力値: '精神', ダイス: 0, 固定値: 0, 備考: '' },
  { id: 'sym', 能力値: '共感', ダイス: 0, 固定値: 0, 備考: '' },
]);

export const statModificationDiceFamily = atomFamily((statName: StatName) =>
  atom((get) => get(statModificationAtom).find((item) => item.能力値 === statName)?.ダイス || 0),
);
export const setStatModificationDiceFamily = atomFamily((statName: StatName) =>
  atom(null, (get, set, value: number) => {
    const id = get(statModificationAtom).find((item) => item.能力値 === statName)?.id;
    set(statModificationAtom, (prev: StatModification[]) =>
      prev.map((item) => (item.id === id ? { ...item, ダイス: value } : item)),
    );
  }),
);
export const statModificatioValueFamily = atomFamily((statName: StatName) =>
  atom((get) => get(statModificationAtom).find((item) => item.能力値 === statName)?.固定値 || 0),
);
export const setStatModificationValueFamily = atomFamily((statName: StatName) =>
  atom(null, (get, set, value: number) => {
    const id = get(statModificationAtom).find((item) => item.能力値 === statName)?.id;
    set(statModificationAtom, (prev: StatModification[]) =>
      prev.map((item) => (item.id === id ? { ...item, 固定値: value } : item)),
    );
  }),
);
export const statModificatioDescriptionFamily = atomFamily((statName: StatName) =>
  atom((get) => get(statModificationAtom).find((item) => item.能力値 === statName)?.備考 || ''),
);
export const setStatModificationDescriptionFamily = atomFamily((statName: StatName) =>
  atom(null, (get, set, value: string) => {
    const id = get(statModificationAtom).find((item) => item.能力値 === statName)?.id;
    set(statModificationAtom, (prev: StatModification[]) =>
      prev.map((item) => (item.id === id ? { ...item, 備考: value } : item)),
    );
  }),
);

export type SkillModification = {
  id: string;
  技能: string;
  ダイス: number;
  固定値: number;
  備考: string;
};

export const skillModificationAtom = atom<SkillModification[]>([
  { id: nanoid(), 技能: '', ダイス: 0, 固定値: 0, 備考: '' },
]);
export const skillModificationFamily = atomFamily((id: string) =>
  atom((get) => get(skillModificationAtom).find((item) => item.id === id)),
);
export const skillModificationNameFamily = atomFamily((id: string) =>
  atom((get) => get(skillModificationAtom).find((item) => item.id === id)?.技能 || ''),
);
export const setSkillModificationNameFamily = atomFamily((id: string) =>
  atom(null, (get, set, value: string) => {
    set(skillModificationAtom, (prev: SkillModification[]) =>
      prev.map((item) => (item.id === id ? { ...item, 技能: value } : item)),
    );
  }),
);

export const skillModificationDiceFamily = atomFamily((id: string) =>
  atom((get) => get(skillModificationAtom).find((item) => item.id === id)?.ダイス || 0),
);
export const setSkillModificationDiceFamily = atomFamily((id: string) =>
  atom(null, (get, set, value: number) => {
    set(skillModificationAtom, (prev: SkillModification[]) =>
      prev.map((item) => (item.id === id ? { ...item, ダイス: value } : item)),
    );
  }),
);
export const skillModificationValueFamily = atomFamily((id: string) =>
  atom((get) => get(skillModificationAtom).find((item) => item.id === id)?.固定値 || 0),
);
export const setSkillModificationValueFamily = atomFamily((id: string) =>
  atom(null, (get, set, value: number) => {
    set(skillModificationAtom, (prev: SkillModification[]) =>
      prev.map((item) => (item.id === id ? { ...item, 固定値: value } : item)),
    );
  }),
);
export const skillModificationDescriptionFamily = atomFamily((id: string) =>
  atom((get) => get(skillModificationAtom).find((item) => item.id === id)?.備考 || ''),
);
export const setSkillModificationDescriptionFamily = atomFamily((id: string) =>
  atom(null, (get, set, value: string) => {
    set(skillModificationAtom, (prev: SkillModification[]) =>
      prev.map((item) => (item.id === id ? { ...item, 備考: value } : item)),
    );
  }),
);
export const addSkillModificationAtom = atom(null, (_, set) => {
  set(skillModificationAtom, (prev: SkillModification[]) => [
    ...prev,
    { id: nanoid(), 技能: '', ダイス: 0, 固定値: 0, 備考: '' },
  ]);
});
export const removeSkillModificationAtom = atom(null, (_, set) => {
  set(skillModificationAtom, (prev: SkillModification[]) => prev.slice(0, -1));
});
