import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dispatch, SetStateAction } from 'react';
import { dataFlags, genericMemo } from '../../commons/react-util';
import DragHandle from './drag-handle';
import styles from './sortable-list-table.module.scss';
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
      <ol className={styles.list}>
        {items.map((item, index) => (
          <Row key={item.id} item={item} index={index} render={render} />
        ))}
      </ol>
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
    <li ref={setNodeRef} {...dataFlags({ dragging: isDragging })} className={styles.item} style={style}>
      {render(item, index, { isDragging })}
      <DragHandle ref={setActivatorNodeRef} {...attributes} {...listeners} />
    </li>
  );
});
