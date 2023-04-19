import { rangeArray } from '../../common/functions/generate-fns';
import { customFlags } from '../../common/functions/react-util';
import { Setter } from '../../common/types';
import { InputDef } from '../../features/user-input/user-input';
import VerticalTable, { ColumnDef } from '../../features/vertical-table/vertical-table';
import styles from './skill-table.module.scss';
import { SkillItem, SkillSet, useSkillSetValue, useUpdateSkillSet } from './states/skill-set';
import { STAT_NAMES } from './states/stats';

export default function SkillTable() {
  const item = useSkillSetValue();
  const setter = useUpdateSkillSet();
  return (
    <section>
      <VerticalTable
        columns={columns}
        inputDefs={inputDefs}
        item={item}
        layout={styles.layout}
        setter={setter}
        titleRender={(title, setter) => {
          const onAdd = () => setter((prev) => [...prev, initialize()]);
          const onRemove = () =>
            setter((prev) => {
              const last = prev.at(-1);
              if (!last || last.fixed) {
                return prev;
              }
              return prev.slice(0, -1);
            });
          return (
            <div className={styles.title}>
              <p>{title}</p>
              <div className={styles.controller}>
                <button className={styles['controller-button']} type="button" onClick={onAdd}>
                  +
                </button>
                <button className={styles['controller-button']} type="button" onClick={onRemove}>
                  -
                </button>
              </div>
            </div>
          );
        }}
      />
    </section>
  );
}

function SkillLevel({ item, setter }: { item: SkillItem; setter: Setter<SkillItem> }) {
  return (
    <ol className={styles['level-selector']}>
      {rangeArray(2, 7).map((level) => (
        <li key={level} {...customFlags({ selected: level === item.レベル })}>
          <button
            className={styles['level-button']}
            type="button"
            onClick={() =>
              setter((prev) => {
                if (prev.レベル === level) {
                  return prev;
                }
                return { ...prev, レベル: level };
              })
            }
          >
            {level}
          </button>
        </li>
      ))}
    </ol>
  );
}

const initialize = () => ({ id: '', 技能名: '', レベル: 2, fixed: false });

const inputDefs: InputDef<SkillItem, null>[] = [
  {
    title: 'Name',
    fn: (item) =>
      !item.fixed
        ? {
            type: 'text',
            title: 'Name',
            from: (item) => item.技能名,
            to: (item, value) => ({ ...item, 技能名: value }),
          }
        : {
            type: 'readonly',
            title: 'Name',
            from: (item) => item.技能名,
          },
  },
  {
    type: 'custom',
    title: 'Level',
    render: (item, setter) => <SkillLevel item={item} setter={setter} />,
  },
];
const columns: ColumnDef<SkillSet, SkillItem>[] = STAT_NAMES.map((stat) => ({
  title: stat,
  from: (state: SkillSet) => state[stat],
  to: (state: SkillSet, value: SkillItem[]) => ({ ...state, [stat]: value }),
}));
