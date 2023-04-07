export interface Props {
  id: string;
  items: [string, string[]][];
}

export function DataListGroup({ id, items }: Props) {
  return (
    <datalist id={id}>
      <option aria-label="empty" value="" />
      {items.map(([group, values]) => (
        <optgroup key={group} label={group}>
          {values.map(
            (value) =>
              value && (
                <option key={value} value={value}>
                  {value}
                </option>
              ),
          )}
        </optgroup>
      ))}
    </datalist>
  );
}
