import Chapter from '../../../common/components/chapter';
import PlainSortableList from '../../../features/sortable/plain-sortable-list';
import {
  GCR_ARIMIE_KEYS,
  GCR_ARMIE_ABILITY_KEYS,
  gcrArmieAbilitiesAtom,
  gcrArmieAtom,
  initializeArmie,
  initializeArmieAbility,
} from '../states/mc';
import styles from './armie-table.module.scss';

export default function ArmieTable() {
  return (
    <>
      <Chapter title="部隊">
        <PlainSortableList
          abbreviatedOnStart
          applyCheckbox={true}
          disableAdd={true}
          disableSort={true}
          initialize={initializeArmie}
          itemsAtom={gcrArmieAtom}
          keys={GCR_ARIMIE_KEYS}
          layout={styles['table-layout']}
        />
      </Chapter>{' '}
      <Chapter title="部隊特技">
        <PlainSortableList
          abbreviatedOnStart
          initialize={initializeArmieAbility}
          itemsAtom={gcrArmieAbilitiesAtom}
          keys={GCR_ARMIE_ABILITY_KEYS}
          layout={styles['abilities-layout']}
        />
      </Chapter>
    </>
  );
}
