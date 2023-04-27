import { cdate } from 'cdate';
import { useSetAtom } from 'jotai';
import { Suspense } from 'react';
import { SYSTEM_NAMES } from '../../common/text-map';
import { freeTextAtom, systemAtom, tagAtom, useFilteredUnits } from './states';
import styles from './unit-list.module.scss';

export default function UnitList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnitList_ />
    </Suspense>
  );
}

function UnitList_() {
  const items = useFilteredUnits();
  const setTag = useSetAtom(tagAtom);
  const setSystem = useSetAtom(systemAtom);
  const setFreeText = useSetAtom(freeTextAtom);
  return (
    <>
      <table className={styles.table}>
        <caption>一覧</caption>
        <thead>
          <tr>
            <th>名前</th>
            <th className={styles.system}>システム</th>
            <th className={styles.user}>ユーザー</th>
            <th className={styles.tags}>タグ</th>
            <th className={styles['updated-at']}>更新日時</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name || item.id}</td>
              <td>
                <a className={styles['filter-link']} onClick={() => setSystem(item.system)}>
                  {SYSTEM_NAMES[item.system] || item.system}
                </a>
              </td>
              <td>
                <a className={styles['filter-link']} onClick={() => setFreeText(item.user)}>
                  {item.user}
                </a>
              </td>
              <td>
                <ul className={styles['tag-list']}>
                  {item.tags.map((tag) => (
                    <li key={tag}>
                      <a className={styles['filter-link']} data-text={tag} onClick={() => setTag(tag)}>
                        {tag}
                      </a>
                    </li>
                  ))}
                </ul>
              </td>

              <td className={styles['updated-at']}>{cdate(item.createdAt).format('YYYY-MM-DD HH:mm')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
