import { atom } from 'jotai';
import { nanoid } from 'nanoid';

export type GcrArmie = {
  id: string;
  適用: boolean;
  部隊名: string;
  LV: string;
  資源: string;
  士気: string;

  筋力: string;
  反射: string;
  感覚: string;
  知力: string;
  精神: string;
  共感: string;

  HP: string;
  行動値: string;
  移動力: string;

  攻撃力: string;
  武器: string;
  炎熱: string;
  衝撃: string;
  体内: string;

  備考: string;
};

export const initializeArmie = (): GcrArmie => ({
  id: nanoid(),
  適用: true,
  部隊名: '',
  LV: '',
  資源: '',
  士気: '',
  筋力: '',
  反射: '',
  感覚: '',
  知力: '',
  精神: '',
  共感: '',
  HP: '',
  行動値: '',
  移動力: '',
  攻撃力: '',
  武器: '',
  炎熱: '',
  衝撃: '',
  体内: '',
  備考: '',
});

export const GCR_ARIMIE_KEYS = [
  '部隊名',
  'LV',
  '資源',
  '士気',
  '筋力',
  '反射',
  '感覚',
  '知力',
  '精神',
  '共感',
  'HP',
  '行動値',
  '移動力',
  '攻撃力',
  '武器',
  '炎熱',
  '衝撃',
  '体内',
] as const;

export const gcrArmieAtom = atom<GcrArmie[]>([initializeArmie()]);

export type GcrArmieAbility = {
  id: string;
  部隊特技名: string;
  LV: string;
  種別: string;
  タイミング: string;
  判定: string;
  目標値: string;
  対象: string;
  射程: string;
  コスト: string;
  制限: string;
  備考: string;
};

export const initializeArmieAbility = (): GcrArmieAbility => ({
  id: nanoid(),
  部隊特技名: '',
  LV: '',
  種別: '',
  タイミング: '',
  判定: '',
  目標値: '',
  対象: '',
  射程: '',
  コスト: '',
  制限: '',
  備考: '',
});

export const gcrArmieAbilitiesAtom = atom<GcrArmieAbility[]>([initializeArmieAbility()]);
export const GCR_ARMIE_ABILITY_KEYS = [
  '部隊特技名',
  'LV',
  '種別',
  'タイミング',
  '判定',
  '目標値',
  '対象',
  '射程',
  'コスト',
  '制限',
] as const;
