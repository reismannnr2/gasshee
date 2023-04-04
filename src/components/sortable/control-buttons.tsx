import { Dispatch, SetStateAction } from 'react';
import styles from './control-buttons.module.scss';

export interface Props<T> {
  setter: Dispatch<SetStateAction<T[]>>;
  initialize: () => T;
}

export default function ControlButtons<T>({ setter, initialize }: Props<T>) {
  return (
    <div className={styles.container}>
      <button type="button" onClick={() => setter((prev) => prev.concat(initialize()))}>
        +
      </button>
      <button type="button" onClick={() => setter((prev) => prev.slice(0, -1))}>
        -
      </button>
    </div>
  );
}
