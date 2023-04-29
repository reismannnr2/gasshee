import { Atom, useAtomValue, useSetAtom, WritableAtom } from 'jotai';
import React, { ChangeEvent, useEffect, useMemo, useRef } from 'react';
import { debounced } from '../../common/functions/generate-fns';
import { genericMemo } from '../../common/functions/react-util';
import styles from './user-input.module.scss';

type InputDefImpl<From, To, Args> =
  | PlaceholderDef
  | ReadonlyDef<From, Args>
  | TextInputDef<From, To, Args>
  | TextAreaInputDef<From, To, Args>
  | CustomInputDef<From, To, Args>;

type InputDefGenerate<From, To, Args> = {
  id?: string;
  title: string;
  fn: (from: From, args: Args) => Atom<InputDefImpl<From, To, Args> | undefined>;
};

export type InputDef<From, To, Args> = InputDefGenerate<From, To, Args>;

export type Props<From, To, Args> = {
  def: InputDef<From, To, Args>;
  from: From;
  to: To;
  args: Args;
};

const UserInput = genericMemo(function UserInput<From, To, Args>({ def, from, to, args }: Props<From, To, Args>) {
  const defAtom = useMemo(() => def.fn(from, args), [def, from, args]);
  const actualDef = useAtomValue(defAtom);
  if (!actualDef) {
    return null;
  }
  switch (actualDef.type) {
    case 'placeholder':
      return <Placeholder def={actualDef} />;
    case 'readonly':
      return <ReadonlyInput args={args} def={actualDef} from={from} />;
    case 'text':
      return <TextInput args={args} def={actualDef} from={from} to={to} />;
    case 'textarea':
      return <TextAreaInput args={args} def={actualDef} from={from} to={to} />;
    case 'custom':
      return <CustomInput args={args} def={actualDef} from={from} to={to} />;
  }
});

export default UserInput;

type PlaceholderDef = {
  type: 'placeholder';
  title: string;
  spanProps?: Partial<JSX.IntrinsicElements['span']>;
};

type PlaceholderProps = {
  def: PlaceholderDef;
};

function Placeholder({ def }: PlaceholderProps) {
  return <span data-title={def.title} {...def.spanProps} />;
}

type ReadonlyDef<From, Args> = {
  type: 'readonly';
  title: string;
  from: (source: From, args: Args) => Atom<string>;
  spanProps?: Partial<JSX.IntrinsicElements['span']>;
};

type ReadonlyProps<From, Args> = {
  def: ReadonlyDef<From, Args>;
  from: From;
  args: Args;
};

function ReadonlyInput<From, Args>({ def, from, args }: ReadonlyProps<From, Args>) {
  const valueAtom = useMemo(() => def.from(from, args), [def, from, args]);
  const value = useAtomValue(valueAtom);
  return (
    <span className={styles['read-only']} data-title={def.title} {...def.spanProps}>
      {value}
    </span>
  );
}

type TextInputDef<From, To, Args> = {
  type: 'text';
  title: string;
  from: (from: From, args: Args) => Atom<string>;
  to: (to: To, args: Args) => WritableAtom<null, [string], void>;
  inputProps?: Partial<JSX.IntrinsicElements['input']>;
};

type TextInputProps<From, To, Args> = {
  def: TextInputDef<From, To, Args>;
  from: From;
  to: To;
  args: Args;
};

function TextInput<From, To, Args>({ def, from, to, args }: TextInputProps<From, To, Args>) {
  const valueAtom = useMemo(() => def.from(from, args), [def, from, args]);
  const value = useAtomValue(valueAtom);
  const writeAtom = useMemo(() => def.to(to, args), [def, to, args]);
  const setter = useSetAtom(writeAtom);
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
        setter(e.target.value);
      })}
      {...def.inputProps}
    />
  );
}

type TextAreaInputDef<From, To, Args> = {
  type: 'textarea';
  title: string;
  from: (from: From, args: Args) => Atom<string>;
  to: (to: To, args: Args) => WritableAtom<null, [string], void>;
  textareaProps?: Partial<JSX.IntrinsicElements['textarea']>;
};

type TextAreaInputProps<From, To, Args> = {
  def: TextAreaInputDef<From, To, Args>;
  from: From;
  to: To;
  args: Args;
};

function TextAreaInput<From, To, Args>({ def, from, to, args }: TextAreaInputProps<From, To, Args>) {
  const valueAtom = useMemo(() => def.from(from, args), [def, from, args]);
  const value = useAtomValue(valueAtom);
  const writeAtom = useMemo(() => def.to(to, args), [def, to, args]);
  const setter = useSetAtom(writeAtom);
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.value !== value) {
      ref.current.value = value;
    }
  });
  return (
    <textarea
      ref={ref}
      className={styles.input}
      data-title={def.title}
      defaultValue={value}
      onChange={debounced((e: ChangeEvent<HTMLTextAreaElement>) => {
        setter(e.target.value);
      })}
      {...def.textareaProps}
    />
  );
}

type CustomInputDef<From, To, Args> = {
  type: 'custom';
  title: string;
  render: (from: From, to: To, args: Args) => React.ReactNode;
};

type CustomInputProps<From, To, Args> = {
  def: CustomInputDef<From, To, Args>;
  from: From;
  to: To;
  args: Args;
};

function CustomInput<From, To, Args>({ def, from, to, args }: CustomInputProps<From, To, Args>) {
  return <>{def.render(from, to, args)}</>;
}
