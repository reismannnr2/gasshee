import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import { createListOnChange } from '../../commons/input-util';
import { rangeArray } from '../../commons/range-util';
import AnimateHeight from '../../components/animation/animate-height';
import ControlButtons from '../../components/sortable/control-buttons';
import HeadRow from '../../components/sortable/head-row';
import SortableListTable, { UseRender } from '../../components/sortable/sortable-list-table';
import styles from './ability-table.module.scss';

export interface Ability {
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

const mockBase: Ability = {
  id: '',
  name: '',
  level: 1,
  kind: '',
  skill: '',
  required: '',
  timing: '',
  target: '',
  range: '',
  cost: '',
  limit: '',
  source: '',
  text: '',
};

const createMock = () => ({ ...mockBase, id: nanoid() });
const mock: Ability[] = rangeArray(4).map(createMock);

export default function AbilityTable() {
  const [items, setItems] = useState<Ability[]>(mock);
  const render = useRender(setItems);
  return (
    <AnimateHeight>
      <div className={styles.container}>
        <ControlButtons setter={setItems} initialize={createMock} />
        <HeadRow titles={Object.keys(mockBase).slice(1, -1)} tag="li">
          {(items) => <ol className={styles.titles}>{items}</ol>}
        </HeadRow>
        <SortableListTable items={items} setter={setItems} render={render} />
      </div>
    </AnimateHeight>
  );
}

const useRender: UseRender<Ability> = (setter) =>
  useCallback(
    (item, index) => (
      <div>
        <div className={styles.content}>
          <input type="text" value={item.name} onChange={createListOnChange(setter, index, 'name', (v) => v)} />
          <input
            type="text"
            value={item.level}
            onChange={createListOnChange(setter, index, 'level', (v) => Number(v))}
          />
          <input type="text" value={item.kind} onChange={createListOnChange(setter, index, 'kind', (v) => v)} />
          <input type="text" value={item.skill} onChange={createListOnChange(setter, index, 'skill', (v) => v)} />
          <input type="text" value={item.required} onChange={createListOnChange(setter, index, 'required', (v) => v)} />
          <input type="text" value={item.timing} onChange={createListOnChange(setter, index, 'timing', (v) => v)} />
          <input type="text" value={item.target} onChange={createListOnChange(setter, index, 'target', (v) => v)} />
          <input type="text" value={item.range} onChange={createListOnChange(setter, index, 'range', (v) => v)} />
          <input type="text" value={item.cost} onChange={createListOnChange(setter, index, 'cost', (v) => v)} />
          <input type="text" value={item.limit} onChange={createListOnChange(setter, index, 'limit', (v) => v)} />
          <input type="text" value={item.source} onChange={createListOnChange(setter, index, 'source', (v) => v)} />
        </div>
        <div>
          <textarea
            className={styles.text}
            value={item.text}
            rows={4}
            onChange={createListOnChange(setter, index, 'text', (v) => v)}
          />
        </div>
      </div>
    ),
    [setter],
  );
