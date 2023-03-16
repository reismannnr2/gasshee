export function range(length: number): Generator<number>;
export function range(start: number, end: number): Generator<number>;
export function* range(startOrLength: number, maybeEnd?: number) {
  const [start, end] = maybeEnd == undefined ? [0, startOrLength] : [startOrLength, maybeEnd];
  for (let i = start; i < end; i++) {
    yield i;
  }
}

export function rangeArray(length: number): number[];
export function rangeArray(start: number, end: number): number[];
export function rangeArray(startOrLength: number, maybeEnd?: number): number[] {
  return [...range(startOrLength, maybeEnd as number)];
}
