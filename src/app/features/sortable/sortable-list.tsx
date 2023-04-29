import clsx from 'clsx';
import { Atom, WritableAtom } from 'jotai';
import { useState } from 'react';
import { customFlags, maybe } from '../../common/functions/react-util';
import { useAnimateHeight } from '../animation/use-animate-height';
import { InputDef } from '../user-input/user-input';
import styles from './sortable-list.module.scss';

export type Props<T extends { id: string }, From, To, Args> = {
  layout?: string;
  listDef: ListDef<T, From, To>;
  rowDef: RowDef<T, From, To, Args>;
  detailsDef?: RowDef<T, From, To, Args>;
  disableSort?: boolean;
  uncheckedKeys?: readonly string[];
  from: From;
  to: To;
};

export type ListDef<T extends { id: string }, From, To> = {
  from: (from: From) => Atom<T[]>;
  to: (to: To) => WritableAtom<null, [(prev: T[]) => T[]], void>;
};

export type RowDef<T extends { id: string }, From, To, Args> = {
  inputDefs: InputDef<From, To, Args>[];
  args: (item: T) => Atom<Args>;
};

export default function SortableList<T extends { id: string }, From, To, Args>({
  layout,
  listDef,
  rowDef,
  detailsDef,
  disableSort,
  uncheckedKeys,
  from,
  to,
}: Props<T, From, To, Args>) {
  const [abbreviated, setAbbreviated] = useState(false);
  const abbreviate = maybe(detailsDef, {
    value: abbreviated,
    setter: setAbbreviated,
  });
  const { innerRef, outerRef, className: animate } = useAnimateHeight(2);
  return (
    <div className={styles['sortable-list']}>
      <div ref={outerRef} className={clsx(styles.table, animate)}>
        <div ref={innerRef} {...customFlags({ abbreviated })}></div>
      </div>
    </div>
  );
}

type RowProps<T extends { id: string }, From, To, Args> = {
  item: T;
  rowDef: RowDef<T, From, To, Args>;
  detailsDef?: RowDef<T, From, To, Args>;
  disableSort?: boolean;
};
