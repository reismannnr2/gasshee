import { atom } from 'jotai';
import { nanoid } from 'nanoid';
import { characterLevelAtom, gcrClassAtom } from './base';
export type GcrAbility = {
  id: string;
  特技名: string;
  LV: string;
  種別: string;
  タイミング: string;
  効果時間: string;
  判定: string;
  目標値: string;
  対象: string;
  射程: string;
  コスト: string;
  MC: string;
  制限: string;
  出典: string;
  備考: string;
};

export const initializeAbility = (): GcrAbility => ({
  id: nanoid(),
  特技名: '',
  LV: '',
  種別: '',
  タイミング: '',
  効果時間: '',
  判定: '',
  目標値: '',
  対象: '',
  射程: '',
  コスト: '',
  MC: '',
  制限: '',
  出典: '',
  備考: '',
});

export const gcrAbilitiesAtom = atom<GcrAbility[]>([initializeAbility()]);
export const GCR_ABILITY_KEYS = [
  '特技名',
  'LV',
  '種別',
  'タイミング',
  '効果時間',
  '判定',
  '目標値',
  '対象',
  '射程',
  'コスト',
  'MC',
  '制限',
  '出典',
] as const;

export const gcrWorksAbilitiesAtom = atom<GcrAbility[]>([initializeAbility()]);

export type GcrMagic = Omit<GcrAbility, '特技名'> & { 魔法名: string };
export const initializeMagic = (): GcrMagic => ({
  id: nanoid(),
  魔法名: '',
  LV: '',
  種別: '',
  タイミング: '',
  効果時間: '',
  判定: '',
  目標値: '',
  対象: '',
  射程: '',
  コスト: '',
  MC: '',
  制限: '',
  出典: '',
  備考: '',
});
export const GCR_MAGIC_KEYS = [
  '魔法名',
  'LV',
  '種別',
  'タイミング',
  '効果時間',
  '判定',
  '目標値',
  '対象',
  '射程',
  'コスト',
  'MC',
  '制限',
  '出典',
] as const;
export const gcrMagicsAtom = atom<GcrMagic[]>([initializeMagic()]);

export const classAbilityLevelSumAtom = atom((get) => {
  const abilities = get(gcrAbilitiesAtom);
  const level = abilities.filter((a) => a.LV).reduce((acc, curr) => acc + Number(curr.LV), 0);
  return level;
});

export const worksAbilityLevelSumAtom = atom((get) => {
  const abilities = get(gcrWorksAbilitiesAtom);
  return abilities.filter((a) => a.LV).reduce((acc, curr) => acc + Number(curr.LV), 0);
});
export const classAbilityMaxLevelAtom = atom((get) => {
  const level = get(characterLevelAtom);
  const gcrClass = get(gcrClassAtom);
  const isMage = gcrClass === 'メイジ';
  return isMage ? level + 6 : level + 4;
});
export const worksAbilityMaxLevelAtom = atom((get) => {
  const level = get(characterLevelAtom);
  return level + 1;
});
export const abilitySumDescriptionAtom = atom('');
