import { Dispatch, SetStateAction } from 'react';
import type { MRT_Column, MRT_TableInstance } from '..';
interface Props<TData extends Record<string, any> = {}> {
    allColumns: MRT_Column<TData>[];
    column: MRT_Column<TData>;
    hoveredColumn: MRT_Column<TData> | null;
    setHoveredColumn: Dispatch<SetStateAction<MRT_Column<TData> | null>>;
    table: MRT_TableInstance<TData>;
}
export declare const MRT_ShowHideColumnsMenuItems: <TData extends Record<string, any> = {}>({ allColumns, hoveredColumn, setHoveredColumn, column, table, }: Props<TData>) => JSX.Element;
export {};
