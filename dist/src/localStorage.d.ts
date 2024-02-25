export declare class LocalStorageProvider {
    get(key: string): any;
    set<T>(key: string, object: T): void;
    clear(): void;
    remove(key: string): void;
}
