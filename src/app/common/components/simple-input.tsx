import { Atom, WritableAtom, useAtomValue, useSetAtom } from 'jotai';
import React from 'react';

export type Props<T> = {
  valueAtom: Atom<T>;
  setterAtom: WritableAtom<T, [string], void>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export default function SimpleInput({ valueAtom, setterAtom, inputProps }: Props<string>) {
  const value = useAtomValue(valueAtom);
  const setter = useSetAtom(setterAtom);
  return <input value={value} onChange={(e) => setter(e.target.value)} {...inputProps} />;
}

export function SimpleNumberInput({ valueAtom, setterAtom, inputProps }: Props<number>) {
  const value = useAtomValue(valueAtom);
  const setter = useSetAtom(setterAtom);
  return <input value={value} onChange={(e) => setter(e.target.value)} {...inputProps} />;
}
