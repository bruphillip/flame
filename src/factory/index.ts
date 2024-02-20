import { BehaviorSubject, Observable } from 'rxjs';

import { setup } from '../setup';
import {
  AbstractFactory,
  AsyncSetter,
  SetterCallback,
} from './factory.abstract';

export class Factory<T> extends AbstractFactory<T> {
  protected _subject: BehaviorSubject<T>;

  get observable(): Observable<T> {
    return this._subject.asObservable();
  }

  get data(): T {
    return this._subject.getValue();
  }

  constructor(initialValue: T) {
    super();
    setup.module = this as Factory<unknown>;
    this._subject = new BehaviorSubject(initialValue);
  }

  next(callback: SetterCallback<T>): void;

  next(promise: AsyncSetter<T>): void;

  next(value: Partial<T>): void;

  next(value: Partial<T> | AsyncSetter<T> | Function): void {
    let currentValue = value;

    if (value instanceof Function) {
      const returnCallback = value(this.data);

      if (returnCallback instanceof Promise) {
        returnCallback.then((result) =>
          this._subject.next({ ...this.data, ...result })
        );
        return;
      }
      currentValue = returnCallback;
    }

    this._subject.next({ ...this.data, ...currentValue });
  }
}
