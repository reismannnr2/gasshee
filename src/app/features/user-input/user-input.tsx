import { useEffect, useRef } from 'react';
import { debounced } from '../../common/functions/generate-fns';
import { genericMemo } from '../../common/functions/react-util';
import { Setter } from '../../common/types';
import styles from './user-input.module.scss';

type InputDefImpl<T, Ex> =
  | NumberInputDef<T, Ex>
  | TextInputDef<T, Ex>
  | CustomInputDef<T, Ex>
  | ReadonlyInputDef<T, Ex>
  | EmptyDef;
type InputDefGenerate<T, Ex> = {
  fn: (item: T, ex: Ex) => InputDefImpl<T, Ex>;
  title: string;
};
export type InputDef<T, Ex> = InputDefImpl<T, Ex> | InputDefGenerate<T, Ex>;

export type Props<T, Ex> = {
  def: InputDef<T, Ex>;
  item: T;
  setter: Setter<T>;
  ex: Ex;
};

function isGenerate<T, Ex>(def: InputDef<T, Ex>): def is InputDefGenerate<T, Ex> {
  return 'fn' in def;
}

const UserInput = genericMemo(function UserInput<T, Ex>({ def, item, setter, ex }: Props<T, Ex>) {
  const actualDef = isGenerate(def) ? def.fn(item, ex) : def;
  switch (actualDef.type) {
    case 'number':
      return <NumberInput def={actualDef} ex={ex} item={item} setter={setter} />;
    case 'text':
      return <TextInput def={actualDef} ex={ex} item={item} setter={setter} />;
    case 'custom':
      return <CustomInput def={actualDef} ex={ex} item={item} setter={setter} />;
    case 'readonly':
      return <ReadonlyInput def={actualDef} ex={ex} item={item} />;
    case 'empty':
      return <EmptyInput def={actualDef} />;
  }
});

export default UserInput;

type NumberInputDef<T, Ex> = {
  type: 'number';
  title: string;
  from: (state: T, ex: Ex) => string;
  to: (prev: T, value: number, ex: Ex) => T;
  inputProps?: Partial<JSX.IntrinsicElements['input']>;
};

type NumberInputProps<T, Ex> = {
  item: T;
  def: NumberInputDef<T, Ex>;
  setter: Setter<T>;
  ex: Ex;
};

function NumberInput<T, Ex>({ item, def, setter, ex }: NumberInputProps<T, Ex>) {
  const ref = useRef<HTMLInputElement>(null);
  const value = def.from(item, ex);
  useEffect(() => {
    const n = Number(value);
    if (ref.current && Number(ref.current.value) !== n) {
      ref.current.value = String(value);
    }
  }, [value]);
  return (
    <input
      ref={ref}
      className={styles.input}
      data-title={def.title}
      defaultValue={def.from(item, ex)}
      onChange={debounced((e) => {
        const n = Number(e.target.value);
        setter((prev) => def.to(prev, n, ex));
      }, 500)}
      {...def.inputProps}
    />
  );
}

type TextInputDef<T, Ex> = {
  type: 'text';
  title: string;
  from: (state: T, ex: Ex) => string;
  to: (prev: T, value: string, ex: Ex) => T;
  inputProps?: Partial<JSX.IntrinsicElements['input']>;
};

type TextInputProps<T, Ex> = {
  item: T;
  def: TextInputDef<T, Ex>;
  setter: Setter<T>;
  ex: Ex;
};

function TextInput<T, Ex>({ item, def, setter, ex }: TextInputProps<T, Ex>) {
  const value = def.from(item, ex);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.value !== value) {
      ref.current.value = value;
    }
  }, [value]);
  return (
    <input
      ref={ref}
      className={styles.input}
      data-title={def.title}
      defaultValue={def.from(item, ex)}
      onChange={debounced((e) => {
        setter((prev) => def.to(prev, e.target.value, ex));
      }, 500)}
      {...def.inputProps}
    />
  );
}

type CustomInputDef<T, Ex> = {
  type: 'custom';
  title: string;
  render: (item: T, setter: Setter<T>, def: CustomInputDef<T, Ex>, ex: Ex) => React.ReactNode;
};

type CustomInputProps<T, Ex> = {
  item: T;
  def: CustomInputDef<T, Ex>;
  setter: Setter<T>;
  ex: Ex;
};

function CustomInput<T, Ex>({ item, def, setter, ex }: CustomInputProps<T, Ex>) {
  return <>{def.render(item, setter, def, ex)}</>;
}

type ReadonlyInputDef<T, Ex> = {
  type: 'readonly';
  title: string;
  from: (state: T, ex: Ex) => string;
  spanProps?: Partial<JSX.IntrinsicElements['input']>;
};

type ReadonlyInputProps<T, Ex> = {
  item: T;
  def: ReadonlyInputDef<T, Ex>;
  ex: Ex;
};

function ReadonlyInput<T, Ex>({ item, def, ex }: ReadonlyInputProps<T, Ex>) {
  return (
    <span className={styles['read-only']} data-title={def.title} {...def.spanProps}>
      {def.from(item, ex)}
    </span>
  );
}

type EmptyDef = {
  type: 'empty';
  title: string;
  spanProps?: Partial<JSX.IntrinsicElements['input']>;
};

type EmptyProps = {
  def: EmptyDef;
};

function EmptyInput({ def }: EmptyProps) {
  return <span data-title={def.title} {...def.spanProps} />;
}
