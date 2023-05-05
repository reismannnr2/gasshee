import Chapter from '../../../common/components/chapter';
import PlainSortableList from '../../../features/sortable/plain-sortable-list';
import {
  GCR_ABILITY_KEYS,
  GCR_MAGICS_KEYS,
  gcrAbilitiesAtom,
  gcrMagicsAtom,
  gcrWorksAbilitiesAtom,
  initializeAbility,
  initializeMagic,
} from '../states/abilities';
import styles from './ability-list.module.scss';

export default function AbilityList() {
  return (
    <>
      <Chapter title="クラス特技">
        <PlainSortableList
          abbreviatedOnStart
          initialize={initializeAbility}
          itemsAtom={gcrAbilitiesAtom}
          keys={GCR_ABILITY_KEYS}
          layout={styles['ability-layout']}
        />
      </Chapter>
      <Chapter title="ワークス特技">
        <PlainSortableList
          abbreviatedOnStart
          initialize={initializeAbility}
          itemsAtom={gcrWorksAbilitiesAtom}
          keys={GCR_ABILITY_KEYS}
          layout={styles['ability-layout']}
        />
      </Chapter>
      <Chapter title="魔法">
        <PlainSortableList
          abbreviatedOnStart
          initialize={initializeMagic}
          itemsAtom={gcrMagicsAtom}
          keys={GCR_MAGICS_KEYS}
          layout={styles['magic-layout']}
        />
      </Chapter>
    </>
  );
}
