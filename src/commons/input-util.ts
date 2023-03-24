import { Dispatch, SetStateAction, ChangeEvent } from 'react';

export function createListOnChange<T, K extends keyof T>(
  setter: Dispatch<SetStateAction<T[]>>,
  index: number,
  key: K,
  transform: (value: string) => T[K],
) {
  return function onChange(evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setter((prev) => {
      const next = prev.slice();
      const item = prev[index];
      if (!item) {
        return prev;
      }
      next[index] = { ...item, [key]: transform(evt.target.value) };
      return next;
    });
  };
}
