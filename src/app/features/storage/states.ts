import { atom } from 'jotai';

export const sheetIdAtom = atom('');
export const sheetNameAtom = atom('');
export const userNameAtom = atom('');
export const paroleAtom = atom('');
export const passwordAtom = atom('');
export const cipherKeyAtom = atom('');
export const endpointAtom = atom(process.env.NEXT_PUBLIC_DEFAULT_ENDPOINT);

export const STORE_MODE = ['upload-plain', 'store-local-file'] as const;
export type StoreMode = (typeof STORE_MODE)[number];
