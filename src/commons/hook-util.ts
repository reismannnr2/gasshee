import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';

export function useRerender() {
  const [, setRerender] = useState('');
  return useCallback(() => setRerender(nanoid()), [setRerender]);
}
