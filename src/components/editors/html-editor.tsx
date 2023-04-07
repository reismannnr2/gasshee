import { RefObject, useCallback, useEffect, useRef } from 'react';
import { useHtml } from '../../commons/hook-util';
import Dialog, { useDialog } from '../layout/dialog';

export default function HTMLEditor() {
  const { ref, showModal, closeModal } = useDialog();
  const [__html, setHtml] = useHtml();
  const onClose = useCallback(
    (edited: string) => {
      setHtml(edited);
      closeModal();
    },
    [closeModal, setHtml],
  );
  return (
    <div>
      <button type="button" onClick={showModal}>
        EDIT
      </button>
      <div dangerouslySetInnerHTML={{ __html }} />
      <EditDialog dialogRef={ref} html={__html} onClose={onClose} />
    </div>
  );
}

interface EditDialogProps {
  html: string;
  dialogRef: RefObject<HTMLDialogElement>;
  onClose: (edited: string) => void;
}

function EditDialog({ html, dialogRef, onClose }: EditDialogProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }
    textareaRef.current.value = html;
  }, [html]);
  return (
    <Dialog
      ref={dialogRef}
      onClose={() => {
        onClose(textareaRef.current?.value || '');
      }}
    >
      <textarea ref={textareaRef} defaultValue={html}></textarea>
    </Dialog>
  );
}
