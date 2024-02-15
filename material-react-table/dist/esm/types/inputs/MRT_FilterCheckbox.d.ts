/// <reference types="react" />
import type { MRT_Column, MRT_TableInstance } from '..';
interface Props {
    column: MRT_Column;
    table: MRT_TableInstance;
}
export declare const MRT_FilterCheckbox: ({ column, table }: Props) => JSX.Element;
export {};
