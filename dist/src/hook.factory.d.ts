import { Factory } from './factory';
export declare function hookFactory<T>(model: Factory<T>): () => [T, typeof model.next];
