import React from 'react';
import type { VirtualItem } from '@tanstack/react-virtual';
import type { MRT_Row, MRT_TableInstance } from '..';
interface Props {
    parentRowRef: React.RefObject<HTMLTableRowElement>;
    row: MRT_Row;
    rowIndex: number;
    table: MRT_TableInstance;
    virtualRow?: VirtualItem;
}
export declare const MRT_TableDetailPanel: ({ parentRowRef, row, rowIndex, table, virtualRow, }: Props) => JSX.Element;
export {};
