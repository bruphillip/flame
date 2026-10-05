import { useEffect, useState } from 'react'

import { Factory } from '../factory'

import { HydrateModule } from '.'

interface HydrateProviderProps<T> {
  children: React.ReactElement
  modules?: Factory<T>[]
}

const hydration = new HydrateModule()

export function HydrateProvider<T>({
  children,
  modules,
}: HydrateProviderProps<T>) {
  const [isHydrated, setIsHydrated] = useState(!modules || modules.length === 0)

  useEffect(() => {
    let isMounted = true

    if (modules && modules.length > 0) {
      hydration.setup(modules).then(() => {
        if (isMounted) setIsHydrated(true)
      })
    } else {
      setIsHydrated(true)
    }

    return () => {
      isMounted = false
      hydration.unsubscribe()
    }
  }, [])

  return isHydrated ? children : <div />
}
