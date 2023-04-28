export type Props<T> = {
  test: T | undefined | null;
  children: (value: T) => React.ReactNode;
  fallback?: () => React.ReactNode;
};

export default function MaybeWith<T>({ test, children, fallback }: Props<T>) {
  return test != null ? <>{children(test)}</> : fallback ? <>{fallback()}</> : null;
}
