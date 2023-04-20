import clsx from 'clsx';
import UserInput, { InputDef } from '../user-input/user-input';
import styles from './plain-table.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Props<From, To> = {
  layout?: string;
  title: string;
  titles: readonly string[];
  rowDefs: readonly RowDef<From, To>[];
  from: From;
  to: To;
};

export type RowDef<From, To> = {
  title: string;
  inputDefs: InputDef<From, To>[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PlainTable<From, To>({ layout, title, titles, rowDefs, from, to }: Props<From, To>) {
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
        {rowDefs.map((rowDef) => (
          <tr key={rowDef.title}>
            <th>{rowDef.title}</th>
            {rowDef.inputDefs.map((def) => (
              <td key={def.title}>
                <UserInput def={def} from={from} to={to} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
