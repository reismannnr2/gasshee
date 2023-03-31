import classNames from 'classnames';
import React, { CSSProperties, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useRerender } from '../../commons/hook-util';
import styles from './animate-height.module.scss';

export interface Props {
  children?: React.ReactNode;
}

export default function AnimateHeight({ children }: Props) {
  const { style, className, ref } = useAnimateHeight<HTMLDivElement>();
  return (
    <div className={className} style={style}>
      <div ref={ref}>{children}</div>
    </div>
  );
}

interface AnimateHeightInfo<E> {
  style: CSSProperties;
  className: string;
  ref: RefObject<E>;
}

export function useAnimateHeight<E extends HTMLElement>(): AnimateHeightInfo<E> {
  const height = useRef(0);
  const ref = useRef<E>(null);
  const rerender = useRerender();
  const [rendered, setRendered] = useState(false);
  const observer = useMemo(
    () =>
      new MutationObserver(() => {
        const div = ref.current;
        if (!div) {
          return;
        }
        const next = div.getBoundingClientRect().height;
        if (height.current !== next) {
          height.current = next;
          rerender();
        }
      }),
    [rerender],
  );
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    height.current = element.getBoundingClientRect().height;
    setRendered(true);
    observer.observe(element, { subtree: true, attributes: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [observer]);
  const style = rendered ? { height: `${height.current || 0}px` } : {};
  const className = classNames(styles.wrapper, { rendered });
  return { style, ref, className };
}
