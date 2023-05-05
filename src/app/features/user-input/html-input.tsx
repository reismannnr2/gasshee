import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { Atom, WritableAtom, atom, useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import ToggleBox from '../../common/components/toggle-box';
import { customFlags } from '../../common/functions/react-util';
import LazyModal from '../modals/lazy-modal';
import { useLazyModal } from '../modals/use-modal';
import styles from './html-input.module.scss';

export type Props = {
  valueAtom: Atom<string>;
  setterAtom: WritableAtom<unknown, [string], void>;
  isHtmlAtom: Atom<boolean>;
  setIsHTMLAtom: WritableAtom<unknown, [boolean], void>;
  placeholder: string;
  layout: string;
};

export default function HTMLInput({ valueAtom, setterAtom, isHtmlAtom, setIsHTMLAtom, placeholder, layout }: Props) {
  const baseValue = useAtomValue(valueAtom);
  const value = baseValue || placeholder;
  const isPlaceholder = !baseValue;
  const rawTextAtom = useMemo(() => atom<string>(''), []);
  const submitAtom = useMemo(
    () =>
      atom(null, (get, set) => {
        const raw = get(rawTextAtom);
        const isHTML = get(isHtmlAtom);
        set(setterAtom, isHTML ? DOMPurify.sanitize(raw) : raw);
      }),
    [isHtmlAtom, setterAtom, rawTextAtom],
  );
  const openAtom = useMemo(
    () =>
      atom(null, (get, set) => {
        const raw = get(valueAtom);
        const isHTML = get(isHtmlAtom);
        set(rawTextAtom, isHTML ? DOMPurify.sanitize(raw) : raw);
      }),
    [isHtmlAtom, valueAtom, rawTextAtom],
  );
  const onSubmit = useSetAtom(submitAtom);
  const onOpenModal = useSetAtom(openAtom);
  const isHTML = useAtomValue(isHtmlAtom);
  const purified = isHTML ? DOMPurify.sanitize(value) : value;
  const { ref, openDialog, closeDialog, show } = useLazyModal();
  const onClose = () => {
    onSubmit();
    closeDialog();
  };
  const onOpen = () => {
    onOpenModal();
    openDialog();
  };
  return (
    <div className={clsx(layout, styles.wrapper)}>
      <button className={styles['open-button']} type="button" onClick={onOpen}>
        編集する
      </button>
      {isHTML ? (
        <div
          className={styles['extra-text']}
          dangerouslySetInnerHTML={{ __html: purified }}
          {...customFlags({ placeholder: isPlaceholder })}
        />
      ) : (
        <pre className={styles['extra-text']} {...customFlags({ placeholder: isPlaceholder })}>
          {value}
        </pre>
      )}
      <LazyModal modalRef={ref} show={show} onClose={onClose}>
        {() => (
          <HTMLEditor
            isHtmlAtom={isHtmlAtom}
            layout={layout}
            placeholder={placeholder}
            rawAtom={rawTextAtom}
            setIsHTMLAtom={setIsHTMLAtom}
            setterAtom={setterAtom}
            valueAtom={valueAtom}
            onClose={onClose}
          />
        )}
      </LazyModal>
    </div>
  );
}

const HTML_MODES = ['HTML', 'テキスト'] as const;
type HTMLMode = (typeof HTML_MODES)[number];
function HTMLEditor({
  isHtmlAtom,
  setIsHTMLAtom,
  placeholder,
  rawAtom,
  onClose,
}: Props & { rawAtom: WritableAtom<string, [string], void>; onClose: () => void }) {
  const htmlModesAtom = useMemo(() => atom((get) => (get(isHtmlAtom) ? 'HTML' : 'テキスト')), [isHtmlAtom]);
  const setHtmlModesAtom = useMemo(
    () => atom(null, (_, set, value: HTMLMode) => set(setIsHTMLAtom, value === 'HTML' ? true : false)),
    [setIsHTMLAtom],
  );
  const raw = useAtomValue(rawAtom);
  const setRaw = useSetAtom(rawAtom);
  return (
    <div className={styles.modal}>
      <p className={styles['modal-title']}>テキスト入力</p>
      <ToggleBox<HTMLMode[]> setterAtom={setHtmlModesAtom} valueAtom={htmlModesAtom} values={HTML_MODES} />
      <ul className={styles.description}>
        <li>通常のテキストかHTMLのいずれかを入力できます。</li>
        <li>script要素など、一部の危険なHTMLは反映されません。</li>
        <li>別のテキストエディタで編集してコピー＆ペーストすることを推奨します。</li>
      </ul>
      <textarea
        className={styles.textarea}
        placeholder={placeholder}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
      />
      <button className={styles.close} type="button" onClick={onClose}>
        確定する
      </button>
    </div>
  );
}
