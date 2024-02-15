/// <reference types="react" />
import type { MRT_Cell, MRT_Row, MRT_TableInstance } from '..';
interface Props<TData extends Record<string, any> = {}> {
    cell: MRT_Cell<TData>;
    row: MRT_Row<TData>;
    table: MRT_TableInstance<TData>;
}
export declare const MRT_ToggleRowActionMenuButton: <TData extends Record<string, any> = {}>({ cell, row, table, }: Props<TData>) => JSX.Element;
export {};
