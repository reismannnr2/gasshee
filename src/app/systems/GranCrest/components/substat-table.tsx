import { Atom, WritableAtom, atom } from 'jotai';
import Chapter from '../../../common/components/chapter';
import PlainTable, { RowDef } from '../../../features/plain-table/plain-table';
import { InputDef } from '../../../features/user-input/user-input';
import {
  armieHpAtom,
  armieHpMpDescriptionAtom,
  armieMpAtom,
  baseHpAtom,
  baseHpMpDescriptionAtom,
  baseMpAtom,
  extraDescriptionAtom,
  extraHPAtom,
  extraHpMpDescriptionAtom,
  extraInitAtom,
  extraMPAtom,
  extraMaxWeightAtom,
  extraMoveBaseAtom,
  extraWeightAtom,
  fromArmieDescriptionAtom,
  fromItemDescriptionAtom,
  fromStatDescriptionAtom,
  hpMpSumDescriptionAtom,
  hpSumAtom,
  initFromArmieAtom,
  initFromItemAtom,
  initFromStatAtom,
  initSumAtom,
  maxWeightFromStatAtom,
  maxWeightSumAtom,
  moveBaseDescriptionAtom,
  moveBaseFromItemAtom,
  moveBaseFromStatAtom,
  moveBaseSumAtom,
  moveBaseSumDescriptionAtom,
  moveFromArmieAtom,
  moveSumAtom,
  mpSumAtom,
  styleGrowHPAtom,
  styleGrowHpMpDescriptionAtom,
  styleGrowMPAtom,
  styleHPAtom,
  styleHpMpDescriptionAtom,
  styleMPAtom,
  substatSumDescriptionAtom,
  weightFromItemAtom,
  weightSumAtom,
  worksHPAtom,
  worksHpMpDescriptionAtom,
  worksMPAtom,
} from '../states/sub-stats';
import styles from './substat-table.module.scss';

export default function SubStatTable() {
  return (
    <Chapter title="サブステータス">
      <HPMPTable />
      <ExtraStatTable />
    </Chapter>
  );
}

function HPMPTable() {
  return (
    <PlainTable
      from={hpMpfrom}
      layout={hpMpLayout}
      rowDefs={hpmpRowDefs}
      title={hpMpTitle}
      titles={hpMptitles}
      to={hpMpto}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const placeholderDef: InputDef<any, any, unknown> = {
  title: 'placeholder',
  fn: () =>
    atom(() => ({
      type: 'placeholder',
      title: '',
      spanProps: {
        className: styles.placeholder,
      },
    })),
};

const hpMpLayout = styles['hpmp-layout'];
const hpMpTitle = 'HPMP';
const hpMptitles = ['', 'HP', 'MP', '備考'];
const hpMpfrom = {};
const hpMpto = {};
const args = () => atom(null);

const createHpMpDef = (
  title: string,
  hpAtom: WritableAtom<number, [number], void>,
  mpAtom: WritableAtom<number, [number], void>,
  descriptionAtom: WritableAtom<string, [string], void>,
): RowDef<typeof hpMpfrom, typeof hpMpto, unknown> => {
  return {
    title,
    showRowtitle: true,
    cellDefs: [
      {
        title: 'HP',
        inputDefs: [
          {
            title: `${title}HP`,
            fn: () =>
              atom(() => ({
                type: 'number',
                title: `${title}HP`,
                from: () => hpAtom,
                to: () => hpAtom,
              })),
          },
        ],
        args,
      },
      {
        title: 'MP',
        inputDefs: [
          {
            title: `${title}MP`,
            fn: () =>
              atom(() => ({
                type: 'number',
                title: `${title}MP`,
                from: () => mpAtom,
                to: () => mpAtom,
              })),
          },
        ],
        args,
      },
      {
        title: `${title}備考`,
        inputDefs: [
          {
            title: `${title}備考`,
            fn: () =>
              atom(() => ({
                type: 'text',
                title: `${title}備考`,
                from: () => descriptionAtom,
                to: () => descriptionAtom,
              })),
          },
        ],
        args,
      },
    ],
  };
};
const createReadHpMpDef = (
  title: string,
  hpAtom: Atom<number>,
  mpAtom: Atom<number>,
  descriptionAtom: WritableAtom<string, [string], void>,
): RowDef<typeof hpMpfrom, typeof hpMpto, unknown> => {
  return {
    title,
    showRowtitle: true,
    cellDefs: [
      {
        title: 'HP',
        inputDefs: [
          {
            title: `${title}HP`,
            fn: () =>
              atom(() => ({
                type: 'readonly',
                title: `${title}HP`,
                from: () => hpAtom,
              })),
          },
        ],
        args,
      },
      {
        title: 'MP',
        inputDefs: [
          {
            title: `${title}MP`,
            fn: () =>
              atom(() => ({
                type: 'readonly',
                title: `${title}MP`,
                from: () => mpAtom,
              })),
          },
        ],
        args,
      },
      {
        title: `${title}備考`,
        inputDefs: [
          {
            title: `${title}備考`,
            fn: () =>
              atom(() => ({
                type: 'text',
                title: `${title}備考`,
                from: () => descriptionAtom,
                to: () => descriptionAtom,
              })),
          },
        ],
        args,
      },
    ],
  };
};
const worksHpMpDef = createHpMpDef('ワークス', worksHPAtom, worksMPAtom, worksHpMpDescriptionAtom);
const baseHpMpDef = createReadHpMpDef('ベース値', baseHpAtom, baseMpAtom, baseHpMpDescriptionAtom);
const styleHpMpDef = createHpMpDef('スタイル', styleHPAtom, styleMPAtom, styleHpMpDescriptionAtom);
const styleGrowHpMpDef = createHpMpDef('スタイル成長', styleGrowHPAtom, styleGrowMPAtom, styleGrowHpMpDescriptionAtom);
const armieHpMpDef = createReadHpMpDef('部隊', armieHpAtom, armieMpAtom, armieHpMpDescriptionAtom);
const extraHpMpDef = createHpMpDef('その他修正', extraHPAtom, extraMPAtom, extraHpMpDescriptionAtom);
const hpMpSumDef = createReadHpMpDef('合計', hpSumAtom, mpSumAtom, hpMpSumDescriptionAtom);
const hpmpRowDefs: RowDef<typeof hpMpfrom, typeof hpMpto, unknown>[] = [
  baseHpMpDef,
  worksHpMpDef,
  styleHpMpDef,
  styleGrowHpMpDef,
  armieHpMpDef,
  extraHpMpDef,
  hpMpSumDef,
];

function ExtraStatTable() {
  return (
    <PlainTable
      from={extraFrom}
      layout={extraLayout}
      rowDefs={extraRowDefs}
      title={extraTitle}
      titles={extraTitles}
      to={extraTo}
    />
  );
}

const extraLayout = styles['extra-layout'];
const extraTitle = 'その他のステータス';
const extraTitles = ['', '行動値', '移動力', '最大重量', '重量', '備考'];
const extraFrom = null;
const extraTo = null;

const fromStatRowDef: RowDef<typeof extraFrom, typeof extraTo, unknown> = {
  title: 'ベース値',
  showRowtitle: true,
  cellDefs: [
    {
      title: '行動値',
      inputDefs: [
        {
          title: '行動値',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '行動値',
              from: () => initFromStatAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '移動力',
      inputDefs: [
        {
          title: '移動力',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '移動力',
              from: () => moveBaseFromStatAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '最大重量',
      inputDefs: [
        {
          title: '最大重量',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '最大重量',
              from: () => maxWeightFromStatAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '重量',
      inputDefs: [placeholderDef],
      args,
    },
    {
      title: '備考',
      inputDefs: [
        {
          title: '備考',
          fn: () =>
            atom(() => ({
              type: 'text',
              title: '備考',
              from: () => fromStatDescriptionAtom,
              to: () => fromStatDescriptionAtom,
            })),
        },
      ],
      args,
    },
  ],
};

const extraMoveBaseRowDef: RowDef<typeof extraFrom, typeof extraTo, unknown> = {
  title: '基本値修正',
  showRowtitle: true,
  cellDefs: [
    {
      title: '行動値',
      inputDefs: [placeholderDef],
      args,
    },
    {
      title: '移動力',
      inputDefs: [
        {
          title: '移動力',
          fn: () =>
            atom(() => ({
              type: 'number',
              title: '移動力',
              from: () => extraMoveBaseAtom,
              to: () => extraMoveBaseAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '最大重量',
      inputDefs: [placeholderDef],
      args,
    },
    {
      title: '重量',
      inputDefs: [placeholderDef],
      args,
    },
    {
      title: '備考',
      inputDefs: [
        {
          title: '備考',
          fn: () =>
            atom(() => ({
              type: 'text',
              title: '備考',
              from: () => moveBaseDescriptionAtom,
              to: () => moveBaseDescriptionAtom,
            })),
        },
      ],
      args,
    },
  ],
};
const moveBaseSumRowDef: RowDef<typeof extraFrom, typeof extraTo, unknown> = {
  title: '基本合計',
  showRowtitle: true,
  cellDefs: [
    {
      title: '行動値',
      inputDefs: [placeholderDef],
      args,
    },
    {
      title: '移動力',
      inputDefs: [
        {
          title: '移動力',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '移動力',
              from: () => moveBaseSumAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '最大重量',
      inputDefs: [placeholderDef],
      args,
    },
    {
      title: '重量',
      inputDefs: [placeholderDef],
      args,
    },
    {
      title: '備考',
      inputDefs: [
        {
          title: '備考',
          fn: () =>
            atom(() => ({
              type: 'text',
              title: '備考',
              from: () => moveBaseSumDescriptionAtom,
              to: () => moveBaseSumDescriptionAtom,
            })),
        },
      ],
      args,
    },
  ],
};

const fromItemRowDef: RowDef<typeof extraFrom, typeof extraTo, unknown> = {
  title: 'アイテム',
  showRowtitle: true,
  cellDefs: [
    {
      title: '行動値',
      inputDefs: [
        {
          title: '行動値',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '行動値',
              from: () => initFromItemAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '移動力',
      inputDefs: [
        {
          title: '移動力',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '移動力',
              from: () => moveBaseFromItemAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '最大重量',
      inputDefs: [placeholderDef],
      args,
    },
    {
      title: '重量',
      inputDefs: [
        {
          title: '重量',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '重量',
              from: () => weightFromItemAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '備考',
      inputDefs: [
        {
          title: '備考',
          fn: () =>
            atom(() => ({
              type: 'text',
              title: '備考',
              from: () => fromItemDescriptionAtom,
              to: () => fromItemDescriptionAtom,
            })),
        },
      ],
      args,
    },
  ],
};
const fromArmieRowDef: RowDef<typeof extraFrom, typeof extraTo, unknown> = {
  title: '部隊',
  showRowtitle: true,
  cellDefs: [
    {
      title: '行動値',
      inputDefs: [
        {
          title: '行動値',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '行動値',
              from: () => initFromArmieAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '移動力',
      inputDefs: [
        {
          title: '移動力',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '移動力',
              from: () => moveFromArmieAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '最大重量',
      inputDefs: [placeholderDef],
      args,
    },
    {
      title: '重量',
      inputDefs: [placeholderDef],
      args,
    },
    {
      title: '備考',
      inputDefs: [
        {
          title: '備考',
          fn: () =>
            atom(() => ({
              type: 'text',
              title: '備考',
              from: () => fromArmieDescriptionAtom,
              to: () => fromArmieDescriptionAtom,
            })),
        },
      ],
      args,
    },
  ],
};

const extraRowDef: RowDef<typeof extraFrom, typeof extraTo, unknown> = {
  title: 'その他修正',
  showRowtitle: true,
  cellDefs: [
    {
      title: '行動値',
      inputDefs: [
        {
          title: '行動値',
          fn: () =>
            atom(() => ({
              type: 'number',
              title: '行動値',
              from: () => extraInitAtom,
              to: () => extraMoveBaseAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '移動力',
      inputDefs: [
        {
          title: '移動力',
          fn: () =>
            atom(() => ({
              type: 'number',
              title: '移動力',
              from: () => extraInitAtom,
              to: () => extraInitAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '最大重量',
      inputDefs: [
        {
          title: '最大重量',
          fn: () =>
            atom(() => ({
              type: 'number',
              title: '最大重量',
              from: () => extraMaxWeightAtom,
              to: () => extraMaxWeightAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '重量',
      inputDefs: [
        {
          title: '重量',
          fn: () =>
            atom(() => ({
              type: 'number',
              title: '重量',
              from: () => extraWeightAtom,
              to: () => extraWeightAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '備考',
      inputDefs: [
        {
          title: '備考',
          fn: () =>
            atom(() => ({
              type: 'text',
              title: '備考',
              from: () => extraDescriptionAtom,
              to: () => extraDescriptionAtom,
            })),
        },
      ],
      args,
    },
  ],
};

const sumRowDef: RowDef<typeof extraFrom, typeof extraTo, unknown> = {
  title: '合計',
  showRowtitle: true,
  cellDefs: [
    {
      title: '行動値',
      inputDefs: [
        {
          title: '行動値',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '行動値',
              from: () => initSumAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '移動力',
      inputDefs: [
        {
          title: '移動力',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '移動力',
              from: () => moveSumAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '最大重量',
      inputDefs: [
        {
          title: '最大重量',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '最大重量',
              from: () => maxWeightSumAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '重量',
      inputDefs: [
        {
          title: '重量',
          fn: () =>
            atom(() => ({
              type: 'readonly',
              title: '重量',
              from: () => weightSumAtom,
            })),
        },
      ],
      args,
    },
    {
      title: '備考',
      inputDefs: [
        {
          title: '備考',
          fn: () =>
            atom(() => ({
              type: 'text',
              title: '備考',
              from: () => substatSumDescriptionAtom,
              to: () => substatSumDescriptionAtom,
            })),
        },
      ],
      args,
    },
  ],
};

const extraRowDefs: RowDef<typeof extraFrom, typeof extraTo, unknown>[] = [
  fromStatRowDef,
  extraMoveBaseRowDef,
  fromItemRowDef,
  moveBaseSumRowDef,
  fromArmieRowDef,
  extraRowDef,
  sumRowDef,
];
