import { Factory } from '../factory';
declare class OnUpdateSetup {
    setup(modules: Factory<unknown>[]): Promise<void>;
}
export declare const onUpdateSetup: OnUpdateSetup;
export {};
