import React, { RefObject } from 'react';
import type { VirtualItem } from '@tanstack/react-virtual';
import type { MRT_Cell, MRT_TableInstance } from '..';
interface Props {
    cell: MRT_Cell;
    measureElement?: (element: HTMLTableCellElement) => void;
    numRows: number;
    rowIndex: number;
    rowRef: RefObject<HTMLTableRowElement>;
    table: MRT_TableInstance;
    virtualCell?: VirtualItem;
}
export declare const MRT_TableBodyCell: ({ cell, measureElement, numRows, rowIndex, rowRef, table, virtualCell, }: Props) => JSX.Element;
export declare const Memo_MRT_TableBodyCell: React.MemoExoticComponent<({ cell, measureElement, numRows, rowIndex, rowRef, table, virtualCell, }: Props) => JSX.Element>;
export {};
