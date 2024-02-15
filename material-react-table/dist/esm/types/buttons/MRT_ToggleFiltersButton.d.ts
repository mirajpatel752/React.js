/// <reference types="react" />
import type { IconButtonProps } from '@mui/material/IconButton';
import type { MRT_TableInstance } from '..';
interface Props<TData extends Record<string, any> = {}> extends IconButtonProps {
    table: MRT_TableInstance<TData>;
}
export declare const MRT_ToggleFiltersButton: <TData extends Record<string, any> = {}>({ table, ...rest }: Props<TData>) => JSX.Element;
export {};
