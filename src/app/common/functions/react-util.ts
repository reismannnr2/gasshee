import { forwardRef, memo, MutableRefObject, Ref, RefAttributes } from 'react';
export const genericMemo: <T>(component: T) => T = memo;
export const genericForwardRef = forwardRef as <T, P>(
  render: (props: P, ref: Ref<T>) => React.ReactNode,
) => (props: P & RefAttributes<T>) => React.ReactElement;

export function customFlags(flags: { [name in string]: unknown }) {
  const result: { [name in string]: string } = {};
  for (const [name, value] of Object.entries(flags)) {
    if (value) {
      result[`data-${name}`] = '';
    }
  }
  return result;
}

export function maybe<T, V>(test: T, value: V): V | undefined {
  return test ? value : undefined;
}

export function maybeWith<T, V>(test: T | undefined | null, f: (value: T) => V): V | undefined {
  return test != null ? f(test) : undefined;
}

export function mergeRefs<T>(...refs: Ref<T>[]): (value: T) => void {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        (ref as MutableRefObject<T>).current = value;
      }
    }
  };
}
