import { atom } from 'jotai';
import { nanoid } from 'nanoid';

export type GcrArmor = {
  id: string;
  適用: boolean;
  アイテム名: string;
  重さ: string;
  個数: string;
  部位: string;
  種別: string;
  判定: string;
  射程: string;
  武器: string;
  炎熱: string;
  衝撃: string;
  体内: string;
  攻撃: string;
  命中: string;
  回避: string;
  行動: string;
  移動: string;
  備考: string;
};

export const initializeArmor = (): GcrArmor => ({
  id: nanoid(),
  適用: true,
  アイテム名: '',
  重さ: '',
  個数: '',
  部位: '',
  種別: '',
  判定: '',
  射程: '',
  武器: '',
  炎熱: '',
  衝撃: '',
  体内: '',
  攻撃: '',
  命中: '',
  回避: '',
  行動: '',
  移動: '',
  備考: '',
});
export const gcrArmorsAtom = atom<GcrArmor[]>([initializeArmor()]);
export const GCR_ARMOR_KEYS = [
  'アイテム名',
  '重さ',
  '個数',
  '種別',
  '部位',
  '判定',
  '射程',
  '武器',
  '炎熱',
  '衝撃',
  '体内',
  '攻撃',
  '命中',
  '回避',
  '行動',
  '移動',
] as const;
