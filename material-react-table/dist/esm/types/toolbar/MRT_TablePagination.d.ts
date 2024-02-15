/// <reference types="react" />
import type { MRT_TableInstance } from '..';
interface Props<TData extends Record<string, any> = {}> {
    position?: 'top' | 'bottom';
    table: MRT_TableInstance<TData>;
}
export declare const MRT_TablePagination: <TData extends Record<string, any> = {}>({ table, position, }: Props<TData>) => JSX.Element;
export {};
