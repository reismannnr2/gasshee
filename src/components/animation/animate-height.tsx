import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useRerender } from '../../commons/hook-util';
import styles from './animate-height.module.scss';

export interface Props {
  children?: React.ReactNode;
  deps: unknown;
}
export default function AnimateHeight({ children, deps }: Props) {
  const height = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const rerender = useRerender();
  useEffect(() => {
    const div = ref.current;
    if (!div) {
      return;
    }
    height.current = div.getBoundingClientRect().height;
    setRendered(true);
  }, []);
  useEffect(() => {
    const div = ref.current;
    if (!div || !rendered) {
      return;
    }
    const next = div.getBoundingClientRect().height;
    if (height.current !== next) {
      height.current = next;
      rerender();
    }
  }, [deps, rendered, rerender]);
  const style = rendered ? { height: `${height.current || 0}px` } : undefined;
  return (
    <div className={classNames({ rendered }, styles.wrapper)} style={style}>
      <div ref={ref}>{children}</div>
    </div>
  );
}
