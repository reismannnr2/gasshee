import { useState } from 'react';
import { createObjectOnChange } from '../../commons/input-util';
import { asIs, typedEntries } from '../../commons/object-utils';
import HeadRow from '../../components/sortable/head-row';
import ArmieAbilityTable from './armie-ability-table';
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

export default function ArmieTable() {
  return (
    <div>
      <ArmieBaseTable />
      <ArmieAbilityTable />
    </div>
  );
}

const mockBase: Armie = {
  id: '',
  名称: '',
  LV: '',
  HP: '',
  攻撃: '',
  武器: '',
  炎熱: '',
  衝撃: '',
  体内: '',
  筋力: '',
  反射: '',
  感覚: '',
  知力: '',
  精神: '',
  共感: '',
  行動: '',
  移動: '',
  備考: '',
};

function ArmieBaseTable() {
  const [data, setData] = useState(mockBase);
  return (
    <div className={styles.container}>
      <HeadRow tag="li" titles={Object.keys(data).slice(1, -1)}>
        {(children) => <ol className={styles.titles}>{children}</ol>}
      </HeadRow>
      <div className={styles['content-wrap']}>
        <div className={styles.content}>
          {typedEntries(data)
            .slice(1, -1)
            .map(([key, value]) => (
              <input key={key} value={value} onChange={createObjectOnChange(setData, key, asIs)} />
            ))}
        </div>
        <div />
      </div>
    </div>
  );
}
