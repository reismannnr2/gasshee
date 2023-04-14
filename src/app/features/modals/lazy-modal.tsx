import React, { Ref } from 'react';
import Modal from './modal';

export type Props = {
  show: boolean;
  modalRef: Ref<HTMLDialogElement>;
  onClose: () => void;
  children: () => React.ReactNode;
};

export default function LazyModal({ show, modalRef, onClose, children }: Props) {
  const content = show ? children() : null;
  return (
    <Modal modalRef={modalRef} onClose={onClose}>
      {content}
    </Modal>
  );
}
