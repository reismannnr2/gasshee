import { useState } from 'react';
import { rangeArray } from '../../commons/range-util';
interface StatsGrowth {
  筋力: boolean;
  反射: boolean;
  感覚: boolean;
  知力: boolean;
  精神: boolean;
  共感: boolean;
}

interface Growth {
  LV: number;
  能力成長: StatsGrowth;
  クラス特技: [string, string];
  ワークス特技: string;
}

export default function GrowthTable() {
  const [items, setItems] = useState<Growth[]>([]);
  return (
    <ol>
      {rangeArray(3)
        .map((v) => v + 2)
        .map((v) => (
          <Row key={v} />
        ))}
    </ol>
  );
}

function Row() {
  return null;
}
