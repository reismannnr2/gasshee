import { literalIncludes } from '../../common/functions/strictly-typed';
import PlainTable, { RowDef } from '../../features/plain-table/plain-table';
import { CLASS_NAMES, StyleNames, useStyleNamesAtom, useUpdateStyleNamesAtom } from './states/stats';
import styles from './style-table.module.scss';

export default function StyleTable() {
  const item = useStyleNamesAtom();
  const setter = useUpdateStyleNamesAtom();
  return <PlainTable ex={null} item={item} layout={layout} rows={rows} setter={setter} title={title} titles={titles} />;
}

const title = 'Style Table';
const titles = ['Class', 'Style', 'SubStyle', 'Works', 'WorksType'];
const layout = styles.layout;

const rows: RowDef<StyleNames, StyleNames, null>[] = [
  {
    title: 'Style Names',
    defs: [
      {
        title: 'Class',
        type: 'text',
        from: (state) => state.クラス,
        to: (state, value) => ({ ...state, クラス: value }),
        inputProps: {
          list: 'class-names',
        },
      },
      {
        title: 'Style',
        fn: (state) => ({
          title: 'Class',
          type: 'text',
          from: (state) => state.スタイル,
          to: (state, value) => ({ ...state, スタイル: value }),
          inputProps: {
            list: literalIncludes(CLASS_NAMES, state.クラス) ? `style-names-${state.クラス}` : 'style-names-all',
          },
        }),
      },
    ],
    from: (state) => state,
    to: (_, value) => value,
  },
];
