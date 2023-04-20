import { ChangeEvent, useEffect, useRef } from 'react';
import { debounced } from '../../common/functions/generate-fns';
import { genericMemo } from '../../common/functions/react-util';
import styles from './user-input.module.scss';

type InputDefImpl<From, To> =
  | NumberInputDef<From, To>
  | TextInputDef<From, To>
  | CustomInputDef<From, To>
  | ReadonlyInputDef<From>
  | EmptyDef;

type InputDefGenerate<From, To> = {
  title: string;
  fn: (from: From) => InputDefImpl<From, To>;
};

export type InputDef<From, To> = InputDefImpl<From, To> | InputDefGenerate<From, To>;

function isGenerate<From, To>(def: InputDef<From, To>): def is InputDefGenerate<From, To> {
  return 'fn' in def;
}

export type Props<From, To> = {
  def: InputDef<From, To>;
  from: From;
  to: To;
};

const UserInput = genericMemo(function UserInput<From, To>({ def, from, to }: Props<From, To>) {
  const actualDef = isGenerate(def) ? def.fn(from) : def;
  switch (actualDef.type) {
    case 'number':
      return <NumberInput def={actualDef} from={from} to={to} />;
    case 'text':
      return <TextInput def={actualDef} from={from} to={to} />;
    case 'custom':
      return <CustomInput def={actualDef} from={from} to={to} />;
    case 'read-only':
      return <ReadonlyInput def={actualDef} from={from} />;
    case 'empty':
      return <EmptyInput def={actualDef} />;
  }
});

export default UserInput;

type TextInputDef<From, To> = {
  type: 'text';
  title: string;
  from: (source: From) => string;
  to: (to: To, value: string) => void;
  inputProps?: Partial<JSX.IntrinsicElements['input']>;
};

type TextInputProps<From, To> = {
  def: TextInputDef<From, To>;
  from: From;
  to: To;
};

function TextInput<From, To>({ def, from, to }: TextInputProps<From, To>) {
  const value = def.from(from);
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
      defaultValue={value}
      onChange={debounced((e: ChangeEvent<HTMLInputElement>) => {
        def.to(to, e.target.value);
      })}
    />
  );
}

type NumberInputDef<From, To> = {
  type: 'number';
  title: string;
  from: (from: From) => string;
  to: (to: To, value: number) => void;
  inputProps?: Partial<JSX.IntrinsicElements['input']>;
};

type NumberInputProps<From, To> = {
  def: NumberInputDef<From, To>;
  from: From;
  to: To;
};

function NumberInput<From, To>({ def, from, to }: NumberInputProps<From, To>) {
  const value = def.from(from);
  const ref = useRef<HTMLInputElement>(null);
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
      defaultValue={value}
      onChange={debounced((e: ChangeEvent<HTMLInputElement>) => {
        const n = Number(e.target.value);
        def.to(to, n);
      })}
    />
  );
}

type CustomInputDef<From, To> = {
  type: 'custom';
  title: string;
  render: (from: From, to: To, def: CustomInputDef<From, To>) => React.ReactNode;
};

type CustomInputProps<From, To> = {
  def: CustomInputDef<From, To>;
  from: From;
  to: To;
};

function CustomInput<From, To>({ def, from, to }: CustomInputProps<From, To>) {
  return <>{def.render(from, to, def)}</>;
}

type ReadonlyInputDef<From> = {
  type: 'read-only';
  title: string;
  from: (from: From) => string;
  spanProps?: Partial<JSX.IntrinsicElements['input']>;
};

type ReadonlyInputProps<From> = {
  def: ReadonlyInputDef<From>;
  from: From;
};

function ReadonlyInput<From>({ def, from }: ReadonlyInputProps<From>) {
  return (
    <span className={styles['read-only']} data-title={def.title} {...def.spanProps}>
      {def.from(from)}
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
