import { MutableRefObject, Ref, RefAttributes, forwardRef, memo } from 'react';
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

export function maybe<T, V>(test: T, value: V): V | undefined;
export function maybe<T, V1, V2>(test: T, value: V1, fallback: V2): V1 | V2;
export function maybe<T, V1, V2>(test: T, value: V1, fallback?: V2): V1 | V2 | undefined {
  return test ? value : fallback;
}

export function maybeWith<T, V>(test: T | undefined | null, f: (value: T) => V): V | undefined;
export function maybeWith<T, V1, V2>(test: T | undefined | null, f: (value: T) => V1, fallback: V2): V1 | V2;
export function maybeWith<T, V1, V2>(
  test: T | undefined | null,
  f: (value: T) => V1,
  fallback?: () => V2,
): V1 | V2 | undefined {
  return test != null ? f(test) : fallback ? fallback() : undefined;
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withTransition<T, Args extends any[]>(f: (...args: Args) => Promise<T>): (...args: Args) => Promise<T> {
  return async (...args) => {
    return new Promise((resolve) => {
      if ('startViewTransition' in document) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).startViewTransition(() => {
          resolve(f(...args));
        });
      } else {
        resolve(f(...args));
      }
    });
  };
}

export function doWithTransition(f: () => void): void {
  if ('startViewTransition' in document) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (document as any).startViewTransition(() => {
      f();
    });
  } else {
    f();
  }
}
