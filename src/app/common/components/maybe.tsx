export type Props = {
  test: unknown;
  children?: React.ReactNode;
};
export default function Maybe({ test, children }: Props) {
  return test ? <>{children}</> : null;
}
