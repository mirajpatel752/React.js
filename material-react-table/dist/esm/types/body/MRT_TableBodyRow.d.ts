import React from 'react';
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual';
import type { MRT_Row, MRT_TableInstance } from '..';
interface Props {
    columnVirtualizer?: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
    measureElement?: (element: HTMLTableRowElement) => void;
    numRows: number;
    row: MRT_Row;
    rowIndex: number;
    table: MRT_TableInstance;
    virtualColumns?: VirtualItem[];
    virtualPaddingLeft?: number;
    virtualPaddingRight?: number;
    virtualRow?: VirtualItem;
}
export declare const MRT_TableBodyRow: ({ columnVirtualizer, measureElement, numRows, row, rowIndex, table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, virtualRow, }: Props) => JSX.Element;
export declare const Memo_MRT_TableBodyRow: React.MemoExoticComponent<({ columnVirtualizer, measureElement, numRows, row, rowIndex, table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, virtualRow, }: Props) => JSX.Element>;
export {};
