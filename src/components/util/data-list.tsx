export interface Props {
  id: string;
  items: string[];
}

export default function DataList({ id, items }: Props) {
  return (
    <datalist id={id}>
      <option aria-label="empty" value="" />
      {items.map(
        (value) =>
          value && (
            <option key={value} value={value}>
              {value}
            </option>
          ),
      )}
    </datalist>
  );
}
