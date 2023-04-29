import { atom, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { nanoid } from 'nanoid';
import { rangeArray } from '../../../common/functions/generate-fns';
import { customFlags } from '../../../common/functions/react-util';
import { InputDef } from '../../../features/user-input/user-input';
import VerticalTable, { ColumnDef } from '../../../features/vertical-table/vertical-table';
import {
  SkillItem,
  addNewSkillFamily,
  skillFamily,
  skillNameFamily,
  skillSetFamily,
  updateSkillLevelFamily,
  updateSkillNameFamily,
  updateSkillSetFamily,
} from '../states/skill-set';
import { STAT_NAMES } from '../states/stats';
import styles from './skill-table.module.scss';

export default function SkillTable() {
  return <VerticalTable<SkillItem, From, To, string> {...tableProps} />;
}

function SkillLevel({ skill: item, to }: { skill: SkillItem; to: To }) {
  const update = useSetAtom(to.updateSkillLevelFamily(item.id));
  return (
    <ol className={styles['level-selector']}>
      {rangeArray(2, 7).map((level) => {
        const selected = item.レベル === level;
        return (
          <li key={level} {...customFlags({ selected })}>
            <button className={styles['level-button']} type="button" onClick={() => !selected && update(level)}>
              {level}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

const layout = styles.layout;

const from = {
  skillSetFamily,
  skillFamily,
  skillNameFamily,
};
type From = typeof from;
const to = {
  addNewSkillFamily,
  updateSkillNameFamily,
  updateSkillSetFamily,
  updateSkillLevelFamily,
};

type To = typeof to;

const inputDefs: InputDef<From, To, string>[] = [
  {
    title: 'Name',
    fn: (from, skillId) =>
      atom((get) => {
        const skill = get(from.skillFamily(skillId));
        const title = 'Name';
        if (!skill) {
          return;
        }
        if (skill.fixed) {
          return {
            type: 'readonly',
            title,
            from: (from, skillId) => from.skillNameFamily(skillId),
          };
        }
        return {
          type: 'text',
          title,
          from: (from, skillId) => from.skillNameFamily(skillId),
          to: (to, skillId) => to.updateSkillNameFamily(skillId),
        };
      }),
  },
  {
    title: 'Level',
    fn: (from, skillId) => {
      return atom((get) => {
        const skill = get(from.skillFamily(skillId));
        if (!skill) {
          return;
        }
        return {
          type: 'custom',
          title: 'Level',
          render: (from, to) => <SkillLevel skill={skill} to={to} />,
        };
      });
    },
  },
];
const args = atomFamily(
  (SkillItem: SkillItem) => atom(SkillItem.id),
  (a, b) => a.id === b.id,
);

const columnDefs: ColumnDef<SkillItem, From, To, string>[] = STAT_NAMES.map((statName) => {
  return {
    title: statName,
    inputDefs,
    from: (from) => from.skillSetFamily(statName),
    to: (to) => to.updateSkillSetFamily(statName),
    args,
    renderTitle: (title, setter) => {
      return (
        <div className={styles.title}>
          <p>{title}</p>
          <div className={styles.controller}>
            <button
              className={styles['controller-button']}
              type="button"
              onClick={() =>
                setter((prev) =>
                  prev.concat({
                    id: nanoid(),
                    技能名: '',
                    レベル: 2,
                  }),
                )
              }
            >
              +
            </button>
            <button
              className={styles['controller-button']}
              type="button"
              onClick={() => {
                setter((prev) => {
                  const last = prev.at(-1);
                  if (!last || last.fixed) {
                    return prev;
                  }
                  return prev.slice(0, -1);
                });
              }}
            >
              -
            </button>
          </div>
        </div>
      );
    },
  };
});

const tableProps = {
  layout,
  from,
  to,
  columnDefs,
};
