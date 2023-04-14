import React, { Ref } from 'react';
import styles from './modal.module.scss';

export type Props = {
  modalRef: Ref<HTMLDialogElement>;
  onClose: () => void;
  children?: React.ReactNode;
};

export default function Modal({ modalRef, onClose, children }: Props) {
  return (
    <dialog ref={modalRef} className={styles.modal} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </dialog>
  );
}
