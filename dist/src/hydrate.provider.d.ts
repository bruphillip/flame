/// <reference types="react" />
import { Factory } from './factory';
interface HydrateProviderProps {
    children: React.ReactElement;
    modules?: Factory<any>[];
}
export declare function HydrateProvider({ children, modules }: HydrateProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
