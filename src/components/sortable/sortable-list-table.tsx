import { Dispatch, SetStateAction } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import VerticallySortable, { useOnDragEnd } from './vertically-sortable';
import DragHandle from './drag-handle';

export interface Props<T extends { id: string }> {
  items: T[];
  setter: Dispatch<SetStateAction<T[]>>;
  render: Render<T>;
  rowSize: number;
}

export interface Render<T extends { id: string }> {
  (item: T, index: number): React.ReactNode;
}

export default function SortableListTable<T extends { id: string }>({ items, setter, render, rowSize }: Props<T>) {
  const onDragEnd = useOnDragEnd(setter);
  const height = `calc(${rowSize * items.length}rem + ${items.length + 1}px)`;
  return (
    <VerticallySortable items={items} onDragEnd={onDragEnd}>
      <ol>
        {items.map((item, index) => (
          <Row key={item.id} item={item} index={index} render={render} rowSize={rowSize} />
        ))}
      </ol>
      <style jsx>{`
        ol {
          height: ${height};
        }
      `}</style>
      <style jsx>{`
        ol {
          list-style-type: none;
          border: 1px dotted #666;
          overflow: hidden;
          transition: height 0.2s ease-out;
        }
        ol:empty {
          display: none;
        }
      `}</style>
    </VerticallySortable>
  );
}

interface RowProps<T extends { id: string }> {
  item: T;
  index: number;
  render: Render<T>;
  rowSize: number;
}

function Row<T extends { id: string }>({ item, index, render, rowSize }: RowProps<T>) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable(item);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const rowWithBorder = `calc(${rowSize}rem + 1px)`;
  return (
    <li ref={setNodeRef} className={classNames({ dragging: isDragging })} style={style}>
      {render(item, index)}
      <DragHandle ref={setActivatorNodeRef} {...attributes} {...listeners} />
      <style jsx>{`
        li {
          height: ${rowSize}rem;
        }
      `}</style>
      <style jsx>{`
        li {
          display: grid;
          grid-template-columns: 1fr 1rem;

          &:not(:last-of-type) {
            border-bottom: 1px dotted #666;
            height: ${rowWithBorder};
          }

          &.dragging {
            border: 1px dotted #666;
          }
        }
      `}</style>
    </li>
  );
}
