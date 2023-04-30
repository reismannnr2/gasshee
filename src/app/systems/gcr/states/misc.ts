import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { nanoid } from 'nanoid';
import { StatName } from './stats';

export type GrowthItem = {
  id: string;
  能力基本値: {
    [k in StatName]: boolean;
  };
  習得特技: [string, string, string];
  備考: string;
};

export const growthListAtom = atom<GrowthItem[]>([]);
export const setGrowthListAtom = atom(null, (get, set, update: (prev: GrowthItem[]) => GrowthItem[]) => {
  const growthList = get(growthListAtom);
  const updatedGrowthList = update(growthList);
  set(growthListAtom, updatedGrowthList);
});
export const growthFamily = atomFamily((growthId: string) =>
  atom((get) => {
    const growthList = get(growthListAtom);
    return growthList.find((growth) => growth.id === growthId);
  }),
);
export const updateGrowthFamily = atomFamily((growthId: string) =>
  atom(null, (get, set, update: (prev: GrowthItem) => GrowthItem) => {
    const growthList = get(growthListAtom);
    const growthIndex = growthList.findIndex((growth) => growth.id === growthId);
    const growth = growthList[growthIndex];
    if (!growth) {
      return;
    }
    const updatedGrowth = update(growth);
    const updatedGrowthList = growthList.slice();
    updatedGrowthList[growthIndex] = updatedGrowth;
    set(growthListAtom, updatedGrowthList);
  }),
);

export const growthDescriptionFamily = atomFamily((growthId: string) =>
  atom((get) => get(growthFamily(growthId))?.備考 || ''),
);
export const updateGrowthDescriptionFamily = atomFamily((growthId: string) =>
  atom(null, (_, set, value: string) => {
    set(updateGrowthFamily(growthId), (prev) => ({ ...prev, 備考: value }));
  }),
);
export const addNewGrowthAtom = atom(null, (get, set) => {
  const growthList = get(growthListAtom);
  const newGrowth: GrowthItem = {
    id: nanoid(),
    能力基本値: {
      筋力: false,
      反射: false,
      感覚: false,
      知力: false,
      精神: false,
      共感: false,
    },
    習得特技: ['', '', ''],
    備考: '',
  };
  set(growthListAtom, [...growthList, newGrowth]);
});
export const removeLastGrowthAtom = atom(null, (get, set) => {
  const growthList = get(growthListAtom);
  set(growthListAtom, growthList.slice(0, -1));
});
