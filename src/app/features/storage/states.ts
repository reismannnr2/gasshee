import { Atom, atom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMemo } from 'react';
import { encryptWithPassword } from './encrypt';

export const sheetIdAtom = atom('');
export const sheetTagAtom = atom('');
export const sheetTagsAtom = atom((get) => {
  const sheetTag = get(sheetTagAtom);
  return sheetTag.split('|').map((tag) => tag.trim());
});
export const sheetNameAtom = atom('');
export const userNameAtom = atom('');
export const paroleAtom = atom('');
export const passwordAtom = atom('');
export const cipherKeyAtom = atom('');
export const endpointAtom = atomWithStorage('GASSHEE_API_ENDPOINT', process.env.NEXT_PUBLIC_DEFAULT_ENDPOINT || '');
export const resetAdvancedAtom = atom(null, (_, set) => {
  set(paroleAtom, '');
  set(cipherKeyAtom, '');
});

export function useStoreSheetAtomValue<T>(sheetAtom: Atom<T>, system: string) {
  return useAtomValue(
    useMemo(
      () =>
        atom(async (get) => {
          const sheetBase = get(sheetAtom);
          const cipherKey = get(cipherKeyAtom);
          const name = get(sheetNameAtom);
          const parole = get(paroleAtom);
          const password = get(passwordAtom);
          const tags = get(sheetTagsAtom);
          const id = get(sheetIdAtom);
          const user = get(userNameAtom);
          if (!cipherKey) {
            return {
              type: 'plain',
              id: id || undefined,
              system,
              user,
              name,
              tags,
              parole: parole || undefined,
              password: password || undefined,
              content: sheetBase,
            };
          }
          return {
            type: 'cipher',
            id: id || undefined,
            system,
            user,
            ...sheetBase,
            name,
            tags,
            parole: parole || undefined,
            password: password || undefined,
            content: await encryptWithPassword(JSON.stringify(sheetBase), cipherKey),
          };
        }),
      [sheetAtom, system],
    ),
  );
}

export const ADVANCED_MODES = ['簡易設定', '高度な設定'] as const;
export type AdvancedMode = (typeof ADVANCED_MODES)[number];
export const advancedModeAtom = atom<AdvancedMode>('簡易設定');
