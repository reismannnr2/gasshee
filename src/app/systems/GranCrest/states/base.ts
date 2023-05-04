import { atom } from 'jotai';

export const characterNameAtom = atom('');
export const characterLevelAtom = atom(1);

export const CLASS_NAMES = ['ロード', 'メイジ', 'アーティスト', '投影体'] as const;
export type GcrClassName = (typeof CLASS_NAMES)[number];
export const gcrClassAtom = atom<GcrClassName>(CLASS_NAMES[0]);
export const gcrWorksAtom = atom('');
export const gcrStyleAtom = atom('');
