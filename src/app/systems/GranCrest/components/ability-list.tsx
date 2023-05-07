import { atom } from 'jotai';
import Chapter from '../../../common/components/chapter';
import PlainTable, { RowDef } from '../../../features/plain-table/plain-table';
import PlainSortableList from '../../../features/sortable/plain-sortable-list';
import {
  GCR_ABILITY_KEYS,
  GCR_MAGIC_KEYS,
  classAbilityLevelSumAtom,
  classAbilityMaxLevelAtom,
  gcrAbilitiesAtom,
  gcrMagicsAtom,
  gcrWorksAbilitiesAtom,
  initializeAbility,
  initializeMagic,
  worksAbilityLevelSumAtom,
  worksAbilityMaxLevelAtom,
} from '../states/abilities';
import styles from './ability-list.module.scss';
const args = () => atom(null);
const numbersRowDef: RowDef<null, null, null>[] = [
  {
    title: '特技枠',
    cellDefs: [
      {
        title: 'クラス特技枠',
        inputDefs: [
          {
            title: `クラス特技枠`,
            fn: () =>
              atom(() => ({
                type: 'readonly',
                title: `クラス特技枠`,
                from: () => classAbilityMaxLevelAtom,
              })),
          },
        ],
        args,
      },
      {
        title: '現在クラス特技',
        inputDefs: [
          {
            title: `現在クラス特技`,
            fn: () =>
              atom(() => ({
                type: 'readonly',
                title: `現在クラス特技`,
                from: () => classAbilityLevelSumAtom,
              })),
          },
        ],
        args,
      },
      {
        title: 'ワークス特技枠',
        inputDefs: [
          {
            title: `ワークス特技枠`,
            fn: () =>
              atom(() => ({
                type: 'readonly',
                title: `ワークス特技枠`,
                from: () => worksAbilityMaxLevelAtom,
              })),
          },
        ],
        args,
      },
      {
        title: '現在ワークス特技',
        inputDefs: [
          {
            title: `現在ワークス特技`,
            fn: () =>
              atom(() => ({
                type: 'readonly',
                title: `現在ワークス特技`,
                from: () => worksAbilityLevelSumAtom,
              })),
          },
        ],
        args,
      },
      {
        title: '備考',
        inputDefs: [],
        args,
      },
    ],
  },
];
export default function AbilityList() {
  return (
    <>
      <Chapter title="特技枠数">
        <PlainTable
          from={null}
          layout={styles['ability-numbers']}
          rowDefs={numbersRowDef}
          title="特技枠数"
          titles={['クラス特技枠', '現在クラス特技', 'ワークス特技枠', '現在ワークス特技', '備考']}
          to={null}
        />
      </Chapter>
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
          keys={GCR_MAGIC_KEYS}
          layout={styles['ability-layout']}
        />
      </Chapter>
    </>
  );
}
