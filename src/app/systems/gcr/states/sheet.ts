import { atom } from 'jotai';
import { characterLevelAtom, characterNameAtom, gcrClassAtom, gcrStyleAtom, gcrWorksAtom } from './base';
import { growthListAtom } from './misc';
import { skillSetAtom } from './skill-set';

export const gcrSheetAtom = atom((get) => {
  const skillSet = get(skillSetAtom);
  const gcrClass = get(gcrClassAtom);
  const gcrStyle = get(gcrStyleAtom);
  const gcrWorks = get(gcrWorksAtom);
  const characterName = get(characterNameAtom);
  const characterLevel = get(characterLevelAtom);
  const growthList = get(growthListAtom);
  return {
    skillSet,
    gcrClass,
    gcrStyle,
    gcrWorks,
    characterLevel,
    characterName,
    growthList,
  };
});

export const SAVE_MODE = ['新規作成', 'データ更新', 'ローカルに保存'] as const;
export const SAVE_MODE_WITHOUT_UPDATE = ['新規作成', 'ローカルに保存'] as const;
export type SaveMode = (typeof SAVE_MODE)[number];
export const saveModeAtom = atom<SaveMode>(SAVE_MODE[0]);

export const ADVANCE_SAVE_MODE = ['簡易設定', '高度な設定'] as const;
export type AdvanceSaveMode = (typeof ADVANCE_SAVE_MODE)[number];
export const advanceModeAtom = atom<AdvanceSaveMode>(ADVANCE_SAVE_MODE[0]);
