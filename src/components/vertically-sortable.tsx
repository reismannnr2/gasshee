import React, { Dispatch, SetStateAction } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

export interface Props {
  items: string[];
  onDragEnd: (event: DragEndEvent) => void;
  children: React.ReactNode;
}

export function createOnDragEnd<T>(setter: Dispatch<SetStateAction<T[]>>, takeId: (item: T) => string) {
  return function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      return;
    }
    if (active.id !== over.id) {
      setter((items) => {
        const oldIndex = items.findIndex((item) => takeId(item) === active.id);
        const newIndex = items.findIndex((item) => takeId(item) === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
}

export default function VerticallySortable({ items, onDragEnd, children }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
