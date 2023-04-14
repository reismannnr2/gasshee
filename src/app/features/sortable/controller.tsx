import clsx from 'clsx';
import MaybeWith from '../../common/components/maybe-with';
import { Setter } from '../../common/types';
import styles from './controller.module.scss';

export type Props<T> = {
  setter: Setter<T[]>;
  initialize: () => T;
  abbreviate?: { value: boolean; setter: Setter<boolean> };
  confirmToDelete?: boolean;
};

export default function Controller<T>({ setter, initialize, abbreviate, confirmToDelete }: Props<T>) {
  return (
    <menu className={styles.controller}>
      <li>
        <button type="button" onClick={() => setter((prev) => prev.concat(initialize()))}>
          +
        </button>
      </li>
      <li>
        <button
          type="button"
          onClick={() => {
            if (!confirmToDelete) {
              setter((prev) => prev.slice(0, -1));
            } else if (window.confirm('最後の行に値が入力されています。削除しますか？')) {
              setter((prev) => prev.slice(0, -1));
            }
          }}
        >
          -
        </button>
      </li>
      {
        <MaybeWith test={abbreviate}>
          {(abbreviate) => (
            <li>
              <button type="button" onClick={() => abbreviate.setter((prev) => !prev)}>
                <span className={clsx({ [styles.hide]: !abbreviate.value })}>詳細を表示</span>
                <span className={clsx({ [styles.hide]: abbreviate.value })}>省略する</span>
              </button>
            </li>
          )}
        </MaybeWith>
      }
    </menu>
  );
}
