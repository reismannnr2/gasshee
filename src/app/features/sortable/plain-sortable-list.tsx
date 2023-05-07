import { Atom, WritableAtom, atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { useCallback, useMemo } from 'react';
import { InputDef } from '../user-input/user-input';
import SortableList, { ListDef, RowDef } from './sortable-list';

export type Props<
  T extends { id: string; 備考: string } & { [k in string]: string | boolean } & { 適用?: boolean },
  Keys extends readonly (keyof T)[],
> = {
  itemsAtom: WritableAtom<T[], [(prev: T[]) => T[]], void>;
  keys: Keys;
  layout: string;
  initialize: () => T;
  applyCheckbox?: boolean;
  inputProps?: { [k in keyof T]?: JSX.IntrinsicElements['input'] };
  textareaProps?: JSX.IntrinsicElements['textarea'];
  disableSort?: boolean;
  disableAdd?: boolean;
  abbreviatedOnStart?: boolean;
};

export default function PlainSortableList<
  T extends { id: string; 備考: string } & { [k in string]: string | boolean } & { 適用?: boolean },
  Keys extends readonly (keyof T)[],
>({
  itemsAtom,
  keys,
  layout,
  initialize,
  applyCheckbox,
  inputProps,
  textareaProps,
  disableAdd,
  disableSort,
  abbreviatedOnStart,
}: Props<T, Keys>) {
  const setterFamily = useMemo(
    () =>
      atomFamily((id: string) =>
        atom(null, (_, set, update: (prev: T) => T) => {
          set(itemsAtom, (prev) => {
            const index = prev.findIndex((item) => item.id === id);
            const item = prev[index];
            if (index === -1 || !item) {
              return prev;
            }
            const next = update(item);
            if (next === item) {
              return prev;
            }
            const nextItems = [...prev];
            nextItems[index] = next;
            return nextItems;
          });
        }),
      ),
    [itemsAtom],
  );
  const getterFamily = useMemo(
    () =>
      atomFamily((id: string) =>
        atom((get) => {
          const items = get(itemsAtom);
          return items.find((item) => item.id === id);
        }),
      ),
    [itemsAtom],
  );
  const from = { getterFamily };
  const to = { setterFamily };
  const addAtom = useMemo(
    () =>
      atom(null, (_, set) => {
        set(itemsAtom, (prev) => {
          const item = initialize();
          return [...prev, item];
        });
      }),
    [initialize, itemsAtom],
  );
  const removeAtom = useMemo(
    () =>
      atom(null, (_, set) => {
        set(itemsAtom, (prev) => prev.slice(0, -1));
      }),
    [itemsAtom],
  );
  const add = useCallback(() => addAtom, [addAtom]);
  const remove = useCallback(() => removeAtom, [removeAtom]);
  type From = typeof from;
  type To = typeof to;
  type Args = string;

  const detailsDef: RowDef<T, From, To, Args> = useMemo(
    () => ({
      inputDefs: [
        {
          title: '備考',
          fn: () =>
            atom(() => {
              return {
                type: 'textarea',
                title: '備考',
                from: (from, args) =>
                  atom((get) => {
                    return get(from.getterFamily(args))?.備考 ?? '';
                  }),
                to: (to, args) =>
                  atom(null, (_, set) => {
                    set(to.setterFamily(args), (prev) => ({ ...prev, 備考: '' }));
                  }),
                textareaProps: { rows: 3, placeholder: '備考...', ...textareaProps },
              };
            }),
        },
      ],
      args,
    }),
    [textareaProps],
  );
  const listDef: ListDef<T, From, To> = useMemo(
    () => ({
      from: () => itemsAtom,
      to: () => itemsAtom,
    }),
    [itemsAtom],
  );
  const inputDefs: InputDef<From, To, Args>[] = useMemo(() => {
    const apply: InputDef<From, To, Args>[] = applyCheckbox
      ? [
          {
            title: '適用',
            fn: () =>
              atom(() => {
                return {
                  type: 'checkbox',
                  title: '適用',
                  from: (from, args) =>
                    atom((get) => {
                      return get(from.getterFamily(args))?.適用 ?? false;
                    }),
                  to: (to, args) =>
                    atom(null, (_, set) => {
                      set(to.setterFamily(args), (prev) => ({ ...prev, 適用: !prev.適用 }));
                    }),
                };
              }),
          },
        ]
      : [];
    const mapped: InputDef<From, To, Args>[] = keys.map((key) => {
      return {
        title: String(key),
        fn: () =>
          atom(() => {
            return {
              type: 'text',
              title: String(key),
              from: (from, args) =>
                atom((get) => {
                  return String(get(from.getterFamily(args))?.[key] ?? '');
                }),
              to: (to, args) =>
                atom(null, (_, set, value: string) => {
                  set(to.setterFamily(args), (prev) => ({ ...prev, [key]: value }));
                }),
              inputProps: inputProps?.[key],
            };
          }),
      };
    });
    return [...mapped, ...apply];
  }, [keys, inputProps, applyCheckbox]);
  const rowDef: RowDef<T, From, To, Args> = useMemo(
    () => ({
      inputDefs,
      args,
    }),
    [inputDefs],
  );
  return (
    <SortableList<T, From, To, Args>
      abbreviatedOnStart={abbreviatedOnStart}
      add={add}
      detailsDef={detailsDef}
      disableAdd={disableAdd}
      disableSort={disableSort}
      from={from}
      layout={layout}
      listDef={listDef}
      remove={remove}
      rowDef={rowDef}
      to={to}
    />
  );
}

interface ArgsCallback {
  <T extends { id: string; 備考: string; 適用?: boolean }>(item: T): Atom<string>;
}

const args: ArgsCallback = atomFamily(
  (item) => atom(item.id),
  (a, b) => a.id === b.id,
);
