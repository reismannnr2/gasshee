// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function typedEntries<T extends Record<string, any>>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj);
}

type MappedObject<Keys extends readonly string[], V> = { [key in Keys[number]]: V };
export function keysToObject<Keys extends readonly string[], V>(
  keys: Keys,
  initiator: (key: Keys[number]) => V,
): MappedObject<Keys, V> {
  return keys.reduce((acc, key) => {
    acc[key as Keys[number]] = initiator(key);
    return acc;
  }, {} as MappedObject<Keys, V>);
}

export function typedKeys<T extends Record<string, unknown>>(value: T): (keyof T)[] {
  return Object.keys(value);
}

export function omitted<T extends Record<string, unknown>, K extends (keyof T)[]>(
  value: T,
  ...keys: K
): Omit<T, K[number]> {
  const clone = { ...value };
  for (const key of keys) {
    delete clone[key];
  }
  return clone;
}

export function replaced<T extends Record<string, unknown>>(prev: T, key: keyof T, value: T[typeof key]): T {
  const next = { ...prev };
  next[key] = value;
  return next;
}
