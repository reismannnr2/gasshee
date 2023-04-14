import { Setter } from '../../common/types';
import UserInput, { InputDef } from '../user-input/user-input';

export type Props<S, T> = {
  layout?: string;
  item: S;
  setter: Setter<S>;
  columns: ColumnDef<S, T>[];
  inputDefs: InputDef<T>[];
};

export default function VerticalTable<S, T>({ layout, item, setter, columns, inputDefs }: Props<S, T>) {
  return (
    <ul className={layout}>
      {columns.map((column) => (
        <Column<T>
          key={column.title}
          inputDefs={inputDefs}
          items={column.from(item)}
          title={column.title}
          setter={(transform) => {
            setter((state) => column.to(state, transform(column.from(state))));
          }}
        />
      ))}
    </ul>
  );
}

export type ColumnDef<S, T> = {
  title: string;
  from: (state: S) => T[];
  to: (state: S, value: T[]) => S;
};

type ColumnProps<T> = {
  title: string;
  items: T[];
  setter: Setter<T[]>;
  inputDefs: InputDef<T>[];
};

function Column<T>({ title, items, setter, inputDefs }: ColumnProps<T>) {
  return (
    <li>
      <p>{title}</p>
      <ul>
        {items.map((item, index) => (
          <Row<T>
            key={index}
            inputDefs={inputDefs}
            item={item}
            setter={(transform) => setter((prev) => prev.map((item, i) => (i === index ? transform(item) : item)))}
          />
        ))}
      </ul>
    </li>
  );
}

type RowProps<T> = {
  item: T;
  setter: Setter<T>;
  inputDefs: InputDef<T>[];
};

function Row<T>({ item, setter, inputDefs }: RowProps<T>) {
  return (
    <li>
      <ul>
        {inputDefs.map((def) => (
          <li key={def.title}>
            <UserInput<T> def={def} item={item} setter={setter} />
          </li>
        ))}
      </ul>
    </li>
  );
}
