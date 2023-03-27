import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import { createListOnChange } from '../../commons/input-util';
import AnimateHeight from '../../components/animation/animate-height';
import SortableListTable, { Render } from '../../components/sortable/sortable-list-table';

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

export default function SkillModificationTable() {
  const [items, setItems] = useState(mock);
  const render: Render<SkillModification> = useCallback(
    (item, index) => {
      return (
        <div>
          <input type="text" value={item.skill} onChange={createListOnChange(setItems, index, 'skill', (v) => v)} />
          <input type="text" value={item.base} onChange={createListOnChange(setItems, index, 'base', (v) => v)} />
          <input
            type="text"
            value={item.dice}
            onChange={createListOnChange(setItems, index, 'dice', (v) => Number(v))}
          />
          <input
            type="text"
            value={item.fixed}
            onChange={createListOnChange(setItems, index, 'fixed', (v) => Number(v))}
          />
          <input type="text" value={`${2 + item.dice}D+${7 + item.fixed}`} readOnly />
          <input
            className="long"
            type="text"
            value={item.text}
            onChange={createListOnChange(setItems, index, 'text', (v) => v)}
          />
          <style jsx>{`
            div {
              display: grid;
              grid-template-columns: 6.5rem 3rem 1.5rem 1.5rem 4rem 1fr;
              font-size: 0.75rem;
              height: 100%;

              input {
                padding: 0 0.25rem;
                border-right: 1px dotted #666;
                text-align: center;

                &.long {
                  text-align: left;
                }
              }
              & :global(.drag-handle) {
                font-size: 0.75rem;
              }
            }
          `}</style>
        </div>
      );
    },
    [setItems],
  );
  return (
    <AnimateHeight deps={items}>
      <div className="button-container">
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
      <SortableListTable items={items} setter={setItems} render={render} />
      <style jsx>{`
        .button-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 1rem;
          width: 10rem;
          margin-bottom: 0.25rem;

          font-size: 0.75rem;

          button {
            &:hover {
              background-color: #ddd;
            }
          }
        }
      `}</style>
    </AnimateHeight>
  );
}
