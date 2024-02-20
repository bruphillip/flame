/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'

import { Factory } from './factory'
import { HydrateModule } from './hydrate'
import { setup } from './setup'

interface HydrateProviderProps {
  children: React.ReactElement
  modules?: Factory<any>[]
}

const hydration = new HydrateModule()
export function HydrateProvider({ children, modules }: HydrateProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (modules) {
      hydration.setup(modules)
      setup.config().finally(() => setIsHydrated(true))
      return
    }
    return setIsHydrated(true)
  }, [])

  return isHydrated ? children : <div />
}
