import clsx from 'clsx';
import { ChangeEvent, useCallback, useState } from 'react';
import Maybe from '../../common/components/maybe';
import MaybeWith from '../../common/components/maybe-with';
import { customFlags, maybe } from '../../common/functions/react-util';
import { typedEntries } from '../../common/functions/strictly-typed';
import { Setter } from '../../common/types';
import { useAnimateHeight } from '../animation/use-animate-height';
import UserInput, { InputDef } from '../input/user-input';
import Controller from './controller';
import styles from './simple-table-list.module.scss';
import SortableListBase from './sortable-list-base';
import { RenderSortableItem } from './types';

export type Props<T extends { id: string }> = {
  defs: InputDef<T>[];
  grids: string;
  initialize: () => T;
  detailsKey?: keyof T;
  unchecked?: string[];
  disableSort?: boolean;
};

export default function SortableList<T extends { id: string }>({
  defs,
  grids,
  initialize,
  detailsKey,
  unchecked,
  disableSort,
}: Props<T>) {
  const [items, setter] = useState<T[]>(() => [initialize()]);
  const [abbreviated, setAbbreviated] = useState(false);
  const abbreviate = maybe(detailsKey, {
    value: abbreviated,
    setter: setAbbreviated,
  });
  const { innerRef, outerRef, className: animate } = useAnimateHeight();
  const confirm = shouldConfirmToDelete(items, unchecked);
  const renderItem = useRenderItem({ defs, grids, setter, detailsKey });

  return (
    <div className={styles['simple-table-list']}>
      <Controller abbreviate={abbreviate} confirmToDelete={confirm} initialize={initialize} setter={setter} />
      <div ref={outerRef} className={clsx(styles.table, animate)}>
        <div ref={innerRef} {...customFlags({ abbreviated })}>
          <HeadRow grids={grids} titles={defs.map((def) => def.title)} />
          <SortableListBase disableSort={disableSort} items={items} renderItem={renderItem} setter={setter} />
        </div>
      </div>
    </div>
  );
}

type RenderItemArgs<T> = {
  defs: InputDef<T>[];
  grids: string;
  setter: Setter<T[]>;
  detailsKey?: keyof T;
  disableSort?: boolean;
};

function useRenderItem<T extends { id: string }>({
  defs,
  grids,
  setter,
  detailsKey,
  disableSort,
}: RenderItemArgs<T>): RenderSortableItem<T> {
  return useCallback(
    (item, index, dragHandle) => (
      <div className={styles['content-container']}>
        <div className={styles.content}>
          <ul className={clsx(styles['content-list'], grids)}>
            {defs.map((def) => (
              <li key={def.title}>
                <UserInput
                  def={def}
                  item={item}
                  setter={(transform) =>
                    setter((prev) => {
                      const item = prev[index];
                      if (!item) {
                        return prev;
                      }
                      const next = prev.slice();
                      const nextItem = transform(item);
                      next[index] = nextItem;
                      return next;
                    })
                  }
                />
              </li>
            ))}
          </ul>
          {
            <MaybeWith test={detailsKey}>
              {(key) => (
                <div className={styles.details}>
                  <textarea
                    data-key={key}
                    rows={3}
                    value={String(item[key])}
                    onChange={createOnChange(setter, index, key)}
                  />
                </div>
              )}
            </MaybeWith>
          }
        </div>
        <div className={styles['handle-container']}>
          {dragHandle((ref, attributes, listeners) => (
            <Maybe test={!disableSort}>
              <button ref={ref} type="button" {...attributes} {...listeners}>
                {disableSort ? '' : '::'}
              </button>
            </Maybe>
          ))}
        </div>
        <div className={styles['dragging-border']} />
      </div>
    ),
    [setter, defs, detailsKey, grids, disableSort],
  );
}

function HeadRow({ grids, titles }: { grids: string; titles: string[] }) {
  return (
    <div className={styles['head-contaienr']}>
      <ul className={clsx(styles['head-list'], grids)}>
        {titles.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>
      <div />
    </div>
  );
}

function createOnChange<T extends { id: string; [k: string]: string }>(
  setter: Setter<T[]>,
  index: number,
  key: keyof T,
) {
  return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter((prev) => {
      const next = prev.slice();
      const item = prev[index];
      if (!item) {
        return prev;
      }
      next[index] = { ...item, [key]: e.target.value };
      return next;
    });
  };
}

function shouldConfirmToDelete<T>(items: T[], unchecked: string[] = []) {
  const last = items.at(-1);
  if (!last) {
    return false;
  }
  return typedEntries(last).some(([key, value]) => key !== 'id' && !unchecked.includes(key as string) && value);
}
