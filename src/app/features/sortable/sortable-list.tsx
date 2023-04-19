import clsx from 'clsx';
import { useState } from 'react';
import Maybe from '../../common/components/maybe';
import MaybeWith from '../../common/components/maybe-with';
import { customFlags, genericMemo, maybe } from '../../common/functions/react-util';
import { typedEntries } from '../../common/functions/strictly-typed';
import { Setter } from '../../common/types';
import { useAnimateHeight } from '../animation/use-animate-height';
import UserInput, { InputDef } from '../user-input/user-input';
import Controller from './controller';
import SortableListBase, { DragHandle } from './sortable-list-base';
import styles from './sortable-list.module.scss';

export type Props<T extends { id: string }, Ex> = {
  defs: InputDef<T, Ex>[];
  grids: string;
  setter: Setter<T[]>;
  items: T[];
  initialize: () => T;
  detailsKey?: keyof T;
  unchecked?: string[];
  disableSort?: boolean;
  ex: Ex;
};

export default function SortableList<T extends { id: string }, I>({
  defs,
  grids,
  initialize,
  setter,
  items,
  detailsKey,
  unchecked,
  disableSort,
  ex,
}: Props<T, I>) {
  const [abbreviated, setAbbreviated] = useState(false);
  const abbreviate = maybe(detailsKey, {
    value: abbreviated,
    setter: setAbbreviated,
  });
  const { innerRef, outerRef, className: animate } = useAnimateHeight(2);
  const confirm = shouldConfirmToDelete(items, unchecked);

  return (
    <div className={styles['simple-table-list']}>
      <Controller abbreviate={abbreviate} confirmToDelete={confirm} initialize={initialize} setter={setter} />
      <div ref={outerRef} className={clsx(styles.table, animate)}>
        <div ref={innerRef} {...customFlags({ abbreviated })}>
          <HeadRow grids={grids} titles={defs.map((def) => def.title)} />
          <SortableListBase disableSort={disableSort} items={items} setter={setter}>
            {(item, drag, setter) => (
              <Row
                key={item.id}
                defs={defs}
                detailsKey={detailsKey}
                disableSort={disableSort}
                drag={drag}
                ex={ex}
                grids={grids}
                item={item}
                setter={setter}
              />
            )}
          </SortableListBase>
        </div>
      </div>
    </div>
  );
}

type RowProps<T extends { id: string }, Ex> = {
  defs: InputDef<T, Ex>[];
  disableSort?: boolean;
  setter: Setter<T>;
  item: T;
  grids: string;
  detailsKey?: keyof T;
  drag: DragHandle;
  ex: Ex;
};

const Row = genericMemo(function Row<T extends { id: string }, Ex>({
  defs,
  disableSort,
  setter,
  item,
  grids,
  detailsKey,
  drag,
  ex,
}: RowProps<T, Ex>) {
  return (
    <div className={styles['content-container']}>
      <div className={styles.content}>
        <ul className={clsx(styles['content-list'], grids)}>
          {defs.map((def) => (
            <li key={def.title}>
              <UserInput def={def} ex={ex} item={item} setter={setter} />
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
                  onChange={(e) => setter((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              </div>
            )}
          </MaybeWith>
        }
      </div>
      <div className={styles['handle-container']}>
        <Maybe test={!disableSort}>
          <button ref={drag.ref} type="button" {...drag.attributes} {...drag.listeners}>
            {disableSort ? '' : '::'}
          </button>
        </Maybe>
      </div>
      <div className={styles['dragging-border']} />
    </div>
  );
});

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

function shouldConfirmToDelete<T>(items: T[], unchecked: string[] = []) {
  const last = items.at(-1);
  if (!last) {
    return false;
  }
  return typedEntries(last).some(([key, value]) => key !== 'id' && !unchecked.includes(key as string) && value);
}
