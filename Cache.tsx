import * as React from 'react';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useRef } from 'react';

interface ContextType {
  set: (key: string, value: unknown) => void;
  get: (key: string) => unknown;
  has: (key: string) => boolean;
  delete: (key: string) => void;
  clear: () => void;
}

const Context = createContext<ContextType | undefined>(undefined);

export function useCache() {
  const value = useContext(Context);
  if (value === undefined) {
    throw Error('cache context must be initialized');
  }
  return value;
}

export function CacheProvider({ children }: PropsWithChildren<object>) {
  const cacheRef = useRef(new Map());

  const value = useMemo(() => {
    const map = cacheRef.current;
    return {
      set: (key: string, value: unknown) => map.set(key, value),
      get: (key: string) => map.get(key),
      has: (key: string) => map.has(key),
      delete: (key: string) => map.delete(key),
      clear: () => map.clear(),
    };
  }, [cacheRef]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
