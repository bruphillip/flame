import { Factory } from '../factory';
interface RegisterType {
    [key: string]: Factory<unknown>;
}
declare class HydrateModule {
    static signature: string;
    private _registed;
    private subscriptions;
    private get localStorage();
    private set localStorage(value);
    private set registed(value);
    get registed(): RegisterType;
    setup<T>(modules: Factory<T>[]): Promise<() => void>;
    register<T>(modules: Factory<T>[]): void;
    hydrate(): void;
    subscribe(): void;
    unsubscribe(): void;
}
export { HydrateModule };
