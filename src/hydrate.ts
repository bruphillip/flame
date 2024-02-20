import { defaultTo, get, merge, set } from 'lodash';

import { LocalStorageProvider } from './localStorage';
import { Subscription } from 'rxjs';

import { Factory } from './factory';

interface RegisterType {
  [key: string]: Factory<unknown>;
}

const localStorageProvider = new LocalStorageProvider();

class HydrateModule {
  static signature = '@DASHBOARD_WEB';

  private _registed: RegisterType = {};

  private subscriptions: Subscription[] = [];

  private get localStorage(): object {
    return localStorageProvider.get(HydrateModule.signature) as object;
  }

  private set localStorage(object: unknown) {
    localStorageProvider.set(HydrateModule.signature, object);
  }

  private set registed(module: RegisterType) {
    this._registed = merge(this.registed, module);
  }

  get registed() {
    return this._registed;
  }

  async setup(modules: Factory<unknown>[]) {
    this.register(modules);
    this.hydrate();
    this.subscribe();

    return () => this.unsubscribe();
  }

  register(modules: Factory<unknown>[]) {
    modules.forEach((module) => {
      const key = Object.getPrototypeOf(module).constructor.name;

      this.registed = {
        [key]: module,
      };
    });
  }

  hydrate() {
    const store = this.localStorage;

    const keys = Object.getOwnPropertyNames(this._registed);

    keys.forEach((key) => {
      const module = this._registed[key];

      module.next(get(store, key, {}));
    });
  }

  subscribe() {
    const keys = Object.getOwnPropertyNames(this._registed);

    this.subscriptions = keys.map((key) => {
      const module = this._registed[key];

      return module.observable.subscribe({
        next: (value) => {
          const store = defaultTo(this.localStorage, {});
          const newState = set(store, key, value);

          this.localStorage = newState;
        },
      });
    });
  }

  unsubscribe() {
    if (this.subscriptions?.length === 0) return;

    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}

export { HydrateModule };
