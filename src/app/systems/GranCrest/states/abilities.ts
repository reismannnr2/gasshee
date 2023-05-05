import { atom } from 'jotai';
import { nanoid } from 'nanoid';

export type GcrAbility = {
  id: string;
  特技名: string;
  LV: string;
  種別: string;
  タイミング: string;
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

export type GcrMagic = {
  id: string;
  魔法名: string;
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

export const initializeMagic = (): GcrMagic => ({
  id: nanoid(),
  魔法名: '',
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

export const gcrMagicsAtom = atom<GcrMagic[]>([initializeMagic()]);
export const GCR_MAGICS_KEYS = [
  '魔法名',
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
