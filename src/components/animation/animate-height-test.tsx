import { nanoid } from 'nanoid';
import { useState } from 'react';
import AnimateHeight from './animate-height';

export default function AnimateHeightTest() {
  const [items, setItems] = useState<string[]>([nanoid(), nanoid()]);
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setItems((prev) => (prev.length > 2 ? prev.slice(0, -1) : prev.concat(nanoid())));
        }}
      >
        change
      </button>
      <AnimateHeight deps={items}>
        <ol>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </AnimateHeight>
    </div>
  );
}
