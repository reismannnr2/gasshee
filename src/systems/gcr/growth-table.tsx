import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import { dataFlags } from '../../commons/react-util';
import AnimateHeight from '../../components/animation/animate-height';
import ControlButtons from '../../components/sortable/control-buttons';
import HeadRow from '../../components/sortable/head-row';
import SortableListTable, { UseRender } from '../../components/sortable/sortable-list-table';
import styles from './growth-table.module.scss';
interface StatsGrowth {
  筋力: boolean;
  反射: boolean;
  感覚: boolean;
  知力: boolean;
  精神: boolean;
  共感: boolean;
}

interface Growth {
  id: string;
  LV: string;
  能力成長: StatsGrowth;
  習得特技: [string, string, string];
  備考: string;
}

const mockBase: Growth = {
  id: '',
  LV: '',
  能力成長: {
    筋力: false,
    反射: false,
    感覚: false,
    知力: false,
    精神: false,
    共感: false,
  },
  習得特技: ['', '', ''],
  備考: '',
};

const createMock = (): Growth => ({
  ...mockBase,
  id: nanoid(),
  能力成長: { ...mockBase.能力成長 },
  習得特技: ['', '', ''],
});

export default function GrowthTable() {
  const [items, setItems] = useState<Growth[]>([]);
  const [abbr, setAbbr] = useState<boolean>(true);
  const render = useRender(setItems);
  return (
    <AnimateHeight>
      <div className={styles.container} {...dataFlags({ abbr })}>
        <ControlButtons abbr={{ value: abbr, setter: setAbbr }} initialize={createMock} setter={setItems} />
        <HeadRow tag="li" titles={Object.keys(mockBase).slice(1, -1)}>
          {(items) => <ol className={styles.titles}>{items}</ol>}
        </HeadRow>
        <SortableListTable items={items} render={render} setter={setItems} />
      </div>
    </AnimateHeight>
  );
}

const useRender: UseRender<Growth> = (setter) => useCallback((item, index) => <div></div>, [setter]);
