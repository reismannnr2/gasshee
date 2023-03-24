import classNames from 'classnames';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { rangeArray } from '../../commons/range-util';

const stats = ['str', 'ref', 'dex', 'int', 'mnd', 'sym'] as const;

interface Skill {
  id: string;
  name: string;
  level: number;
  fixed?: boolean;
}

type SkillSet = {
  [k in (typeof stats)[number]]: Skill[];
};

export default function SkillTable() {
  const [skillSet, setSkillSet] = useState<SkillSet>({ str: [], ref: [], dex: [], int: [], mnd: [], sym: [] });
  return (
    <table>
      <tbody>
        {Object.entries(skillSet).map(([stat, skills]) => (
          <Column
            key={stat}
            stat={stat}
            skills={skills}
            onChange={() => {
              return;
            }}
          />
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
  );
}

function Column({
  stat,
  skills,
  onChange,
}: {
  stat: string;
  skills: Skill[];
  onChange: (skills: readonly Skill[]) => void;
}) {
  return (
    <tr>
      <th>{stat}</th>
      {skills.map((skill, idx) => (
        <Row
          key={skill.id}
          skill={skill}
          onChange={() => {
            return;
          }}
        />
      ))}
      <td>
        <div className="button-container">
          <button
            type="button"
            onClick={() => {
              return;
            }}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => {
              return;
            }}
          >
            -
          </button>
        </div>
      </td>
      <style jsx>{`
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

function Row({ skill, onChange }: { skill: Skill; onChange: (skill: Skill) => void }) {
  return (
    <td>
      <div>
        <input
          value={skill.name}
          readOnly={skill.fixed}
          onChange={(e) => onChange({ ...skill, name: e.target.value })}
        />
        <LevelSelect level={skill.level} onChange={(level) => onChange({ ...skill, level })} />
      </div>
      <style jsx>{`
        div {
          display: grid;
          grid-template-columns: 6.5rem 1fr;

          input {
            border-right: 1px dotted #666;
            text-align: center;
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
            <button type="button" onClick={() => onChange(v + 1)}>
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
