import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import { rangeArray } from '../../commons/range-util';
import { dataFlags } from '../../commons/react-util';
import AnimateHeight from '../../components/animation/animate-height';
import ControlButtons from '../../components/sortable/control-buttons';
import HeadRow from '../../components/sortable/head-row';
import SortableListTable, { UseRender } from '../../components/sortable/sortable-list-table';
import styles from './armie-table.module.scss';
interface Armie {
  id: string;
  名称: string;
  LV: string;

  HP: string;
  攻撃: string;

  武器: string;
  炎熱: string;
  衝撃: string;
  体内: string;

  筋力: string;
  反射: string;
  感覚: string;
  知力: string;
  精神: string;
  共感: string;

  行動: string;
  移動: string;

  備考: string;
}

interface ArmieAbility {
  id: string;
  特技名: string;
  LV: string;
  種別: string;
  技能: string;
  目標値: string;
  タイミング: string;
  対象: string;
  射程: string;
  コスト: string;
  制限: string;
  効果: string;
}

export default function ArmieTable() {
  return (
    <>
      <ArmieAbilityTable />
    </>
  );
}

const mockBase: ArmieAbility = {
  id: '',
  特技名: '',
  LV: '',
  種別: '',
  技能: '',
  目標値: '',
  タイミング: '',
  対象: '',
  射程: '',
  コスト: '',
  制限: '',
  効果: '',
};
const createMock = (): ArmieAbility => ({ ...mockBase, id: nanoid() });
const mock: ArmieAbility[] = rangeArray(1).map(createMock);

function ArmieAbilityTable() {
  const [items, setItems] = useState<ArmieAbility[]>(mock);
  const [abbr, setAbbr] = useState<boolean>(true);
  const render = useRender(setItems);
  return (
    <AnimateHeight>
      <div className={styles.container} {...dataFlags({ abbr })}>
        <ControlButtons setter={setItems} initialize={createMock} abbr={{ value: abbr, setter: setAbbr }} />
        <HeadRow titles={Object.keys(mockBase).slice(1, -1)} tag="li">
          {(items) => <ol className={styles.titles}>{items}</ol>}
        </HeadRow>
        <SortableListTable items={items} setter={setItems} render={render} />
      </div>
    </AnimateHeight>
  );
}

const useRender: UseRender<ArmieAbility> = (setter) => useCallback((item, index) => <div></div>, []);
