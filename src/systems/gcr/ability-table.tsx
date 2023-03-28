import { useCallback, useState } from 'react';
import AnimateHeight from '../../components/animation/animate-height';
import SortableListTable, { UseRender } from '../../components/sortable/sortable-list-table';

interface Ability {
  id: string;
  name: string;
  level: number;
  kind: string;
  skill: string;
  required: string;
  timing: string;
  target: string;
  range: string;
  cost: string;
  limit: string;
  source: string;
  text: string;
}

export default function AbilityTable() {
  const [items, setItems] = useState<Ability[]>([]);
  const render = useRender(setItems);
  return (
    <AnimateHeight deps={items}>
      <div className="list-container">
        <SortableListTable items={items} setter={setItems} render={render} />
      </div>
    </AnimateHeight>
  );
}

const useRender: UseRender<Ability> = () => useCallback(() => null, []);
