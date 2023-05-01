import { Atom, useAtomValue } from 'jotai';
import Maybe from '../../common/components/maybe';
import SimpleInput from '../../common/components/simple-input';
import ToggleBox from '../../common/components/toggle-box';
import {
  ADVANCE_SAVE_MODE,
  AdvanceSaveMode,
  SAVE_MODE,
  SAVE_MODE_WITHOUT_UPDATE,
  SaveMode,
  advanceModeAtom,
  saveModeAtom,
} from '../../systems/gcr/states/sheet';
import LazyModal from '../modals/lazy-modal';
import { useLazyModal } from '../modals/use-modal';
import { paroleAtom, passwordAtom, sheetIdAtom, sheetNameAtom, userNameAtom } from './states';
import styles from './store-sheet.module.scss';

export type Props<T> = {
  sheetAtom: Atom<T>;
};

export default function StoreSheet<T>({ sheetAtom }: Props<T>) {
  const { ref, openDialog, closeDialog, show } = useLazyModal();
  return (
    <div>
      <button type="button" onClick={openDialog}>
        Save
      </button>
      <LazyModal modalRef={ref} show={show} onClose={closeDialog}>
        {() => <StoreModal sheetAtom={sheetAtom} />}
      </LazyModal>
    </div>
  );
}

function StoreModal<T>({ sheetAtom }: Props<T>) {
  const value = useAtomValue(sheetAtom);
  const id = useAtomValue(sheetIdAtom);
  const modes = id ? SAVE_MODE : SAVE_MODE_WITHOUT_UPDATE;
  const mode = useAtomValue(saveModeAtom);
  return (
    <div className={styles.modal}>
      <p>キャラクターシートを保存</p>
      <div className={styles.controller}>
        <ToggleBox<SaveMode[]> setterAtom={saveModeAtom} valueAtom={saveModeAtom} values={modes} />
        <Maybe test={mode !== 'ローカルに保存'}>
          <ToggleBox<AdvanceSaveMode[]>
            setterAtom={advanceModeAtom}
            valueAtom={advanceModeAtom}
            values={ADVANCE_SAVE_MODE}
          />
        </Maybe>
      </div>
      <ul>
        <li>合言葉を設定すると、一覧画面に表示させるのに合言葉の入力が必要になります。</li>
        <li>暗号化キーを設定すると、キャラクターシートの表示に暗号化キーが必要になります。</li>
        <li>注意: 暗号化は簡易的なものなので、個人情報など漏洩して困るデータの保存に使わないでください。</li>
      </ul>
      <ul>
        <li>
          <label>
            <span>表示名: </span>
            <SimpleInput setterAtom={sheetNameAtom} valueAtom={sheetNameAtom} />
          </label>
        </li>
        <li>
          <label>
            <span>ユーザー名: </span>
            <SimpleInput setterAtom={userNameAtom} valueAtom={userNameAtom} />
          </label>
        </li>
        <li>
          <label>
            <span>更新用パスワード: </span>
            <SimpleInput inputProps={{ type: 'password' }} setterAtom={passwordAtom} valueAtom={passwordAtom} />
          </label>
        </li>
        <li>
          <label>
            <span>合言葉: </span>
            <SimpleInput setterAtom={paroleAtom} valueAtom={paroleAtom} />
          </label>
        </li>
        <li>
          <label>
            <span>暗号化キー: </span>
            <SimpleInput setterAtom={paroleAtom} valueAtom={paroleAtom} />
          </label>
        </li>
      </ul>
    </div>
  );
}
