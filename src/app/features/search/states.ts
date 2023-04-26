import { atom, useAtomValue, useSetAtom } from 'jotai';
import { Data } from '../../common/schema';

export const ORDER_BY_ITEMS = [
  { id: 'name-asc', field: 'name', direction: 'asc' },
  { id: 'name-desc', field: 'name', direction: 'desc' },
  { id: 'user-asc', field: 'user', direction: 'asc' },
  { id: 'user-desc', field: 'user', direction: 'desc' },
  { id: 'system-asc', field: 'system', direction: 'asc' },
  { id: 'system-desc', field: 'system', direction: 'desc' },
  { id: 'updatedAt-asc', field: 'updatedAt', direction: 'asc' },
  { id: 'updatedAt-desc', field: 'updatedAt', direction: 'desc' },
] as const;

type OrderByItem = (typeof ORDER_BY_ITEMS)[number];

const orderByAtom = atom<OrderByItem>(ORDER_BY_ITEMS[7]);
const setOrderByAtom = atom(null, (_get, set, id: string) => {
  console.log(ORDER_BY_ITEMS);
  console.log(id);
  const item = ORDER_BY_ITEMS.find((item) => item.id === id);
  console.log(item);
  if (item) {
    set(orderByAtom, item);
  }
});
export function useOrderBy(): [OrderByItem, (id: string) => void] {
  const orderBy = useAtomValue(orderByAtom);
  const setOrderBy = useSetAtom(setOrderByAtom);
  return [orderBy, setOrderBy];
}

export const paroleAtom = atom('');
export const tagAtom = atom('');
export const systemAtom = atom('');
export const freeTextAtom = atom('');
const freeSearchAtom = atom((get) => {
  const freeText = get(freeTextAtom);
  return freeText.split('|').map((item) => item.trim());
});
const unitsAtom = atom(async (get) => {
  const parole = get(paroleAtom);
  return await searchUnits(parole);
});
const filteredUnitsAtom = atom(async (get) => {
  const units = await get(unitsAtom);
  const tag = get(tagAtom);
  const system = get(systemAtom);
  const freeSearch = get(freeSearchAtom);
  const items = units.filter((unit) => {
    if (tag && !unit.tags.includes(tag)) {
      return false;
    }
    if (system && unit.system !== system) {
      return false;
    }
    for (const freeSearchItem of freeSearch) {
      if (
        freeSearchItem &&
        !unit.name.includes(freeSearchItem) &&
        !unit.user.includes(freeSearchItem) &&
        !unit.updatedAt.includes(freeSearchItem)
      ) {
        return false;
      }
    }
    return true;
  });
  const orderBy = get(orderByAtom);
  const compareFn =
    orderBy.direction === 'asc'
      ? (a: Data, b: Data) => a[orderBy.field].localeCompare(b[orderBy.field])
      : (a: Data, b: Data) => b[orderBy.field].localeCompare(a[orderBy.field]);
  return items.sort(compareFn);
});

export function useFilteredUnits() {
  return useAtomValue(filteredUnitsAtom);
}

async function searchUnits(parole: string): Promise<Data[]> {
  return await mock(parole);
}

const mockData: Data[] = [];

async function mock(parole: string): Promise<Data[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!parole) {
        resolve(mockData.filter((item) => !item.parole));
      }
      resolve(mockData.filter((item) => item.parole === parole));
    }, 1000);
  });
}
