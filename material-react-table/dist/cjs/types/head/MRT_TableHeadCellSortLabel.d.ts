/// <reference types="react" />
import { MRT_Header, MRT_TableInstance } from '..';
import type { TableCellProps } from '@mui/material/TableCell';
interface Props {
    header: MRT_Header;
    table: MRT_TableInstance;
    tableCellProps?: TableCellProps;
}
export declare const MRT_TableHeadCellSortLabel: ({ header, table, tableCellProps, }: Props) => JSX.Element;
export {};
