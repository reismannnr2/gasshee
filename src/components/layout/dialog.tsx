import clsx from 'clsx';
import { forwardRef, useCallback, useRef } from 'react';

interface BaseProps {
  children: React.ReactNode | React.ReactNode[];
  onClose: () => void;
}

export type Props = BaseProps & JSX.IntrinsicElements['dialog'];

export const useDialog = () => {
  const ref = useRef<HTMLDialogElement>(null);
  const showModal = useCallback(() => {
    ref.current?.showModal();
  }, []);
  const closeModal = useCallback(() => {
    ref.current?.close();
  }, []);
  return { ref, showModal, closeModal };
};

const Dialog = forwardRef<HTMLDialogElement, Props>(function Dialog(
  { children, onClose, className, ...props }: Props,
  ref,
) {
  return (
    <dialog ref={ref} onClick={onClose} className={clsx(className)} {...props}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </dialog>
  );
});

export default Dialog;
