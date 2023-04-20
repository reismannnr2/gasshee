import clsx from 'clsx';
import { useMemo } from 'react';
import { rangeArray } from '../../common/functions/generate-fns';
import { genericMemo } from '../../common/functions/react-util';
import { Setter } from '../../common/types';
import { useAnimateHeight } from '../animation/use-animate-height';
import UserInput, { InputDef } from '../user-input/user-input';
import styles from './vertical-table.module.scss';

export type Props<S, T extends { id: string }, Ex> = {
  layout?: string;
  item: S;
  setter: Setter<S>;
  columns: ColumnDef<S, T, Ex>[];
  inputDefs: InputDef<T, Ex>[];
  titleRender: (title: string, setter: Setter<T[]>) => React.ReactNode;
  ex: Ex;
};

export default function VerticalTable<S, T extends { id: string }, Ex>({
  layout,
  item,
  setter,
  columns,
  inputDefs,
  titleRender,
  ex,
}: Props<S, T, Ex>) {
  // columnsは変更されないので、useMemoでキャッシュする
  const columnsWithSetter = useMemo(
    () =>
      columns.map((column): [ColumnDef<S, T, Ex>, Setter<T[]>] => [
        column,
        (transform) => {
          setter((state) => column.to(state, transform(column.from(state, ex)), ex));
        },
      ]),
    [setter, columns, ex],
  );
  const { innerRef, outerRef, className: animate } = useAnimateHeight<HTMLUListElement, HTMLDivElement>(2);
  return (
    <div ref={outerRef} className={clsx(styles.container, animate)}>
      <ul ref={innerRef} className={clsx(layout, styles.table)}>
        {columnsWithSetter.map(([column, setter]) => (
          <Column<T, Ex>
            key={column.title}
            ex={ex}
            inputDefs={inputDefs}
            items={column.from(item, ex)}
            setter={setter}
            title={column.title}
            titleRender={titleRender}
          />
        ))}
      </ul>
    </div>
  );
}

export type ColumnDef<S, T extends { id: string }, Ex> = {
  title: string;
  from: (state: S, ex: Ex) => T[];
  to: (state: S, value: T[], ex: Ex) => S;
};

type ColumnProps<T extends { id: string }, Ex> = {
  title: string;
  items: T[];
  setter: Setter<T[]>;
  inputDefs: InputDef<T, Ex>[];
  titleRender: (title: string, setter: Setter<T[]>) => React.ReactNode;
  ex: Ex;
};

const Column = genericMemo(function Column<T extends { id: string }, Ex>({
  title,
  items,
  setter,
  titleRender,
  inputDefs,
  ex,
}: ColumnProps<T, Ex>) {
  const setters: Setter<T>[] = useMemo(
    () =>
      rangeArray(items.length).map(
        (index) => (transform) => setter((prev) => prev.map((item, i) => (i === index ? transform(item) : item))),
      ),
    [items.length, setter],
  );
  return (
    <li className={styles.column}>
      <div>{titleRender(title, setter)}</div>
      <ul>
        {items.map((item, index) => (
          // items.length をチェックしてからmapしているので、setters[index]は必ず存在する
          <Row<T, Ex> key={item.id} ex={ex} inputDefs={inputDefs} item={item} setter={setters[index] as Setter<T>} />
        ))}
      </ul>
    </li>
  );
});

type RowProps<T extends { id: string }, Ex> = {
  item: T;
  setter: Setter<T>;
  inputDefs: InputDef<T, Ex>[];
  ex: Ex;
};

const Row = genericMemo(function Row<T extends { id: string }, Ex>({ item, setter, inputDefs, ex }: RowProps<T, Ex>) {
  return (
    <li>
      <ul className="inputs">
        {inputDefs.map((def, index) => (
          <li key={index}>
            <UserInput<T, Ex> def={def} ex={ex} item={item} setter={setter} />
          </li>
        ))}
      </ul>
    </li>
  );
});
