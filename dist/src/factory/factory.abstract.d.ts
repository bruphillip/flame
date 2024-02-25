import { BehaviorSubject, Observable } from 'rxjs';
export type AsyncSetter<T> = (data: T) => Promise<Partial<T>>;
export type SetterCallback<T> = (data: T) => Partial<T>;
export declare abstract class AbstractFactory<T> {
    protected static initialValue: object;
    protected abstract _subject: BehaviorSubject<T>;
    abstract data: T;
    abstract state: T;
    abstract get observable(): Observable<T>;
    abstract next(value: Partial<T>): void;
    abstract next(value: SetterCallback<T>): void;
    abstract next(value: AsyncSetter<T>): void;
}
