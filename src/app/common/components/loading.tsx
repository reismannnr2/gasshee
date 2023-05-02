import { Suspense, useEffect, useId, useRef } from 'react';
import { RotatingSquare } from 'react-loader-spinner';
import { useAsyncData } from '../hooks/data';
import styles from './loading.module.scss';

export type Props<T> = {
  promise: Promise<T>;
  onResolve?: (data: T) => void;
};

export default function Loading<T>({ promise, onResolve }: Props<T>) {
  return (
    <Suspense fallback={<Fallback />}>
      <Inner promise={promise} onResolve={onResolve} />
    </Suspense>
  );
}

function Inner<T>({ promise, onResolve }: Props<T>) {
  const id = useId();
  const data = useAsyncData(id, promise);
  const calledRef = useRef(false);
  useEffect(() => {
    if (data && !calledRef.current) {
      onResolve?.(data);
      calledRef.current = true;
    }
  }, [data, onResolve]);
  return null;
}

function Fallback() {
  return (
    <div className={styles.wrapper}>
      <RotatingSquare color="Aquamarine" height={200} width={200} />
    </div>
  );
}
