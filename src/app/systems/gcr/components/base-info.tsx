import { atom, useAtomValue } from 'jotai';
import RubyInput from '../../../common/components/ruby-input';
import SimpleInput, { SimpleNumberInput } from '../../../common/components/simple-input';
import ToggleBox from '../../../common/components/toggle-box';
import {
  CLASS_NAMES,
  GcrClassName,
  characterLevelAtom,
  characterNameAtom,
  gcrClassAtom,
  gcrStyleAtom,
  gcrWorksAtom,
} from '../states/base';
import styles from './base-info.module.scss';

const levelSetterAtom = atom(
  (get) => get(characterLevelAtom),
  (_get, set, value: string) => {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    set(characterLevelAtom, parsed);
  },
);

export default function BaseInfo() {
  return (
    <div className={styles['base-info']}>
      <RubyInput
        layout={styles['character-name']}
        placeholder="{名前:なまえ}を{入力:にゅうりょく}..."
        setterAtom={characterNameAtom}
        valueAtom={characterNameAtom}
      />
      <div className={styles['class-info']}>
        <label className={styles['character-level']}>
          <span>Lv: </span>
          <SimpleNumberInput
            inputProps={{ className: styles['level-input'] }}
            setterAtom={levelSetterAtom}
            valueAtom={characterLevelAtom}
          />
        </label>
        <ToggleBox<GcrClassName[]> setterAtom={gcrClassAtom} valueAtom={gcrClassAtom} values={CLASS_NAMES} />
        <GcrClassInput />
        <SimpleInput
          inputProps={{ placeholder: 'ワークス', className: styles['style-input'], list: `gcr-works` }}
          setterAtom={gcrWorksAtom}
          valueAtom={gcrWorksAtom}
        />
      </div>
    </div>
  );
}
function GcrClassInput() {
  const gcrClass = useAtomValue(gcrClassAtom);
  return (
    <SimpleInput
      inputProps={{ placeholder: 'スタイル', className: styles['style-input'], list: `gcr-styles-${gcrClass}` }}
      setterAtom={gcrStyleAtom}
      valueAtom={gcrStyleAtom}
    />
  );
}
