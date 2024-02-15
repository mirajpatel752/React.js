/// <reference types="react" />
import type { MRT_Header, MRT_TableInstance } from '..';
interface Props {
    header: MRT_Header;
    rangeFilterIndex?: number;
    table: MRT_TableInstance;
}
export declare const MRT_FilterTextField: ({ header, rangeFilterIndex, table, }: Props) => JSX.Element;
export {};
