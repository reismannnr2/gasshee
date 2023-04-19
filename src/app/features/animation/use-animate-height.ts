import { useEffect, useMemo, useRef } from 'react';
import styles from './use-animate-height.module.scss';

export type AnimateHeight<I, O> = {
  innerRef: React.RefObject<I>;
  outerRef: React.RefObject<O>;
  className: string;
};

export function useAnimateHeight<I extends HTMLElement = HTMLDivElement, O extends HTMLElement = HTMLDivElement>(
  extraHeight = 0,
): AnimateHeight<I, O> {
  const innerRef = useRef<I>(null);
  const outerRef = useRef<O>(null);
  const heightRef = useRef(0);
  const observer = useMemo(
    () =>
      new MutationObserver(() => {
        const inner = innerRef.current;
        const height = heightRef.current;
        if (!inner) {
          return;
        }
        const next = inner.getBoundingClientRect().height;
        if (next !== height) {
          heightRef.current = next;
          const outer = outerRef.current;
          if (outer) {
            outer.style.height = `${next + extraHeight}px`;
          }
        }
      }),
    [],
  );
  useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) {
      return;
    }
    const next = inner.getBoundingClientRect().height;
    heightRef.current = next;
    outer.style.height = `${next + extraHeight}px`;
    observer.observe(inner, { subtree: true, attributes: true, childList: true, characterData: true });
    return () => {
      observer.disconnect();
    };
  }, [observer, extraHeight]);
  const className = styles['animate-height'];
  return { innerRef, outerRef, className };
}
