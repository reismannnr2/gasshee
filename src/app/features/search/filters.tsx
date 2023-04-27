import { WritableAtom, useAtom, useAtomValue } from 'jotai';
import { ChangeEvent, useEffect, useRef } from 'react';
import { debounced } from '../../common/functions/generate-fns';
import styles from './filters.module.scss';
import {
  ORDER_BY_ITEMS,
  allSystemsAtom,
  allTagsAtom,
  freeTextAtom,
  paroleAtom,
  systemAtom,
  tagAtom,
  useOrderBy,
} from './states';

export default function Filters() {
  return (
    <section>
      <ul className={styles.list}>
        <li>
          <SortOrder />
        </li>
        <li>
          <InputField atom={paroleAtom} debounce={500} label="合言葉" />
        </li>
        <li>
          <InputField atom={systemAtom} debounce={250} label="システム" list="filter-systems" />
        </li>
        <li>
          <InputField atom={tagAtom} debounce={250} label="タグ" list="filter-tags" />
        </li>
        <li>
          <InputField atom={freeTextAtom} debounce={250} label="フリー" />
        </li>
      </ul>
      <DataList />
    </section>
  );
}

const SORT_DIRECTION_LABELS = {
  asc: '昇順',
  desc: '降順',
} as const;

const SORT_FIELD_LABELS = {
  name: '名前',
  system: 'システム',
  user: 'ユーザー',
  updatedAt: '更新日時',
} as const;

function sortOrderLabel(field: keyof typeof SORT_FIELD_LABELS, direction: keyof typeof SORT_DIRECTION_LABELS) {
  return `${SORT_FIELD_LABELS[field]}: ${SORT_DIRECTION_LABELS[direction]}`;
}

function SortOrder() {
  const [orderBy, setOrderBy] = useOrderBy();
  return (
    <label className={styles.field}>
      <span>ソート順</span>
      <span className={styles['select-wrapper']}>
        <select
          className={styles.select}
          title="ソート順"
          value={orderBy.id}
          onChange={(e) => {
            setOrderBy(e.target.value);
          }}
        >
          {ORDER_BY_ITEMS.map(({ id, field, direction }) => (
            <option key={id} label={sortOrderLabel(field, direction)} value={id} />
          ))}
        </select>
      </span>
    </label>
  );
}

function DataList() {
  const tags = useAtomValue(allTagsAtom);
  const systems = useAtomValue(allSystemsAtom);
  return (
    <div>
      <datalist id="filter-tags">
        {tags.map((tag) => (
          <option key={tag} value={tag} />
        ))}
      </datalist>
      <datalist id="filter-systems">
        {systems.map((system) => (
          <option key={system} value={system} />
        ))}
      </datalist>
    </div>
  );
}

function InputField({
  label,
  atom,
  list,
  debounce,
}: {
  atom: WritableAtom<string, [string], void>;
  list?: string;
  label: string;
  debounce?: number;
}) {
  const [value, setValue] = useAtom(atom);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.value !== value) {
      ref.current.value = value;
    }
  }, [value]);
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        ref={ref}
        className={styles.input}
        defaultValue={value}
        list={list}
        type="text"
        onInput={debounced((e: ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value);
        }, debounce || 500)}
      />
    </label>
  );
}
