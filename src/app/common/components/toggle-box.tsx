import { Atom, WritableAtom, useAtomValue, useSetAtom } from 'jotai';
import { customFlags } from '../functions/react-util';
import styles from './toggle-box.module.scss';

export type Props<Values extends string[]> = {
  valueAtom: Atom<Values[number]>;
  setterAtom: WritableAtom<Values[number], [Values[number]], void>;
  values: Readonly<Values>;
  labels?: {
    [key in Values[number]]: string;
  };
};

export default function ToggleBox<Values extends string[]>({ valueAtom, setterAtom, values, labels }: Props<Values>) {
  const currentValue = useAtomValue(valueAtom);
  const setter = useSetAtom(setterAtom);
  return (
    <div className={styles['toggle-box']}>
      <ul className={styles.list}>
        {values.map((value: Values[number]) => (
          <li key={value}>
            <button
              className={styles['item-button']}
              type="button"
              onClick={() => setter(value)}
              {...customFlags({ selected: value === currentValue })}
            >
              {labels ? labels[value] : value}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
