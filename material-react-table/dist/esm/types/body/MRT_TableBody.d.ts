import React from 'react';
import { type VirtualItem, type Virtualizer } from '@tanstack/react-virtual';
import type { MRT_TableInstance } from '..';
interface Props {
    columnVirtualizer?: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
    table: MRT_TableInstance;
    virtualColumns?: VirtualItem[];
    virtualPaddingLeft?: number;
    virtualPaddingRight?: number;
}
export declare const MRT_TableBody: ({ columnVirtualizer, table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, }: Props) => JSX.Element;
export declare const Memo_MRT_TableBody: React.MemoExoticComponent<({ columnVirtualizer, table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, }: Props) => JSX.Element>;
export {};
