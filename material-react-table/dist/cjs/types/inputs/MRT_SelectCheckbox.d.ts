/// <reference types="react" />
import type { MRT_Row, MRT_TableInstance } from '..';
interface Props {
    row?: MRT_Row;
    selectAll?: boolean;
    table: MRT_TableInstance;
}
export declare const MRT_SelectCheckbox: ({ row, selectAll, table }: Props) => JSX.Element;
export {};
