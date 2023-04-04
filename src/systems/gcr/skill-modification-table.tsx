import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import { createListOnChange } from '../../commons/input-util';
import { asIs } from '../../commons/object-utils';
import AnimateHeight from '../../components/animation/animate-height';
import ControlButtons from '../../components/sortable/control-buttons';
import HeadRow from '../../components/sortable/head-row';
import SortableListTable, { UseRender } from '../../components/sortable/sortable-list-table';
import styles from './skill-modification-table.module.scss';

interface SkillModification {
  id: string;
  技能: string;
  能力値: string;
  ダイス: string;
  固定値: string;
  備考: string;
}

const mock: SkillModification[] = [
  { id: nanoid(), 技能: 'xxx', 能力値: 'str', ダイス: '', 固定値: '', 備考: '' },
  { id: nanoid(), 技能: 'yyy', 能力値: 'int', ダイス: '', 固定値: '', 備考: '' },
  { id: nanoid(), 技能: 'zzz', 能力値: 'str', ダイス: '', 固定値: '', 備考: '' },
  { id: nanoid(), 技能: '', 能力値: '', ダイス: '', 固定値: '', 備考: '' },
];
const createMock = (): SkillModification => ({ id: nanoid(), 技能: '', 能力値: '', ダイス: '', 固定値: '', 備考: '' });

const titles = ['技能', '能力値', 'ダイス', '固定値', '判定値', '備考'];

export default function SkillModificationTable() {
  const [items, setItems] = useState(mock.slice(0, 1));
  const render = useRender(setItems);
  return (
    <AnimateHeight>
      <ControlButtons setter={setItems} initialize={createMock} />
      <div className={styles['list-container']}>
        <HeadRow titles={titles} tag="li">
          {(items) => <ol className={styles.titles}>{items}</ol>}
        </HeadRow>
        <SortableListTable items={items} setter={setItems} render={render} />
      </div>
    </AnimateHeight>
  );
}

const useRender: UseRender<SkillModification> = (setter) =>
  useCallback(
    (item, index) => {
      return (
        <div className={styles.content}>
          <input type="text" value={item.技能} onChange={createListOnChange(setter, index, '技能', asIs)} />
          <input type="text" value={item.能力値} onChange={createListOnChange(setter, index, '能力値', asIs)} />
          <input type="text" value={item.ダイス} onChange={createListOnChange(setter, index, 'ダイス', asIs)} />
          <input type="text" value={item.固定値} onChange={createListOnChange(setter, index, '固定値', asIs)} />
          <input type="text" value={`${2 + Number(item.ダイス) || 0}D+${7 + (Number(item.固定値) || 0)}`} readOnly />
          <input
            className="long"
            type="text"
            value={item.備考}
            onChange={createListOnChange(setter, index, '備考', asIs)}
          />
        </div>
      );
    },
    [setter],
  );
