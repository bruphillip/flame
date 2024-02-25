/// <reference types="react" />
import { Factory } from '../factory';
interface HydrateProviderProps<T> {
    children: React.ReactElement;
    modules?: Factory<T>[];
}
export declare function HydrateProvider<T>({ children, modules, }: HydrateProviderProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
