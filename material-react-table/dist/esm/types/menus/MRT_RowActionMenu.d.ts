import { MouseEvent } from 'react';
import type { MRT_Row, MRT_TableInstance } from '..';
interface Props {
    anchorEl: HTMLElement | null;
    handleEdit: (event: MouseEvent) => void;
    row: MRT_Row;
    setAnchorEl: (anchorEl: HTMLElement | null) => void;
    table: MRT_TableInstance;
}
export declare const MRT_RowActionMenu: ({ anchorEl, handleEdit, row, setAnchorEl, table, }: Props) => JSX.Element;
export {};
