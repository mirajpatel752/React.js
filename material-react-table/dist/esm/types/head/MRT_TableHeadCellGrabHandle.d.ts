import { RefObject } from 'react';
import type { MRT_Column, MRT_TableInstance } from '..';
interface Props {
    column: MRT_Column;
    table: MRT_TableInstance;
    tableHeadCellRef: RefObject<HTMLTableCellElement>;
}
export declare const MRT_TableHeadCellGrabHandle: ({ column, table, tableHeadCellRef, }: Props) => JSX.Element;
export {};
