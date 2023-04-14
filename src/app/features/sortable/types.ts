import { DraggableAttributes } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';

type Listeners = ReturnType<typeof useSortable>['listeners'];

export type RenderSortableItem<T extends { id: string }> = (
  item: T,
  index: number,
  dragHandle: (
    f: (ref: (e: HTMLElement | null) => void, attributes: DraggableAttributes, listeners: Listeners) => React.ReactNode,
  ) => React.ReactNode,
) => React.ReactNode;
