/// <reference types="react" />
import type { MRT_TableInstance } from '..';
interface Props<TData extends Record<string, any> = {}> {
    anchorEl: HTMLElement | null;
    isSubMenu?: boolean;
    setAnchorEl: (anchorEl: HTMLElement | null) => void;
    table: MRT_TableInstance<TData>;
}
export declare const MRT_ShowHideColumnsMenu: <TData extends Record<string, any> = {}>({ anchorEl, setAnchorEl, table, }: Props<TData>) => JSX.Element;
export {};
