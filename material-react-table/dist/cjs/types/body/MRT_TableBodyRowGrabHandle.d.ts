import { RefObject } from 'react';
import { MRT_Cell, MRT_TableInstance } from '..';
interface Props {
    cell: MRT_Cell;
    rowRef: RefObject<HTMLTableRowElement>;
    table: MRT_TableInstance;
}
export declare const MRT_TableBodyRowGrabHandle: ({ cell, rowRef, table }: Props) => JSX.Element;
export {};
