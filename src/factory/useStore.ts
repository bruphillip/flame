import { useSyncExternalStore } from 'react'

import { Factory } from './index'

/**
 * Idiomatic React hook to consume a Flame store safely with selector support.
 *
 * @param store The Flame store instance
 * @param selector Optional selector function to pick specific state properties and avoid re-renders
 * @returns The selected state snapshot
 *
 * @example
 * ```tsx
 * const name = useStore(userStore, (s) => s.name)
 * ```
 */
export function useStore<T, S = T>(
  store: Factory<T>,
  selector: (state: T) => S = (state) => state as unknown as S
): S {
  return useSyncExternalStore(
    (callback) => {
      const subscription = store.observable.subscribe(callback)
      return () => subscription.unsubscribe()
    },
    () => selector(store.data),
    () => selector(store.data)
  )
}
