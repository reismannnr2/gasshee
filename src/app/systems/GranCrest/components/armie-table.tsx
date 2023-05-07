import Chapter from '../../../common/components/chapter';
import PlainSortableList from '../../../features/sortable/plain-sortable-list';
import { GCR_ABILITY_KEYS, initializeAbility } from '../states/abilities';
import { GCR_ARIMIE_KEYS, gcrArmieAbilitiesAtom, gcrArmieAtom, initializeArmie } from '../states/mc';
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
          initialize={initializeAbility}
          itemsAtom={gcrArmieAbilitiesAtom}
          keys={GCR_ABILITY_KEYS}
          layout={styles['ability-layout']}
        />
      </Chapter>
    </>
  );
}
