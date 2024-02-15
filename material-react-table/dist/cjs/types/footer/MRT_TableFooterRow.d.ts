/// <reference types="react" />
import type { VirtualItem } from '@tanstack/react-virtual';
import type { MRT_HeaderGroup, MRT_TableInstance } from '..';
interface Props {
    footerGroup: MRT_HeaderGroup;
    table: MRT_TableInstance;
    virtualColumns?: VirtualItem[];
    virtualPaddingLeft?: number;
    virtualPaddingRight?: number;
}
export declare const MRT_TableFooterRow: ({ footerGroup, table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, }: Props) => JSX.Element | null;
export {};
