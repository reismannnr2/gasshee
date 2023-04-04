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
  特技名: string;
  LV: number;
  種別: string;
  技能: string;
  目標値: string;
  タイミング: string;
  対象: string;
  射程: string;
  コスト: string;
  制限: string;
  出典: string;
  効果: string;
}

const mockBase: Ability = {
  id: '',
  特技名: '',
  LV: 1,
  種別: '',
  技能: '',
  目標値: '',
  タイミング: '',
  対象: '',
  射程: '',
  コスト: '',
  制限: '',
  出典: '',
  効果: '',
};

const createMock = () => ({ ...mockBase, id: nanoid() });
const mock: Ability[] = rangeArray(1).map(createMock);

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
          <input type="text" value={item.特技名} onChange={createListOnChange(setter, index, '特技名', (v) => v)} />
          <input type="text" value={item.LV} onChange={createListOnChange(setter, index, 'LV', (v) => Number(v))} />
          <input type="text" value={item.種別} onChange={createListOnChange(setter, index, '種別', (v) => v)} />
          <input type="text" value={item.技能} onChange={createListOnChange(setter, index, '技能', (v) => v)} />
          <input type="text" value={item.目標値} onChange={createListOnChange(setter, index, '目標値', (v) => v)} />
          <input
            type="text"
            value={item.タイミング}
            onChange={createListOnChange(setter, index, 'タイミング', (v) => v)}
          />
          <input type="text" value={item.対象} onChange={createListOnChange(setter, index, '対象', (v) => v)} />
          <input type="text" value={item.射程} onChange={createListOnChange(setter, index, '射程', (v) => v)} />
          <input type="text" value={item.コスト} onChange={createListOnChange(setter, index, 'コスト', (v) => v)} />
          <input type="text" value={item.制限} onChange={createListOnChange(setter, index, '制限', (v) => v)} />
          <input type="text" value={item.出典} onChange={createListOnChange(setter, index, '出典', (v) => v)} />
        </div>
        <div>
          <textarea
            className={styles.text}
            value={item.効果}
            rows={3}
            onChange={createListOnChange(setter, index, '効果', (v) => v)}
          />
        </div>
      </div>
    ),
    [setter],
  );
