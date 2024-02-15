/// <reference types="react" />
import type { MRT_Header, MRT_TableInstance } from '..';
export declare const commonMenuItemStyles: {
    py: string;
    my: number;
    justifyContent: string;
    alignItems: string;
};
export declare const commonListItemStyles: {
    display: string;
    alignItems: string;
};
interface Props {
    anchorEl: HTMLElement | null;
    header: MRT_Header;
    setAnchorEl: (anchorEl: HTMLElement | null) => void;
    table: MRT_TableInstance;
}
export declare const MRT_ColumnActionMenu: ({ anchorEl, header, setAnchorEl, table, }: Props) => JSX.Element;
export {};
