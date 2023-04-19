import clsx from 'clsx';
import { Setter } from '../../common/types';
import UserInput, { InputDef } from '../user-input/user-input';
import styles from './plain-table.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Props<S, R extends Array<RowDef<S, any, Ex>>, Ex> = {
  title: string;
  titles: readonly string[];
  layout?: string;
  rows: R;
  item: S;
  setter: Setter<S>;
  ex: Ex;
};

export type RowDef<S, T, Ex> = {
  title: string;
  defs: InputDef<T, Ex>[];
  from: (state: S, ex: Ex) => T;
  to: (state: S, value: T, ex: Ex) => S;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PlainTable<S, R extends RowDef<S, any, Ex>[], Ex>({
  title,
  titles,
  layout,
  rows,
  item,
  setter,
  ex,
}: Props<S, R, Ex>) {
  return (
    <table className={clsx(styles.table, layout)} title={title}>
      <thead>
        <tr>
          <th title="placeholder" />
          {titles.map((title) => (
            <th key={title}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.title}>
            <th>{row.title}</th>
            {row.defs.map((def) => (
              <td key={def.title}>
                <UserInput
                  def={def}
                  ex={ex}
                  item={row.from(item, ex)}
                  setter={(transform) => setter((prev) => row.to(prev, transform(row.from(prev, ex)), ex))}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
