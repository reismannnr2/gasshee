import DOMPurify from 'dompurify';
import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
export function useRerender() {
  const [, setRerender] = useState('');
  return useCallback(() => setRerender(nanoid()), [setRerender]);
}

export function useHtml(init = ''): [string, (raw: string) => void] {
  const [raw, setRaw] = useState(init);
  const html = DOMPurify.sanitize(raw, {});
  const setHtml = useCallback((raw: string) => {
    const html = DOMPurify.sanitize(raw, {});
    setRaw(html);
  }, []);
  return [html, setHtml];
}
