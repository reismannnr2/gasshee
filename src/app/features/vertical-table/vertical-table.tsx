import clsx from 'clsx';
import { Atom, WritableAtom, useAtomValue, useSetAtom } from 'jotai';
import { genericMemo } from '../../common/functions/react-util';
import UserInput, { InputDef } from '../user-input/user-input';
import styles from './vertical-table.module.scss';

export type Props<T extends { id: string }, From, To, Args> = {
  layout?: string;
  columnDefs: readonly ColumnDef<T, From, To, Args>[];
  from: From;
  to: To;
};

export default function VerticalTable<T extends { id: string }, From, To, Args>({
  layout,
  columnDefs,
  from,
  to,
}: Props<T, From, To, Args>) {
  return (
    <div className={clsx(styles.container)}>
      <ul className={clsx(layout, styles.table)}>
        {columnDefs.map((columnDef) => (
          <Column key={columnDef.id || columnDef.title} def={columnDef} from={from} to={to} />
        ))}
      </ul>
    </div>
  );
}
export type ColumnDef<T extends { id: string }, From, To, Args> = {
  id?: string;
  title: string;
  inputDefs: InputDef<From, To, Args>[];
  from: (from: From, columnDef: ColumnDef<T, From, To, Args>) => Atom<T[]>;
  to: (to: To, columnDef: ColumnDef<T, From, To, Args>) => WritableAtom<null, [(prev: T[]) => T[]], void>;
  args: (item: T) => Atom<Args>;
  renderTitle: (
    title: string,
    setter: ReturnType<typeof useSetAtom<null, [(prev: T[]) => T[]], void>>,
  ) => React.ReactNode;
};

type ColumnProps<T extends { id: string }, From, To, Args> = {
  def: ColumnDef<T, From, To, Args>;
  from: From;
  to: To;
};

const Column = genericMemo(function Column<T extends { id: string }, From, To, Args>({
  def,
  from,
  to,
}: ColumnProps<T, From, To, Args>) {
  const items = useAtomValue(def.from(from, def));
  const setItems = useSetAtom(def.to(to, def));
  return (
    <li className={styles.column}>
      <div>{def.renderTitle(def.title, setItems)}</div>
      <ul>
        {items.map((item) => (
          <Row key={item.id} args={def.args} from={from} inputDefs={def.inputDefs} item={item} to={to} />
        ))}
      </ul>
    </li>
  );
});

type RowProps<T extends { id: string }, From, To, Args> = {
  item: T;
  inputDefs: readonly InputDef<From, To, Args>[];
  from: From;
  to: To;
  args: (item: T) => Atom<Args>;
};

const Row = genericMemo(function Row<T extends { id: string }, From, To, Args>({
  item,
  inputDefs,
  from,
  to,
  args,
}: RowProps<T, From, To, Args>) {
  const argsValue = useAtomValue(args(item));
  return (
    <ul className="inputs">
      {inputDefs.map((inputDef) => (
        <li key={inputDef.id || inputDef.title}>
          <UserInput<From, To, Args> args={argsValue} def={inputDef} from={from} to={to} />
        </li>
      ))}
    </ul>
  );
});
