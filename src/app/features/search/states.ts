import { atom, useAtomValue, useSetAtom } from 'jotai';
import { Data, DataForList } from '../../common/schema';

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
export const allTagsAtom = atom(async (get) => {
  const units = await get(unitsAtom);
  return Array.from(new Set(units.flatMap((unit) => unit.tags)));
});
export const allSystemsAtom = atom(async (get) => {
  const units = await get(unitsAtom);
  return Array.from(new Set(units.map((unit) => unit.system)));
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
      ? (a: DataForList, b: DataForList) => a[orderBy.field].localeCompare(b[orderBy.field])
      : (a: DataForList, b: DataForList) => b[orderBy.field].localeCompare(a[orderBy.field]);
  return items.sort(compareFn);
});

export function useFilteredUnits() {
  return useAtomValue(filteredUnitsAtom);
}

async function searchUnits(parole: string): Promise<DataForList[]> {
  return await mock(parole);
}

async function mock(parole: string): Promise<DataForList[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!parole) {
        resolve(
          mockData
            .filter((item) => !item.parole)
            .map((item) => {
              const next = { ...item };
              delete next.content;
              delete next.password;
              return next;
            }),
        );
      }
      resolve(
        mockData
          .filter((item) => item.parole === parole)
          .map((item) => {
            const next = { ...item };
            delete next.content;
            delete next.password;
            return next;
          }),
      );
    }, 1000);
  });
}

export const mockData: Data[] = [
  {
    type: 'plain',
    system: 'Windows',
    id: 'jLuO6sfKU5lH3zNG_JM4_',
    name: 'Example Document',
    user: 'Alice',
    tags: ['example', 'document'],
    parole: 'password123',
    createdAt: '2022-04-01T10:00:00+09:00',
    updatedAt: '2022-04-01T12:30:00+09:00',
    content: {
      text: 'This is an example document.',
    },
  },
  {
    type: 'cipher',
    system: 'Mac',
    id: 'pE_oODUkaWr4YlsVPPLrw',
    name: 'Confidential Memo',
    user: 'Bob',
    tags: ['confidential'],
    createdAt: '2022-04-02T15:30:00+09:00',
    updatedAt: '2022-04-02T16:00:00+09:00',
    content: '',
  },
  {
    type: 'plain',
    system: 'Linux',
    id: 'ac-Iq7OpKYjNmENKbNVEk',
    name: 'Meeting Agenda',
    user: 'Charlie',
    tags: ['meeting', 'agenda'],
    parole: 'password456',
    createdAt: '2022-04-03T09:00:00+09:00',
    updatedAt: '2022-04-03T10:30:00+09:00',
    content: {
      text: 'This is a meeting agenda.',
    },
  },
  {
    type: 'cipher',
    system: 'Windows',
    id: 'BCWAVGdVwgnVIIOGUrBEU',
    name: 'Top Secret Plan',
    user: 'Alice',
    tags: ['top secret', 'plan'],
    parole: 'password789',
    createdAt: '2022-04-04T14:00:00+09:00',
    updatedAt: '2022-04-04T15:30:00+09:00',
    content: '',
  },
  {
    type: 'plain',
    system: 'Mac',
    id: 'mDFW0vWWSsW7GYjV8PUIu',
    name: 'Report',
    user: 'Bob',
    tags: ['report'],
    createdAt: '2022-04-05T13:00:00+09:00',
    updatedAt: '2022-04-05T14:30:00+09:00',
    content: {
      text: 'This is a report.',
    },
  },
  {
    type: 'cipher',
    system: 'Linux',
    id: 'zHf_ihsvig0md1uJrrux3',
    name: 'Proposal',
    user: 'Charlie',
    tags: ['proposal'],
    parole: 'password123',
    createdAt: '2022-04-06T11:00:00+09:00',
    updatedAt: '2022-04-06T12:30:00+09:00',
    content: '',
  },
  {
    type: 'plain',
    system: 'Windows',
    id: 'Z_NH3OhZaOZToF-yTFfNx',
    name: 'Project Plan',
    user: 'David',
    tags: ['project', 'plan'],
    createdAt: '2022-04-07T16:00:00+09:00',
    updatedAt: '2022-04-07T17:30:00+09:00',
    content: {
      text: 'This is a project plan.',
    },
  },
  {
    type: 'cipher',
    system: 'Windows',
    id: 'sAia5o5DrK5InbJOtN_f6',
    name: 'Password List',
    user: 'Eve',
    tags: ['passwords', 'list'],
    parole: 'secret123',
    createdAt: '2022-04-08T10:00:00+09:00',
    updatedAt: '2022-04-08T11:30:00+09:00',
    content: '',
  },
  {
    type: 'plain',
    system: 'Mac',
    id: 'ENaar4mPwSQWS6A2r7hG3',
    name: 'Meeting Minutes',
    user: 'Frank',
    tags: ['meeting', 'minutes'],
    createdAt: '2022-04-09T14:00:00+09:00',
    updatedAt: '2022-04-09T15:30:00+09:00',
    content: {
      text: 'These are the meeting minutes.',
    },
  },
  {
    type: 'cipher',
    system: 'Linux',
    id: 'EZucY70Uw2DBHvAmVrg9M',
    name: 'Financial Report',
    user: 'Grace',
    tags: ['financial', 'report'],
    parole: 'password456',
    createdAt: '2022-04-10T09:00:00+09:00',
    updatedAt: '2022-04-10T10:30:00+09:00',
    content: '',
  },
  {
    type: 'plain',
    system: 'Windows',
    id: 'mOB1gNBmeP8REqGPwn_Zo',
    name: 'Manual',
    user: 'Harry',
    tags: ['manual'],
    createdAt: '2022-04-11T12:00:00+09:00',
    updatedAt: '2022-04-11T13:30:00+09:00',
    content: {
      text: 'This is a manual.',
    },
  },
  {
    type: 'cipher',
    system: 'Mac',
    id: 'iAsIeLifGQzt5z1I1fAwk',
    name: 'Secret Code',
    user: 'Isabella',
    tags: ['secret', 'code'],
    parole: 'passcode789',
    createdAt: '2022-04-12T15:00:00+09:00',
    updatedAt: '2022-04-12T16:30:00+09:00',
    content: 'This is a secret code.',
  },
  {
    type: 'plain',
    system: 'Linux',
    id: 'nhaj_s3LDunTtMxnAUmNx',
    name: 'Task List',
    user: 'Jack',
    tags: ['task', 'list'],
    createdAt: '2022-04-13T08:00:00+09:00',
    updatedAt: '2022-04-13T09:30:00+09:00',
    content: {
      text: 'This is a task list.',
    },
  },
];
