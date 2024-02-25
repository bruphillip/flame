import { Factory } from '.';
export type Config<T> = {
    onInit?: () => Promise<void>;
    onUpdate?: (data: T) => Promise<void>;
};
export declare function useCreateStore<T>(initialData: T, config?: Config<T>): Factory<T>;
