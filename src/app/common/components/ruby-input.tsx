import clsx from 'clsx';
import { Atom, WritableAtom, useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import LazyModal from '../../features/modals/lazy-modal';
import { useLazyModal } from '../../features/modals/use-modal';
import rubify from '../../features/rubied-text/rubify';
import { customFlags } from '../functions/react-util';
import styles from './ruby-input.module.scss';

export type Props = {
  valueAtom: Atom<string>;
  setterAtom: WritableAtom<string, [string], void>;
  placeholder: string;
  layout?: string;
};

export default function RubyInput({ valueAtom, setterAtom, placeholder, layout }: Props) {
  const value = useAtomValue(valueAtom);
  const setter = useSetAtom(setterAtom);
  const { ref, openDialog, closeDialog, show } = useLazyModal();
  return (
    <div className={clsx(layout)}>
      <div className={styles.wrapper} onClick={openDialog}>
        <Show placeholder={placeholder} value={value} />
      </div>
      <LazyModal modalRef={ref} show={show} onClose={closeDialog}>
        {() => <InputModal setter={setter} value={value} onClose={closeDialog} />}
      </LazyModal>
    </div>
  );
}

function Show({ value, placeholder }: { value: string; placeholder: string }) {
  const rubied = useMemo(() => rubify(value || placeholder), [value, placeholder]);
  const placeholdered = value === '' && placeholder !== '';
  return (
    <span className={clsx('show', styles.show)} {...customFlags({ placeholdered })}>
      {rubied.map(({ text, ruby }, i) =>
        ruby ? (
          <ruby key={i}>
            {text}
            <rt>{ruby}</rt>
          </ruby>
        ) : (
          <span key={i}>{text}</span>
        ),
      )}
    </span>
  );
}

function InputModal({
  value,
  setter,
  onClose,
}: {
  value: string;
  setter: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <div className={styles.modal}>
      <p className={styles['modal-title']}>ルビ付き文字列入力</p>
      <ul className={styles.description}>
        <li>{'{漢字:かんじ} のような形式でルビ付きの文字列を入力できます'}</li>
        <li>{'{や}、:を使いたいときは\\を使って \\{ のように記述します'}</li>
      </ul>
      <input className={styles.input} type="text" value={value} onChange={(e) => setter(e.target.value)} />
      <button className={styles.close} type="button" onClick={onClose}>
        確定する
      </button>
    </div>
  );
}
