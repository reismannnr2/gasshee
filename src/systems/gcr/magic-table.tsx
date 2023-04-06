import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import { createListOnChange } from '../../commons/input-util';
import { asIs, typedEntries } from '../../commons/object-utils';
import { rangeArray } from '../../commons/range-util';
import { dataFlags } from '../../commons/react-util';
import AnimateHeight from '../../components/animation/animate-height';
import ControlButtons from '../../components/sortable/control-buttons';
import HeadRow from '../../components/sortable/head-row';
import SortableListTable, { UseRender } from '../../components/sortable/sortable-list-table';
import styles from './magic-table.module.scss';
export interface Magic {
  id: string;
  魔法名: string;
  LV: string;
  種別: string;
  持続時間: string;
  技能: string;
  目標値: string;
  タイミング: string;
  対象: string;
  射程: string;
  コスト: string;
  MC: string;
  制限: string;
  出典: string;
  効果: string;
}

const mockBase: Magic = {
  id: '',
  魔法名: '',
  LV: '',
  種別: '',
  持続時間: '',
  技能: '',
  目標値: '',
  タイミング: '',
  対象: '',
  射程: '',
  MC: '',
  コスト: '',
  制限: '',
  出典: '',
  効果: '',
};

const createMock = () => ({ ...mockBase, id: nanoid() });
const mock: Magic[] = rangeArray(1).map(createMock);

export default function MagicTable() {
  const [items, setItems] = useState<Magic[]>(mock);
  const [abbr, setAbbr] = useState<boolean>(true);
  const render = useRender(setItems);
  return (
    <AnimateHeight>
      <div className={styles.container} {...dataFlags({ abbr })}>
        <ControlButtons setter={setItems} initialize={createMock} abbr={{ value: abbr, setter: setAbbr }} />
        <HeadRow titles={Object.keys(mockBase).slice(1, -1)} tag="li">
          {(items) => <ol className={styles.titles}>{items}</ol>}
        </HeadRow>
        <SortableListTable items={items} setter={setItems} render={render} />
      </div>
    </AnimateHeight>
  );
}

const useRender: UseRender<Magic> = (setter) =>
  useCallback(
    (item, index) => (
      <div>
        <div className={styles.content}>
          {typedEntries(item)
            .slice(1, -1)
            .map(([key, value]) => (
              <input key={key} type="text" value={value} onChange={createListOnChange(setter, index, key, asIs)} />
            ))}
        </div>
        <div className={styles.detail}>
          <textarea
            className={styles.text}
            value={item.効果}
            rows={3}
            onChange={createListOnChange(setter, index, '効果', asIs)}
          />
        </div>
      </div>
    ),
    [setter],
  );
