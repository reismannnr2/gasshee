import Chapter from '../../../common/components/chapter';
import PlainSortableList from '../../../features/sortable/plain-sortable-list';
import { LIFEPATH_KEYS, gcrLifePathAtom, initializeLifePath } from '../states/misc';
import styles from './lifepath-list.module.scss';

export default function LifepathList() {
  return (
    <Chapter title="ライフパス">
      <PlainSortableList
        abbreviatedOnStart
        disableAdd={true}
        disableSort={true}
        initialize={initializeLifePath}
        itemsAtom={gcrLifePathAtom}
        keys={LIFEPATH_KEYS}
        layout={styles.layout}
        inputProps={{
          種別: { readOnly: true },
        }}
      />
    </Chapter>
  );
}
