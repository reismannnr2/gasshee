import { atom, useAtomValue, useSetAtom } from 'jotai';
import { nanoid } from 'nanoid';
export type SkillModification = {
  id: string;
  技能: string;
  ダイス: number;
  修正値: number;
  備考: string;
};

const skillModificationsAtom = atom<SkillModification[]>([
  {
    id: nanoid(),
    技能: '',
    ダイス: 0,
    修正値: 0,
    備考: '',
  },
]);
export function useSkillModificationsValue() {
  return useAtomValue(skillModificationsAtom);
}
export function useUpdateSkillModifications() {
  return useSetAtom(skillModificationsAtom);
}
