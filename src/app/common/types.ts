export type Setter<T> = (transform: (prev: T) => T) => void;
