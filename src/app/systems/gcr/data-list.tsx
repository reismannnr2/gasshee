import { Fragment } from 'react';
import { STAT_NAMES } from './states/stats';
import { useSkillSetValue } from './states/skill-set';

export default function DataList() {
  return (
    <>
      <SkillSet />
    </>
  );
}

function SkillSet() {
  const skillSet = useSkillSetValue();
  return (
    <datalist id="skill-set">
      {STAT_NAMES.map((statName) => (
        <Fragment key={statName}>
          <option value={statName} />
          {skillSet[statName].map((skill) => (
            <option key={skill.id} value={skill.技能名} />
          ))}
        </Fragment>
      ))}
    </datalist>
  );
}
