import { Factory } from '../factory';
declare class OnInitSetup {
    setup(modules: Factory<unknown>[]): Promise<void>;
}
export declare const onInitSetup: OnInitSetup;
export {};
