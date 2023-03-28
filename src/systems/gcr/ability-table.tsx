import { useState } from 'react';
import AnimateHeight from '../../components/animation/animate-height';

interface Ability {
  id: string;
  name: string;
  level: number;
  kind: string;
  skill: string;
  required: string;
  timing: string;
  target: string;
  range: string;
  cost: string;
  source: string;
  text: string;
}

export default function AbilityTable() {
  const [items] = useState<Ability[]>([]);
  return (
    <AnimateHeight deps={items}>
      <div className="list-container"></div>
    </AnimateHeight>
  );
}
