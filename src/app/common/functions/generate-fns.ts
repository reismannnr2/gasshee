export function fromAndTo<T, K extends keyof T>(
  key: K,
): {
  from: (obj: T) => T[K];
  to: (obj: T, value: T[K]) => T;
} {
  return {
    from: (obj: T) => obj[key],
    to: (obj: T, value: T[K]) => ({ ...obj, [key]: value }),
  };
}

export function fromAndToWith<T, K extends keyof T, V>(
  key: K,
  transform: (value: T[K]) => V,
): {
  from: (obj: T) => V;
  to: (obj: T, value: T[K]) => T;
} {
  return {
    from: (obj: T) => transform(obj[key]),
    to: (obj: T, value: T[K]) => ({ ...obj, [key]: value }),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounced<T extends (...args: any[]) => void>(
  callback: T,
  time = 500,
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      callback(...args);
    }, time);
  };
}

export function range(length: number): Generator<number>;
export function range(start: number, end: number): Generator<number>;
export function* range(startOrLength: number, maybeEnd?: number) {
  const [start, end] = maybeEnd == undefined ? [0, startOrLength] : [startOrLength, maybeEnd];
  for (let i = start; i < end; i++) {
    yield i;
  }
}

export function rangeArray(length: number): number[];
export function rangeArray(start: number, end: number): number[];
export function rangeArray(startOrLength: number, maybeEnd?: number): number[] {
  return [...range(startOrLength, maybeEnd as number)];
}
