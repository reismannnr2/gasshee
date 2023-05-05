import styles from './chapter-title.module.scss';
export type Props = {
  children?: React.ReactNode;
  title: string;
  tooltip?: string;
};

export default function Chapter({ children, tooltip, title }: Props) {
  return (
    <section className={styles.chapter}>
      <h2 className={styles['chapter-title']} title={tooltip}>
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}
