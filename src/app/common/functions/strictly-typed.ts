// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function typedEntries<T extends Record<string, any>>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function typedKeys<T extends Record<string, any>>(obj: T): (keyof T)[] {
  return Object.keys(obj);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in (obj as object);
}

export function literalIncludes<T extends readonly string[]>(list: T, value: string) {
  return list.includes(value);
}
