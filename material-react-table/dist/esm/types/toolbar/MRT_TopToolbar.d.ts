/// <reference types="react" />
import type { MRT_TableInstance } from '..';
import type { Theme } from '@mui/material/styles';
export declare const commonToolbarStyles: ({ theme }: {
    theme: Theme;
}) => {
    alignItems: string;
    backgroundColor: string;
    backgroundImage: string;
    display: string;
    flexWrap: string;
    minHeight: string;
    overflow: string;
    p: string;
    transition: string;
    zIndex: number;
};
interface Props<TData extends Record<string, any> = {}> {
    table: MRT_TableInstance<TData>;
}
export declare const MRT_TopToolbar: <TData extends Record<string, any> = {}>({ table, }: Props<TData>) => JSX.Element;
export {};
