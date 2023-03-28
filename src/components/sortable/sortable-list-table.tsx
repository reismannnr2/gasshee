import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { genericMemo } from '../../commons/react-util';
import DragHandle from './drag-handle';
import VerticallySortable, { useOnDragEnd } from './vertically-sortable';

export interface Props<T extends { id: string }> {
  items: T[];
  setter: Dispatch<SetStateAction<T[]>>;
  render: Render<T>;
}

export interface RenderOption {
  isDragging?: boolean;
}

export type Render<T extends { id: string }> = (item: T, index: number, option: RenderOption) => React.ReactNode;

export type UseRender<T extends { id: string }> = (setter: Dispatch<SetStateAction<T[]>>) => Render<T>;

export default function SortableListTable<T extends { id: string }>({ items, setter, render }: Props<T>) {
  const onDragEnd = useOnDragEnd(setter);
  return (
    <VerticallySortable items={items} onDragEnd={onDragEnd}>
      <ol>
        {items.map((item, index) => (
          <Row key={item.id} item={item} index={index} render={render} />
        ))}
      </ol>
      <style jsx>{`
        ol {
          list-style-type: none;
          border: 1px dotted #666;
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
}

const Row = genericMemo(function Row<T extends { id: string }>({ item, index, render }: RowProps<T>) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable(item);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li ref={setNodeRef} className={classNames({ dragging: isDragging })} style={style}>
      {render(item, index, { isDragging })}
      <DragHandle ref={setActivatorNodeRef} {...attributes} {...listeners} />
      <style jsx>{`
        li {
          display: grid;
          grid-template-columns: 1fr 1rem;

          &:not(:last-of-type) {
            border-bottom: 1px dotted #666;
          }

          &.dragging {
            border: 1px dotted #666;
          }
        }
      `}</style>
    </li>
  );
});
