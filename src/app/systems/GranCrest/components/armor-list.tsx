import Chapter from '../../../common/components/chapter';
import PlainSortableList from '../../../features/sortable/plain-sortable-list';
import { GCR_ARMOR_KEYS, gcrArmorsAtom, initializeArmor } from '../states/items';
import styles from './armor-list.module.scss';

export default function ArmorList() {
  return (
    <Chapter title="アイテム">
      <PlainSortableList
        abbreviatedOnStart
        applyCheckbox={true}
        initialize={initializeArmor}
        itemsAtom={gcrArmorsAtom}
        keys={GCR_ARMOR_KEYS}
        layout={styles.layout}
      />
    </Chapter>
  );
}
