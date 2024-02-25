import { Factory } from '../factory';
declare class Setup {
    private _modules;
    private actions;
    get modules(): Factory<unknown>[];
    set module(module: Factory<unknown>);
    config(): Promise<void>;
}
export declare const setup: Setup;
export {};
