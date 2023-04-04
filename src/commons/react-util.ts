import { memo } from 'react';

export const genericMemo: <T>(component: T) => T = memo;

export function dataFlags(flags: { [name in string]: unknown }) {
  const result: { [name in string]: string } = {};
  for (const [name, value] of Object.entries(flags)) {
    if (value) {
      result[`data-${name}`] = '';
    }
  }
  return result;
}
