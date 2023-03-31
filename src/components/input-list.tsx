import { replaced, typedKeys } from '../commons/object-utils';

export interface Props<T extends Record<string, string | number>> {
  item: T;
  onChange: (callback: (prev: T) => T) => void;
}

export default function InputList<T extends Record<string, string | number>>({ item, onChange }: Props<T>) {
  const keys = typedKeys(item);
  return (
    <ul>
      {keys.map((rawKey) => {
        const key = String(rawKey);
        return (
          <li key={String(key)}>
            <input
              value={String(item[key])}
              onChange={(e) =>
                onChange((prev) => {
                  const v = typeof prev[rawKey] === 'string' ? e.target.value : Number(e.target.value);
                  return replaced(prev, rawKey, v as T[typeof rawKey]);
                })
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
