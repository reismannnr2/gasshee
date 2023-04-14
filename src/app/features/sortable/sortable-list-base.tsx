import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCallback } from 'react';
import { customFlags, genericMemo, maybe } from '../../common/functions/react-util';
import { Setter } from '../../common/types';
import styles from './sortable-list-base.module.scss';
import { RenderSortableItem } from './types';

type ContextProps<T extends { id: string }> = {
  items: T[];
  children?: React.ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
};

function Context<T extends { id: string }>({ items, children, onDragEnd }: ContextProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  return (
    <DndContext collisionDetection={closestCenter} sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export type Props<T extends { id: string }> = {
  items: T[];
  setter: Setter<T[]>;
  renderItem: RenderSortableItem<T>;
  disableSort?: boolean;
};

export default function SortableListBase<T extends { id: string }>({
  items,
  setter,
  renderItem,
  disableSort,
}: Props<T>) {
  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) {
        return;
      }
      setter((items) => {
        const prev = items.findIndex((item) => item.id === active.id);
        const next = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, prev, next);
      });
    },
    [setter],
  );

  return (
    <Context items={items} onDragEnd={onDragEnd}>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <Row key={item.id} disableSort={disableSort} index={index} item={item} renderItem={renderItem} />
        ))}
      </ol>
    </Context>
  );
}

interface RowProps<T extends { id: string }> {
  item: T;
  index: number;
  renderItem: RenderSortableItem<T>;
  disableSort?: boolean;
}

const Row = genericMemo(function Row<T extends { id: string }>({ item, index, renderItem, disableSort }: RowProps<T>) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={maybe(!disableSort, setNodeRef)}
      style={maybe(!disableSort, style)}
      {...customFlags({ dragging: isDragging })}
    >
      {renderItem(item, index, (f) => f(setActivatorNodeRef, attributes, listeners))}
    </li>
  );
});
