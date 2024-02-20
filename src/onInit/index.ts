import { Factory } from '../factory'

import { hasOnInit } from './onInit.abstract'

class OnInitSetup {
  async setup(modules: Factory<unknown>[]) {
    await Promise.all(
      modules.map(async (module) => {
        if (hasOnInit(module)) {
          await module.onInit()
        }
      })
    )
  }
}

export const onInitSetup = new OnInitSetup()
