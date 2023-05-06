import { WritableAtom, atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithHash } from 'jotai-location';
import { doWithTransition } from '../../common/functions/react-util';
import { DataForList } from '../../common/schema';
import { SYSTEM_NAMES } from '../../common/text-map';
import { endpointAtom } from '../storage/states';
export const ORDER_BY_ITEMS = [
  { id: 'name-asc', field: 'name', direction: 'asc' },
  { id: 'name-desc', field: 'name', direction: 'desc' },
  { id: 'system-asc', field: 'system', direction: 'asc' },
  { id: 'system-desc', field: 'system', direction: 'desc' },
  { id: 'user-asc', field: 'user', direction: 'asc' },
  { id: 'user-desc', field: 'user', direction: 'desc' },
  { id: 'updatedAt-asc', field: 'updatedAt', direction: 'asc' },
  { id: 'updatedAt-desc', field: 'updatedAt', direction: 'desc' },
] as const;
const PAGE_SIZE = 5;

type OrderByItem = (typeof ORDER_BY_ITEMS)[number];

const orderByAtom = atomWithHash<OrderByItem>('order', ORDER_BY_ITEMS[7]);
const setOrderByAtom = atom(null, (_get, set, id: string) => {
  const item = ORDER_BY_ITEMS.find((item) => item.id === id);
  if (item) {
    doWithTransition(() => {
      set(orderByAtom, item);
    });
  }
});
export function useOrderBy(): [OrderByItem, (id: string) => void] {
  const orderBy = useAtomValue(orderByAtom);
  const setOrderBy = useSetAtom(setOrderByAtom);
  return [orderBy, setOrderBy];
}

function withPageAndTransition<T>(base: WritableAtom<T, [T], void>) {
  return atom(
    (get) => get(base),
    (_get, set, value: T) => {
      doWithTransition(() => {
        set(base, value);
        set(pageAtom, 1);
      });
    },
  );
}

export const rawParoleAtom = atomWithHash('parole', '');
export const debouncedParoleAtom = withPageAndTransition<string>(atom(''));
export const setParoleDebouncedAtom = (() => {
  let timeoutId: number | null = null;
  return atom(null, (_, set, value: string) => {
    set(rawParoleAtom, value);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      set(debouncedParoleAtom, value);
    }, 500);
  });
})();
export const tagAtom = withPageAndTransition<string>(atomWithHash('tag', ''));
export const systemAtom = withPageAndTransition<string>(atomWithHash('system', ''));
export const freeTextAtom = withPageAndTransition<string>(atomWithHash('free', ''));

const freeSearchAtom = atom((get) => {
  const freeText = get(freeTextAtom);
  return freeText.split('|').map((item) => item.trim());
});
const unitsAtom = atom(async (get) => {
  const parole = get(debouncedParoleAtom);
  const endpoint = get(endpointAtom);
  return await searchUnits(parole, endpoint);
});
export const allTagsAtom = atom(async (get) => {
  const units = await get(unitsAtom);
  return Array.from(new Set(units.flatMap((unit) => unit.tags)));
});
export const allSystemsAtom = atom(async (get) => {
  const units = await get(unitsAtom);
  return Array.from(new Set(units.map((unit) => unit.system)));
});
const filteredUnitsAtom = atom(async (get) => {
  const tag = get(tagAtom);
  const system = get(systemAtom);
  const freeSearch = get(freeSearchAtom);
  const orderBy = get(orderByAtom);
  const units = await get(unitsAtom);
  const items = units.filter((unit) => {
    if (tag && !unit.tags.includes(tag)) {
      return false;
    }
    if (system && !unit.system.includes(system) && !SYSTEM_NAMES['unit.system']?.includes(system)) {
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
  const compareFn =
    orderBy.direction === 'asc'
      ? (a: DataForList, b: DataForList) => a[orderBy.field].localeCompare(b[orderBy.field])
      : (a: DataForList, b: DataForList) => b[orderBy.field].localeCompare(a[orderBy.field]);
  return items.sort(compareFn);
});

export const maxPageAtom = atom(async (get) => {
  const items = await get(filteredUnitsAtom);
  return Math.ceil(items.length / PAGE_SIZE);
});
export const pageAtom = atom(1);
export const setPageAtom = atom(null, async (get, set, page: number) => {
  const maxPage = await get(maxPageAtom);
  if (page > 0 && page <= maxPage) {
    set(pageAtom, page);
  }
});
export const setNextPageAtom = atom(null, async (get, set) => {
  const page = await get(pageAtom);
  const maxPage = await get(maxPageAtom);
  if (page < maxPage) {
    set(pageAtom, page + 1);
  }
});
export const setPrevPageAtom = atom(null, async (get, set) => {
  const page = await get(pageAtom);
  if (page > 1) {
    set(pageAtom, page - 1);
  }
});
export const setLastPageAtom = atom(null, async (get, set) => {
  const maxPage = await get(maxPageAtom);
  set(pageAtom, maxPage);
});
export const setFirstPageAtom = atom(null, async (get, set) => {
  set(pageAtom, 1);
});

export const pagedUnitsAtom = atom(async (get) => {
  const items = await get(filteredUnitsAtom);
  const page = get(pageAtom);
  return items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
});

export function useFilteredUnits() {
  return useAtomValue(filteredUnitsAtom);
}

export async function searchUnits(parole: string, endpoint: string): Promise<DataForList[]> {
  try {
    const result = await fetch(`${endpoint}?mode=list`).then((res) => res.json());
    if (result.success) {
      return result.items;
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}
