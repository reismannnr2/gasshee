import { useEffect, useRef } from 'react';
import { Setter } from '../../common/types';
import styles from './user-input.module.scss';

export type InputDef<T> = NumberInputDef<T> | TextInputDef<T> | CustomInputDef<T> | EmptyDef;

export type Props<T> = {
  def: InputDef<T>;
  item: T;
  setter: Setter<T>;
};

export default function UserInput<T>({ def, item, setter }: Props<T>) {
  switch (def.type) {
    case 'number':
      return <NumberInput def={def} item={item} setter={setter} />;
    case 'text':
      return <TextInput def={def} item={item} setter={setter} />;
    case 'custom':
      return <CustomInput def={def} item={item} setter={setter} />;
    case 'empty':
      return <EmptyInput def={def} />;
  }
}

type NumberInputDef<T> = {
  type: 'number';
  title: string;
  placeholder?: string;
  from: (state: T) => string;
  to: (prev: T, value: number) => T;
};

type NumberInputProps<T> = {
  item: T;
  def: NumberInputDef<T>;
  setter: Setter<T>;
};

function NumberInput<T>({ item, def, setter }: NumberInputProps<T>) {
  const ref = useRef<HTMLInputElement>(null);
  const value = def.from(item);
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
      defaultValue={def.from(item)}
      placeholder={def.placeholder}
      onChange={(e) => {
        const n = Number(e.target.value);
        setter((prev) => def.to(prev, n));
      }}
    />
  );
}

type TextInputDef<T> = {
  type: 'text';
  title: string;
  placeholder?: string;
  from: (state: T) => string;
  to: (prev: T, value: string) => T;
};

type TextInputProps<T> = {
  item: T;
  def: TextInputDef<T>;
  setter: Setter<T>;
};

function TextInput<T>({ item, def, setter }: TextInputProps<T>) {
  const value = def.from(item);
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
      defaultValue={def.from(item)}
      placeholder={def.placeholder}
      onChange={(e) => {
        setter((prev) => def.to(prev, e.target.value));
      }}
    />
  );
}

type CustomInputDef<T> = {
  type: 'custom';
  title: string;
  render: (item: T, setter: Setter<T>, def: CustomInputDef<T>) => React.ReactNode;
};

type CustomInputProps<T> = {
  item: T;
  def: CustomInputDef<T>;
  setter: Setter<T>;
};

function CustomInput<T>({ item, def, setter }: CustomInputProps<T>) {
  return <>{def.render(item, setter, def)}</>;
}

type EmptyDef = {
  type: 'empty';
  title: string;
};

type EmptyProps = {
  def: EmptyDef;
};

function EmptyInput({ def }: EmptyProps) {
  return <span data-title={def.title} />;
}
