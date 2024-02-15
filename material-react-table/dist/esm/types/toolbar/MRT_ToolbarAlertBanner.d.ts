/// <reference types="react" />
import type { MRT_TableInstance } from '..';
interface Props<TData extends Record<string, any> = {}> {
    stackAlertBanner: boolean;
    table: MRT_TableInstance<TData>;
}
export declare const MRT_ToolbarAlertBanner: <TData extends Record<string, any> = {}>({ stackAlertBanner, table, }: Props<TData>) => JSX.Element;
export {};
