import { useMemo, useState } from 'react';
import HeadRow from '../../components/sortable/head-row';
import AnimateHeight from '../animation/animate-height';
import styles from './animated-sortable-list-table.module.scss';
import ControlButtons from './control-buttons';
import SortableListTable, { UseRender } from './sortable-list-table';

export interface Props<T extends { id: string }> {
  abbreviation?: boolean;
  slice?: [number, number?];
  initialize: () => T;
  useRender: UseRender<T>;
}

export default function AnimatedSortableListTable<T extends { id: string }>({
  abbreviation,
  slice,
  initialize,
  useRender,
}: Props<T>) {
  const [items, setItems] = useState<T[]>(() => [initialize()]);
  const [abbreviated, setabbreviated] = useState<boolean>(true);
  const base = useMemo(initialize, [initialize]);
  const abbr = abbreviation
    ? {
        value: abbreviated,
        setter: setabbreviated,
      }
    : undefined;
  const sliceIndex = slice ? [slice[0], slice[1]] : [1];
  const render = useRender(setItems);
  return (
    <AnimateHeight>
      <div className={styles.container}>
        <ControlButtons abbr={abbr} initialize={initialize} setter={setItems} />
        <HeadRow tag="li" titles={Object.keys(base).slice(...sliceIndex)}>
          {(items) => <ol className={styles.titles}>{items}</ol>}
        </HeadRow>
        <SortableListTable items={items} render={render} setter={setItems}></SortableListTable>
      </div>
    </AnimateHeight>
  );
}
