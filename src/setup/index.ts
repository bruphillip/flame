import { BehaviorSubject } from 'rxjs'

import { Factory } from '../factory'
import { onInitSetup } from '../onInit'
import { onUpdateSetup } from '../onUpdate'

class Setup {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _modules = new BehaviorSubject<Factory<any>[]>([])
  private actions = [onUpdateSetup, onInitSetup]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get modules(): Factory<any>[] {
    return this._modules.getValue()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set module(module: Factory<any>) {
    this._modules.next([...this.modules, module])
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove(module: Factory<any>) {
    this._modules.next(this.modules.filter((m) => m !== module))
  }

  reset() {
    onUpdateSetup.unsubscribe()
    this._modules.next([])
  }

  async config() {
    await Promise.all(this.actions.map((action) => action.setup(this.modules)))
  }
}

export const setup = new Setup()
