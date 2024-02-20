import { BehaviorSubject } from 'rxjs'

import { Factory } from '../factory'
import { onInitSetup } from '../onInit'
import { onUpdateSetup } from '../onUpdate'

class Setup {
  private _modules = new BehaviorSubject<Factory<unknown>[]>([])
  private actions = [onUpdateSetup, onInitSetup]

  get modules() {
    return this._modules.getValue()
  }

  set module(module: Factory<unknown>) {
    this._modules.next([...this.modules, module])
  }

  async config() {
    await Promise.all(this.actions.map(action => action.setup(this.modules)))
  }
}

export const setup = new Setup()
