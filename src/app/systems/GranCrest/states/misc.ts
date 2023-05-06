import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { nanoid } from 'nanoid';
import { typedEntries } from '../../../common/functions/strictly-typed';
import { StatName } from './stats';

export type GcrGrowthItem = {
  id: string;
  能力基本値: {
    [k in StatName]: boolean;
  };
  習得特技: [string, string, string];
  備考: string;
};
const initializeGrowth = (): GcrGrowthItem => ({
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
});
export const growthListAtom = atom<GcrGrowthItem[]>([initializeGrowth()]);
export const setGrowthListAtom = atom(null, (get, set, update: (prev: GcrGrowthItem[]) => GcrGrowthItem[]) => {
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
  atom(null, (get, set, update: (prev: GcrGrowthItem) => GcrGrowthItem) => {
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
  set(growthListAtom, [...growthList, initializeGrowth()]);
});
export const removeLastGrowthAtom = atom(null, (get, set) => {
  const growthList = get(growthListAtom);
  set(growthListAtom, growthList.slice(0, -1));
});

export const growthSumAtom = atom((get) => {
  const growthList = get(growthListAtom);
  const sums = {
    筋力: 0,
    反射: 0,
    感覚: 0,
    知力: 0,
    精神: 0,
    共感: 0,
  };
  for (const item of growthList) {
    for (const [statName, value] of typedEntries(item.能力基本値)) {
      sums[statName] += value ? 1 : 0;
    }
  }
  return sums;
});
export const growthSumAtomFamily = atomFamily((statName: StatName) => atom((get) => get(growthSumAtom)[statName]));

export const extraTextAtom = atom('');
export const isExtraTextHTMLAtom = atom(true);

export type LifePath = {
  id: string;
  種別: string;
  内容: string;
  詳細: string;
  備考: string;
};
export const initializeLifePath = (): LifePath => ({
  id: nanoid(),
  種別: '',
  内容: '',
  詳細: '',
  備考: '',
});

export const gcrLifePathAtom = atom<LifePath[]>([
  {
    id: '出自',
    種別: '出自',
    内容: '',
    詳細: '',
    備考: '',
  },
  {
    id: '経験1',
    種別: '経験1',
    内容: '',
    詳細: '',
    備考: '',
  },
  {
    id: '経験2',
    種別: '経験2',
    内容: '',
    詳細: '',
    備考: '',
  },
  {
    id: '目的',
    種別: '目的',
    内容: '',
    詳細: '',
    備考: '',
  },
  {
    id: '禁忌',
    種別: '禁忌',
    内容: '',
    詳細: '',
    備考: '',
  },
  {
    id: '趣味嗜好',
    種別: '趣味嗜好',
    内容: '',
    詳細: '',
    備考: '',
  },
]);
export const LIFEPATH_KEYS = ['種別', '内容', '詳細'] as const;
