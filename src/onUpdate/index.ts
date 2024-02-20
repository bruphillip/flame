import { Factory } from '../factory'

import { hasOnUpdate } from './onUpdate.abstract'

class OnUpdateSetup {
  async setup(modules: Factory<unknown>[]) {
    await Promise.all(
      modules.map(async (module) => {
        if (hasOnUpdate(module)) {
          module.observable.subscribe({
            next: (data) => module.onUpdate(data),
          })
        }
      })
    )
  }
}

export const onUpdateSetup = new OnUpdateSetup()
