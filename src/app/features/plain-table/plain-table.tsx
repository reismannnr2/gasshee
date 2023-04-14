import clsx from 'clsx';
import { Setter } from '../../common/types';
import UserInput, { InputDef } from '../input/user-input';
import styles from './plain-table.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Props<S, R extends Array<RowDef<S, any>>> = {
  title: string;
  titles: string[];
  layout?: string;
  rows: R;
  item: S;
  setter: Setter<S>;
};

export type RowDef<S, T> = {
  title: string;
  defs: InputDef<T>[];
  from: (state: S) => T;
  to: (state: S, value: T) => S;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PlainTable<S, R extends RowDef<S, any>[]>({
  title,
  titles,
  layout,
  rows,
  item,
  setter,
}: Props<S, R>) {
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
                  item={row.from(item)}
                  setter={(transform) => setter((prev) => row.to(prev, transform(row.from(prev))))}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
