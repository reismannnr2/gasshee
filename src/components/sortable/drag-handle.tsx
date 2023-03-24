import { forwardRef } from 'react';

export default forwardRef<HTMLButtonElement, JSX.IntrinsicElements['button']>(function DragHandle(props, ref) {
  return (
    <button className="drag-handle" type="button" {...props} ref={ref}>
      ::
      <style jsx>{`
        button {
          display: inline-block;
          width: 100%;
          height: 100%;
          line-height: 1;
          cursor: grab;
          &:active {
            cursor: grabbing;
          }
        }
      `}</style>
    </button>
  );
});
