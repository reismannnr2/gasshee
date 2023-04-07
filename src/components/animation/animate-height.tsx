import clsx from 'clsx';
import React, { CSSProperties, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useRerender } from '../../commons/hook-util';
import styles from './animate-height.module.scss';

export interface Props {
  children?: React.ReactNode;
}

export default function AnimateHeight({ children }: Props) {
  const { style, className, innerRef, outerRef } = useAnimateHeight();
  return (
    <div ref={outerRef} className={className} style={style}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

export interface AnimateHeightInfo<
  Inner extends HTMLElement = HTMLDivElement,
  Outer extends HTMLElement = HTMLDivElement,
> {
  style: CSSProperties;
  className: string;
  innerRef: RefObject<Inner>;
  outerRef: RefObject<Outer>;
}

export function useAnimateHeight<
  Inner extends HTMLElement = HTMLDivElement,
  Outer extends HTMLElement = HTMLDivElement,
>(): AnimateHeightInfo<Inner, Outer> {
  const height = useRef(0);
  const innerRef = useRef<Inner>(null);
  const outerRef = useRef<Outer>(null);
  const rerender = useRerender();
  const [rendered, setRendered] = useState(false);
  const [animating, setAnimating] = useState(false);
  const observer = useMemo(
    () =>
      new MutationObserver(() => {
        const div = innerRef.current;
        if (!div) {
          return;
        }
        const next = div.getBoundingClientRect().height;
        if (height.current !== next) {
          height.current = next;
          setAnimating(true);
          rerender();
        }
      }),
    [rerender],
  );
  useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) {
      return;
    }
    height.current = inner.getBoundingClientRect().height;
    setRendered(true);
    observer.observe(inner, { subtree: true, attributes: true, childList: true, characterData: true });
    const onAnimationEnd = () => setAnimating(false);
    const onAnimationStart = () => setAnimating(true);
    outer.addEventListener('animationstart', onAnimationStart);
    outer.addEventListener('animationcancel', onAnimationEnd);
    outer.addEventListener('animationend', onAnimationEnd);
    return () => {
      observer.disconnect();
      outer.removeEventListener('animationstart', onAnimationStart);
      outer.removeEventListener('animationcancel', onAnimationEnd);
      outer.removeEventListener('animationend', onAnimationEnd);
    };
  }, [observer]);
  const style = rendered ? { height: `${height.current || 0}px` } : {};
  const className = clsx(styles.wrapper, { rendered, animating });
  return { style, innerRef, outerRef, className };
}
