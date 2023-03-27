import classNames from 'classnames';
import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import { rangeArray } from '../../commons/range-util';
import { typedEntries } from '../../commons/object-utils';
import AnimateHeight from '../../components/animation/animate-height';

const stats = ['str', 'ref', 'dex', 'int', 'mnd', 'sym'] as const;

type Stat = (typeof stats)[number];

interface Skill {
  id: string;
  name: string;
  level: number;
  fixed?: boolean;
}

type SkillSet = {
  [k in Stat]: Skill[];
};

const fixed = { id: nanoid(), name: 'name', level: 2, fixed: true };
const notFixed = { id: nanoid(), name: '', level: 2, fixed: false };

const mock: Skill[] = [fixed, fixed, fixed, notFixed];
const cloneBase = () => mock.map((s) => ({ ...s, id: nanoid() }));
const mockSet = {
  str: cloneBase(),
  ref: cloneBase(),
  dex: cloneBase(),
  int: cloneBase(),
  mnd: cloneBase(),
  sym: cloneBase(),
} as const;

export default function SkillTable() {
  const [skillSet, setSkillSet] = useState<SkillSet>(mockSet);
  const onColumnChange = useCallback(
    (callback: (prev: Skill[]) => Skill[], stat: Stat) => {
      setSkillSet((prev) => {
        const skills = callback(prev[stat]);
        return prev[stat] === skills ? prev : { ...prev, [stat]: skills };
      });
      return;
    },
    [setSkillSet],
  );
  return (
    <AnimateHeight deps={skillSet}>
      <table>
        <tbody>
          {typedEntries(skillSet).map(([stat, skills]) => (
            <Column key={stat} stat={stat} skills={skills} onChange={onColumnChange} />
          ))}
        </tbody>
        <style jsx>{`
          table {
            writing-mode: vertical-lr;
            table-layout: fixed;
            width: 100%;

            border-collapse: collapse;
            border: 1px dotted #666;
            font-size: 0.75rem;

            & :global(td),
            & :global(th) {
              writing-mode: horizontal-tb;
              border: 1px dotted #666;
            }
          }
        `}</style>
      </table>
    </AnimateHeight>
  );
}

function Column({
  stat,
  skills,
  onChange,
}: {
  stat: Stat;
  skills: Skill[];
  onChange: (callback: (prev: Skill[]) => Skill[], stat: Stat) => void;
}) {
  const onRowChange = useCallback(
    (callback: (prev: Skill) => Skill, index: number) => {
      onChange((prev: Skill[]) => {
        const prevItem = prev[index];
        if (!prevItem) {
          return prev;
        }
        const nextItem = callback(prevItem);
        if (nextItem === prevItem) {
          return prev;
        }
        const next = prev.slice();
        next[index] = nextItem;
        return next;
      }, stat);
    },
    [onChange, stat],
  );
  return (
    <tr>
      <th>{stat}</th>
      {skills.map((skill, index) => (
        <Row key={skill.id} skill={skill} index={index} onChange={onRowChange} />
      ))}
      <td>
        <div className="button-container">
          <button
            type="button"
            onClick={() => {
              onChange((prev) => prev.concat({ ...notFixed, id: nanoid() }), stat);
              return;
            }}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => {
              onChange((prev) => {
                const last = prev.at(-1);
                if (!last || last.fixed) {
                  return prev;
                }
                return prev.slice(0, -1);
              }, stat);
              return;
            }}
          >
            -
          </button>
        </div>
      </td>
      <style jsx>{`
        th {
          cursor: default;
        }
        .button-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 1rem;
          font-size: 0.75rem;

          button {
            &:hover {
              background-color: #ddd;
            }
          }
        }
      `}</style>
    </tr>
  );
}

function Row({
  skill,
  index,
  onChange,
}: {
  skill: Skill;
  index: number;
  onChange: (callback: (prev: Skill) => Skill, index: number) => void;
}) {
  return (
    <td>
      <div>
        <input
          value={skill.name}
          readOnly={skill.fixed}
          onChange={(e) => {
            onChange((skill) => ({ ...skill, name: e.target.value }), index);
            return;
          }}
        />
        <LevelSelect level={skill.level} onChange={(level) => onChange((skill) => ({ ...skill, level }), index)} />
      </div>
      <style jsx>{`
        div {
          display: grid;
          grid-template-columns: 6.5rem 1fr;

          input {
            border-right: 1px dotted #666;
            text-align: center;

            &:read-only {
              cursor: default;
            }
          }
        }
      `}</style>
    </td>
  );
}

function LevelSelect({ level, onChange }: { level: number; onChange: (level: number) => void }) {
  return (
    <ol>
      {rangeArray(6).map((v) => {
        const selected = level === v + 1;
        return (
          <li key={v} className={classNames({ selected })}>
            <button type="button" onClick={() => onChange(v + 1)} disabled={selected}>
              {v + 1}
            </button>
          </li>
        );
      })}
      <style jsx>{`
        ol {
          list-style-type: none;
          display: grid;
          grid-template-columns: repeat(6, 1fr);

          li.selected {
            background-color: black;
            color: white;
          }
          li:not(.selected):hover {
            background-color: #ddd;
          }
          li:not(:last-of-type) {
            border-right: 1px dotted #666;
          }
          button {
            display: inline-block;
            width: 100%;
            height: 100%;

            text-align: center;
          }
        }
      `}</style>
    </ol>
  );
}
