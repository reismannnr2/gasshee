import { nanoid } from 'nanoid';
import { useState } from 'react';
import { rangeArray } from '../../commons/range-util';
import AnimateHeight from '../../components/animation/animate-height';
import SortableListTable from '../../components/sortable/sortable-list-table';

export interface Armor {
  id: string;
  checked: boolean;
  name: string;
  kind: string;
  weight: number;

  weapon: number;
  heat: number;
  impact: number;
  life: number;

  agility: number;
  initiative: number;
  move: number;
  text: string;
}

const mockBase: Armor = {
  id: '',
  checked: true,
  name: '',
  kind: '',
  weight: 1,

  weapon: 2,
  heat: 0,
  impact: 1,
  life: 0,

  agility: 0,
  initiative: 0,
  move: 0,
  text: '',
};
const mock: Armor[] = rangeArray(4).map(() => ({ ...mockBase, id: nanoid() }));
export default function GrowthTable() {
  const [items, setItems] = useState<Armor[]>(mock);
  return (
    <AnimateHeight deps={items}>
      <div>
        <SortableListTable items={items} setter={setItems} render={() => <></>} />
      </div>
    </AnimateHeight>
  );
}
