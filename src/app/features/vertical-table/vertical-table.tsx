import clsx from 'clsx';
import { useMemo } from 'react';
import { rangeArray } from '../../common/functions/generate-fns';
import { genericMemo } from '../../common/functions/react-util';
import { Setter } from '../../common/types';
import { useAnimateHeight } from '../animation/use-animate-height';
import UserInput, { InputDef } from '../user-input/user-input';
import styles from './vertical-table.module.scss';

export type Props<S, T extends { id: string }> = {
  layout?: string;
  item: S;
  setter: Setter<S>;
  columns: ColumnDef<S, T>[];
  inputDefs: InputDef<T>[];
  titleRender: (title: string, setter: Setter<T[]>) => React.ReactNode;
};

export default function VerticalTable<S, T extends { id: string }>({
  layout,
  item,
  setter,
  columns,
  inputDefs,
  titleRender,
}: Props<S, T>) {
  // columnsは変更されないので、useMemoでキャッシュする
  const columnsWithSetter = useMemo(
    () =>
      columns.map((column): [ColumnDef<S, T>, Setter<T[]>] => [
        column,
        (transform) => {
          setter((state) => column.to(state, transform(column.from(state))));
        },
      ]),
    [setter, columns],
  );
  const { innerRef, outerRef, className: animate } = useAnimateHeight<HTMLUListElement, HTMLDivElement>(2);
  return (
    <div ref={outerRef} className={clsx(styles.container, animate)}>
      <ul ref={innerRef} className={clsx(layout, styles.table)}>
        {columnsWithSetter.map(([column, setter]) => (
          <Column<T>
            key={column.title}
            inputDefs={inputDefs}
            items={column.from(item)}
            setter={setter}
            title={column.title}
            titleRender={titleRender}
          />
        ))}
      </ul>
    </div>
  );
}

export type ColumnDef<S, T extends { id: string }> = {
  title: string;
  from: (state: S) => T[];
  to: (state: S, value: T[]) => S;
};

type ColumnProps<T extends { id: string }> = {
  title: string;
  items: T[];
  setter: Setter<T[]>;
  inputDefs: InputDef<T>[];
  titleRender: (title: string, setter: Setter<T[]>) => React.ReactNode;
};

const Column = genericMemo(function Column<T extends { id: string }>({
  title,
  items,
  setter,
  titleRender,
  inputDefs,
}: ColumnProps<T>) {
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
          <Row<T> key={item.id} inputDefs={inputDefs} item={item} setter={setters[index] as Setter<T>} />
        ))}
      </ul>
    </li>
  );
});

type RowProps<T extends { id: string }> = {
  item: T;
  setter: Setter<T>;
  inputDefs: InputDef<T>[];
};

const Row = genericMemo(function Row<T extends { id: string }>({ item, setter, inputDefs }: RowProps<T>) {
  return (
    <li>
      <ul className="inputs">
        {inputDefs.map((def, index) => (
          <li key={index}>
            <UserInput<T> def={def} item={item} setter={setter} />
          </li>
        ))}
      </ul>
    </li>
  );
});
