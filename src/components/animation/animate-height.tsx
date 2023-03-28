import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useRerender } from '../../commons/hook-util';

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
  return (
    <div className={classNames({ rendered }, 'wrapper')}>
      <div ref={ref}>{children}</div>
      <style jsx>{`
        .wrapper {
          position: relative;
          height: auto;
        }
        .wrapper.rendered {
          overflow: hidden;
          transition: height 0.2s ease;
        }
        .wrapper.rendered.dragging {
          overflow: visible;
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
