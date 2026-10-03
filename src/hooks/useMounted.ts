'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Custom hook to detect if component has mounted on client side.
 * Uses React 18/19's native useSyncExternalStore for hydration safety without cascading re-renders.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
