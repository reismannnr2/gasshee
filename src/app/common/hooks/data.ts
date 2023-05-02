export const useAsyncData = (() => {
  const cache = new Map<string, unknown>();
  return function useAsyncData<T>(key: string, promise: Promise<T>): T {
    if (cache.has(key)) {
      return cache.get(key) as T;
    }
    throw promise.then((data) => {
      cache.set(key, data);
      return data;
    });
  };
})();
