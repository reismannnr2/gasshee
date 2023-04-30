import { atom } from 'jotai';
import SortableList, { ListDef, RowDef } from '../../../features/sortable/sortable-list';
import {
  GrowthItem,
  addNewGrowthAtom,
  growthDescriptionFamily,
  growthFamily,
  growthListAtom,
  removeLastGrowthAtom,
  setGrowthListAtom,
  updateGrowthDescriptionFamily,
  updateGrowthFamily,
} from '../states/misc';

import styles from './growth-list.module.scss';

export default function GrowthList() {
  return (
    <SortableList
      add={add}
      detailsDef={detailsDef}
      from={from}
      layout={layout}
      listDef={listDef}
      remove={remove}
      to={to}
    />
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

type From = typeof from;
type To = typeof to;

const listDef: ListDef<GrowthItem, From, To> = {
  from: (from: From) => from.growthListAtom,
  to: (to: To) => to.setGrowthListAtom,
};

const detailsDef: RowDef<GrowthItem, From, To, string> = {
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
          };
        }),
    },
  ],
  args: (item: GrowthItem) => atom(item.id),
};

const add = (to: To) => to.addNewGrowthAtom;
const remove = (to: To) => to.removeLastGrowthAtom;
