import { Fragment } from 'react';
import { typedEntries } from '../../common/functions/strictly-typed';
import { useSkillSetValue } from './states/skill-set';
import { CLASS_NAMES, GCR_STYLES, GCR_WORKS, GcrClassName, STAT_NAMES } from './states/stats';

export default function DataList() {
  return (
    <>
      <SkillSet />
      <StyleNames />
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

const allStyleNames = Object.values(GCR_STYLES).flatMap((styles) => {
  return Object.keys(styles);
});
const classedStyleNames = typedEntries(GCR_STYLES).map(([className, styles]): [GcrClassName, string[]] => {
  return [className, Object.keys(styles)];
});
const worksNames = Object.keys(GCR_WORKS);
function StyleNames() {
  return (
    <>
      <datalist id="class-names">
        {CLASS_NAMES.map((className) => (
          <option key={className} value={className} />
        ))}
      </datalist>
      <datalist id="style-names-all">
        {allStyleNames.map((styleName) => (
          <option key={styleName} value={styleName} />
        ))}
      </datalist>
      {classedStyleNames.map(([className, styleNames]) => (
        <datalist key={className} id={`style-names-${className}`}>
          {styleNames.map((styleName) => (
            <option key={styleName} value={styleName} />
          ))}
        </datalist>
      ))}
      <datalist id="works-names">
        {worksNames.map((worksName) => (
          <option key={worksName} value={worksName} />
        ))}
      </datalist>
    </>
  );
}
