import { atom } from 'jotai';
import { characterLevelAtom, characterNameAtom, gcrClassAtom, gcrStyleAtom, gcrWorksAtom } from './base';
import { growthListAtom } from './misc';
import { skillSetAtom } from './skill-set';

export const gcrSheetAtom = atom((get) => {
  const skillSet = get(skillSetAtom);
  const gcrClass = get(gcrClassAtom);
  const gcrStyle = get(gcrStyleAtom);
  const gcrWorks = get(gcrWorksAtom);
  const characterName = get(characterNameAtom);
  const characterLevel = get(characterLevelAtom);
  const growthList = get(growthListAtom);
  return {
    skillSet,
    gcrClass,
    gcrStyle,
    gcrWorks,
    characterLevel,
    characterName,
    growthList,
  };
});
