export declare abstract class OnUpdate<T> {
    abstract onUpdate(data: T): void;
}
export declare function hasOnUpdate(module: unknown): module is OnUpdate<unknown>;
