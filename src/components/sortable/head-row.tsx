import { ComponentType } from 'react';
import styles from './head-row.module.scss';

export interface Props {
  titles: string[];
  tag: keyof JSX.IntrinsicElements | ComponentType;
  children: (items: React.ReactNode[]) => React.ReactNode;
}

export default function HeadRow({ titles, tag: Wrapper, children }: Props) {
  const items = titles.map((title) => (
    <Wrapper key={title} className={styles.item}>
      {title}
    </Wrapper>
  ));
  return (
    <div className={styles.head}>
      {children(items)}
      <div className={styles.grab}>↕</div>
    </div>
  );
}
