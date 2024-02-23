/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'

import { setup } from '.'

interface SetupProviderProps {
  children: React.ReactElement
}

export function SetupProvider({ children }: SetupProviderProps) {
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setup.config().finally(() => setFinished(true))
  }, [])

  return finished ? children : <div />
}
