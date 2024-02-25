import { Factory } from '.';
export declare function hookFactory<T>(model: Factory<T>): () => [T, typeof model.next];
