import { Factory } from './factory';
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
    setup(modules: Factory<unknown>[]): Promise<() => void>;
    register(modules: Factory<unknown>[]): void;
    hydrate(): void;
    subscribe(): void;
    unsubscribe(): void;
}
export { HydrateModule };
