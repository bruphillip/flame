import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractFactory, AsyncSetter, SetterCallback } from './factory.abstract';
export declare class Factory<T> extends AbstractFactory<T> {
    protected _subject: BehaviorSubject<T>;
    get observable(): Observable<T>;
    get data(): T;
    get state(): T;
    constructor(initialValue: T);
    private _state;
    next(callback: SetterCallback<T>): void;
    next(promise: AsyncSetter<T>): Promise<void>;
    next(value: Partial<T>): void;
}
