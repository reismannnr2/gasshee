export type Props = {
  test: unknown;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
};
export default function Maybe({ test, children, fallback }: Props) {
  return test ? <>{children}</> : fallback ? <>[fallback]</> : null;
}
