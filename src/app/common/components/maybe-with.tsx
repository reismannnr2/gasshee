export type Props<T> = {
  test: T | undefined | null;
  children: (value: T) => React.ReactNode;
};

export default function MaybeWith<T>({ test, children }: Props<T>) {
  return test != null ? <>{children(test)}</> : null;
}
