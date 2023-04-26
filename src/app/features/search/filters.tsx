import { WritableAtom, useAtom } from 'jotai';
import { ChangeEvent } from 'react';
import { debounced } from '../../common/functions/generate-fns';
import styles from './filters.module.scss';
import { ORDER_BY_ITEMS, freeTextAtom, paroleAtom, systemAtom, tagAtom, useOrderBy } from './states';

export default function Filters() {
  return (
    <ul className={styles.list}>
      <li>
        <SortOrder />
      </li>
      <li>
        <InputField atom={paroleAtom} label="合言葉" />
      </li>
      <li>
        <InputField atom={tagAtom} label="タグ" />
      </li>
      <li>
        <InputField atom={systemAtom} label="システム" />
      </li>
      <li>
        <InputField atom={freeTextAtom} label="フリー" />
      </li>
    </ul>
  );
}

const SORT_DIRECTION_LABELS = {
  asc: '昇順',
  desc: '降順',
} as const;

const SORT_FIELD_LABELS = {
  name: '名前',
  user: 'ユーザー',
  system: 'システム',
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

function InputField({ label, atom }: { atom: WritableAtom<string, [string], void>; label: string }) {
  const [value, setValue] = useAtom(atom);
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        className={styles.input}
        defaultValue={value}
        type="text"
        onChange={debounced((e: ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value);
        }, 1000)}
      />
    </label>
  );
}
