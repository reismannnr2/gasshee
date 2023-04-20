import clsx from 'clsx';
import { useState } from 'react';
import { customFlags } from '../../common/functions/react-util';
import { Setter } from '../../common/types';
import { useAnimateHeight } from '../animation/use-animate-height';
import { InputDef } from '../user-input/user-input';
import SortableListBase from './sortable-list-base';
import styles from './sortable-list.module.scss';

export type Props<T extends { id: string }, From, To> = {
  layout?: string;
  inputDefs: InputDef<From, To>[];
  items: (from: From) => T[];
  setter: (to: To) => Setter<T[]>;
  detailsKey?: keyof T;
  unchecked?: string[];
  disableSort?: boolean;
  from: From;
  to: To;
};

export default function SortableList<T extends { id: string }, From, To>({
  layout,
  inputDefs,
  items,
  setter,
  detailsKey,
  unchecked,
  disableSort,
  from,
  to,
}: Props<T, From, To>) {
  const [abbreviated, setAbbreviated] = useState(false);
  const { innerRef, outerRef, className: animate } = useAnimateHeight(2);

  return (
    <div className={styles['sortable-list']}>
      <div ref={outerRef} className={clsx(styles.table, animate)}>
        <div ref={innerRef} {...customFlags({ abbreviated })}>
          <SortableListBase disableSort={disableSort} items={items(from)} setter={setter(to)}>
            {() => <></>}
          </SortableListBase>
        </div>
      </div>
    </div>
  );
}

function HeadRow({ layout, titles }: { layout?: string; titles: string[] }) {
  return (
    <div className={styles['head-contaienr']}>
      <ul className={clsx(styles['head-list'], layout)}>
        {titles.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>
      <div />
    </div>
  );
}
