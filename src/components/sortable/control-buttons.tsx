import { Dispatch, SetStateAction } from 'react';
import { typedEntries } from '../../commons/object-utils';
import styles from './control-buttons.module.scss';

export interface Props<T extends { id: string }> {
  setter: Dispatch<SetStateAction<T[]>>;
  initialize: () => T;
}

export default function ControlButtons<T extends { id: string }>({ setter, initialize }: Props<T>) {
  return (
    <div className={styles.container}>
      <button type="button" onClick={() => setter((prev) => prev.concat(initialize()))}>
        +
      </button>
      <button
        type="button"
        onClick={() =>
          setter((prev) => {
            const last = prev.at(-1);
            if (!last) {
              return prev;
            }
            const hasData = typedEntries(last).some(([key, value]) => key !== 'id' && value);
            if (!hasData || window.confirm('Data already exists. Would you really want to delete it?')) {
              return prev.slice(0, -1);
            }
            return prev;
          })
        }
      >
        -
      </button>
    </div>
  );
}
