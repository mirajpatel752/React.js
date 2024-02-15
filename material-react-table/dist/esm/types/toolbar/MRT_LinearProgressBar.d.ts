/// <reference types="react" />
import type { MRT_TableInstance } from '..';
interface Props<TData extends Record<string, any> = {}> {
    isTopToolbar: boolean;
    table: MRT_TableInstance<TData>;
}
export declare const MRT_LinearProgressBar: <TData extends Record<string, any> = {}>({ isTopToolbar, table, }: Props<TData>) => JSX.Element;
export {};
