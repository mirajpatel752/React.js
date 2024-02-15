/// <reference types="react" />
import type { VirtualItem } from '@tanstack/react-virtual';
import type { MRT_HeaderGroup, MRT_TableInstance } from '..';
interface Props {
    headerGroup: MRT_HeaderGroup;
    table: MRT_TableInstance;
    virtualColumns?: VirtualItem[];
    virtualPaddingLeft?: number;
    virtualPaddingRight?: number;
}
export declare const MRT_TableHeadRow: ({ headerGroup, table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, }: Props) => JSX.Element;
export {};
