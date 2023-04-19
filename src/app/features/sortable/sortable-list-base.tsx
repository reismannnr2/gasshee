import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DraggableAttributes,
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
import { useCallback, useMemo } from 'react';
import { rangeArray } from '../../common/functions/generate-fns';
import { customFlags, genericMemo, maybe } from '../../common/functions/react-util';
import { Setter } from '../../common/types';
import styles from './sortable-list-base.module.scss';

type Listeners = ReturnType<typeof useSortable>['listeners'];
export type DragHandle = {
  ref: (e: HTMLElement | null) => void;
  attributes: DraggableAttributes;
  listeners: Listeners;
};

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
  children: (item: T, drag: DragHandle, setter: Setter<T>) => React.ReactNode;
  disableSort?: boolean;
};

export default function SortableListBase<T extends { id: string }>({ items, setter, children, disableSort }: Props<T>) {
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
  const setters = useMemo(
    () =>
      rangeArray(items.length).map(
        (index): Setter<T> =>
          (transform) =>
            setter((prev) => prev.map((item, i) => (i === index ? transform(item) : item))),
      ),
    [setter, items.length],
  );

  return (
    <Context items={items} onDragEnd={onDragEnd}>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <Row
            key={item.id}
            disableSort={disableSort}
            item={item}
            renderItem={children}
            // items.length をチェックしてからmapしているので、setters[index]は必ず存在する
            setter={setters[index] as Setter<T>}
          />
        ))}
      </ol>
    </Context>
  );
}

interface RowProps<T extends { id: string }> {
  item: T;
  renderItem: (item: T, drag: DragHandle, setter: Setter<T>) => React.ReactNode;
  disableSort?: boolean;
  setter: Setter<T>;
}

const Row = genericMemo(function Row<T extends { id: string }>({ item, renderItem, disableSort, setter }: RowProps<T>) {
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
      {renderItem(item, { ref: setActivatorNodeRef, attributes, listeners }, setter)}
    </li>
  );
});
