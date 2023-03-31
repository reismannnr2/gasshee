import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import { createListOnChange } from '../../commons/input-util';
import AnimateHeight from '../../components/animation/animate-height';
import HeadRow from '../../components/sortable/head-row';
import SortableListTable, { UseRender } from '../../components/sortable/sortable-list-table';
import styles from './skill-modification-table.module.scss';

interface SkillModification {
  id: string;
  skill: string;
  base: string;
  dice: number;
  fixed: number;
  text: string;
}

const mock: SkillModification[] = [
  { id: nanoid(), skill: 'xxx', base: 'str', dice: 0, fixed: 1, text: '' },
  { id: nanoid(), skill: 'yyy', base: 'int', dice: 1, fixed: 2, text: '' },
  { id: nanoid(), skill: 'zzz', base: 'str', dice: 1, fixed: 2, text: '' },
  { id: nanoid(), skill: '', base: 'dex', dice: 0, fixed: 0, text: '' },
];

const titles = ['skill', 'stat', 'dice', 'fixed', 'chat', 'text'];

export default function SkillModificationTable() {
  const [items, setItems] = useState(mock);
  const render = useRender(setItems);
  return (
    <AnimateHeight>
      <div className={styles['button-container']}>
        <button
          type="button"
          onClick={() =>
            setItems((prev) => prev.concat({ id: nanoid(), skill: '', base: 'dex', dice: 0, fixed: 0, text: '' }))
          }
        >
          +
        </button>
        <button type="button" onClick={() => setItems((prev) => prev.slice(0, -1))}>
          -
        </button>
      </div>
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
          <input type="text" value={item.skill} onChange={createListOnChange(setter, index, 'skill', (v) => v)} />
          <input type="text" value={item.base} onChange={createListOnChange(setter, index, 'base', (v) => v)} />
          <input type="text" value={item.dice} onChange={createListOnChange(setter, index, 'dice', (v) => Number(v))} />
          <input
            type="text"
            value={item.fixed}
            onChange={createListOnChange(setter, index, 'fixed', (v) => Number(v))}
          />
          <input type="text" value={`${2 + item.dice}D+${7 + item.fixed}`} readOnly />
          <input
            className="long"
            type="text"
            value={item.text}
            onChange={createListOnChange(setter, index, 'text', (v) => v)}
          />
        </div>
      );
    },
    [setter],
  );
