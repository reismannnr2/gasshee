import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import { createListOnChange } from '../../commons/input-util';
import { asIs } from '../../commons/object-utils';
import { rangeArray } from '../../commons/range-util';
import AnimateHeight from '../../components/animation/animate-height';
import ControlButtons from '../../components/sortable/control-buttons';
import HeadRow from '../../components/sortable/head-row';
import SortableListTable, { UseRender } from '../../components/sortable/sortable-list-table';
import styles from './armor-table.module.scss';
export interface Armor {
  id: string;
  適用: boolean;
  名称: string;
  種別: string;
  重さ: string;

  武器: string;
  炎熱: string;
  衝撃: string;
  体内: string;

  回避: string;
  行動: string;
  移動: string;
  備考: string;
}

const mockBase: Armor = {
  id: '',
  適用: true,
  名称: '',
  種別: '',
  重さ: '',

  武器: '',
  炎熱: '',
  衝撃: '',
  体内: '',

  回避: '',
  行動: '',
  移動: '',

  備考: '',
};
const createMock = () => ({ ...mockBase, id: nanoid() });
const mock: Armor[] = rangeArray(1).map(createMock);

export default function ArmorTable() {
  const [items, setItems] = useState<Armor[]>(mock);
  return (
    <AnimateHeight>
      <ControlButtons setter={setItems} initialize={createMock} />
      <HeadRow titles={Object.keys(mockBase).slice(2)} tag="li">
        {(children) => (
          <ol className={styles.titles}>
            <li />
            {children}
          </ol>
        )}
      </HeadRow>
      <SortableListTable items={items} setter={setItems} render={useRender(setItems)} />
    </AnimateHeight>
  );
}

const useRender: UseRender<Armor> = (setter) =>
  useCallback(
    (item, index) => (
      <div className={styles.content}>
        <input type="checkbox" />
        <input type="text" value={item.名称} onChange={createListOnChange(setter, index, '名称', asIs)} />
        <input type="text" value={item.種別} onChange={createListOnChange(setter, index, '種別', asIs)} />
        <input type="text" value={item.重さ} onChange={createListOnChange(setter, index, '重さ', asIs)} />
        <input type="text" value={item.武器} onChange={createListOnChange(setter, index, '武器', asIs)} />
        <input type="text" value={item.炎熱} onChange={createListOnChange(setter, index, '炎熱', asIs)} />
        <input type="text" value={item.衝撃} onChange={createListOnChange(setter, index, '衝撃', asIs)} />
        <input type="text" value={item.体内} onChange={createListOnChange(setter, index, '体内', asIs)} />
        <input type="text" value={item.回避} onChange={createListOnChange(setter, index, '回避', asIs)} />
        <input type="text" value={item.行動} onChange={createListOnChange(setter, index, '行動', asIs)} />
        <input type="text" value={item.移動} onChange={createListOnChange(setter, index, '移動', asIs)} />
        <input
          className="long"
          type="text"
          value={item.備考}
          onChange={createListOnChange(setter, index, '備考', asIs)}
        />
      </div>
    ),
    [setter],
  );
