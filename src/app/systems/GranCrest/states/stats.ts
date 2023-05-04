import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { growthSumAtomFamily } from './misc';
export const STAT_NAMES = ['筋力', '反射', '感覚', '知力', '精神', '共感'] as const;
export type StatName = (typeof STAT_NAMES)[number];

export type StatBaseInfo = {
  [k in StatName]: number;
} & {
  備考: string;
};

function createStatAtomFamilies() {
  const statAtom = atom<StatBaseInfo>({
    筋力: 0,
    反射: 0,
    感覚: 0,
    知力: 0,
    精神: 0,
    共感: 0,
    備考: '',
  });
  const worksStatAtomFamily = atomFamily((statName: StatName) => atom((get) => get(statAtom)[statName]));
  const setWorksStatAtomFamily = atomFamily((statName: StatName) =>
    atom(null, (get, set, value: number) => {
      const prev = get(statAtom);
      const next = { ...prev, [statName]: value };
      set(statAtom, next);
    }),
  );
  const descriptionAtom = atom(
    (get) => get(statAtom).備考,
    (get, set, value: string) => {
      set(statAtom, { ...get(statAtom), 備考: value });
    },
  );
  return [statAtom, worksStatAtomFamily, setWorksStatAtomFamily, descriptionAtom] as const;
}

export const [worksStatAtom, worksStatAtomFamily, setWorksStatAtomFamily, worksDescriptionAtom] =
  createStatAtomFamilies();
export const [bonusStatAtom, bonusStatAtomFamily, setBonusStatAtomFamily, bonusDescriptionAtom] =
  createStatAtomFamilies();
export const [extraBaseStatAtom, extraBaseStatAtomFamily, setExtraBaseStatAtomFamily, extraBaseDescriptionAtom] =
  createStatAtomFamilies();
export const growthSumDescriptionAtom = atom('');
export const baseSumDescriptionAtom = atom('');
export const baseSumAtomFamily = atomFamily((statName: StatName) =>
  atom((get) => {
    const worksStat = get(worksStatAtomFamily(statName));
    const bonusStat = get(bonusStatAtomFamily(statName));
    const extraBaseStat = get(extraBaseStatAtomFamily(statName));
    const growthSum = get(growthSumAtomFamily(statName));
    return worksStat + bonusStat + extraBaseStat + Number(growthSum);
  }),
);
export const [styleStatAtom, styleStatAtomFamily, setStyleStatAtomFamily, styleStatDescriptionAtom] =
  createStatAtomFamilies();
export const [extraStatAtom, extraStatAtomFamily, setExtraStatAtomFamily, extraStatDescriptionAtom] =
  createStatAtomFamilies();
export const statSumDescriptionAtom = atom('');
export const statSumAtomFamily = atomFamily((statName: StatName) =>
  atom((get) => {
    const baseStat = get(baseSumAtomFamily(statName));
    const styleStat = get(styleStatAtomFamily(statName));
    const extraStat = get(extraStatAtomFamily(statName));
    return Math.floor(baseStat / 3) + styleStat + extraStat;
  }),
);
