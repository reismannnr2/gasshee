import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';

export interface Props {
  children?: React.ReactNode;
  deps: unknown;
}
export default function AnimateHeight({ children, deps }: Props) {
  const height = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [, setRerender] = useState('');
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
      setRerender(nanoid());
    }
  }, [deps, rendered]);
  return (
    <div className={classNames({ rendered }, 'wrapper')}>
      <div ref={ref}>{children}</div>
      <style jsx>{`
        .wrapper {
          position: relative;
          height: auto;

          &.rendered {
            overflow: hidden;
            transition: height 0.2s ease;
          }
        }
      `}</style>
      <style jsx>{`
        .wrapper.rendered {
          height: ${height.current || 0}px;
        }
      `}</style>
    </div>
  );
}
