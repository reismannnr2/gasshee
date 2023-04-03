import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './drag-handle.module.scss';

export default forwardRef<HTMLButtonElement, JSX.IntrinsicElements['button']>(function DragHandle(props, ref) {
  return (
    <button className={clsx(styles['drag-handle'])} type="button" {...props} ref={ref}>
      ::
    </button>
  );
});
