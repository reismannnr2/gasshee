import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import SortableList, { ListDef, RowDef } from '../../../features/sortable/sortable-list';
import {
  GcrGrowthItem,
  addNewGrowthAtom,
  growthDescriptionFamily,
  growthFamily,
  growthListAtom,
  removeLastGrowthAtom,
  setGrowthListAtom,
  updateGrowthDescriptionFamily,
  updateGrowthFamily,
} from '../states/misc';

import Chapter from '../../../common/components/chapter';
import { rangeArray } from '../../../common/functions/generate-fns';
import { customFlags } from '../../../common/functions/react-util';
import { InputDef } from '../../../features/user-input/user-input';
import { STAT_NAMES } from '../states/stats';
import styles from './growth-list.module.scss';

export default function GrowthList() {
  return (
    <Chapter title="成長履歴">
      <SortableList
        abbreviatedOnStart
        add={add}
        detailsDef={detailsDef}
        from={from}
        layout={layout}
        listDef={listDef}
        remove={remove}
        rowDef={rowDef}
        to={to}
      />
    </Chapter>
  );
}

const layout = styles.layout;
const from = {
  growthListAtom,
  growthFamily,
  growthDescriptionFamily,
};
const to = {
  setGrowthListAtom,
  updateGrowthFamily,
  updateGrowthDescriptionFamily,
  addNewGrowthAtom,
  removeLastGrowthAtom,
};

const args = atomFamily(
  (growthItem: GcrGrowthItem) => atom(growthItem.id),
  (a, b) => a.id === b.id,
);
type From = typeof from;
type To = typeof to;
type Args = string;

const listDef: ListDef<GcrGrowthItem, From, To> = {
  from: (from: From) => from.growthListAtom,
  to: (to: To) => to.setGrowthListAtom,
};

const detailsDef: RowDef<GcrGrowthItem, From, To, Args> = {
  inputDefs: [
    {
      title: '備考',
      fn: () =>
        atom(() => {
          return {
            type: 'textarea',
            title: '備考',
            from: (from, args) => from.growthDescriptionFamily(args),
            to: (to, args) => to.updateGrowthDescriptionFamily(args),
            textareaProps: { rows: 2, placeholder: '備考...' },
          };
        }),
    },
  ],
  args,
};

const add = (to: To) => to.addNewGrowthAtom;
const remove = (to: To) => to.removeLastGrowthAtom;

const inputDefs: InputDef<From, To, Args>[] = [
  {
    title: '能力基本値',
    fn: () => {
      return atom(() => {
        return {
          type: 'custom',
          title: '能力基本値',
          render: (from, to, args) => <BaseStatSelect args={args} from={from} to={to} />,
        };
      });
    },
  },
  {
    title: '習得特技',
    fn: () => {
      return atom(() => {
        return {
          type: 'custom',
          title: '習得特技',
          render: (from, to, args) => {
            return <AbilitiesInput args={args} from={from} to={to} />;
          },
        };
      });
    },
  },
];

const rowDef: RowDef<GcrGrowthItem, From, To, Args> = {
  inputDefs,
  args,
};

function BaseStatSelect({ from, to, args }: { from: From; to: To; args: Args }) {
  const item = useAtomValue(from.growthFamily(args));
  const setter = useSetAtom(to.updateGrowthFamily(args));
  if (!item) {
    return null;
  }
  const count = Object.values(item.能力基本値).filter((v) => v).length;
  return (
    <ul className={styles['stat-select']}>
      {STAT_NAMES.map((statName) => {
        return (
          <li key={statName}>
            <button
              className={styles['stat-button']}
              type="button"
              {...customFlags({ selected: item.能力基本値[statName] })}
              onClick={() => {
                setter((prev) => {
                  const selected = prev.能力基本値[statName];
                  if (count > 2 && !selected) {
                    return prev;
                  }
                  return {
                    ...prev,
                    能力基本値: {
                      ...prev.能力基本値,
                      [statName]: !selected,
                    },
                  };
                });
              }}
            >
              {statName}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function AbilitiesInput({ from, to, args }: { from: From; to: To; args: Args }) {
  const item = useAtomValue(from.growthFamily(args));
  const setter = useSetAtom(to.updateGrowthFamily(args));
  if (!item) {
    return null;
  }
  return (
    <ul className={styles.abilities}>
      {rangeArray(3).map((index) => {
        return (
          <li key={index} className={styles['abilities-item']}>
            <input
              type="text"
              value={item.習得特技[index]}
              onChange={(e) => {
                setter((prev) => {
                  const next: [string, string, string] = [...prev.習得特技];
                  next[index] = e.target.value;
                  return {
                    ...prev,
                    習得特技: next,
                  };
                });
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
