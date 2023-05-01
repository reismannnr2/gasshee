import clsx from 'clsx';
import { Atom, useAtomValue } from 'jotai';
import Maybe from '../../common/components/maybe';
import MaybeWith from '../../common/components/maybe-with';
import UserInput, { InputDef } from '../user-input/user-input';
import styles from './plain-table.module.scss';

export type Props<From, To, Args> = {
  layout?: string;
  title: string;
  titles?: string[];
  rowDefs: readonly RowDef<From, To, Args>[];
  from: From;
  to: To;
};

export type RowDef<From, To, Args> = {
  id?: string;
  title: string;
  showCellTitles?: boolean;
  cellDefs: readonly CellDef<From, To, Args>[];
};

export type CellDef<From, To, Args> = {
  id?: string;
  title: string;
  inputDefs: readonly InputDef<From, To, Args>[];
  args: (from: From) => Atom<Args>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PlainTable<From, To, Args>({
  layout,
  title,
  titles,
  rowDefs,
  from,
  to,
}: Props<From, To, Args>) {
  return (
    <table className={clsx(styles.table, layout)} title={title}>
      {
        <MaybeWith test={titles}>
          {(titles) => (
            <thead>
              <tr>
                {titles.map((title) => (
                  <th key={title}>{title}</th>
                ))}
              </tr>
            </thead>
          )}
        </MaybeWith>
      }
      <tbody>
        {rowDefs.map((rowDef) => (
          <Row key={rowDef.id || rowDef.title} def={rowDef} from={from} to={to} />
        ))}
      </tbody>
    </table>
  );
}

type RowProps<From, To, Args> = {
  def: RowDef<From, To, Args>;
  from: From;
  to: To;
};

function Row<From, To, Args>({ def, from, to }: RowProps<From, To, Args>) {
  return (
    <>
      <Maybe test={def.showCellTitles}>
        <tr data-heading-row>
          {def.cellDefs.map((cellDef) => (
            <th key={cellDef.id || cellDef.title}>{cellDef.title}</th>
          ))}
        </tr>
      </Maybe>
      <tr data-content-row>
        {def.cellDefs.map((cellDef) => (
          <Cell key={cellDef.id || cellDef.title} def={cellDef} from={from} to={to} />
        ))}
      </tr>
    </>
  );
}

type CellProps<From, To, Args> = {
  def: CellDef<From, To, Args>;
  from: From;
  to: To;
};

function Cell<From, To, Args>({ def, from, to }: CellProps<From, To, Args>) {
  const args = useAtomValue(def.args(from));
  return (
    <td>
      <div>
        {def.inputDefs.map((inputDef) => (
          <UserInput key={inputDef.id || inputDef.title} args={args} def={inputDef} from={from} to={to} />
        ))}
      </div>
    </td>
  );
}
