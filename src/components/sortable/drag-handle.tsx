import classNames from 'classnames';
import { forwardRef } from 'react';
import styles from './drag-handle.module.scss';

export default forwardRef<HTMLButtonElement, JSX.IntrinsicElements['button']>(function DragHandle(props, ref) {
  return (
    <button className={classNames(styles['drag-handle'], 'drag-handle')} type="button" {...props} ref={ref}>
      ::
    </button>
  );
});
