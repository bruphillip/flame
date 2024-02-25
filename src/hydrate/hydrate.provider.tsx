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
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (modules) {
      hydration.setup(modules).then(() => setIsHydrated(true))
    }
    setIsHydrated(true)

    return () => {
      hydration.unsubscribe()
    }
  }, [])

  return isHydrated ? children : <div />
}
