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
import styles from './ability-table.module.scss';
export interface Ability {
  id: string;
  特技名: string;
  LV: string;
  種別: string;
  技能: string;
  目標値: string;
  タイミング: string;
  対象: string;
  射程: string;
  MC: string;
  コスト: string;
  制限: string;
  出典: string;
  効果: string;
}

const mockBase: Ability = {
  id: '',
  特技名: '',
  LV: '',
  種別: '',
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
const mock: Ability[] = rangeArray(1).map(createMock);

export default function AbilityTable() {
  const [items, setItems] = useState<Ability[]>(mock);
  const [abbr, setAbbr] = useState<boolean>(true);
  const render = useRender(setItems);
  return (
    <AnimateHeight>
      <div className={styles.container} {...dataFlags({ abbr })}>
        <ControlButtons abbr={{ value: abbr, setter: setAbbr }} initialize={createMock} setter={setItems} />
        <HeadRow tag="li" titles={Object.keys(mockBase).slice(1, -1)}>
          {(items) => <ol className={styles.titles}>{items}</ol>}
        </HeadRow>
        <SortableListTable items={items} render={render} setter={setItems} />
      </div>
    </AnimateHeight>
  );
}

const useRender: UseRender<Ability> = (setter) =>
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
            rows={3}
            value={item.効果}
            onChange={createListOnChange(setter, index, '効果', asIs)}
          />
        </div>
      </div>
    ),
    [setter],
  );
