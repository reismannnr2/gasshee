import { Atom, WritableAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import Loading from '../../common/components/loading';
import MaybeWith from '../../common/components/maybe-with';
import ToggleBox from '../../common/components/toggle-box';
import { customFlags } from '../../common/functions/react-util';
import LazyModal from '../modals/lazy-modal';
import { useLazyModal } from '../modals/use-modal';
import {
  ADVANCED_MODES,
  AdvancedMode,
  advancedModeAtom,
  cipherKeyAtom,
  endpointAtom,
  paroleAtom,
  passwordAtom,
  resetAdvancedAtom,
  sheetIdAtom,
  sheetNameAtom,
  sheetTagAtom,
  storageAtom,
  userNameAtom,
} from './states';
import styles from './store-sheet.module.scss';

export type Props<T extends Readonly<Record<string, unknown>>> = {
  sheetAtom: Atom<T>;
  system: string;
};

export default function StoreSheet<T extends Readonly<Record<string, unknown>>>({ sheetAtom, system }: Props<T>) {
  const { ref, openDialog, closeDialog, show } = useLazyModal();
  return (
    <div>
      <button type="button" onClick={openDialog}>
        Save
      </button>
      <LazyModal modalRef={ref} show={show} onClose={closeDialog}>
        {() => <StoreModal sheetAtom={sheetAtom} system={system} />}
      </LazyModal>
    </div>
  );
}

function StoreModal<T extends Readonly<Record<string, unknown>>>({ sheetAtom, system }: Props<T>) {
  const advanced = useAtomValue(advancedModeAtom);
  const resetAdvanced = useSetAtom(resetAdvancedAtom);
  useLayoutEffect(() => {
    if (advanced === '簡易設定') {
      resetAdvanced();
    }
  }, [advanced, resetAdvanced]);
  const hidden = advanced === '簡易設定';

  return (
    <div className={styles.modal}>
      <p className={styles['modal-title']}>シートを保存</p>
      <div className={styles['mode-toggle']}>
        <ToggleBox<AdvancedMode[]> setterAtom={advancedModeAtom} valueAtom={advancedModeAtom} values={ADVANCED_MODES} />
      </div>
      <ul className={styles.description}>
        <li>以下の設定はローカル保存時には無効です。</li>
        <li>タグ: 一覧画面でタグ検索が可能になる。縦棒&lsquo;|&rsquo;区切り。前後のスペースはトリムされる。</li>
        <li>パスワード: 更新時にパスワードが必要になる。</li>
        <li {...customFlags({ hidden })}>合言葉: 一覧画面において、合言葉を入力するまでこのシートが表示されない。</li>
        <li {...customFlags({ hidden })}>
          <span>暗号化キー: キャラクターシート詳細を表示する際に、暗号化キーが必要になる。</span>
          <ul>
            <li>暗号化は簡易的なものです。個人情報など機密情報の保存に利用しないでください。</li>
          </ul>
        </li>
        <li {...customFlags({ hidden })}>
          <span>サーバー: 保存先のサーバーです。クライアントはそのまま、保存先と読み取り先を変更できます。</span>
          <ul>
            <li>サーバー設定のみ、一度変更すると他のキャラクターシートでも変更されます。</li>
          </ul>
        </li>
      </ul>
      <ul className={styles.fields}>
        <li>
          <TextInput
            label="ID: "
            setterAtom={sheetIdAtom}
            valueAtom={sheetIdAtom}
            inputProps={{
              readOnly: true,
              placeholder: '新規作成時に自動で採番されます。',
            }}
          />
        </li>
        <li>
          <TextInput label="表示名: " setterAtom={sheetNameAtom} valueAtom={sheetNameAtom} />
        </li>
        <li>
          <TextInput label="ユーザー名: " setterAtom={userNameAtom} valueAtom={userNameAtom} />
        </li>
        <li>
          <TextInput label="タグ: " setterAtom={sheetTagAtom} valueAtom={sheetTagAtom} />
        </li>
        <li>
          <TextInput
            inputProps={{ type: 'password' }}
            label="パスワード: "
            setterAtom={passwordAtom}
            valueAtom={passwordAtom}
          />
        </li>
        <li {...customFlags({ hidden })}>
          <TextInput label="合言葉: " setterAtom={paroleAtom} valueAtom={paroleAtom} />
        </li>
        <li {...customFlags({ hidden })}>
          <TextInput label="暗号化キー: " setterAtom={cipherKeyAtom} valueAtom={cipherKeyAtom} />
        </li>
        <li {...customFlags({ hidden })}>
          <TextInput label="サーバー: " setterAtom={endpointAtom} valueAtom={endpointAtom} />
        </li>
      </ul>
      <SaveButtons sheetAtom={sheetAtom} system={system} />
    </div>
  );
}

function TextInput({
  valueAtom,
  setterAtom,
  label,
  inputProps,
}: {
  valueAtom: Atom<string>;
  setterAtom: WritableAtom<unknown, [string], void>;
  label: string;
  inputProps?: JSX.IntrinsicElements['input'];
}) {
  const value = useAtomValue(valueAtom);
  const setValue = useSetAtom(setterAtom);
  return (
    <label>
      <span className={styles.label}>{label}</span>
      <input className={styles.input} value={value} onChange={(e) => setValue(e.target.value)} {...inputProps} />
    </label>
  );
}

function SaveButtons<T extends Readonly<Record<string, unknown>>>({ sheetAtom, system }: Props<T>) {
  const id = useAtomValue(sheetIdAtom);
  const [promise, setPromise] = useState<Promise<unknown> | null>(null);
  const router = useRouter();
  const storage = useSetAtom(storageAtom);
  return (
    <div className={styles.buttons}>
      {id}
      <button
        className={styles.button}
        type="button"
        onClick={() => {
          setPromise(storage({ sheetAtom, system, baseMode: 'create', saveTo: 'server', setPromise, router }));
          return;
        }}
      >
        新規登録
      </button>
      <button
        className={styles.button}
        disabled={id === ''}
        type="button"
        onClick={() => {
          setPromise(storage({ sheetAtom, system, baseMode: 'update', saveTo: 'server', setPromise, router }));
          return;
        }}
      >
        データ更新
      </button>
      <button
        className={styles.button}
        type="button"
        onClick={() => {
          storage({ sheetAtom, system, baseMode: 'update', saveTo: 'local', setPromise, router });
          return;
        }}
      >
        ローカル保存
      </button>
      <MaybeWith test={promise}>{(p) => <Loading promise={p} />}</MaybeWith>
    </div>
  );
}