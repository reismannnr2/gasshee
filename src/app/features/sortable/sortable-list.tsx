import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { Atom, WritableAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';
import Maybe from '../../common/components/maybe';
import MaybeWith from '../../common/components/maybe-with';
import { customFlags, maybe } from '../../common/functions/react-util';
import { Setter } from '../../common/types';
import { useAnimateHeight } from '../animation/use-animate-height';
import UserInput, { InputDef } from '../user-input/user-input';
import styles from './sortable-list.module.scss';

export type Props<T extends { id: string }, From, To, Args> = {
  layout?: string;
  listDef: ListDef<T, From, To>;
  rowDef: RowDef<T, From, To, Args>;
  detailsDef?: RowDef<T, From, To, Args>;
  disableSort?: boolean;
  disableAdd?: boolean;
  abbreviatedOnStart?: boolean;
  from: From;
  to: To;
  add: (to: To) => WritableAtom<unknown, [], void>;
  remove: (to: To) => WritableAtom<unknown, [], void>;
};

export type ListDef<T extends { id: string }, From, To> = {
  from: (from: From) => Atom<T[]>;
  to: (to: To) => WritableAtom<unknown, [(prev: T[]) => T[]], void>;
};

export type RowDef<T extends { id: string }, From, To, Args> = {
  inputDefs: InputDef<From, To, Args>[];
  args: (item: T) => Atom<Args>;
};

export default function SortableList<T extends { id: string }, From, To, Args>({
  layout,
  listDef,
  rowDef,
  detailsDef,
  disableSort,
  disableAdd,
  abbreviatedOnStart,
  from,
  to,
  add,
  remove,
}: Props<T, From, To, Args>) {
  const [abbreviated, setAbbreviated] = useState(Boolean(abbreviatedOnStart));
  const abbreviate = maybe(detailsDef, {
    value: abbreviated,
    setter: setAbbreviated,
  });
  const { innerRef, outerRef, className: animate } = useAnimateHeight<HTMLDivElement, HTMLDivElement>(2);
  const items = useAtomValue(listDef.from(from));
  const setItems = useSetAtom(listDef.to(to));
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) {
        return;
      }
      setItems((items) => {
        const prev = items.findIndex((item) => item.id === active.id);
        const next = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, prev, next);
      });
    },
    [setItems],
  );
  return (
    <DndContext collisionDetection={closestCenter} sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className={clsx(styles['sortable-list'], layout)}>
          <Controller abbreviate={abbreviate} add={add} disableAdd={disableAdd} remove={remove} to={to} />
          <div ref={outerRef} className={clsx(styles.table, animate)}>
            <div ref={innerRef}>
              <HeadRow titles={rowDef.inputDefs.map((def) => def.title)} />
              <ul className={styles.items} {...customFlags({ abbreviated })}>
                {items.map((item) => (
                  <Row
                    key={item.id}
                    abbreviated={abbreviated}
                    detailsDef={detailsDef}
                    disableSort={disableSort}
                    from={from}
                    item={item}
                    rowDef={rowDef}
                    to={to}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}

type RowProps<T extends { id: string }, From, To, Args> = {
  item: T;
  rowDef: RowDef<T, From, To, Args>;
  detailsDef?: RowDef<T, From, To, Args>;
  disableSort?: boolean;
  abbreviated: boolean;
  from: From;
  to: To;
};

function Row<T extends { id: string }, From, To, Args>({
  item,
  rowDef,
  detailsDef,
  disableSort,
  abbreviated,
  from,
  to,
}: RowProps<T, From, To, Args>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging: dragging,
  } = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const args = useAtomValue(rowDef.args(item));
  return (
    <li ref={maybe(!disableSort, setNodeRef)} style={maybe(!disableSort, style)} {...customFlags({ dragging })}>
      <div className={styles['content-container']}>
        <div className={styles.content}>
          <ul className={styles['content-list']}>
            {rowDef.inputDefs.map((inputDef) => (
              <li key={inputDef.id || inputDef.title}>
                <UserInput args={args} def={inputDef} from={from} to={to} />
              </li>
            ))}
          </ul>
          <MaybeWith test={detailsDef}>
            {(detailsDef) => (
              <div className={styles.details} {...customFlags({ abbreviated })}>
                <ul className={styles['details-list']}>
                  {detailsDef.inputDefs.map((inputDef) => (
                    <li key={inputDef.id || inputDef.title}>
                      <UserInput args={args} def={inputDef} from={from} to={to} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </MaybeWith>
        </div>
        <div className={styles['handle-container']}>
          <Maybe test={!disableSort}>
            <button ref={setActivatorNodeRef} type="button" {...attributes} {...listeners}>
              ::
            </button>
          </Maybe>
        </div>
        <div className={styles['dragging-border']} />
      </div>
    </li>
  );
}

type ControllerProps<To> = {
  add: (to: To) => WritableAtom<unknown, [], void>;
  remove: (to: To) => WritableAtom<unknown, [], void>;
  abbreviate?: {
    value: boolean;
    setter: Setter<boolean>;
  };
  to: To;
  disableAdd?: boolean;
};

function Controller<To>({ add, remove, abbreviate, to, disableAdd }: ControllerProps<To>) {
  const addItem = useSetAtom(add(to));
  const removeItem = useSetAtom(remove(to));
  return (
    <menu className={styles.controller} {...customFlags({ 'disable-add': disableAdd })}>
      {
        <Maybe test={!disableAdd}>
          <li>
            <button className={styles['controller-button']} type="button" onClick={addItem}>
              +
            </button>
          </li>
          <li>
            <button className={styles['controller-button']} type="button" onClick={removeItem}>
              -
            </button>
          </li>
        </Maybe>
      }
      {
        <MaybeWith test={abbreviate}>
          {(abbreviate) => (
            <li>
              <button
                className={styles['controller-button']}
                type="button"
                onClick={() => abbreviate.setter((prev) => !prev)}
              >
                <span className={clsx({ [styles.hide]: !abbreviate.value })}>詳細を表示</span>
                <span className={clsx({ [styles.hide]: abbreviate.value })}>省略する</span>
              </button>
            </li>
          )}
        </MaybeWith>
      }
    </menu>
  );
}

function HeadRow({ titles }: { titles: string[] }) {
  return (
    <div className={styles['head-contaienr']}>
      <ul className={clsx(styles['head-list'])}>
        {titles.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>
      <div />
    </div>
  );
}
