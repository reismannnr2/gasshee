import { useCallback, useRef, useState } from 'react';

export function useModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<number>(0);

  const openDialog = useCallback(() => {
    if (ref.current) {
      scrollRef.current = window.scrollY;
      document.body.style.top = `-${window.scrollY}px`;
      ref.current.showModal();
    }
  }, []);
  const closeDialog = useCallback(() => {
    if (ref.current) {
      document.body.style.top = '';
      ref.current.close();
      window.scrollTo(0, scrollRef.current);
    }
  }, []);
  return { ref, openDialog, closeDialog };
}

export function useLazyModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [show, setShow] = useState(false);
  const scrollRef = useRef<number>(0);

  const openDialog = useCallback(() => {
    if (ref.current) {
      scrollRef.current = window.scrollY;
      document.body.style.top = `-${window.scrollY}px`;
      setShow(true);
      ref.current.showModal();
    }
  }, []);
  const closeDialog = useCallback(() => {
    if (ref.current) {
      document.body.style.top = '';
      ref.current.close();
      setShow(false);
      window.scrollTo(0, scrollRef.current);
    }
  }, []);
  return { ref, openDialog, closeDialog, show };
}
