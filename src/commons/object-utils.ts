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
