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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { Dispatch, SetStateAction, useCallback } from 'react';

export interface Props<T extends { id: string }> {
  items: string[] | T[];
  onDragEnd: (event: DragEndEvent) => void;
  children: React.ReactNode;
}

export default function VerticallySortable<T extends { id: string }>({ items, onDragEnd, children }: Props<T>) {
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

export function useOnDragEnd<T extends { id: string }>(setter: Dispatch<SetStateAction<T[]>>) {
  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) {
        return;
      }
      if (active.id !== over.id) {
        setter((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    },
    [setter],
  );
  return onDragEnd;
}
