import { Subscription } from 'rxjs'

import { Factory } from '../factory'

import { hasOnUpdate } from './onUpdate.abstract'

class OnUpdateSetup {
  private subscriptions: Subscription[] = []

  async setup(modules: Factory<unknown>[]) {
    this.unsubscribe()
    await Promise.all(
      modules.map(async (module) => {
        if (hasOnUpdate(module)) {
          const sub = module.observable.subscribe({
            next: (data) => module.onUpdate(data),
          })
          this.subscriptions.push(sub)
        }
      })
    )
  }

  unsubscribe() {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
    this.subscriptions = []
  }
}

export const onUpdateSetup = new OnUpdateSetup()
