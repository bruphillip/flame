import { useState, useEffect, useMemo } from 'react'

import { Factory } from '.'

export function hookFactory<T>(model: Factory<T>) {
  return function useHook(): [T, typeof model.next] {
    const [state, set] = useState<T>(model.data)

    useEffect(() => {
      const subscribed = model.observable.subscribe({
        next(value) {
          set(value)
        },
      })

      return () => subscribed.unsubscribe()
    }, [])

    const setState = useMemo(() => model.next.bind(model), [model])

    return [state, setState]
  }
}
