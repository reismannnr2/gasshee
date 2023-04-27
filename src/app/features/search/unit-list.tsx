import { cdate } from 'cdate';
import { useAtomValue, useSetAtom } from 'jotai';
import { Suspense } from 'react';
import Maybe from '../../common/components/maybe';
import { SYSTEM_NAMES } from '../../common/text-map';
import {
  freeTextAtom,
  maxPageAtom,
  pageAtom,
  pagedUnitsAtom,
  setFirstPageAtom,
  setLastPageAtom,
  setNextPageAtom,
  setPageAtom,
  setPrevPageAtom,
  systemAtom,
  tagAtom,
} from './states';
import styles from './unit-list.module.scss';

export default function UnitList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnitList_ />
    </Suspense>
  );
}

function UnitList_() {
  const items = useAtomValue(pagedUnitsAtom);
  const setTag = useSetAtom(tagAtom);
  const setSystem = useSetAtom(systemAtom);
  const setFreeText = useSetAtom(freeTextAtom);
  return (
    <section>
      <Controller />
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
    </section>
  );
}

function Controller() {
  const setFirstPage = useSetAtom(setFirstPageAtom);
  const setLastPage = useSetAtom(setLastPageAtom);
  const currentPage = useAtomValue(pageAtom);
  const maxPage = useAtomValue(maxPageAtom);
  const setNextPage = useSetAtom(setNextPageAtom);
  const setPrevPage = useSetAtom(setPrevPageAtom);
  const setPage = useSetAtom(setPageAtom);
  return (
    <ol className={styles.pager}>
      <li>
        <a onClick={setFirstPage}>{'≪'}</a>
      </li>
      {
        <Maybe test={currentPage > 1 && currentPage === maxPage}>
          <li>
            <a onClick={() => setPage(maxPage - 2)}>{maxPage - 2}</a>
          </li>
        </Maybe>
      }
      {
        <Maybe test={currentPage > 1}>
          <li>
            <a onClick={setPrevPage}>{currentPage - 1}</a>
          </li>
        </Maybe>
      }
      <li>
        <a className={styles.current}>{currentPage}</a>
      </li>
      {
        <Maybe test={currentPage < maxPage}>
          <li>
            <a onClick={setNextPage}>{currentPage + 1}</a>
          </li>
        </Maybe>
      }

      {
        <Maybe test={currentPage < maxPage && currentPage === 1}>
          <li>
            <a onClick={() => setPage(3)}>{currentPage + 2}</a>
          </li>
        </Maybe>
      }
      <li>
        <a onClick={setLastPage}>{'≫'}</a>
      </li>
    </ol>
  );
}
