import { Dispatch, SetStateAction } from 'react';
import { typedEntries } from '../../commons/object-utils';
import { dataFlags } from '../../commons/react-util';
import styles from './control-buttons.module.scss';

export interface Props<T extends { id: string }> {
  setter: Dispatch<SetStateAction<T[]>>;
  initialize: () => T;
  abbr?: {
    setter: Dispatch<SetStateAction<boolean>>;
    value: boolean;
  };
}

export default function ControlButtons<T extends { id: string }>({ setter, initialize, abbr }: Props<T>) {
  return (
    <div className={styles.container} {...dataFlags({ abbr })}>
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
            const hasData = typedEntries(last).some(
              ([key, value]) => key !== 'id' && typeof value !== 'boolean' && value,
            );
            if (!hasData || window.confirm('Data already exists. Would you really want to delete it?')) {
              return prev.slice(0, -1);
            }
            return prev;
          })
        }
      >
        -
      </button>
      {abbr && (
        <button type="button" onClick={() => abbr.setter((prev) => !prev)}>
          {abbr.value ? '詳細表示' : '短縮表示'}
        </button>
      )}
    </div>
  );
}
