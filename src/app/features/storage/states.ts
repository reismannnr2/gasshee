import { cdate } from 'cdate';
import { Atom, atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useRouter } from 'next/navigation';
import { doWithTransition } from '../../common/functions/react-util';
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

export type StorageAction<T extends Readonly<Record<string, unknown>>> = {
  sheetAtom: Atom<T>;
  system: string;
  baseMode: 'create' | 'update';
  saveTo: 'server' | 'local';
  setPromise: (p: Promise<unknown> | null) => void;
  router: ReturnType<typeof useRouter>;
};
export const storageAtom = atom(null, async (get, _set, args: StorageAction<Readonly<Record<string, unknown>>>) => {
  const { sheetAtom, system, baseMode, saveTo, router, setPromise } = args;
  const sheetBase = get(sheetAtom);
  const cipherKey = get(cipherKeyAtom);
  const name = get(sheetNameAtom);
  const parole = get(paroleAtom);
  const password = get(passwordAtom);
  const tags = get(sheetTagsAtom);
  const id = get(sheetIdAtom);
  const user = get(userNameAtom);
  const endpoint = get(endpointAtom);
  const postMode = id ? baseMode : 'create';
  const value = cipherKey
    ? {
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
      }
    : {
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
  const json = JSON.stringify(value);
  if (saveTo === 'server') {
    const params = new URLSearchParams();
    const mode = id ? postMode : 'create';
    params.append('data', json);
    params.append('mode', mode);
    const data = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    };
    const res = await fetch(endpoint, data)
      .then(async (res) => {
        const json = await res.json();
        if (json?.success && json?.id) {
          doWithTransition(() => {
            console.log('successfully post data on server');
            router.push(`/systems/${system}?id=${json.id}`);
          });
        } else {
          console.error(`Error: ${json}`);
          window.alert('サーバーへの保存に失敗しました。');
          setPromise(null);
        }
      })
      .catch((e) => {
        console.error(`unknown error on post ${e}`);
        window.alert('サーバーへの保存に失敗しました。');
        setPromise(null);
      });
    return res;
  } else if (saveTo === 'local') {
    downloadText(`${system}-${name}-${cdate().format('YYYY-MM-DD_HHmmss')}.json`, json);
  }
});

function downloadText(fileName: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain' });
  const aTag = document.createElement('a');
  aTag.href = URL.createObjectURL(blob);
  aTag.target = '_blank';
  aTag.download = fileName;
  aTag.click();
  URL.revokeObjectURL(aTag.href);
}

export const ADVANCED_MODES = ['簡易設定', '高度な設定'] as const;
export type AdvancedMode = (typeof ADVANCED_MODES)[number];
export const advancedModeAtom = atom<AdvancedMode>('簡易設定');
