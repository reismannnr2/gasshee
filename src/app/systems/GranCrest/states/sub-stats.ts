import { atom } from 'jotai';
import { characterLevelAtom } from './base';
import { gcrArmorsAtom } from './items';
import { gcrArmieAtom } from './mc';
import { baseSumAtomFamily, bonusStatAtomFamily, worksStatAtomFamily } from './stats';
export const baseHpAtom = atom((get) => {
  return get(worksStatAtomFamily('筋力')) + get(bonusStatAtomFamily('筋力'));
});
export const baseMpAtom = atom((get) => {
  return get(worksStatAtomFamily('精神')) + get(bonusStatAtomFamily('精神'));
});
export const placeholderAtom = atom(() => 0);
export const baseHpMpDescriptionAtom = atom('');
export const worksHPAtom = atom(0);
export const worksMPAtom = atom(0);
export const worksHpMpDescriptionAtom = atom('');
export const styleHPAtom = atom(0);
export const styleMPAtom = atom(0);
export const styleHpMpDescriptionAtom = atom('');
export const styleGrowHPAtom = atom(0);
export const styleGrowMPAtom = atom(0);
export const styleGrowHpMpDescriptionAtom = atom('');
export const extraHPAtom = atom(0);
export const extraMPAtom = atom(0);
export const extraHpMpDescriptionAtom = atom('');
export const armieHpMpDescriptionAtom = atom('');
export const armieHpAtom = atom((get) => {
  const armie = get(gcrArmieAtom)[0];
  if (!armie || !armie.適用) {
    return 0;
  }
  return Number(armie.HP);
});
export const armieMpAtom = atom(() => 0);
export const hpSumAtom = atom((get) => {
  const level = get(characterLevelAtom);
  return (
    get(baseHpAtom) +
    get(worksHPAtom) +
    get(styleHPAtom) +
    get(styleGrowHPAtom) * (level - 1) +
    get(extraHPAtom) +
    get(armieHpAtom)
  );
});
export const mpSumAtom = atom((get) => {
  const level = get(characterLevelAtom);
  return (
    get(baseMpAtom) +
    get(worksMPAtom) +
    get(styleMPAtom) +
    get(styleGrowMPAtom) * (level - 1) +
    get(extraMPAtom) +
    get(armieMpAtom)
  );
});
export const hpMpSumDescriptionAtom = atom('');

export const initFromStatAtom = atom((get) => {
  return Math.floor((get(baseSumAtomFamily('感覚')) + get(baseSumAtomFamily('知力'))) / 2);
});
export const moveBaseFromStatAtom = atom((get) => {
  return Math.floor(get(baseSumAtomFamily('反射')));
});
export const maxWeightFromStatAtom = atom((get) => {
  return Math.floor(get(baseSumAtomFamily('筋力')));
});
export const extraMoveBaseAtom = atom(0);
export const initFromItemAtom = atom((get) => {
  const items = get(gcrArmorsAtom);
  return items
    .filter((item) => item.適用)
    .reduce((acc, item) => acc + Number(item.行動 || 0) * Number(item.個数 || 1), 0);
});
export const moveBaseFromItemAtom = atom((get) => {
  const items = get(gcrArmorsAtom);
  return items
    .filter((item) => item.適用)
    .reduce((acc, item) => acc + Number(item.移動 || 0) * Number(item.個数 || 1), 0);
});
export const weightFromItemAtom = atom((get) => {
  const items = get(gcrArmorsAtom);
  return items
    .filter((item) => item.適用)
    .reduce((acc, item) => acc + Number(item.重さ || 0) * Number(item.個数 || 1), 0);
});
export const initFromArmieAtom = atom((get) => {
  const armie = get(gcrArmieAtom)[0];
  if (!armie || !armie.適用) {
    return 0;
  }
  return Number(armie.行動値 || 0);
});
export const moveFromArmieAtom = atom((get) => {
  const armie = get(gcrArmieAtom)[0];
  if (!armie || !armie.適用) {
    return 0;
  }
  return Number(armie.移動力 || 0);
});
export const moveBaseSumAtom = atom((get) => {
  return get(moveBaseFromStatAtom) + get(moveBaseFromItemAtom) + get(extraMoveBaseAtom);
});
export const moveBaseSumDescriptionAtom = atom('');

export const extraInitAtom = atom(0);
export const extraMoveAtom = atom(0);
export const extraMaxWeightAtom = atom(0);
export const extraWeightAtom = atom(0);

export const initSumAtom = atom((get) => {
  return get(initFromStatAtom) + get(initFromItemAtom) + get(initFromArmieAtom) + get(extraInitAtom);
});
export const moveSumAtom = atom((get) => {
  const base = get(moveBaseFromStatAtom) + get(moveBaseFromItemAtom) + get(extraMoveBaseAtom);
  return 1 + Math.floor(base / 5) + get(moveFromArmieAtom) + get(extraMoveAtom);
});
export const maxWeightSumAtom = atom((get) => {
  return get(maxWeightFromStatAtom) + get(extraMaxWeightAtom);
});
export const weightSumAtom = atom((get) => {
  return get(weightFromItemAtom) + get(extraWeightAtom);
});
export const fromStatDescriptionAtom = atom('');
export const fromItemDescriptionAtom = atom('');
export const fromArmieDescriptionAtom = atom('');
export const extraDescriptionAtom = atom('');
export const moveBaseDescriptionAtom = atom('');
export const substatSumDescriptionAtom = atom('');
