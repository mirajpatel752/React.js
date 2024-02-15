/// <reference types="react" />
import type { VirtualItem } from '@tanstack/react-virtual';
import type { MRT_TableInstance } from '..';
interface Props {
    table: MRT_TableInstance;
    virtualColumns?: VirtualItem[];
    virtualPaddingLeft?: number;
    virtualPaddingRight?: number;
}
export declare const MRT_TableHead: ({ table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, }: Props) => JSX.Element;
export {};
