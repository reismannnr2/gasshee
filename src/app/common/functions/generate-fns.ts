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
