import React, { useMemo, useState, useRef, useCallback, useEffect, Fragment, memo, useLayoutEffect } from 'react';
import { aggregationFns, filterFns, sortingFns, useReactTable, getCoreRowModel, getExpandedRowModel, getFacetedRowModel, getFilteredRowModel, getGroupedRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { alpha, lighten, useTheme, darken } from '@mui/material/styles';
import { rankItem, rankings, compareItems } from '@tanstack/match-sorter-utils';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CancelIcon from '@mui/icons-material/Cancel';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from '@mui/icons-material/Close';
import DensityLargeIcon from '@mui/icons-material/DensityLarge';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PushPinIcon from '@mui/icons-material/PushPin';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import SortIcon from '@mui/icons-material/Sort';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import Collapse from '@mui/material/Collapse';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { debounce } from '@mui/material/utils';
import LinearProgress from '@mui/material/LinearProgress';
import TablePagination from '@mui/material/TablePagination';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import TableContainer from '@mui/material/TableContainer';
import { useVirtualizer, defaultRangeExtractor } from '@tanstack/react-virtual';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Badge from '@mui/material/Badge';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableBody from '@mui/material/TableBody';
import Skeleton from '@mui/material/Skeleton';
import highlightWords from 'highlight-words';
import TableFooter from '@mui/material/TableFooter';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
}

const MRT_AggregationFns = Object.assign({}, aggregationFns);

const getColumnId = (columnDef) => { var _a, _b, _c, _d; return (_d = (_a = columnDef.id) !== null && _a !== void 0 ? _a : (_c = (_b = columnDef.accessorKey) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b)) !== null && _d !== void 0 ? _d : columnDef.header; };
const getAllLeafColumnDefs = (columns) => {
    const allLeafColumnDefs = [];
    const getLeafColumns = (cols) => {
        cols.forEach((col) => {
            if (col.columns) {
                getLeafColumns(col.columns);
            }
            else {
                allLeafColumnDefs.push(col);
            }
        });
    };
    getLeafColumns(columns);
    return allLeafColumnDefs;
};
const prepareColumns = ({ aggregationFns, columnDefs, columnFilterFns, defaultDisplayColumn, filterFns, sortingFns, }) => columnDefs.map((columnDef) => {
    var _a, _b;
    //assign columnId
    if (!columnDef.id)
        columnDef.id = getColumnId(columnDef);
    if (process.env.NODE_ENV !== 'production' && !columnDef.id) {
        console.error('Column definitions must have a valid `accessorKey` or `id` property');
    }
    //assign columnDefType
    if (!columnDef.columnDefType)
        columnDef.columnDefType = 'data';
    if ((_a = columnDef.columns) === null || _a === void 0 ? void 0 : _a.length) {
        columnDef.columnDefType = 'group';
        //recursively prepare columns if this is a group column
        columnDef.columns = prepareColumns({
            aggregationFns,
            columnDefs: columnDef.columns,
            columnFilterFns,
            defaultDisplayColumn,
            filterFns,
            sortingFns,
        });
    }
    else if (columnDef.columnDefType === 'data') {
        //assign aggregationFns if multiple aggregationFns are provided
        if (Array.isArray(columnDef.aggregationFn)) {
            const aggFns = columnDef.aggregationFn;
            columnDef.aggregationFn = (columnId, leafRows, childRows) => aggFns.map((fn) => { var _a; return (_a = aggregationFns[fn]) === null || _a === void 0 ? void 0 : _a.call(aggregationFns, columnId, leafRows, childRows); });
        }
        //assign filterFns
        if (Object.keys(filterFns).includes(columnFilterFns[columnDef.id])) {
            columnDef.filterFn =
                (_b = filterFns[columnFilterFns[columnDef.id]]) !== null && _b !== void 0 ? _b : filterFns.fuzzy;
            columnDef._filterFn =
                columnFilterFns[columnDef.id];
        }
        //assign sortingFns
        if (Object.keys(sortingFns).includes(columnDef.sortingFn)) {
            // @ts-ignore
            columnDef.sortingFn = sortingFns[columnDef.sortingFn];
        }
    }
    else if (columnDef.columnDefType === 'display') {
        columnDef = Object.assign(Object.assign({}, defaultDisplayColumn), columnDef);
    }
    return columnDef;
});
const reorderColumn = (draggedColumn, targetColumn, columnOrder) => {
    if (draggedColumn.getCanPin()) {
        draggedColumn.pin(targetColumn.getIsPinned());
    }
    columnOrder.splice(columnOrder.indexOf(targetColumn.id), 0, columnOrder.splice(columnOrder.indexOf(draggedColumn.id), 1)[0]);
    return [...columnOrder];
};
const showExpandColumn = (props, grouping) => !!(props.enableExpanding ||
    (props.enableGrouping && (grouping === undefined || (grouping === null || grouping === void 0 ? void 0 : grouping.length))) ||
    props.renderDetailPanel);
const getLeadingDisplayColumnIds = (props) => {
    var _a;
    return [
        (props.enableRowDragging || props.enableRowOrdering) && 'mrt-row-drag',
        props.positionActionsColumn === 'first' &&
        (props.enableRowActions ||
            (props.enableEditing &&
                ['row', 'modal'].includes((_a = props.editingMode) !== null && _a !== void 0 ? _a : ''))) &&
        'mrt-row-actions',
        props.positionExpandColumn === 'first' &&
        showExpandColumn(props) &&
        'mrt-row-expand',
        props.enableRowSelection && 'mrt-row-select',
        props.enableRowNumbers && 'mrt-row-numbers',
    ].filter(Boolean);
};
const getTrailingDisplayColumnIds = (props) => {
    var _a;
    return [
        props.positionActionsColumn === 'last' &&
        (props.enableRowActions ||
            (props.enableEditing &&
                ['row', 'modal'].includes((_a = props.editingMode) !== null && _a !== void 0 ? _a : ''))) &&
        'mrt-row-actions',
        props.positionExpandColumn === 'last' &&
        showExpandColumn(props) &&
        'mrt-row-expand',
    ].filter(Boolean);
};
const getDefaultColumnOrderIds = (props) => {
    const leadingDisplayCols = getLeadingDisplayColumnIds(props);
    const trailingDisplayCols = getTrailingDisplayColumnIds(props);
    const allLeafColumnDefs = getAllLeafColumnDefs(props.columns)
        .map((columnDef) => getColumnId(columnDef))
        .filter((columnId) => !leadingDisplayCols.includes(columnId) &&
            !trailingDisplayCols.includes(columnId));
    return [...leadingDisplayCols, ...allLeafColumnDefs, ...trailingDisplayCols];
};
const getDefaultColumnFilterFn = (columnDef) => {
    if (columnDef.filterVariant === 'multi-select')
        return 'arrIncludesSome';
    if (columnDef.filterVariant === 'range')
        return 'betweenInclusive';
    if (columnDef.filterVariant === 'select' ||
        columnDef.filterVariant === 'checkbox')
        return 'equals';
    return 'fuzzy';
};
const getIsFirstColumn = (column, table) => {
    return table.getVisibleLeafColumns()[0].id === column.id;
};
const getIsLastColumn = (column, table) => {
    const columns = table.getVisibleLeafColumns();
    return columns[columns.length - 1].id === column.id;
};
const getIsLastLeftPinnedColumn = (table, column) => {
    return (column.getIsPinned() === 'left' &&
        table.getLeftLeafHeaders().length - 1 === column.getPinnedIndex());
};
const getIsFirstRightPinnedColumn = (column) => {
    return column.getIsPinned() === 'right' && column.getPinnedIndex() === 0;
};
const getTotalRight = (table, column) => {
    return table
        .getRightLeafHeaders()
        .slice(column.getPinnedIndex() + 1)
        .reduce((acc, col) => acc + col.getSize(), 0);
};
const getCommonCellStyles = ({ column, header, table, tableCellProps, theme, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const widthStyles = {
        minWidth: `max(calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId((_a = header === null || header === void 0 ? void 0 : header.id) !== null && _a !== void 0 ? _a : column.id)}-size) * 1px), ${(_b = column.columnDef.minSize) !== null && _b !== void 0 ? _b : 30}px)`,
        width: `calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId((_c = header === null || header === void 0 ? void 0 : header.id) !== null && _c !== void 0 ? _c : column.id)}-size) * 1px)`,
    };
    return Object.assign(Object.assign(Object.assign({
        backgroundColor: column.getIsPinned() && column.columnDef.columnDefType !== 'group'
            ? alpha(lighten(theme.palette.background.default, 0.04), 0.97)
            : 'inherit', backgroundImage: 'inherit', boxShadow: getIsLastLeftPinnedColumn(table, column)
                ? `-4px 0 8px -6px ${alpha(theme.palette.common.black, 0.2)} inset`
                : getIsFirstRightPinnedColumn(column)
                    ? `4px 0 8px -6px ${alpha(theme.palette.common.black, 0.2)} inset`
                    : undefined, display: table.options.layoutMode === 'grid' ? 'flex' : 'table-cell', flex: table.options.layoutMode === 'grid'
                        ? `var(--${header ? 'header' : 'col'}-${parseCSSVarId((_d = header === null || header === void 0 ? void 0 : header.id) !== null && _d !== void 0 ? _d : column.id)}-size) 0 auto`
                        : undefined, left: column.getIsPinned() === 'left'
                            ? `${column.getStart('left')}px`
                            : undefined, ml: table.options.enableColumnVirtualization &&
                                column.getIsPinned() === 'left' &&
                                column.getPinnedIndex() === 0
                                ? `-${column.getSize() *
                                ((_f = (_e = table.getState().columnPinning.left) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 1)}px`
                                : undefined, mr: table.options.enableColumnVirtualization &&
                                    column.getIsPinned() === 'right' &&
                                    column.getPinnedIndex() === table.getVisibleLeafColumns().length - 1
                                    ? `-${column.getSize() *
                                    ((_h = (_g = table.getState().columnPinning.right) === null || _g === void 0 ? void 0 : _g.length) !== null && _h !== void 0 ? _h : 1) *
                                    1.2}px`
                                    : undefined, opacity: ((_j = table.getState().draggingColumn) === null || _j === void 0 ? void 0 : _j.id) === column.id ||
                                        ((_k = table.getState().hoveredColumn) === null || _k === void 0 ? void 0 : _k.id) === column.id
                                        ? 0.5
                                        : 1, position: column.getIsPinned() && column.columnDef.columnDefType !== 'group'
                                            ? 'sticky'
                                            : undefined, right: column.getIsPinned() === 'right'
                                                ? `${getTotalRight(table, column)}px`
                                                : undefined, transition: table.options.enableColumnVirtualization
                                                    ? 'none'
                                                    : `padding 150ms ease-in-out`
    }, (!table.options.enableColumnResizing && widthStyles)), ((tableCellProps === null || tableCellProps === void 0 ? void 0 : tableCellProps.sx) instanceof Function
        ? tableCellProps.sx(theme)
        : tableCellProps === null || tableCellProps === void 0 ? void 0 : tableCellProps.sx)), (table.options.enableColumnResizing && widthStyles));
};
const MRT_DefaultColumn = {
    filterVariant: 'text',
    minSize: 40,
    maxSize: 1000,
    size: 180,
};
const MRT_DefaultDisplayColumn = {
    columnDefType: 'display',
    enableClickToCopy: false,
    enableColumnActions: false,
    enableColumnDragging: false,
    enableColumnFilter: false,
    enableColumnOrdering: false,
    enableEditing: false,
    enableGlobalFilter: false,
    enableGrouping: false,
    enableHiding: false,
    enableResizing: false,
    enableSorting: false,
};
const parseCSSVarId = (id) => id.replace(/[^a-zA-Z0-9]/g, '_');

const fuzzy$1 = (row, columnId, filterValue, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), filterValue, {
        threshold: rankings.MATCHES,
    });
    addMeta(itemRank);
    return itemRank.passed;
};
fuzzy$1.autoRemove = (val) => !val;
const contains = (row, id, filterValue) => row
    .getValue(id)
    .toString()
    .toLowerCase()
    .trim()
    .includes(filterValue.toString().toLowerCase().trim());
contains.autoRemove = (val) => !val;
const startsWith = (row, id, filterValue) => row
    .getValue(id)
    .toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue.toString().toLowerCase().trim());
startsWith.autoRemove = (val) => !val;
const endsWith = (row, id, filterValue) => row
    .getValue(id)
    .toString()
    .toLowerCase()
    .trim()
    .endsWith(filterValue.toString().toLowerCase().trim());
endsWith.autoRemove = (val) => !val;
const equals = (row, id, filterValue) => row.getValue(id).toString().toLowerCase().trim() ===
    filterValue.toString().toLowerCase().trim();
equals.autoRemove = (val) => !val;
const notEquals = (row, id, filterValue) => row.getValue(id).toString().toLowerCase().trim() !==
    filterValue.toString().toLowerCase().trim();
notEquals.autoRemove = (val) => !val;
const greaterThan = (row, id, filterValue) => !isNaN(+filterValue) && !isNaN(+row.getValue(id))
    ? +row.getValue(id) > +filterValue
    : row.getValue(id).toString().toLowerCase().trim() >
    filterValue.toString().toLowerCase().trim();
greaterThan.autoRemove = (val) => !val;
const greaterThanOrEqualTo = (row, id, filterValue) => equals(row, id, filterValue) || greaterThan(row, id, filterValue);
greaterThanOrEqualTo.autoRemove = (val) => !val;
const lessThan = (row, id, filterValue) => !isNaN(+filterValue) && !isNaN(+row.getValue(id))
    ? +row.getValue(id) < +filterValue
    : row.getValue(id).toString().toLowerCase().trim() <
    filterValue.toString().toLowerCase().trim();
lessThan.autoRemove = (val) => !val;
const lessThanOrEqualTo = (row, id, filterValue) => equals(row, id, filterValue) || lessThan(row, id, filterValue);
lessThanOrEqualTo.autoRemove = (val) => !val;
const between = (row, id, filterValues) => (['', undefined].includes(filterValues[0]) ||
    greaterThan(row, id, filterValues[0])) &&
    ((!isNaN(+filterValues[0]) &&
        !isNaN(+filterValues[1]) &&
        +filterValues[0] > +filterValues[1]) ||
        ['', undefined].includes(filterValues[1]) ||
        lessThan(row, id, filterValues[1]));
between.autoRemove = (val) => !val;
const betweenInclusive = (row, id, filterValues) => (['', undefined].includes(filterValues[0]) ||
    greaterThanOrEqualTo(row, id, filterValues[0])) &&
    ((!isNaN(+filterValues[0]) &&
        !isNaN(+filterValues[1]) &&
        +filterValues[0] > +filterValues[1]) ||
        ['', undefined].includes(filterValues[1]) ||
        lessThanOrEqualTo(row, id, filterValues[1]));
betweenInclusive.autoRemove = (val) => !val;
const empty = (row, id, _filterValue) => !row.getValue(id).toString().trim();
empty.autoRemove = (val) => !val;
const notEmpty = (row, id, _filterValue) => !!row.getValue(id).toString().trim();
notEmpty.autoRemove = (val) => !val;
const MRT_FilterFns = Object.assign(Object.assign({}, filterFns), {
    between,
    betweenInclusive,
    contains,
    empty,
    endsWith,
    equals,
    fuzzy: fuzzy$1,
    greaterThan,
    greaterThanOrEqualTo,
    lessThan,
    lessThanOrEqualTo,
    notEmpty,
    notEquals,
    startsWith
});

const MRT_Default_Icons = {
    ArrowDownwardIcon,
    ArrowRightIcon,
    CancelIcon,
    ClearAllIcon,
    CloseIcon,
    DensityLargeIcon,
    DensityMediumIcon,
    DensitySmallIcon,
    DragHandleIcon,
    DynamicFeedIcon,
    EditIcon,
    ExpandMoreIcon,
    FilterAltIcon,
    FilterListIcon,
    FilterListOffIcon,
    FullscreenExitIcon,
    FullscreenIcon,
    KeyboardDoubleArrowDownIcon,
    MoreHorizIcon,
    MoreVertIcon,
    PushPinIcon,
    RestartAltIcon,
    SaveIcon,
    SearchIcon,
    SearchOffIcon,
    SortIcon,
    ViewColumnIcon,
    VisibilityOffIcon,
};

const fuzzy = (rowA, rowB, columnId) => {
    let dir = 0;
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(rowA.columnFiltersMeta[columnId], rowB.columnFiltersMeta[columnId]);
    }
    // Provide a fallback for when the item ranks are equal
    return dir === 0
        ? sortingFns.alphanumeric(rowA, rowB, columnId)
        : dir;
};
const MRT_SortingFns = Object.assign(Object.assign({}, sortingFns), { fuzzy });
const rankGlobalFuzzy = (rowA, rowB) => Math.max(...Object.values(rowB.columnFiltersMeta).map((v) => v.rank)) -
    Math.max(...Object.values(rowA.columnFiltersMeta).map((v) => v.rank));

const MRT_ExpandAllButton = ({ table }) => {
    var _a, _b;
    const { getIsAllRowsExpanded, getIsSomeRowsExpanded, getCanSomeRowsExpand, getState, options: { icons: { KeyboardDoubleArrowDownIcon }, localization, muiExpandAllButtonProps, renderDetailPanel, }, toggleAllRowsExpanded, } = table;
    const { density, isLoading } = getState();
    const iconButtonProps = muiExpandAllButtonProps instanceof Function
        ? muiExpandAllButtonProps({ table })
        : muiExpandAllButtonProps;
    const isAllRowsExpanded = getIsAllRowsExpanded();
    return (React.createElement(Tooltip, {
        arrow: true, enterDelay: 1000, enterNextDelay: 1000, title: ((_a = iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.title) !== null && _a !== void 0 ? _a : isAllRowsExpanded)
            ? localization.collapseAll
            : localization.expandAll
    },
        React.createElement("span", null,
            React.createElement(IconButton, Object.assign({ "aria-label": localization.expandAll, disabled: isLoading || (!renderDetailPanel && !getCanSomeRowsExpand()), onClick: () => toggleAllRowsExpanded(!isAllRowsExpanded) }, iconButtonProps, {
                sx: (theme) => (Object.assign({ height: density === 'compact' ? '1.75rem' : '2.25rem', width: density === 'compact' ? '1.75rem' : '2.25rem', mt: density !== 'compact' ? '-0.25rem' : undefined }, ((iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.sx) instanceof Function
                    ? iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.sx(theme)
                    : iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.sx))), title: undefined
            }), (_b = iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.children) !== null && _b !== void 0 ? _b : (React.createElement(KeyboardDoubleArrowDownIcon, {
                style: {
                    transform: `rotate(${isAllRowsExpanded ? -180 : getIsSomeRowsExpanded() ? -90 : 0}deg)`,
                    transition: 'transform 150ms',
                }
            }))))));
};

const MRT_ExpandButton = ({ row, table, }) => {
    var _a, _b;
    const { getState, options: { icons: { ExpandMoreIcon }, localization, muiExpandButtonProps, renderDetailPanel, }, } = table;
    const { density } = getState();
    const iconButtonProps = muiExpandButtonProps instanceof Function
        ? muiExpandButtonProps({ table, row })
        : muiExpandButtonProps;
    const canExpand = row.getCanExpand();
    const isExpanded = row.getIsExpanded();
    const handleToggleExpand = (event) => {
        var _a;
        event.stopPropagation();
        row.toggleExpanded();
        (_a = iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.onClick) === null || _a === void 0 ? void 0 : _a.call(iconButtonProps, event);
    };
    return (React.createElement(Tooltip, {
        arrow: true, disableHoverListener: !canExpand && !renderDetailPanel, enterDelay: 1000, enterNextDelay: 1000, title: ((_a = iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.title) !== null && _a !== void 0 ? _a : isExpanded)
            ? localization.collapse
            : localization.expand
    },
        React.createElement("span", null,
            React.createElement(IconButton, Object.assign({ "aria-label": localization.expand, disabled: !canExpand && !renderDetailPanel }, iconButtonProps, {
                onClick: handleToggleExpand, sx: (theme) => (Object.assign({ height: density === 'compact' ? '1.75rem' : '2.25rem', width: density === 'compact' ? '1.75rem' : '2.25rem' }, ((iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.sx) instanceof Function
                    ? iconButtonProps.sx(theme)
                    : iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.sx))), title: undefined
            }), (_b = iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.children) !== null && _b !== void 0 ? _b : (React.createElement(ExpandMoreIcon, {
                style: {
                    transform: `rotate(${!canExpand && !renderDetailPanel ? -90 : isExpanded ? -180 : 0}deg)`,
                    transition: 'transform 150ms',
                }
            }))))));
};

const mrtFilterOptions = (localization) => [
    {
        option: 'fuzzy',
        symbol: '≈',
        label: localization.filterFuzzy,
        divider: false,
    },
    {
        option: 'contains',
        symbol: '*',
        label: localization.filterContains,
        divider: false,
    },
    {
        option: 'startsWith',
        symbol: 'a',
        label: localization.filterStartsWith,
        divider: false,
    },
    {
        option: 'endsWith',
        symbol: 'z',
        label: localization.filterEndsWith,
        divider: true,
    },
    {
        option: 'equals',
        symbol: '=',
        label: localization.filterEquals,
        divider: false,
    },
    {
        option: 'notEquals',
        symbol: '≠',
        label: localization.filterNotEquals,
        divider: true,
    },
    {
        option: 'between',
        symbol: '⇿',
        label: localization.filterBetween,
        divider: false,
    },
    {
        option: 'betweenInclusive',
        symbol: '⬌',
        label: localization.filterBetweenInclusive,
        divider: true,
    },
    {
        option: 'greaterThan',
        symbol: '>',
        label: localization.filterGreaterThan,
        divider: false,
    },
    {
        option: 'greaterThanOrEqualTo',
        symbol: '≥',
        label: localization.filterGreaterThanOrEqualTo,
        divider: false,
    },
    {
        option: 'lessThan',
        symbol: '<',
        label: localization.filterLessThan,
        divider: false,
    },
    {
        option: 'lessThanOrEqualTo',
        symbol: '≤',
        label: localization.filterLessThanOrEqualTo,
        divider: true,
    },
    {
        option: 'empty',
        symbol: '∅',
        label: localization.filterEmpty,
        divider: false,
    },
    {
        option: 'notEmpty',
        symbol: '!∅',
        label: localization.filterNotEmpty,
        divider: false,
    },
];
const rangeModes = ['between', 'betweenInclusive', 'inNumberRange'];
const emptyModes = ['empty', 'notEmpty'];
const arrModes = ['arrIncludesSome', 'arrIncludesAll', 'arrIncludes'];
const MRT_FilterOptionMenu = ({ anchorEl, header, onSelect, setAnchorEl, setFilterValue, table, }) => {
    var _a, _b, _c, _d;
    const { getState, options: { columnFilterModeOptions, globalFilterModeOptions, localization, renderColumnFilterModeMenuItems, renderGlobalFilterModeMenuItems, }, setColumnFilterFns, setGlobalFilterFn, } = table;
    const { globalFilterFn, density } = getState();
    const { column } = header !== null && header !== void 0 ? header : {};
    const { columnDef } = column !== null && column !== void 0 ? column : {};
    const currentFilterValue = column === null || column === void 0 ? void 0 : column.getFilterValue();
    const allowedColumnFilterOptions = (_a = columnDef === null || columnDef === void 0 ? void 0 : columnDef.columnFilterModeOptions) !== null && _a !== void 0 ? _a : columnFilterModeOptions;
    const internalFilterOptions = useMemo(() => mrtFilterOptions(localization).filter((filterOption) => columnDef
        ? allowedColumnFilterOptions === undefined ||
        (allowedColumnFilterOptions === null || allowedColumnFilterOptions === void 0 ? void 0 : allowedColumnFilterOptions.includes(filterOption.option))
        : (!globalFilterModeOptions ||
            globalFilterModeOptions.includes(filterOption.option)) &&
        ['fuzzy', 'contains', 'startsWith'].includes(filterOption.option)), []);
    const handleSelectFilterMode = (option) => {
        var _a;
        const prevFilterMode = (_a = columnDef === null || columnDef === void 0 ? void 0 : columnDef._filterFn) !== null && _a !== void 0 ? _a : '';
        if (!header || !column) {
            // global filter mode
            setGlobalFilterFn(option);
        }
        else if (option !== prevFilterMode) {
            // column filter mode
            setColumnFilterFns((prev) => (Object.assign(Object.assign({}, prev), { [header.id]: option })));
            // reset filter value and/or perform new filter render
            if (emptyModes.includes(option)) {
                // will now be empty/notEmpty filter mode
                if (currentFilterValue !== ' ' &&
                    !emptyModes.includes(prevFilterMode)) {
                    column.setFilterValue(' ');
                }
                else if (currentFilterValue) {
                    column.setFilterValue(currentFilterValue); // perform new filter render
                }
            }
            else if ((columnDef === null || columnDef === void 0 ? void 0 : columnDef.filterVariant) === 'multi-select' ||
                arrModes.includes(option)) {
                // will now be array filter mode
                if (currentFilterValue instanceof String ||
                    (currentFilterValue === null || currentFilterValue === void 0 ? void 0 : currentFilterValue.length)) {
                    column.setFilterValue([]);
                    setFilterValue === null || setFilterValue === void 0 ? void 0 : setFilterValue([]);
                }
                else if (currentFilterValue) {
                    column.setFilterValue(currentFilterValue); // perform new filter render
                }
            }
            else if ((columnDef === null || columnDef === void 0 ? void 0 : columnDef.filterVariant) === 'range' ||
                rangeModes.includes(option)) {
                // will now be range filter mode
                if (!Array.isArray(currentFilterValue) ||
                    (!(currentFilterValue === null || currentFilterValue === void 0 ? void 0 : currentFilterValue.every((v) => v === '')) &&
                        !rangeModes.includes(prevFilterMode))) {
                    column.setFilterValue(['', '']);
                    setFilterValue === null || setFilterValue === void 0 ? void 0 : setFilterValue('');
                }
                else {
                    column.setFilterValue(currentFilterValue); // perform new filter render
                }
            }
            else {
                // will now be single value filter mode
                if (Array.isArray(currentFilterValue)) {
                    column.setFilterValue('');
                    setFilterValue === null || setFilterValue === void 0 ? void 0 : setFilterValue('');
                }
                else {
                    column.setFilterValue(currentFilterValue); // perform new filter render
                }
            }
        }
        setAnchorEl(null);
        onSelect === null || onSelect === void 0 ? void 0 : onSelect();
    };
    const filterOption = !!header && columnDef ? columnDef._filterFn : globalFilterFn;
    return (React.createElement(Menu, {
        anchorEl: anchorEl, anchorOrigin: { vertical: 'center', horizontal: 'right' }, onClose: () => setAnchorEl(null), open: !!anchorEl, MenuListProps: {
            dense: density === 'compact',
        }
    }, (_d = (header && column && columnDef
        ? (_c = (_b = columnDef.renderColumnFilterModeMenuItems) === null || _b === void 0 ? void 0 : _b.call(columnDef, {
            column: column,
            internalFilterOptions,
            onSelectFilterMode: handleSelectFilterMode,
            table,
        })) !== null && _c !== void 0 ? _c : renderColumnFilterModeMenuItems === null || renderColumnFilterModeMenuItems === void 0 ? void 0 : renderColumnFilterModeMenuItems({
            column: column,
            internalFilterOptions,
            onSelectFilterMode: handleSelectFilterMode,
            table,
        })
        : renderGlobalFilterModeMenuItems === null || renderGlobalFilterModeMenuItems === void 0 ? void 0 : renderGlobalFilterModeMenuItems({
            internalFilterOptions,
            onSelectFilterMode: handleSelectFilterMode,
            table,
        }))) !== null && _d !== void 0 ? _d : internalFilterOptions.map(({ option, label, divider, symbol }, index) => (React.createElement(MenuItem, {
            divider: divider, key: index, onClick: () => handleSelectFilterMode(option), selected: option === filterOption, sx: {
                alignItems: 'center',
                display: 'flex',
                gap: '2ch',
                my: 0,
                py: '6px',
            }, value: option
        },
            React.createElement(Box, { sx: { fontSize: '1.25rem', width: '2ch' } }, symbol),
            label)))));
};

const commonMenuItemStyles = {
    py: '6px',
    my: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
};
const commonListItemStyles = {
    display: 'flex',
    alignItems: 'center',
};
const MRT_ColumnActionMenu = ({ anchorEl, header, setAnchorEl, table, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const { getState, toggleAllColumnsVisible, setColumnOrder, options: { columnFilterModeOptions, enableColumnFilterModes, enableColumnFilters, enableColumnResizing, enableGrouping, enableHiding, enablePinning, enableSorting, enableSortingRemoval, icons: { ArrowRightIcon, ClearAllIcon, ViewColumnIcon, DynamicFeedIcon, FilterListIcon, FilterListOffIcon, PushPinIcon, SortIcon, RestartAltIcon, VisibilityOffIcon, }, localization, renderColumnActionsMenuItems, }, refs: { filterInputRefs }, setColumnSizingInfo, setShowColumnFilters, } = table;
    const { column } = header;
    const { columnDef } = column;
    const { columnSizing, columnVisibility, density, showColumnFilters } = getState();
    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
    const handleClearSort = () => {
        column.clearSorting();
        setAnchorEl(null);
    };
    const handleSortAsc = () => {
        column.toggleSorting(false);
        setAnchorEl(null);
    };
    const handleSortDesc = () => {
        column.toggleSorting(true);
        setAnchorEl(null);
    };
    const handleResetColumnSize = () => {
        setColumnSizingInfo((old) => (Object.assign(Object.assign({}, old), { isResizingColumn: false })));
        column.resetSize();
        setAnchorEl(null);
    };
    const handleHideColumn = () => {
        column.toggleVisibility(false);
        setAnchorEl(null);
    };
    const handlePinColumn = (pinDirection) => {
        column.pin(pinDirection);
        setAnchorEl(null);
    };
    const handleGroupByColumn = () => {
        column.toggleGrouping();
        setColumnOrder((old) => ['mrt-row-expand', ...old]);
        setAnchorEl(null);
    };
    const handleClearFilter = () => {
        column.setFilterValue('');
        setAnchorEl(null);
    };
    const handleFilterByColumn = () => {
        setShowColumnFilters(true);
        queueMicrotask(() => { var _a; return (_a = filterInputRefs.current[`${column.id}-0`]) === null || _a === void 0 ? void 0 : _a.focus(); });
        setAnchorEl(null);
    };
    const handleShowAllColumns = () => {
        toggleAllColumnsVisible(true);
        setAnchorEl(null);
    };
    const handleOpenFilterModeMenu = (event) => {
        event.stopPropagation();
        setFilterMenuAnchorEl(event.currentTarget);
    };
    const isSelectFilter = !!columnDef.filterSelectOptions;
    const allowedColumnFilterOptions = (_a = columnDef === null || columnDef === void 0 ? void 0 : columnDef.columnFilterModeOptions) !== null && _a !== void 0 ? _a : columnFilterModeOptions;
    const showFilterModeSubMenu = enableColumnFilterModes &&
        columnDef.enableColumnFilterModes !== false &&
        !isSelectFilter &&
        (allowedColumnFilterOptions === undefined ||
            !!(allowedColumnFilterOptions === null || allowedColumnFilterOptions === void 0 ? void 0 : allowedColumnFilterOptions.length));
    return (React.createElement(Menu, {
        anchorEl: anchorEl, open: !!anchorEl, onClose: () => setAnchorEl(null), MenuListProps: {
            dense: density === 'compact',
        }, className: 'munim-header-column-action-popover'
    }, (_d = (_c = (_b = columnDef.renderColumnActionsMenuItems) === null || _b === void 0 ? void 0 : _b.call(columnDef, {
        closeMenu: () => setAnchorEl(null),
        column,
        table,
    })) !== null && _c !== void 0 ? _c : renderColumnActionsMenuItems === null || renderColumnActionsMenuItems === void 0 ? void 0 : renderColumnActionsMenuItems({
        closeMenu: () => setAnchorEl(null),
        column,
        table,
    })) !== null && _d !== void 0 ? _d : (enableSorting &&
        column.getCanSort() &&
        [
            enableSortingRemoval !== false && (React.createElement(MenuItem, { disabled: !column.getIsSorted(), key: 0, onClick: handleClearSort, sx: commonMenuItemStyles },
                React.createElement(Box, { sx: commonListItemStyles },
                    React.createElement(ListItemIcon, null,
                        React.createElement(ClearAllIcon, null)),
                    localization.clearSort))),
            React.createElement(MenuItem, { disabled: column.getIsSorted() === 'asc', key: 1, onClick: handleSortAsc, sx: commonMenuItemStyles },
                React.createElement(Box, { sx: commonListItemStyles },
                    React.createElement(ListItemIcon, null,
                        React.createElement(SortIcon, { style: { transform: 'rotate(180deg) scaleX(-1)' } })), (_e = localization.sortByColumnAsc) === null || _e === void 0 ? void 0 :
                    _e.replace('{column}', String(columnDef.header)))),
            React.createElement(MenuItem, { divider: enableColumnFilters || enableGrouping || enableHiding, key: 2, disabled: column.getIsSorted() === 'desc', onClick: handleSortDesc, sx: commonMenuItemStyles },
                React.createElement(Box, { sx: commonListItemStyles },
                    React.createElement(ListItemIcon, null,
                        React.createElement(SortIcon, null)), (_f = localization.sortByColumnDesc) === null || _f === void 0 ? void 0 :
                    _f.replace('{column}', String(columnDef.header)))),
        ].filter(Boolean)),
        enableColumnFilters &&
        column.getCanFilter() &&
        [
            React.createElement(MenuItem, { disabled: !column.getFilterValue(), key: 0, onClick: handleClearFilter, sx: commonMenuItemStyles },
                React.createElement(Box, { sx: commonListItemStyles },
                    React.createElement(ListItemIcon, null,
                        React.createElement(FilterListOffIcon, null)),
                    localization.clearFilter)),
            React.createElement(MenuItem, {
                disabled: showColumnFilters && !enableColumnFilterModes, divider: enableGrouping || enableHiding, key: 1, onClick: showColumnFilters
                    ? handleOpenFilterModeMenu
                    : handleFilterByColumn, sx: commonMenuItemStyles
            },
                React.createElement(Box, { sx: commonListItemStyles },
                    React.createElement(ListItemIcon, null,
                        React.createElement(FilterListIcon, null)), (_g = localization.filterByColumn) === null || _g === void 0 ? void 0 :
                    _g.replace('{column}', String(columnDef.header))),
                showFilterModeSubMenu && (React.createElement(IconButton, { onClick: handleOpenFilterModeMenu, onMouseEnter: handleOpenFilterModeMenu, size: "small", sx: { p: 0 } },
                    React.createElement(ArrowRightIcon, null)))),
            showFilterModeSubMenu && (React.createElement(MRT_FilterOptionMenu, { anchorEl: filterMenuAnchorEl, header: header, key: 2, onSelect: handleFilterByColumn, setAnchorEl: setFilterMenuAnchorEl, table: table })),
        ].filter(Boolean),
        enableGrouping &&
        column.getCanGroup() && [
            React.createElement(MenuItem, { divider: enablePinning, key: 0, onClick: handleGroupByColumn, sx: commonMenuItemStyles },
                React.createElement(Box, { sx: commonListItemStyles },
                    React.createElement(ListItemIcon, null,
                        React.createElement(DynamicFeedIcon, null)), (_h = localization[column.getIsGrouped() ? 'ungroupByColumn' : 'groupByColumn']) === null || _h === void 0 ? void 0 :
                    _h.replace('{column}', String(columnDef.header)))),
        ],
        enablePinning &&
        column.getCanPin() && [
            React.createElement(MenuItem, { disabled: column.getIsPinned() === 'left' || !column.getCanPin(), key: 0, onClick: () => handlePinColumn('left'), sx: commonMenuItemStyles },
                React.createElement(Box, { sx: commonListItemStyles },
                    React.createElement(ListItemIcon, null,
                        React.createElement(PushPinIcon, { style: { transform: 'rotate(90deg)' } })),
                    localization.pinToLeft)),
            // React.createElement(MenuItem, { disabled: column.getIsPinned() === 'right' || !column.getCanPin(), key: 1, onClick: () => handlePinColumn('right'), sx: commonMenuItemStyles },
            //     React.createElement(Box, { sx: commonListItemStyles },
            //         React.createElement(ListItemIcon, null,
            //             React.createElement(PushPinIcon, { style: { transform: 'rotate(-90deg)' } })),
            //         localization.pinToRight)),
            React.createElement(MenuItem, { disabled: !column.getIsPinned(), divider: enableHiding, key: 2, onClick: () => handlePinColumn(false), sx: commonMenuItemStyles },
                React.createElement(Box, { sx: commonListItemStyles },
                    React.createElement(ListItemIcon, null,
                        React.createElement(PushPinIcon, null)),
                    localization.unpin)),
        ],
        enableColumnResizing &&
        column.getCanResize() && [
            React.createElement(MenuItem, { disabled: !columnSizing[column.id], key: 0, onClick: handleResetColumnSize, sx: commonMenuItemStyles },
                React.createElement(Box, { sx: commonListItemStyles },
                    React.createElement(ListItemIcon, null,
                        React.createElement(RestartAltIcon, null)),
                    localization.resetColumnSize)),
        ],
        enableHiding && [
            React.createElement(MenuItem, { disabled: !column.getCanHide(), key: 0, onClick: handleHideColumn, sx: commonMenuItemStyles },
                React.createElement(Box, { sx: commonListItemStyles },
                    React.createElement(ListItemIcon, null,
                        React.createElement(VisibilityOffIcon, null)), (_j = localization.hideColumn) === null || _j === void 0 ? void 0 :
                    _j.replace('{column}', String(columnDef.header)))),
            React.createElement(MenuItem, {
                disabled: !Object.values(columnVisibility).filter((visible) => !visible)
                    .length, key: 1, onClick: handleShowAllColumns, sx: commonMenuItemStyles
            },
                React.createElement(Box, { sx: commonListItemStyles },
                    React.createElement(ListItemIcon, null,
                        React.createElement(ViewColumnIcon, null)), (_k = localization.showAllColumns) === null || _k === void 0 ? void 0 :
                    _k.replace('{column}', String(columnDef.header)))),
        ]));
};

const MRT_RowActionMenu = ({ anchorEl, handleEdit, row, setAnchorEl, table, }) => {
    const { getState, options: { icons: { EditIcon }, enableEditing, localization, renderRowActionMenuItems, }, } = table;
    const { density } = getState();
    return (React.createElement(Menu, {
        anchorEl: anchorEl, open: !!anchorEl, onClick: (event) => event.stopPropagation(), onClose: () => setAnchorEl(null), MenuListProps: {
            dense: density === 'compact',
        }
    },
        enableEditing instanceof Function
            ? enableEditing(row)
            : enableEditing && (React.createElement(MenuItem, { onClick: handleEdit, sx: commonMenuItemStyles },
                React.createElement(Box, { sx: commonListItemStyles },
                    React.createElement(ListItemIcon, null,
                        React.createElement(EditIcon, null)),
                    localization.edit))), renderRowActionMenuItems === null || renderRowActionMenuItems === void 0 ? void 0 :
        renderRowActionMenuItems({
            row,
            table,
            closeMenu: () => setAnchorEl(null),
        })));
};

const MRT_EditActionButtons = ({ row, table, variant = 'icon', }) => {
    const { getState, options: { icons: { CancelIcon, SaveIcon }, localization, onEditingRowSave, onEditingRowCancel, }, refs: { editInputRefs }, setEditingRow, } = table;
    const { editingRow } = getState();
    const handleCancel = () => {
        onEditingRowCancel === null || onEditingRowCancel === void 0 ? void 0 : onEditingRowCancel({ row, table });
        setEditingRow(null);
    };
    const handleSave = () => {
        var _a, _b;
        //look for auto-filled input values
        (_a = Object.values(editInputRefs === null || editInputRefs === void 0 ? void 0 : editInputRefs.current)) === null || _a === void 0 ? void 0 : _a.forEach((input) => {
            if (input.value !== undefined &&
                Object.hasOwn(editingRow === null || editingRow === void 0 ? void 0 : editingRow._valuesCache, input.name)) {
                // @ts-ignore
                editingRow._valuesCache[input.name] = input.value;
            }
        });
        onEditingRowSave === null || onEditingRowSave === void 0 ? void 0 : onEditingRowSave({
            exitEditingMode: () => setEditingRow(null),
            row: editingRow !== null && editingRow !== void 0 ? editingRow : row,
            table,
            values: (_b = editingRow === null || editingRow === void 0 ? void 0 : editingRow._valuesCache) !== null && _b !== void 0 ? _b : Object.assign({}, row.original),
        });
    };
    return (React.createElement(Box, { onClick: (e) => e.stopPropagation(), sx: { display: 'flex', gap: '0.75rem' } }, variant === 'icon' ? (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { arrow: true, title: localization.cancel },
            React.createElement(IconButton, { "aria-label": localization.cancel, onClick: handleCancel },
                React.createElement(CancelIcon, null))),
        React.createElement(Tooltip, { arrow: true, title: localization.save },
            React.createElement(IconButton, { "aria-label": localization.save, color: "info", onClick: handleSave },
                React.createElement(SaveIcon, null))))) : (React.createElement(React.Fragment, null,
                    React.createElement(Button, { onClick: handleCancel }, localization.cancel),
                    React.createElement(Button, { onClick: handleSave, variant: "contained" }, localization.save)))));
};

const commonIconButtonStyles = {
    height: '2rem',
    ml: '10px',
    opacity: 0.5,
    transition: 'opacity 150ms',
    width: '2rem',
    '&:hover': {
        opacity: 1,
    },
};
const MRT_ToggleRowActionMenuButton = ({ cell, row, table, }) => {
    const { getState, options: { editingMode, enableEditing, icons: { EditIcon, MoreHorizIcon }, localization, renderRowActionMenuItems, renderRowActions, }, setEditingRow, } = table;
    const { editingRow } = getState();
    const [anchorEl, setAnchorEl] = useState(null);
    const handleOpenRowActionMenu = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    const handleStartEditMode = (event) => {
        event.stopPropagation();
        setEditingRow(Object.assign({}, row));
        setAnchorEl(null);
    };
    return (React.createElement(React.Fragment, null, renderRowActions ? (renderRowActions({ cell, row, table })) : row.id === (editingRow === null || editingRow === void 0 ? void 0 : editingRow.id) && editingMode === 'row' ? (React.createElement(MRT_EditActionButtons, { row: row, table: table })) : !renderRowActionMenuItems &&
        (enableEditing instanceof Function
            ? enableEditing(row)
            : enableEditing) ? (React.createElement(Tooltip, { placement: "right", arrow: true, title: localization.edit },
                React.createElement(IconButton, { "aria-label": localization.edit, sx: commonIconButtonStyles, onClick: handleStartEditMode },
                    React.createElement(EditIcon, null)))) : renderRowActionMenuItems ? (React.createElement(React.Fragment, null,
                        React.createElement(Tooltip, { arrow: true, enterDelay: 1000, enterNextDelay: 1000, title: localization.rowActions },
                            React.createElement(IconButton, { "aria-label": localization.rowActions, onClick: handleOpenRowActionMenu, size: "small", sx: commonIconButtonStyles },
                                React.createElement(MoreHorizIcon, null))),
                        React.createElement(MRT_RowActionMenu, { anchorEl: anchorEl, handleEdit: handleStartEditMode, row: row, setAnchorEl: setAnchorEl, table: table }))) : null));
};

const MRT_SelectCheckbox = ({ row, selectAll, table }) => {
    var _a;
    const { getState, options: { localization, enableMultiRowSelection, muiSelectCheckboxProps, muiSelectAllCheckboxProps, selectAllMode, }, } = table;
    const { density, isLoading } = getState();
    const checkboxProps = !row
        ? muiSelectAllCheckboxProps instanceof Function
            ? muiSelectAllCheckboxProps({ table })
            : muiSelectAllCheckboxProps
        : muiSelectCheckboxProps instanceof Function
            ? muiSelectCheckboxProps({ row, table })
            : muiSelectCheckboxProps;
    const allRowsSelected = selectAll
        ? selectAllMode === 'page'
            ? table.getIsAllPageRowsSelected()
            : table.getIsAllRowsSelected()
        : undefined;
    const commonProps = Object.assign(Object.assign({
        checked: selectAll ? allRowsSelected : row === null || row === void 0 ? void 0 : row.getIsSelected(), disabled: isLoading || (row && !row.getCanSelect()), inputProps: {
            'aria-label': selectAll
                ? localization.toggleSelectAll
                : localization.toggleSelectRow,
        }, onChange: row
            ? row.getToggleSelectedHandler()
            : selectAllMode === 'all'
                ? table.getToggleAllRowsSelectedHandler()
                : table.getToggleAllPageRowsSelectedHandler(), size: (density === 'compact' ? 'small' : 'medium')
    }, checkboxProps), {
        onClick: (e) => {
            var _a;
            e.stopPropagation();
            (_a = checkboxProps === null || checkboxProps === void 0 ? void 0 : checkboxProps.onClick) === null || _a === void 0 ? void 0 : _a.call(checkboxProps, e);
        }, sx: (theme) => (Object.assign({ height: density === 'compact' ? '1.75rem' : '2.5rem', width: density === 'compact' ? '1.75rem' : '2.5rem', m: density !== 'compact' ? '-0.4rem' : undefined }, ((checkboxProps === null || checkboxProps === void 0 ? void 0 : checkboxProps.sx) instanceof Function
            ? checkboxProps.sx(theme)
            : checkboxProps === null || checkboxProps === void 0 ? void 0 : checkboxProps.sx))), title: undefined
    });
    return (React.createElement(Tooltip, {
        arrow: true, enterDelay: 1000, enterNextDelay: 1000, title: (_a = checkboxProps === null || checkboxProps === void 0 ? void 0 : checkboxProps.title) !== null && _a !== void 0 ? _a : (selectAll
            ? localization.toggleSelectAll
            : localization.toggleSelectRow)
    }, enableMultiRowSelection === false ? (React.createElement(Radio, Object.assign({}, commonProps))) : (React.createElement(Checkbox, Object.assign({
        indeterminate: selectAll
            ? table.getIsSomeRowsSelected() && !allRowsSelected
            : row === null || row === void 0 ? void 0 : row.getIsSomeSelected()
    }, commonProps)))));
};

const MRT_GlobalFilterTextField = ({ table, }) => {
    var _a;
    const { getState, setGlobalFilter, options: { enableGlobalFilterModes, icons: { SearchIcon, CloseIcon }, localization, manualFiltering, muiSearchTextFieldProps, }, refs: { searchInputRef }, } = table;
    const { globalFilter, showGlobalFilter } = getState();
    const textFieldProps = muiSearchTextFieldProps instanceof Function
        ? muiSearchTextFieldProps({ table })
        : muiSearchTextFieldProps;
    const isMounted = useRef(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchValue, setSearchValue] = useState(globalFilter !== null && globalFilter !== void 0 ? globalFilter : '');
    const handleChangeDebounced = useCallback(debounce((event) => {
        var _a;
        setGlobalFilter((_a = event.target.value) !== null && _a !== void 0 ? _a : undefined);
    }, manualFiltering ? 500 : 250), []);
    const handleChange = (event) => {
        setSearchValue(event.target.value);
        handleChangeDebounced(event);
    };
    const handleGlobalFilterMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClear = () => {
        setSearchValue('');
        setGlobalFilter(undefined);
    };
    useEffect(() => {
        if (isMounted.current) {
            if (globalFilter === undefined) {
                handleClear();
            }
            else {
                setSearchValue(globalFilter);
            }
        }
        isMounted.current = true;
    }, [globalFilter]);
    return (React.createElement(Collapse, { in: showGlobalFilter, orientation: "horizontal", unmountOnExit: true, mountOnEnter: true },
        React.createElement(TextField, Object.assign({
            placeholder: localization.search, onChange: handleChange, value: searchValue !== null && searchValue !== void 0 ? searchValue : '', variant: "standard", InputProps: {
                startAdornment: enableGlobalFilterModes ? (React.createElement(InputAdornment, { position: "start" },
                    React.createElement(Tooltip, { arrow: true, title: localization.changeSearchMode },
                        React.createElement(IconButton, { "aria-label": localization.changeSearchMode, onClick: handleGlobalFilterMenuOpen, size: "small", sx: { height: '1.75rem', width: '1.75rem' } },
                            React.createElement(SearchIcon, null))))) : (React.createElement(SearchIcon, { style: { marginRight: '4px' } })),
                endAdornment: (React.createElement(InputAdornment, { position: "end" },
                    React.createElement(Tooltip, { arrow: true, title: (_a = localization.clearSearch) !== null && _a !== void 0 ? _a : '' },
                        React.createElement("span", null,
                            React.createElement(IconButton, { "aria-label": localization.clearSearch, disabled: !(searchValue === null || searchValue === void 0 ? void 0 : searchValue.length), onClick: handleClear, size: "small" },
                                React.createElement(CloseIcon, null)))))),
            }
        }, textFieldProps, {
            inputRef: (inputRef) => {
                searchInputRef.current = inputRef;
                if (textFieldProps === null || textFieldProps === void 0 ? void 0 : textFieldProps.inputRef) {
                    textFieldProps.inputRef = inputRef;
                }
            }
        })),
        React.createElement(MRT_FilterOptionMenu, { anchorEl: anchorEl, setAnchorEl: setAnchorEl, table: table, onSelect: handleClear })));
};

const MRT_LinearProgressBar = ({ isTopToolbar, table, }) => {
    const { options: { muiLinearProgressProps }, getState, } = table;
    const { isLoading, showProgressBars } = getState();
    const linearProgressProps = muiLinearProgressProps instanceof Function
        ? muiLinearProgressProps({ isTopToolbar, table })
        : muiLinearProgressProps;
    return (React.createElement(Collapse, {
        in: isLoading || showProgressBars, mountOnEnter: true, unmountOnExit: true, sx: {
            bottom: isTopToolbar ? 0 : undefined,
            position: 'absolute',
            top: !isTopToolbar ? 0 : undefined,
            width: '100%',
        }
    },
        React.createElement(LinearProgress, Object.assign({ "aria-label": "Loading", "aria-busy": "true", sx: { position: 'relative' } }, linearProgressProps))));
};

const MRT_TablePagination = ({ table, position = 'bottom', }) => {
    const { getPrePaginationRowModel, getState, setPageIndex, setPageSize, options: { muiTablePaginationProps, enableToolbarInternalActions, localization, rowCount, }, } = table;
    const { pagination: { pageSize = 10, pageIndex = 0 }, showGlobalFilter, } = getState();
    const totalRowCount = rowCount !== null && rowCount !== void 0 ? rowCount : getPrePaginationRowModel().rows.length;
    const showFirstLastPageButtons = totalRowCount / pageSize > 2;
    const tablePaginationProps = muiTablePaginationProps instanceof Function
        ? muiTablePaginationProps({ table })
        : muiTablePaginationProps;
    const handleChangeRowsPerPage = (event) => {
        setPageSize(+event.target.value);
    };
    return (React.createElement(TablePagination, Object.assign({
        component: "div", count: totalRowCount, getItemAriaLabel: (type) => type === 'first'
            ? localization.goToFirstPage
            : type === 'last'
                ? localization.goToLastPage
                : type === 'next'
                    ? localization.goToNextPage
                    : localization.goToPreviousPage, labelDisplayedRows: ({ from, to, count }) => `${from}-${to} ${localization.of} ${count}`, labelRowsPerPage: localization.rowsPerPage, onPageChange: (_, newPage) => setPageIndex(newPage), onRowsPerPageChange: handleChangeRowsPerPage, page: Math.max(Math.min(pageIndex, Math.ceil(totalRowCount / pageSize) - 1), 0), rowsPerPage: pageSize, rowsPerPageOptions: [5, 10, 15, 20, 25, 30, 50, 100], showFirstButton: showFirstLastPageButtons, showLastButton: showFirstLastPageButtons
    }, tablePaginationProps, {
        SelectProps: Object.assign({ sx: { m: '0 1rem 0 1ch' }, MenuProps: { MenuListProps: { disablePadding: true }, sx: { m: 0 } } }, tablePaginationProps === null || tablePaginationProps === void 0 ? void 0 : tablePaginationProps.SelectProps), sx: (theme) => (Object.assign({
            '& .MuiTablePagination-toolbar': {
                display: 'flex',
                alignItems: 'center',
            }, '& .MuiTablePagination-selectLabel': {
                m: '0 -1px',
            }, '&. MuiInputBase-root': {
                m: '0 1px',
            }, '& . MuiTablePagination-select': {
                m: '0 1px',
            }, '& .MuiTablePagination-displayedRows': {
                m: '0 1px',
            }, '& .MuiTablePagination-actions': {
                m: '0 1px',
            }, mt: position === 'top' &&
                enableToolbarInternalActions &&
                !showGlobalFilter
                ? '3.5rem'
                : undefined, position: 'relative', zIndex: 2
        }, ((tablePaginationProps === null || tablePaginationProps === void 0 ? void 0 : tablePaginationProps.sx) instanceof Function
            ? tablePaginationProps.sx(theme)
            : tablePaginationProps === null || tablePaginationProps === void 0 ? void 0 : tablePaginationProps.sx)))
    })));
};

const MRT_ToolbarAlertBanner = ({ stackAlertBanner, table, }) => {
    var _a, _b;
    const { getPrePaginationRowModel, getSelectedRowModel, getState, options: { localization, muiToolbarAlertBannerProps, muiToolbarAlertBannerChipProps, positionToolbarAlertBanner, rowCount, }, } = table;
    const { grouping, showAlertBanner } = getState();
    const alertProps = muiToolbarAlertBannerProps instanceof Function
        ? muiToolbarAlertBannerProps({ table })
        : muiToolbarAlertBannerProps;
    const chipProps = muiToolbarAlertBannerChipProps instanceof Function
        ? muiToolbarAlertBannerChipProps({ table })
        : muiToolbarAlertBannerChipProps;
    const selectMessage = getSelectedRowModel().rows.length > 0
        ? (_b = (_a = localization.selectedCountOfRowCountRowsSelected) === null || _a === void 0 ? void 0 : _a.replace('{selectedCount}', getSelectedRowModel().rows.length.toString())) === null || _b === void 0 ? void 0 : _b.replace('{rowCount}', (rowCount !== null && rowCount !== void 0 ? rowCount : getPrePaginationRowModel().rows.length).toString())
        : null;
    const groupedByMessage = grouping.length > 0 ? (React.createElement("span", null,
        localization.groupedBy,
        ' ',
        grouping.map((columnId, index) => (React.createElement(Fragment, { key: `${index}-${columnId}` },
            index > 0 ? localization.thenBy : '',
            React.createElement(Chip, Object.assign({ label: table.getColumn(columnId).columnDef.header, onDelete: () => table.getColumn(columnId).toggleGrouping() }, chipProps))))))) : null;
    return (React.createElement(Collapse, { in: showAlertBanner || !!selectMessage || !!groupedByMessage, timeout: stackAlertBanner ? 200 : 0 },
        React.createElement(Alert, Object.assign({ color: "info", icon: false }, alertProps, {
            sx: (theme) => (Object.assign({
                borderRadius: 0, fontSize: '1rem', left: 0, p: 0, position: 'relative', mb: stackAlertBanner
                    ? 0
                    : positionToolbarAlertBanner === 'bottom'
                        ? '-1rem'
                        : undefined, right: 0, top: 0, width: '100%', zIndex: 2
            }, ((alertProps === null || alertProps === void 0 ? void 0 : alertProps.sx) instanceof Function
                ? alertProps.sx(theme)
                : alertProps === null || alertProps === void 0 ? void 0 : alertProps.sx)))
        }),
            (alertProps === null || alertProps === void 0 ? void 0 : alertProps.title) && React.createElement(AlertTitle, null, alertProps.title),
            React.createElement(Box, { sx: { p: '0.5rem 1rem' } }, alertProps === null || alertProps === void 0 ? void 0 :
                alertProps.children,
                (alertProps === null || alertProps === void 0 ? void 0 : alertProps.children) && (selectMessage || groupedByMessage) && (React.createElement("br", null)),
                selectMessage,
                selectMessage && groupedByMessage && React.createElement("br", null),
                groupedByMessage))));
};

const MRT_FullScreenToggleButton = (_a) => {
    var _b;
    var { table } = _a, rest = __rest(_a, ["table"]);
    const { getState, options: { icons: { FullscreenExitIcon, FullscreenIcon }, localization, }, setIsFullScreen, } = table;
    const { isFullScreen } = getState();
    const handleToggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };
    return (React.createElement(Tooltip, { arrow: true, title: (_b = rest === null || rest === void 0 ? void 0 : rest.title) !== null && _b !== void 0 ? _b : localization.toggleFullScreen },
        React.createElement(IconButton, Object.assign({ "aria-label": localization.showFilters, onClick: handleToggleFullScreen }, rest, { title: undefined }), isFullScreen ? React.createElement(FullscreenExitIcon, null) : React.createElement(FullscreenIcon, null))));
};

const MRT_ColumnPinningButtons = ({ column, table, }) => {
    const { options: { icons: { PushPinIcon }, localization, }, } = table;
    const handlePinColumn = (pinDirection) => {
        column.pin(pinDirection);
    };
    return (React.createElement(React.Fragment, null,
        // (
        // React.createElement(Tooltip, { arrow: true, title: localization.unpin },
        // React.createElement(IconButton, { onClick: () => handlePinColumn(false), size: "small" },
        //     React.createElement(PushPinIcon, null)))
        // ): (
        // React.createElement(React.Fragment, null,
        // React.createElement(Tooltip, { arrow: true, title: localization.pinToLeft },
        //     React.createElement(IconButton, { onClick: () => handlePinColumn('left'), size: "small" },
        //         React.createElement(PushPinIcon, { style: {
        //                 transform: 'rotate(90deg)',
        //             } }))),
        // React.createElement(Tooltip, { arrow: true, title: localization.pinToRight },
        //     React.createElement(IconButton, { onClick: () => handlePinColumn('right'), size: "small" },
        //         React.createElement(PushPinIcon, { style: {
        //                 transform: 'rotate(-90deg)',
        //             } })))
        // )
        // )
    ));
};

const MRT_GrabHandleButton = ({ iconButtonProps, onDragEnd, onDragStart, table, }) => {
    var _a;
    const { options: { icons: { DragHandleIcon }, localization, }, } = table;
    return (React.createElement(Tooltip, { arrow: true, enterDelay: 1000, enterNextDelay: 1000, placement: "top", title: (_a = iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.title) !== null && _a !== void 0 ? _a : localization.move },
        React.createElement(IconButton, Object.assign({ disableRipple: true, draggable: "true", size: "small" }, iconButtonProps, {
            onClick: (e) => {
                var _a;
                e.stopPropagation();
                (_a = iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.onClick) === null || _a === void 0 ? void 0 : _a.call(iconButtonProps, e);
            }, onDragStart: onDragStart, onDragEnd: onDragEnd, sx: (theme) => (Object.assign({
                cursor: 'grab', m: '0 -0.1rem', opacity: 0.5, p: '2px', transition: 'all 150ms ease-in-out', '&:hover': {
                    backgroundColor: 'transparent',
                    opacity: 1,
                }, '&:active': {
                    cursor: 'grabbing',
                }
            }, ((iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.sx) instanceof Function
                ? iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.sx(theme)
                : iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.sx))), title: undefined
        }),
            React.createElement(DragHandleIcon, null))));
};

const MRT_ShowHideColumnsMenuItems = ({ allColumns, hoveredColumn, setHoveredColumn, column, table, }) => {
    var _a;
    const { getState, options: { enableColumnOrdering, enableHiding, enablePinning, localization, }, setColumnOrder, } = table;
    const { columnOrder } = getState();
    const { columnDef } = column;
    const { columnDefType } = columnDef;
    const switchChecked = (columnDefType !== 'group' && column.getIsVisible()) ||
        (columnDefType === 'group' &&
            column.getLeafColumns().some((col) => col.getIsVisible()));
    const handleToggleColumnHidden = (column) => {
        var _a, _b;
        if (columnDefType === 'group') {
            (_b = (_a = column === null || column === void 0 ? void 0 : column.columns) === null || _a === void 0 ? void 0 : _a.forEach) === null || _b === void 0 ? void 0 : _b.call(_a, (childColumn) => {
                childColumn.toggleVisibility(!switchChecked);
            });
        }
        else {
            column.toggleVisibility();
        }
    };
    const menuItemRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const handleDragStart = (e) => {
        setIsDragging(true);
        e.dataTransfer.setDragImage(menuItemRef.current, 0, 0);
    };
    const handleDragEnd = (_e) => {
        setIsDragging(false);
        setHoveredColumn(null);
        if (hoveredColumn) {
            setColumnOrder(reorderColumn(column, hoveredColumn, columnOrder));
        }
    };
    const handleDragEnter = (_e) => {
        if (!isDragging && columnDef.enableColumnOrdering !== false) {
            setHoveredColumn(column);
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(MenuItem, {
            disableRipple: true, ref: menuItemRef, onDragEnter: handleDragEnter, sx: (theme) => ({
                alignItems: 'center',
                justifyContent: 'flex-start',
                my: 0,
                opacity: isDragging ? 0.5 : 1,
                outlineOffset: '-2px',
                outline: isDragging
                    ? `2px dashed ${theme.palette.divider}`
                    : (hoveredColumn === null || hoveredColumn === void 0 ? void 0 : hoveredColumn.id) === column.id
                        ? `2px dashed ${theme.palette.primary.main}`
                        : 'none',
                pl: `${(column.depth + 0.5) * 2}rem`,
                py: '6px',
            })
        },
            React.createElement(Box, {
                sx: {
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: '8px',
                }
            },
                columnDefType !== 'group' &&
                enableColumnOrdering &&
                !allColumns.some((col) => col.columnDef.columnDefType === 'group') &&
                (columnDef.enableColumnOrdering !== false ? (React.createElement(MRT_GrabHandleButton, { onDragEnd: handleDragEnd, onDragStart: handleDragStart, table: table })) : (React.createElement(Box, { sx: { width: '28px' } }))),
                // enablePinning &&
                // (column.getCanPin() ? (React.createElement(MRT_ColumnPinningButtons, { column: column, table: table })) : (React.createElement(Box, { sx: { width: '70px' } }))),
                enableHiding ? (React.createElement(FormControlLabel, {
                    componentsProps: {
                        typography: {
                            sx: {
                                mb: 0,
                                opacity: columnDefType !== 'display' ? 1 : 0.5,
                            },
                        },
                    }, checked: switchChecked, control: React.createElement(Tooltip, { arrow: true, enterDelay: 1000, enterNextDelay: 1000, title: localization.toggleVisibility },
                        React.createElement(Switch, null)), disabled: !column.getCanHide(), label: columnDef.header, onChange: () => handleToggleColumnHidden(column)
                })) : (React.createElement(Typography, { sx: { alignSelf: 'center' } }, columnDef.header)))), (_a = column.columns) === null || _a === void 0 ? void 0 :
        _a.map((c, i) => (React.createElement(MRT_ShowHideColumnsMenuItems, { allColumns: allColumns, column: c, hoveredColumn: hoveredColumn, key: `${i}-${c.id}`, setHoveredColumn: setHoveredColumn, table: table })))));
};

const MRT_ShowHideColumnsMenu = ({ anchorEl, setAnchorEl, table, }) => {
    const { getAllColumns, getAllLeafColumns, getCenterLeafColumns, getIsAllColumnsVisible, getIsSomeColumnsPinned, getIsSomeColumnsVisible, getLeftLeafColumns, getRightLeafColumns, getState, toggleAllColumnsVisible, options: { enableColumnOrdering, enableHiding, enablePinning, localization, }, } = table;
    const { density, columnOrder, columnPinning } = getState();
    const hideAllColumns = () => {
        getAllLeafColumns()
            .filter((col) => col.columnDef.enableHiding !== false)
            .forEach((col) => col.toggleVisibility(false));
    };
    const allColumns = useMemo(() => {
        const columns = getAllColumns();
        if (columnOrder.length > 0 &&
            !columns.some((col) => col.columnDef.columnDefType === 'group')) {
            return [
                ...getLeftLeafColumns(),
                ...Array.from(new Set(columnOrder)).map((colId) => getCenterLeafColumns().find((col) => (col === null || col === void 0 ? void 0 : col.id) === colId)),
                ...getRightLeafColumns(),
            ].filter(Boolean);
        }
        return columns;
    }, [
        columnOrder,
        columnPinning,
        getAllColumns(),
        getCenterLeafColumns(),
        getLeftLeafColumns(),
        getRightLeafColumns(),
    ]);
    const [hoveredColumn, setHoveredColumn] = useState(null);
    return (React.createElement(Menu, {
        anchorEl: anchorEl, open: !!anchorEl, onClose: () => setAnchorEl(null), MenuListProps: {
            dense: density === 'compact',
        }, className: 'munim-toolbar-hide-show-popover'
    },
        React.createElement(Box, {
            sx: {
                display: 'flex',
                justifyContent: 'space-between',
                p: '0.5rem',
                pt: 0,
            }
        },
            enableHiding && (React.createElement(Button, { disabled: !getIsSomeColumnsVisible(), onClick: hideAllColumns }, localization.hideAll)),
            enableColumnOrdering && (React.createElement(Button, { onClick: () => table.setColumnOrder(getDefaultColumnOrderIds(table.options)) }, localization.resetOrder)),
            // enablePinning && (React.createElement(Button, { disabled: !getIsSomeColumnsPinned(), onClick: () => table.resetColumnPinning(true) }, localization.unpinAll)),
            enableHiding && (React.createElement(Button, { disabled: getIsAllColumnsVisible(), onClick: () => toggleAllColumnsVisible(true) }, localization.showAll))),
        React.createElement(Divider, null),
        allColumns.map((column, index) => (column.id !== 'action' && React.createElement(MRT_ShowHideColumnsMenuItems, { allColumns: allColumns, column: column, hoveredColumn: hoveredColumn, key: `${index}-${column.id}`, setHoveredColumn: setHoveredColumn, table: table })))));
};

const MRT_ShowHideColumnsButton = (_a) => {
    var _b;
    var { table } = _a, rest = __rest(_a, ["table"]);
    const { options: { icons: { ViewColumnIcon }, localization, }, } = table;
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { arrow: true, title: (_b = rest === null || rest === void 0 ? void 0 : rest.title) !== null && _b !== void 0 ? _b : localization.showHideColumns },
            React.createElement(IconButton, Object.assign({ "aria-label": localization.showHideColumns, onClick: handleClick }, rest, { title: undefined }),
                React.createElement(ViewColumnIcon, null))),
        anchorEl && (React.createElement(MRT_ShowHideColumnsMenu, { anchorEl: anchorEl, setAnchorEl: setAnchorEl, table: table }))));
};

const MRT_ToggleDensePaddingButton = (_a) => {
    var _b;
    var { table } = _a, rest = __rest(_a, ["table"]);
    const { getState, options: { icons: { DensityLargeIcon, DensityMediumIcon, DensitySmallIcon }, localization, }, setDensity, } = table;
    const { density } = getState();
    const handleToggleDensePadding = () => {
        const nextDensity = density === 'comfortable'
            ? 'compact'
            : density === 'compact'
                ? 'spacious'
                : 'comfortable';
        setDensity(nextDensity);
    };
    return (React.createElement(Tooltip, { arrow: true, title: (_b = rest === null || rest === void 0 ? void 0 : rest.title) !== null && _b !== void 0 ? _b : localization.toggleDensity },
        React.createElement(IconButton, Object.assign({ "aria-label": localization.toggleDensity, onClick: handleToggleDensePadding }, rest, { title: undefined }), density === 'compact' ? (React.createElement(DensitySmallIcon, null)) : density === 'comfortable' ? (React.createElement(DensityMediumIcon, null)) : (React.createElement(DensityLargeIcon, null)))));
};

const MRT_ToggleFiltersButton = (_a) => {
    var _b;
    var { table } = _a, rest = __rest(_a, ["table"]);
    const { getState, options: { icons: { FilterListIcon, FilterListOffIcon }, localization, }, setShowColumnFilters, } = table;
    const { showColumnFilters } = getState();
    const handleToggleShowFilters = () => {
        setShowColumnFilters(!showColumnFilters);
    };
    return (React.createElement(Tooltip, { arrow: true, title: (_b = rest === null || rest === void 0 ? void 0 : rest.title) !== null && _b !== void 0 ? _b : showColumnFilters ? localization.hideFilters : localization.showFilters },
        React.createElement(IconButton, Object.assign({ "aria-label": showColumnFilters ? localization.hideFilters : localization.showFilters, onClick: handleToggleShowFilters }, rest, { title: undefined }), showColumnFilters ? React.createElement(FilterListOffIcon, null) : React.createElement(FilterListIcon, null))));
};

const MRT_ToggleGlobalFilterButton = (_a) => {
    var _b, _c;
    var { table } = _a, rest = __rest(_a, ["table"]);
    const { getState, options: { icons: { SearchIcon, SearchOffIcon }, localization, }, refs: { searchInputRef }, setShowGlobalFilter, } = table;
    const { globalFilter, showGlobalFilter } = getState();
    const handleToggleSearch = () => {
        setShowGlobalFilter(!showGlobalFilter);
        queueMicrotask(() => { var _a; return (_a = searchInputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); });
    };
    return (React.createElement(Tooltip, { arrow: true, title: (_b = rest === null || rest === void 0 ? void 0 : rest.title) !== null && _b !== void 0 ? _b : localization.showHideSearch },
        React.createElement(IconButton, Object.assign({ "aria-label": (_c = rest === null || rest === void 0 ? void 0 : rest.title) !== null && _c !== void 0 ? _c : localization.showHideSearch, disabled: !!globalFilter, onClick: handleToggleSearch }, rest, { title: undefined }), showGlobalFilter ? React.createElement(SearchOffIcon, null) : React.createElement(SearchIcon, null))));
};

const MRT_ToolbarInternalButtons = ({ table, }) => {
    var _a;
    const { options: { enableColumnFilters, enableColumnOrdering, enableDensityToggle, enableFilters, enableFullScreenToggle, enableGlobalFilter, enableHiding, enablePinning, initialState, renderToolbarInternalActions, }, } = table;
    return (React.createElement(Box, {
        sx: {
            alignItems: 'center',
            display: 'flex',
            zIndex: 3,
        }
    }, (_a = renderToolbarInternalActions === null || renderToolbarInternalActions === void 0 ? void 0 : renderToolbarInternalActions({
        table,
    })) !== null && _a !== void 0 ? _a : (React.createElement(React.Fragment, null,
        enableFilters &&
        enableGlobalFilter &&
        !(initialState === null || initialState === void 0 ? void 0 : initialState.showGlobalFilter) && (React.createElement(MRT_ToggleGlobalFilterButton, { table: table })),
        enableFilters && enableColumnFilters && (React.createElement(MRT_ToggleFiltersButton, { table: table })),
        (enableHiding || enableColumnOrdering || enablePinning) && (React.createElement(MRT_ShowHideColumnsButton, { table: table })),
        enableDensityToggle && (React.createElement(MRT_ToggleDensePaddingButton, { table: table })),
        enableFullScreenToggle && (React.createElement(MRT_FullScreenToggleButton, { table: table }))))));
};

const MRT_ToolbarDropZone = ({ table, }) => {
    var _a, _b;
    const { getState, options: { enableGrouping, localization }, setHoveredColumn, setShowToolbarDropZone, } = table;
    const { draggingColumn, hoveredColumn, grouping, showToolbarDropZone } = getState();
    const handleDragEnter = (_event) => {
        setHoveredColumn({ id: 'drop-zone' });
    };
    useEffect(() => {
        var _a;
        if (((_a = table.options.state) === null || _a === void 0 ? void 0 : _a.showToolbarDropZone) !== undefined) {
            setShowToolbarDropZone(!!enableGrouping &&
                !!draggingColumn &&
                draggingColumn.columnDef.enableGrouping !== false &&
                !grouping.includes(draggingColumn.id));
        }
    }, [enableGrouping, draggingColumn, grouping]);
    return (React.createElement(Fade, { in: showToolbarDropZone },
        React.createElement(Box, {
            className: "Mui-ToolbarDropZone", sx: (theme) => ({
                alignItems: 'center',
                backgroundColor: alpha(theme.palette.info.main, (hoveredColumn === null || hoveredColumn === void 0 ? void 0 : hoveredColumn.id) === 'drop-zone' ? 0.2 : 0.1),
                backdropFilter: 'blur(4px)',
                boxSizing: 'border-box',
                border: `dashed ${theme.palette.info.main} 2px`,
                display: 'flex',
                justifyContent: 'center',
                height: '100%',
                position: 'absolute',
                width: '100%',
                zIndex: 4,
            }), onDragEnter: handleDragEnter
        },
            React.createElement(Typography, { fontStyle: "italic" }, localization.dropToGroupBy.replace('{column}', (_b = (_a = draggingColumn === null || draggingColumn === void 0 ? void 0 : draggingColumn.columnDef) === null || _a === void 0 ? void 0 : _a.header) !== null && _b !== void 0 ? _b : '')))));
};

const commonToolbarStyles = ({ theme }) => ({
    alignItems: 'flex-start',
    backgroundColor: lighten(theme.palette.background.default, 0.04),
    backgroundImage: 'none',
    display: 'grid',
    flexWrap: 'wrap-reverse',
    minHeight: '3.5rem',
    overflow: 'hidden',
    p: '0 !important',
    transition: 'all 150ms ease-in-out',
    zIndex: 1,
});
const MRT_TopToolbar = ({ table, }) => {
    var _a;
    const { getState, options: { enableGlobalFilter, enablePagination, enableToolbarInternalActions, muiTopToolbarProps, positionGlobalFilter, positionPagination, positionToolbarAlertBanner, positionToolbarDropZone, renderTopToolbarCustomActions, }, refs: { topToolbarRef }, } = table;
    const { isFullScreen, showGlobalFilter } = getState();
    const isMobile = useMediaQuery('(max-width:720px)');
    const toolbarProps = muiTopToolbarProps instanceof Function
        ? muiTopToolbarProps({ table })
        : muiTopToolbarProps;
    const stackAlertBanner = isMobile || !!renderTopToolbarCustomActions || showGlobalFilter;
    return (React.createElement(Toolbar, Object.assign({ variant: "dense" }, toolbarProps, {
        ref: (ref) => {
            topToolbarRef.current = ref;
            if (toolbarProps === null || toolbarProps === void 0 ? void 0 : toolbarProps.ref) {
                // @ts-ignore
                toolbarProps.ref.current = ref;
            }
        }, sx: (theme) => (Object.assign(Object.assign({ position: isFullScreen ? 'sticky' : undefined, top: isFullScreen ? '0' : undefined }, commonToolbarStyles({ theme })), ((toolbarProps === null || toolbarProps === void 0 ? void 0 : toolbarProps.sx) instanceof Function
            ? toolbarProps.sx(theme)
            : toolbarProps === null || toolbarProps === void 0 ? void 0 : toolbarProps.sx)))
    }),
        positionToolbarAlertBanner === 'top' && (React.createElement(MRT_ToolbarAlertBanner, { stackAlertBanner: stackAlertBanner, table: table })),
        ['both', 'top'].includes(positionToolbarDropZone !== null && positionToolbarDropZone !== void 0 ? positionToolbarDropZone : '') && (React.createElement(MRT_ToolbarDropZone, { table: table })),
        React.createElement(Box, {
            sx: {
                alignItems: 'flex-start',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'space-between',
                p: '0.5rem',
                position: stackAlertBanner ? 'relative' : 'absolute',
                right: 0,
                top: 0,
                width: '100%',
            }
        },
            enableGlobalFilter && positionGlobalFilter === 'left' && (React.createElement(MRT_GlobalFilterTextField, { table: table })), (_a = renderTopToolbarCustomActions === null || renderTopToolbarCustomActions === void 0 ? void 0 : renderTopToolbarCustomActions({ table })) !== null && _a !== void 0 ? _a : React.createElement("span", null),
            enableToolbarInternalActions ? (React.createElement(Box, {
                sx: {
                    display: 'flex',
                    flexWrap: 'wrap-reverse',
                    justifyContent: 'flex-end',
                }
            },
                enableGlobalFilter && positionGlobalFilter === 'right' && (React.createElement(MRT_GlobalFilterTextField, { table: table })),
                React.createElement(MRT_ToolbarInternalButtons, { table: table }))) : (enableGlobalFilter &&
                    positionGlobalFilter === 'right' && (React.createElement(MRT_GlobalFilterTextField, { table: table })))),
        enablePagination &&
        ['top', 'both'].includes(positionPagination !== null && positionPagination !== void 0 ? positionPagination : '') && (React.createElement(MRT_TablePagination, { table: table, position: "top" })),
        React.createElement(MRT_LinearProgressBar, { isTopToolbar: true, table: table })));
};

const MRT_BottomToolbar = ({ table, }) => {
    const { getState, options: { enablePagination, muiBottomToolbarProps, positionPagination, positionToolbarAlertBanner, positionToolbarDropZone, renderBottomToolbarCustomActions, }, refs: { bottomToolbarRef }, } = table;
    const { isFullScreen } = getState();
    const isMobile = useMediaQuery('(max-width:720px)');
    const toolbarProps = muiBottomToolbarProps instanceof Function
        ? muiBottomToolbarProps({ table })
        : muiBottomToolbarProps;
    const stackAlertBanner = isMobile || !!renderBottomToolbarCustomActions;
    return (React.createElement(Toolbar, Object.assign({ variant: "dense" }, toolbarProps, {
        ref: (node) => {
            if (node) {
                bottomToolbarRef.current = node;
                if (toolbarProps === null || toolbarProps === void 0 ? void 0 : toolbarProps.ref) {
                    // @ts-ignore
                    toolbarProps.ref.current = node;
                }
            }
        }, sx: (theme) => (Object.assign(Object.assign(Object.assign({}, commonToolbarStyles({ theme })), { bottom: isFullScreen ? '0' : undefined, boxShadow: `0 1px 2px -1px ${alpha(theme.palette.common.black, 0.1)} inset`, left: 0, position: isFullScreen ? 'fixed' : 'relative', right: 0 }), ((toolbarProps === null || toolbarProps === void 0 ? void 0 : toolbarProps.sx) instanceof Function
            ? toolbarProps.sx(theme)
            : toolbarProps === null || toolbarProps === void 0 ? void 0 : toolbarProps.sx)))
    }),
        React.createElement(MRT_LinearProgressBar, { isTopToolbar: false, table: table }),
        positionToolbarAlertBanner === 'bottom' && (React.createElement(MRT_ToolbarAlertBanner, { stackAlertBanner: stackAlertBanner, table: table })),
        ['both', 'bottom'].includes(positionToolbarDropZone !== null && positionToolbarDropZone !== void 0 ? positionToolbarDropZone : '') && (React.createElement(MRT_ToolbarDropZone, { table: table })),
        React.createElement(Box, {
            sx: {
                alignItems: 'center',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'space-between',
                p: '0.5rem',
                width: '100%',
            }
        },
            renderBottomToolbarCustomActions ? (renderBottomToolbarCustomActions({ table })) : (React.createElement("span", null)),
            React.createElement(Box, {
                sx: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    position: stackAlertBanner ? 'relative' : 'absolute',
                    right: 0,
                    top: 0,
                }
            }, enablePagination &&
            ['bottom', 'both'].includes(positionPagination !== null && positionPagination !== void 0 ? positionPagination : '') && (React.createElement(MRT_TablePagination, { table: table, position: "bottom" }))))));
};

const MRT_TableHeadCellColumnActionsButton = ({ header, table, }) => {
    var _a;
    const { options: { icons: { MoreVertIcon }, localization, muiTableHeadCellColumnActionsButtonProps, }, } = table;
    const { column } = header;
    const { columnDef } = column;
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    const mTableHeadCellColumnActionsButtonProps = muiTableHeadCellColumnActionsButtonProps instanceof Function
        ? muiTableHeadCellColumnActionsButtonProps({ column, table })
        : muiTableHeadCellColumnActionsButtonProps;
    const mcTableHeadCellColumnActionsButtonProps = columnDef.muiTableHeadCellColumnActionsButtonProps instanceof Function
        ? columnDef.muiTableHeadCellColumnActionsButtonProps({
            column,
            table,
        })
        : columnDef.muiTableHeadCellColumnActionsButtonProps;
    const iconButtonProps = Object.assign(Object.assign({}, mTableHeadCellColumnActionsButtonProps), mcTableHeadCellColumnActionsButtonProps);
    return (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { arrow: true, enterDelay: 1000, enterNextDelay: 1000, placement: "top", title: (_a = iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.title) !== null && _a !== void 0 ? _a : localization.columnActions },
            React.createElement(IconButton, Object.assign({ "aria-label": localization.columnActions, onClick: handleClick, size: "small" }, iconButtonProps, {
                sx: (theme) => (Object.assign({
                    height: '2rem', m: '-8px -4px', opacity: 0.5, transform: 'scale(0.85) translateX(-4px)', transition: 'opacity 150ms', width: '2rem', '&:hover': {
                        opacity: 1,
                    }
                }, ((iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.sx) instanceof Function
                    ? iconButtonProps.sx(theme)
                    : iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.sx))), title: undefined
            }),
                React.createElement(MoreVertIcon, null))),
        anchorEl && (React.createElement(MRT_ColumnActionMenu, { anchorEl: anchorEl, header: header, setAnchorEl: setAnchorEl, table: table }))));
};

const MRT_FilterTextField = ({ header, rangeFilterIndex, table, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const { options: { enableColumnFilterModes, columnFilterModeOptions, icons: { FilterListIcon, CloseIcon }, localization, manualFiltering, muiTableHeadCellFilterTextFieldProps, }, refs: { filterInputRefs }, setColumnFilterFns, } = table;
    const { column } = header;
    const { columnDef } = column;
    const mTableHeadCellFilterTextFieldProps = muiTableHeadCellFilterTextFieldProps instanceof Function
        ? muiTableHeadCellFilterTextFieldProps({
            column,
            table,
            rangeFilterIndex,
        })
        : muiTableHeadCellFilterTextFieldProps;
    const mcTableHeadCellFilterTextFieldProps = columnDef.muiTableHeadCellFilterTextFieldProps instanceof Function
        ? columnDef.muiTableHeadCellFilterTextFieldProps({
            column,
            table,
            rangeFilterIndex,
        })
        : columnDef.muiTableHeadCellFilterTextFieldProps;
    const textFieldProps = Object.assign(Object.assign({}, mTableHeadCellFilterTextFieldProps), mcTableHeadCellFilterTextFieldProps);
    const isRangeFilter = columnDef.filterVariant === 'range' || rangeFilterIndex !== undefined;
    const isSelectFilter = columnDef.filterVariant === 'select';
    const isMultiSelectFilter = columnDef.filterVariant === 'multi-select';
    const isTextboxFilter = columnDef.filterVariant === 'text' ||
        (!isSelectFilter && !isMultiSelectFilter);
    const currentFilterOption = columnDef._filterFn;
    const filterChipLabel = ['empty', 'notEmpty'].includes(currentFilterOption)
        ? //@ts-ignore
        localization[`filter${((_b = (_a = currentFilterOption === null || currentFilterOption === void 0 ? void 0 : currentFilterOption.charAt) === null || _a === void 0 ? void 0 : _a.call(currentFilterOption, 0)) === null || _b === void 0 ? void 0 : _b.toUpperCase()) +
        (currentFilterOption === null || currentFilterOption === void 0 ? void 0 : currentFilterOption.slice(1))}`]
        : '';
    const filterPlaceholder = !isRangeFilter
        ? (_c = textFieldProps === null || textFieldProps === void 0 ? void 0 : textFieldProps.placeholder) !== null && _c !== void 0 ? _c : (_d = localization.filterByColumn) === null || _d === void 0 ? void 0 : _d.replace('{column}', String(columnDef.header))
        : rangeFilterIndex === 0
            ? localization.min
            : rangeFilterIndex === 1
                ? localization.max
                : '';
    const allowedColumnFilterOptions = (_e = columnDef === null || columnDef === void 0 ? void 0 : columnDef.columnFilterModeOptions) !== null && _e !== void 0 ? _e : columnFilterModeOptions;
    const showChangeModeButton = enableColumnFilterModes &&
        columnDef.enableColumnFilterModes !== false &&
        !rangeFilterIndex &&
        (allowedColumnFilterOptions === undefined ||
            !!(allowedColumnFilterOptions === null || allowedColumnFilterOptions === void 0 ? void 0 : allowedColumnFilterOptions.length));
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterValue, setFilterValue] = useState(() => {
        var _a, _b;
        return isMultiSelectFilter
            ? column.getFilterValue() || []
            : isRangeFilter
                ? ((_a = column.getFilterValue()) === null || _a === void 0 ? void 0 : _a[rangeFilterIndex]) || []
                : (_b = column.getFilterValue()) !== null && _b !== void 0 ? _b : '';
    });
    const handleChangeDebounced = useCallback(debounce((event) => {
        const value = textFieldProps.type === 'date'
            ? event.target.valueAsDate
            : textFieldProps.type === 'number'
                ? event.target.valueAsNumber
                : event.target.value;
        if (isRangeFilter) {
            column.setFilterValue((old) => {
                const newFilterValues = old !== null && old !== void 0 ? old : ['', ''];
                newFilterValues[rangeFilterIndex] = value;
                return newFilterValues;
            });
        }
        else {
            column.setFilterValue(value !== null && value !== void 0 ? value : undefined);
        }
    }, isTextboxFilter ? (manualFiltering ? 400 : 200) : 1), []);
    const handleChange = (event) => {
        setFilterValue(event.target.value);
        handleChangeDebounced(event);
    };
    const handleClear = () => {
        if (isMultiSelectFilter) {
            setFilterValue([]);
            column.setFilterValue([]);
        }
        else if (isRangeFilter) {
            setFilterValue('');
            column.setFilterValue((old) => {
                const newFilterValues = (Array.isArray(old) && old) || ['', ''];
                newFilterValues[rangeFilterIndex] = undefined;
                return newFilterValues;
            });
        }
        else {
            setFilterValue('');
            column.setFilterValue(undefined);
        }
    };
    const handleClearEmptyFilterChip = () => {
        setFilterValue('');
        column.setFilterValue(undefined);
        setColumnFilterFns((prev) => {
            var _a;
            return (Object.assign(Object.assign({}, prev), { [header.id]: (_a = allowedColumnFilterOptions === null || allowedColumnFilterOptions === void 0 ? void 0 : allowedColumnFilterOptions[0]) !== null && _a !== void 0 ? _a : 'fuzzy' }));
        });
    };
    const handleFilterMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const isMounted = useRef(false);
    useEffect(() => {
        if (isMounted.current) {
            const filterValue = column.getFilterValue();
            if (filterValue === undefined) {
                handleClear();
            }
            else if (isRangeFilter && rangeFilterIndex !== undefined) {
                setFilterValue(filterValue[rangeFilterIndex]);
            }
            else {
                setFilterValue(filterValue);
            }
        }
        isMounted.current = true;
    }, [column.getFilterValue()]);
    if (columnDef.Filter) {
        return (React.createElement(React.Fragment, null, (_f = columnDef.Filter) === null || _f === void 0 ? void 0 : _f.call(columnDef, { column, header, rangeFilterIndex, table })));
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(TextField, Object.assign({
            fullWidth: true, inputProps: {
                disabled: !!filterChipLabel,
                sx: {
                    textOverflow: 'ellipsis',
                    width: filterChipLabel ? 0 : undefined,
                },
                title: filterPlaceholder,
            }, helperText: showChangeModeButton ? (React.createElement("label", null, localization.filterMode.replace('{filterType}',
                // @ts-ignore
                localization[`filter${((_g = currentFilterOption === null || currentFilterOption === void 0 ? void 0 : currentFilterOption.charAt(0)) === null || _g === void 0 ? void 0 : _g.toUpperCase()) +
                (currentFilterOption === null || currentFilterOption === void 0 ? void 0 : currentFilterOption.slice(1))}`]))) : null, FormHelperTextProps: {
                    sx: {
                        fontSize: '0.75rem',
                        lineHeight: '0.8rem',
                        whiteSpace: 'nowrap',
                    },
                }, margin: "none", placeholder: filterChipLabel || isSelectFilter || isMultiSelectFilter
                    ? undefined
                    : filterPlaceholder, onChange: handleChange, onClick: (e) => e.stopPropagation(), select: isSelectFilter || isMultiSelectFilter, value: filterValue !== null && filterValue !== void 0 ? filterValue : '', variant: "standard", InputProps: {
                        startAdornment: showChangeModeButton ? (React.createElement(InputAdornment, { position: "start" },
                            React.createElement(Tooltip, { arrow: true, title: localization.changeFilterMode },
                                React.createElement("span", null,
                                    React.createElement(IconButton, { "aria-label": localization.changeFilterMode, onClick: handleFilterMenuOpen, size: "small", sx: { height: '1.75rem', width: '1.75rem' } },
                                        React.createElement(FilterListIcon, null)))),
                            filterChipLabel && (React.createElement(Chip, { onDelete: handleClearEmptyFilterChip, label: filterChipLabel })))) : null,
                        endAdornment: !filterChipLabel && (React.createElement(InputAdornment, { position: "end" },
                            React.createElement(Tooltip, { arrow: true, placement: "right", title: (_h = localization.clearFilter) !== null && _h !== void 0 ? _h : '' },
                                React.createElement("span", null,
                                    React.createElement(IconButton, {
                                        "aria-label": localization.clearFilter, disabled: !((_j = filterValue === null || filterValue === void 0 ? void 0 : filterValue.toString()) === null || _j === void 0 ? void 0 : _j.length), onClick: handleClear, size: "small", sx: {
                                            height: '1.75rem',
                                            width: '1.75rem',
                                        }
                                    },
                                        React.createElement(CloseIcon, null)))))),
                    }, SelectProps: {
                        displayEmpty: true,
                        multiple: isMultiSelectFilter,
                        renderValue: isMultiSelectFilter
                            ? (selected) => !(selected === null || selected === void 0 ? void 0 : selected.length) ? (React.createElement(Box, { sx: { opacity: 0.5 } }, filterPlaceholder)) : (React.createElement(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: '2px' } }, selected === null || selected === void 0 ? void 0 : selected.map((value) => {
                                var _a;
                                const selectedValue = (_a = columnDef.filterSelectOptions) === null || _a === void 0 ? void 0 : _a.find((option) => option instanceof Object
                                    ? option.value === value
                                    : option === value);
                                return (React.createElement(Chip, {
                                    key: value, label: selectedValue instanceof Object
                                        ? selectedValue.text
                                        : selectedValue
                                }));
                            })))
                            : undefined,
                    }
        }, textFieldProps, {
            inputRef: (inputRef) => {
                filterInputRefs.current[`${column.id}-${rangeFilterIndex !== null && rangeFilterIndex !== void 0 ? rangeFilterIndex : 0}`] =
                    inputRef;
                if (textFieldProps.inputRef) {
                    textFieldProps.inputRef = inputRef;
                }
            }, sx: (theme) => (Object.assign({
                p: 0, minWidth: isRangeFilter
                    ? '100px'
                    : !filterChipLabel
                        ? '120px'
                        : 'auto', width: 'calc(100% + 4px)', mx: '-2px', '& .MuiSelect-icon': {
                            mr: '1.5rem',
                        }
            }, ((textFieldProps === null || textFieldProps === void 0 ? void 0 : textFieldProps.sx) instanceof Function
                ? textFieldProps.sx(theme)
                : textFieldProps === null || textFieldProps === void 0 ? void 0 : textFieldProps.sx)))
        }),
            (isSelectFilter || isMultiSelectFilter) && (React.createElement(MenuItem, { divider: true, disabled: true, hidden: true, value: "" },
                React.createElement(Box, { sx: { opacity: 0.5 } }, filterPlaceholder))), (_k = textFieldProps.children) !== null && _k !== void 0 ? _k : (_l = columnDef === null || columnDef === void 0 ? void 0 : columnDef.filterSelectOptions) === null || _l === void 0 ? void 0 : _l.map((option) => {
                    var _a;
                    let value;
                    let text;
                    if (typeof option !== 'object') {
                        value = option;
                        text = option;
                    }
                    else {
                        value = option.value;
                        text = option.text;
                    }
                    return (React.createElement(MenuItem, {
                        key: value, sx: {
                            display: 'flex',
                            m: 0,
                            alignItems: 'center',
                            gap: '0.5rem',
                        }, value: value
                    },
                        isMultiSelectFilter && (React.createElement(Checkbox, { checked: ((_a = column.getFilterValue()) !== null && _a !== void 0 ? _a : []).includes(value), sx: { mr: '0.5rem' } })),
                        text));
                })),
        React.createElement(MRT_FilterOptionMenu, { anchorEl: anchorEl, header: header, setAnchorEl: setAnchorEl, table: table, setFilterValue: setFilterValue })));
};

const MRT_FilterRangeFields = ({ header, table }) => {
    return (React.createElement(Box, { sx: { display: 'grid', gridTemplateColumns: '6fr 6fr', gap: '1rem' } },
        React.createElement(MRT_FilterTextField, { header: header, rangeFilterIndex: 0, table: table }),
        React.createElement(MRT_FilterTextField, { header: header, rangeFilterIndex: 1, table: table })));
};

const MRT_FilterCheckbox = ({ column, table }) => {
    var _a, _b, _c;
    const { getState, options: { localization, muiTableHeadCellFilterCheckboxProps }, } = table;
    const { density } = getState();
    const { columnDef } = column;
    const mTableHeadCellFilterCheckboxProps = muiTableHeadCellFilterCheckboxProps instanceof Function
        ? muiTableHeadCellFilterCheckboxProps({
            column,
            table,
        })
        : muiTableHeadCellFilterCheckboxProps;
    const mcTableHeadCellFilterCheckboxProps = columnDef.muiTableHeadCellFilterCheckboxProps instanceof Function
        ? columnDef.muiTableHeadCellFilterCheckboxProps({
            column,
            table,
        })
        : columnDef.muiTableHeadCellFilterCheckboxProps;
    const checkboxProps = Object.assign(Object.assign({}, mTableHeadCellFilterCheckboxProps), mcTableHeadCellFilterCheckboxProps);
    const filterLabel = (_a = localization.filterByColumn) === null || _a === void 0 ? void 0 : _a.replace('{column}', columnDef.header);
    return (React.createElement(Tooltip, { arrow: true, enterDelay: 1000, enterNextDelay: 1000, title: (_b = checkboxProps === null || checkboxProps === void 0 ? void 0 : checkboxProps.title) !== null && _b !== void 0 ? _b : filterLabel },
        React.createElement(FormControlLabel, {
            control: React.createElement(Checkbox, Object.assign({ checked: column.getFilterValue() === 'true', indeterminate: column.getFilterValue() === undefined, color: column.getFilterValue() === undefined ? 'default' : 'primary', size: density === 'compact' ? 'small' : 'medium' }, checkboxProps, {
                onClick: (e) => {
                    var _a;
                    e.stopPropagation();
                    (_a = checkboxProps === null || checkboxProps === void 0 ? void 0 : checkboxProps.onClick) === null || _a === void 0 ? void 0 : _a.call(checkboxProps, e);
                }, onChange: (e, checked) => {
                    var _a;
                    column.setFilterValue(column.getFilterValue() === undefined
                        ? 'true'
                        : column.getFilterValue() === 'true'
                            ? 'false'
                            : undefined);
                    (_a = checkboxProps === null || checkboxProps === void 0 ? void 0 : checkboxProps.onChange) === null || _a === void 0 ? void 0 : _a.call(checkboxProps, e, checked);
                }, sx: (theme) => (Object.assign({ height: '2.5rem', width: '2.5rem' }, ((checkboxProps === null || checkboxProps === void 0 ? void 0 : checkboxProps.sx) instanceof Function
                    ? checkboxProps.sx(theme)
                    : checkboxProps === null || checkboxProps === void 0 ? void 0 : checkboxProps.sx)))
            })), disableTypography: true, label: (_c = checkboxProps.title) !== null && _c !== void 0 ? _c : filterLabel, sx: { color: 'text.secondary', mt: '-4px', fontWeight: 'normal' }, title: undefined
        })));
};

const MRT_TableHeadCellFilterContainer = ({ header, table }) => {
    const { getState } = table;
    const { showColumnFilters } = getState();
    const { column } = header;
    const { columnDef } = column;
    return (React.createElement(Collapse, { in: showColumnFilters, mountOnEnter: true, unmountOnExit: true }, columnDef.filterVariant === 'checkbox' ? (React.createElement(MRT_FilterCheckbox, { column: column, table: table })) : columnDef.filterVariant === 'range' ||
        ['between', 'betweenInclusive', 'inNumberRange'].includes(columnDef._filterFn) ? (React.createElement(MRT_FilterRangeFields, { header: header, table: table })) : (React.createElement(MRT_FilterTextField, { header: header, table: table }))));
};

const MRT_TableHeadCellFilterLabel = ({ header, table }) => {
    var _a, _b, _c;
    const { options: { icons: { FilterAltIcon }, localization, }, refs: { filterInputRefs }, setShowColumnFilters, } = table;
    const { column } = header;
    const { columnDef } = column;
    const isRangeFilter = columnDef.filterVariant === 'range' ||
        ['between', 'betweenInclusive', 'inNumberRange'].includes(columnDef._filterFn);
    const currentFilterOption = columnDef._filterFn;
    const filterTooltip = localization.filteringByColumn
        .replace('{column}', String(columnDef.header))
        .replace('{filterType}',
            // @ts-ignore
            localization[`filter${((_a = currentFilterOption === null || currentFilterOption === void 0 ? void 0 : currentFilterOption.charAt(0)) === null || _a === void 0 ? void 0 : _a.toUpperCase()) +
            (currentFilterOption === null || currentFilterOption === void 0 ? void 0 : currentFilterOption.slice(1))}`])
        .replace('{filterValue}', `"${Array.isArray(column.getFilterValue())
            ? column.getFilterValue().join(`" ${isRangeFilter ? localization.and : localization.or} "`)
            : column.getFilterValue()}"`)
        .replace('" "', '');
    return (React.createElement(Grow, {
        unmountOnExit: true, in: (!!column.getFilterValue() && !isRangeFilter) ||
            (isRangeFilter && // @ts-ignore
                (!!((_b = column.getFilterValue()) === null || _b === void 0 ? void 0 : _b[0]) || !!((_c = column.getFilterValue()) === null || _c === void 0 ? void 0 : _c[1])))
    },
        React.createElement(Box, { component: "span", sx: { flex: '0 0' } },
            React.createElement(Tooltip, { arrow: true, placement: "top", title: filterTooltip },
                React.createElement(IconButton, {
                    disableRipple: true, onClick: (event) => {
                        setShowColumnFilters(true);
                        queueMicrotask(() => {
                            var _a, _b;
                            (_a = filterInputRefs.current[`${column.id}-0`]) === null || _a === void 0 ? void 0 : _a.focus();
                            (_b = filterInputRefs.current[`${column.id}-0`]) === null || _b === void 0 ? void 0 : _b.select();
                        });
                        event.stopPropagation();
                    }, size: "small", sx: {
                        height: '12px',
                        m: 0,
                        opacity: 0.8,
                        p: '2px',
                        transform: 'scale(0.66)',
                        width: '12px',
                    }
                },
                    React.createElement(FilterAltIcon, null))))));
};

const MRT_TableHeadCellGrabHandle = ({ column, table, tableHeadCellRef, }) => {
    const { getState, options: { enableColumnOrdering, muiTableHeadCellDragHandleProps }, setColumnOrder, setDraggingColumn, setHoveredColumn, } = table;
    const { columnDef } = column;
    const { hoveredColumn, draggingColumn, columnOrder } = getState();
    const mIconButtonProps = muiTableHeadCellDragHandleProps instanceof Function
        ? muiTableHeadCellDragHandleProps({ column, table })
        : muiTableHeadCellDragHandleProps;
    const mcIconButtonProps = columnDef.muiTableHeadCellDragHandleProps instanceof Function
        ? columnDef.muiTableHeadCellDragHandleProps({ column, table })
        : columnDef.muiTableHeadCellDragHandleProps;
    const iconButtonProps = Object.assign(Object.assign({}, mIconButtonProps), mcIconButtonProps);
    const handleDragStart = (event) => {
        var _a;
        (_a = iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.onDragStart) === null || _a === void 0 ? void 0 : _a.call(iconButtonProps, event);
        setDraggingColumn(column);
        event.dataTransfer.setDragImage(tableHeadCellRef.current, 0, 0);
    };
    const handleDragEnd = (event) => {
        var _a;
        (_a = iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.onDragEnd) === null || _a === void 0 ? void 0 : _a.call(iconButtonProps, event);
        if ((hoveredColumn === null || hoveredColumn === void 0 ? void 0 : hoveredColumn.id) === 'drop-zone') {
            column.toggleGrouping();
        }
        else if (enableColumnOrdering &&
            hoveredColumn &&
            (hoveredColumn === null || hoveredColumn === void 0 ? void 0 : hoveredColumn.id) !== (draggingColumn === null || draggingColumn === void 0 ? void 0 : draggingColumn.id)) {
            setColumnOrder(reorderColumn(column, hoveredColumn, columnOrder));
        }
        setDraggingColumn(null);
        setHoveredColumn(null);
    };
    return (React.createElement(MRT_GrabHandleButton, { iconButtonProps: iconButtonProps, onDragStart: handleDragStart, onDragEnd: handleDragEnd, table: table }));
};

const MRT_TableHeadCellResizeHandle = ({ header, table }) => {
    var _a;
    const { getState, options: { columnResizeMode }, setColumnSizingInfo, } = table;
    const { density } = getState();
    const { column } = header;
    return (React.createElement(Box, {
        className: "Mui-TableHeadCell-ResizeHandle-Wrapper", onDoubleClick: () => {
            setColumnSizingInfo((old) => (Object.assign(Object.assign({}, old), { isResizingColumn: false })));
            column.resetSize();
        }, onMouseDown: header.getResizeHandler(), onTouchStart: header.getResizeHandler(), sx: (theme) => ({
            cursor: 'col-resize',
            mr: density === 'compact' ? '-0.75rem' : '-1rem',
            position: 'absolute',
            right: '4px',
            px: '4px',
            '&:active > hr': {
                backgroundColor: theme.palette.info.main,
                opacity: 1,
            },
        }), style: {
            transform: column.getIsResizing() && columnResizeMode === 'onEnd'
                ? `translateX(${(_a = getState().columnSizingInfo.deltaOffset) !== null && _a !== void 0 ? _a : 0}px)`
                : undefined,
        }
    },
        React.createElement(Divider, {
            className: "Mui-TableHeadCell-ResizeHandle-Divider", flexItem: true, orientation: "vertical", sx: {
                borderRadius: '2px',
                borderWidth: '2px',
                height: '24px',
                touchAction: 'none',
                transition: column.getIsResizing()
                    ? undefined
                    : 'all 150ms ease-in-out',
                userSelect: 'none',
                zIndex: 4,
            }
        })));
};

const MRT_TableHeadCellSortLabel = ({ header, table, tableCellProps, }) => {
    const { getState, options: { icons: { ArrowDownwardIcon }, localization, }, } = table;
    const { column } = header;
    const { columnDef } = column;
    const { sorting } = getState();
    const sortTooltip = column.getIsSorted()
        ? column.getIsSorted() === 'desc'
            ? localization.sortedByColumnDesc.replace('{column}', columnDef.header)
            : localization.sortedByColumnAsc.replace('{column}', columnDef.header)
        : localization.unsorted;
    return (React.createElement(Tooltip, { arrow: true, placement: "top", title: sortTooltip },
        React.createElement(Badge, { badgeContent: sorting.length > 1 ? column.getSortIndex() + 1 : 0, overlap: "circular" },
            React.createElement(TableSortLabel, {
                "aria-label": sortTooltip, active: !!column.getIsSorted(), direction: column.getIsSorted()
                    ? column.getIsSorted()
                    : undefined, sx: {
                        flex: '0 0',
                        width: '2.4ch',
                        transform: (tableCellProps === null || tableCellProps === void 0 ? void 0 : tableCellProps.align) !== 'right'
                            ? 'translateX(-0.5ch)'
                            : undefined,
                    }, IconComponent: ArrowDownwardIcon, onClick: (e) => {
                        var _a;
                        e.stopPropagation();
                        (_a = header.column.getToggleSortingHandler()) === null || _a === void 0 ? void 0 : _a(e);
                    }
            }))));
};

const MRT_TableHeadCell = ({ header, table }) => {
    var _a, _b, _c, _d, _f, _g;
    const theme = useTheme();
    const { getState, options: { enableColumnActions, enableColumnDragging, enableColumnOrdering, enableGrouping, enableMultiSort, layoutMode, muiTableHeadCellProps, }, refs: { tableHeadCellRefs }, setHoveredColumn, } = table;
    const { density, draggingColumn, grouping, hoveredColumn, showColumnFilters, } = getState();
    const { column } = header;
    const { columnDef } = column;
    const { columnDefType } = columnDef;
    const mTableHeadCellProps = muiTableHeadCellProps instanceof Function
        ? muiTableHeadCellProps({ column, table })
        : muiTableHeadCellProps;
    const mcTableHeadCellProps = columnDef.muiTableHeadCellProps instanceof Function
        ? columnDef.muiTableHeadCellProps({ column, table })
        : columnDef.muiTableHeadCellProps;
    const tableCellProps = Object.assign(Object.assign({}, mTableHeadCellProps), mcTableHeadCellProps);
    const showColumnActions = (enableColumnActions || columnDef.enableColumnActions) &&
        columnDef.enableColumnActions !== false;
    const showDragHandle = enableColumnDragging !== false &&
        columnDef.enableColumnDragging !== false &&
        (enableColumnDragging ||
            (enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
            (enableGrouping &&
                columnDef.enableGrouping !== false &&
                !grouping.includes(column.id)));
    const headerPL = useMemo(() => {
        let pl = 0;
        if (column.getCanSort())
            pl++;
        if (showColumnActions)
            pl += 1.75;
        if (showDragHandle)
            pl += 1.25;
        return pl;
    }, [showColumnActions, showDragHandle]);
    const draggingBorder = useMemo(() => (draggingColumn === null || draggingColumn === void 0 ? void 0 : draggingColumn.id) === column.id
        ? `1px dashed ${theme.palette.text.secondary}`
        : (hoveredColumn === null || hoveredColumn === void 0 ? void 0 : hoveredColumn.id) === column.id
            ? `2px dashed ${theme.palette.primary.main}`
            : undefined, [draggingColumn, hoveredColumn]);
    const draggingBorders = draggingBorder
        ? {
            borderLeft: draggingBorder,
            borderRight: draggingBorder,
            borderTop: draggingBorder,
        }
        : undefined;
    const handleDragEnter = (_e) => {
        if (enableGrouping && (hoveredColumn === null || hoveredColumn === void 0 ? void 0 : hoveredColumn.id) === 'drop-zone') {
            setHoveredColumn(null);
        }
        if (enableColumnOrdering && draggingColumn && columnDefType !== 'group') {
            setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null);
        }
    };
    const headerElement = (columnDef === null || columnDef === void 0 ? void 0 : columnDef.Header) instanceof Function
        ? (_a = columnDef === null || columnDef === void 0 ? void 0 : columnDef.Header) === null || _a === void 0 ? void 0 : _a.call(columnDef, {
            column,
            header,
            table,
        })
        : (_b = columnDef === null || columnDef === void 0 ? void 0 : columnDef.Header) !== null && _b !== void 0 ? _b : columnDef.header;
    return (React.createElement(TableCell, Object.assign({
        align: columnDefType === 'group' ? 'center' : 'left', colSpan: header.colSpan, onDragEnter: handleDragEnter, ref: (node) => {
            if (node) {
                tableHeadCellRefs.current[column.id] = node;
            }
        }
    }, tableCellProps, {
        sx: (theme) => (Object.assign(Object.assign({
            flexDirection: layoutMode === 'grid' ? 'column' : undefined, fontWeight: 'bold', overflow: 'visible', p: density === 'compact'
                ? '0.5rem'
                : density === 'comfortable'
                    ? columnDefType === 'display'
                        ? '0.75rem'
                        : '1rem'
                    : columnDefType === 'display'
                        ? '1rem 1.25rem'
                        : '1.5rem', pb: columnDefType === 'display'
                            ? 0
                            : showColumnFilters || density === 'compact'
                                ? '0.4rem'
                                : '0.6rem', pt: columnDefType === 'group' || density === 'compact'
                                    ? '0.25rem'
                                    : density === 'comfortable'
                                        ? '.75rem'
                                        : '1.25rem', userSelect: enableMultiSort && column.getCanSort() ? 'none' : undefined, verticalAlign: 'top', zIndex: column.getIsResizing() || (draggingColumn === null || draggingColumn === void 0 ? void 0 : draggingColumn.id) === column.id
                                            ? 3
                                            : column.getIsPinned() && columnDefType !== 'group'
                                                ? 2
                                                : 1
        }, getCommonCellStyles({
            column,
            header,
            table,
            tableCellProps,
            theme,
        })), draggingBorders))
    }),
        header.isPlaceholder ? null : (React.createElement(Box, {
            className: "Mui-TableHeadCell-Content", sx: {
                alignItems: 'center',
                display: 'flex',
                flexDirection: (tableCellProps === null || tableCellProps === void 0 ? void 0 : tableCellProps.align) === 'right' ? 'row-reverse' : 'row',
                justifyContent: columnDefType === 'group' || (tableCellProps === null || tableCellProps === void 0 ? void 0 : tableCellProps.align) === 'center'
                    ? 'center'
                    : column.getCanResize()
                        ? 'space-between'
                        : 'flex-start',
                position: 'relative',
                width: '100%',
            }
        },
            React.createElement(Box, {
                className: "Mui-TableHeadCell-Content-Labels", onClick: column.getToggleSortingHandler(), sx: {
                    alignItems: 'center',
                    cursor: column.getCanSort() && columnDefType !== 'group'
                        ? 'pointer'
                        : undefined,
                    display: 'flex',
                    flexDirection: (tableCellProps === null || tableCellProps === void 0 ? void 0 : tableCellProps.align) === 'right' ? 'row-reverse' : 'row',
                    overflow: columnDefType === 'data' ? 'hidden' : undefined,
                    pl: (tableCellProps === null || tableCellProps === void 0 ? void 0 : tableCellProps.align) === 'center'
                        ? `${headerPL}rem`
                        : undefined,
                }
            },
                React.createElement(Box, {
                    className: "Mui-TableHeadCell-Content-Wrapper", sx: {
                        minWidth: `${Math.min((_d = (_c = columnDef.header) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0, 5)}ch`,
                        overflow: columnDefType === 'data' ? 'hidden' : undefined,
                        textOverflow: 'ellipsis',
                        whiteSpace: ((_g = (_f = columnDef.header) === null || _f === void 0 ? void 0 : _f.length) !== null && _g !== void 0 ? _g : 0) < 20 ? 'nowrap' : 'normal',
                        '&:hover': {
                            textOverflow: 'clip',
                        },
                    }, title: columnDefType === 'data' ? columnDef.header : undefined
                }, headerElement),
                column.getCanSort() && (React.createElement(MRT_TableHeadCellSortLabel, { header: header, table: table, tableCellProps: tableCellProps })),
                column.getCanFilter() && (React.createElement(MRT_TableHeadCellFilterLabel, { header: header, table: table }))),
            columnDefType !== 'group' && (React.createElement(Box, { className: "Mui-TableHeadCell-Content-Actions", sx: { whiteSpace: 'nowrap' } },
                showDragHandle && (React.createElement(MRT_TableHeadCellGrabHandle, {
                    column: column, table: table, tableHeadCellRef: {
                        current: tableHeadCellRefs.current[column.id],
                    }
                })),
                showColumnActions && (React.createElement(MRT_TableHeadCellColumnActionsButton, { header: header, table: table })))),
            column.getCanResize() && (React.createElement(MRT_TableHeadCellResizeHandle, { header: header, table: table })))),
        column.getCanFilter() && (React.createElement(MRT_TableHeadCellFilterContainer, { header: header, table: table }))));
};

const MRT_TableHeadRow = ({ headerGroup, table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, }) => {
    const { options: { layoutMode, muiTableHeadRowProps }, } = table;
    const tableRowProps = muiTableHeadRowProps instanceof Function
        ? muiTableHeadRowProps({ headerGroup, table })
        : muiTableHeadRowProps;
    return (React.createElement(TableRow, Object.assign({}, tableRowProps, {
        sx: (theme) => (Object.assign({ backgroundColor: lighten(theme.palette.background.default, 0.04), boxShadow: `4px 0 8px ${alpha(theme.palette.common.black, 0.1)}`, display: layoutMode === 'grid' ? 'flex' : 'table-row', top: 0 }, ((tableRowProps === null || tableRowProps === void 0 ? void 0 : tableRowProps.sx) instanceof Function
            ? tableRowProps === null || tableRowProps === void 0 ? void 0 : tableRowProps.sx(theme)
            : tableRowProps === null || tableRowProps === void 0 ? void 0 : tableRowProps.sx)))
    }),
        virtualPaddingLeft ? (React.createElement("th", { style: { display: 'flex', width: virtualPaddingLeft } })) : null,
        (virtualColumns !== null && virtualColumns !== void 0 ? virtualColumns : headerGroup.headers).map((headerOrVirtualHeader) => {
            const header = virtualColumns
                ? headerGroup.headers[headerOrVirtualHeader.index]
                : headerOrVirtualHeader;
            return (React.createElement(MRT_TableHeadCell, { header: header, key: header.id, table: table }));
        }),
        virtualPaddingRight ? (React.createElement("th", { style: { display: 'flex', width: virtualPaddingRight } })) : null));
};

const MRT_TableHead = ({ table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, }) => {
    const { getHeaderGroups, getState, options: { enableStickyHeader, layoutMode, muiTableHeadProps }, } = table;
    const { isFullScreen } = getState();
    const tableHeadProps = muiTableHeadProps instanceof Function
        ? muiTableHeadProps({ table })
        : muiTableHeadProps;
    const stickyHeader = enableStickyHeader || isFullScreen;
    return (React.createElement(TableHead, Object.assign({}, tableHeadProps, {
        sx: (theme) => (Object.assign({ display: layoutMode === 'grid' ? 'grid' : 'table-row-group', opacity: 0.97, position: stickyHeader ? 'sticky' : 'relative', top: stickyHeader && layoutMode === 'grid' ? 0 : undefined, zIndex: stickyHeader ? 2 : undefined }, ((tableHeadProps === null || tableHeadProps === void 0 ? void 0 : tableHeadProps.sx) instanceof Function
            ? tableHeadProps === null || tableHeadProps === void 0 ? void 0 : tableHeadProps.sx(theme)
            : tableHeadProps === null || tableHeadProps === void 0 ? void 0 : tableHeadProps.sx)))
    }), getHeaderGroups().map((headerGroup) => (React.createElement(MRT_TableHeadRow, { headerGroup: headerGroup, key: headerGroup.id, table: table, virtualColumns: virtualColumns, virtualPaddingLeft: virtualPaddingLeft, virtualPaddingRight: virtualPaddingRight })))));
};

const MRT_EditCellTextField = ({ cell, showLabel, table, }) => {
    var _a, _b, _c;
    const { getState, options: { muiTableBodyCellEditTextFieldProps }, refs: { editInputRefs }, setEditingCell, setEditingRow, } = table;
    const { column, row } = cell;
    const { columnDef } = column;
    const { editingRow } = getState();
    const [value, setValue] = useState(() => cell.getValue());
    const mTableBodyCellEditTextFieldProps = muiTableBodyCellEditTextFieldProps instanceof Function
        ? muiTableBodyCellEditTextFieldProps({ cell, column, row, table })
        : muiTableBodyCellEditTextFieldProps;
    const mcTableBodyCellEditTextFieldProps = columnDef.muiTableBodyCellEditTextFieldProps instanceof Function
        ? columnDef.muiTableBodyCellEditTextFieldProps({
            cell,
            column,
            row,
            table,
        })
        : columnDef.muiTableBodyCellEditTextFieldProps;
    const textFieldProps = Object.assign(Object.assign({}, mTableBodyCellEditTextFieldProps), mcTableBodyCellEditTextFieldProps);
    const isSelectEdit = columnDef.editVariant === 'select';
    const saveRow = (newValue) => {
        if (editingRow) {
            setEditingRow(Object.assign(Object.assign({}, editingRow), { _valuesCache: Object.assign(Object.assign({}, editingRow._valuesCache), { [column.id]: newValue }) }));
        }
    };
    const handleChange = (event) => {
        var _a;
        (_a = textFieldProps.onChange) === null || _a === void 0 ? void 0 : _a.call(textFieldProps, event);
        setValue(event.target.value);
        if (textFieldProps === null || textFieldProps === void 0 ? void 0 : textFieldProps.select) {
            saveRow(event.target.value);
        }
    };
    const handleBlur = (event) => {
        var _a;
        (_a = textFieldProps.onBlur) === null || _a === void 0 ? void 0 : _a.call(textFieldProps, event);
        saveRow(value);
        setEditingCell(null);
    };
    const handleEnterKeyDown = (event) => {
        var _a, _b;
        (_a = textFieldProps.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(textFieldProps, event);
        if (event.key === 'Enter') {
            (_b = editInputRefs.current[column.id]) === null || _b === void 0 ? void 0 : _b.blur();
        }
    };
    if (columnDef.Edit) {
        return React.createElement(React.Fragment, null, (_a = columnDef.Edit) === null || _a === void 0 ? void 0 : _a.call(columnDef, { cell, column, row, table }));
    }
    return (React.createElement(TextField, Object.assign({
        disabled: (columnDef.enableEditing instanceof Function
            ? columnDef.enableEditing(row)
            : columnDef.enableEditing) === false, fullWidth: true, inputRef: (inputRef) => {
                if (inputRef) {
                    editInputRefs.current[column.id] = inputRef;
                    if (textFieldProps.inputRef) {
                        textFieldProps.inputRef = inputRef;
                    }
                }
            }, label: showLabel ? column.columnDef.header : undefined, margin: "none", name: column.id, placeholder: columnDef.header, select: isSelectEdit, value: value, variant: "standard"
    }, textFieldProps, {
        onClick: (e) => {
            var _a;
            e.stopPropagation();
            (_a = textFieldProps === null || textFieldProps === void 0 ? void 0 : textFieldProps.onClick) === null || _a === void 0 ? void 0 : _a.call(textFieldProps, e);
        }, onBlur: handleBlur, onChange: handleChange, onKeyDown: handleEnterKeyDown
    }), (_b = textFieldProps.children) !== null && _b !== void 0 ? _b : (_c = columnDef === null || columnDef === void 0 ? void 0 : columnDef.editSelectOptions) === null || _c === void 0 ? void 0 : _c.map((option) => {
        let value;
        let text;
        if (typeof option !== 'object') {
            value = option;
            text = option;
        }
        else {
            value = option.value;
            text = option.text;
        }
        return (React.createElement(MenuItem, {
            key: value, sx: {
                display: 'flex',
                m: 0,
                alignItems: 'center',
                gap: '0.5rem',
            }, value: value
        }, text));
    })));
};

const MRT_CopyButton = ({ cell, children, table, }) => {
    var _a;
    const { options: { localization, muiTableBodyCellCopyButtonProps }, } = table;
    const { column, row } = cell;
    const { columnDef } = column;
    const [copied, setCopied] = useState(false);
    const handleCopy = (event, text) => {
        event.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 4000);
    };
    const mTableBodyCellCopyButtonProps = muiTableBodyCellCopyButtonProps instanceof Function
        ? muiTableBodyCellCopyButtonProps({ cell, column, row, table })
        : muiTableBodyCellCopyButtonProps;
    const mcTableBodyCellCopyButtonProps = columnDef.muiTableBodyCellCopyButtonProps instanceof Function
        ? columnDef.muiTableBodyCellCopyButtonProps({
            cell,
            column,
            row,
            table,
        })
        : columnDef.muiTableBodyCellCopyButtonProps;
    const buttonProps = Object.assign(Object.assign({}, mTableBodyCellCopyButtonProps), mcTableBodyCellCopyButtonProps);
    return (React.createElement(Tooltip, { arrow: true, enterDelay: 1000, enterNextDelay: 1000, placement: "top", title: (_a = buttonProps === null || buttonProps === void 0 ? void 0 : buttonProps.title) !== null && _a !== void 0 ? _a : (copied ? localization.copiedToClipboard : localization.clickToCopy) },
        React.createElement(Button, Object.assign({ onClick: (e) => handleCopy(e, cell.getValue()), size: "small", type: "button", variant: "text" }, buttonProps, {
            sx: (theme) => (Object.assign({ backgroundColor: 'transparent', border: 'none', color: 'inherit', cursor: 'copy', fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', m: '-0.25rem', minWidth: 'unset', textAlign: 'inherit', textTransform: 'inherit' }, ((buttonProps === null || buttonProps === void 0 ? void 0 : buttonProps.sx) instanceof Function
                ? buttonProps.sx(theme)
                : buttonProps === null || buttonProps === void 0 ? void 0 : buttonProps.sx))), title: undefined
        }), children)));
};

const MRT_TableBodyRowGrabHandle = ({ cell, rowRef, table }) => {
    const { options: { muiTableBodyRowDragHandleProps }, } = table;
    const { row } = cell;
    const iconButtonProps = muiTableBodyRowDragHandleProps instanceof Function
        ? muiTableBodyRowDragHandleProps({ row, table })
        : muiTableBodyRowDragHandleProps;
    const handleDragStart = (event) => {
        var _a;
        (_a = iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.onDragStart) === null || _a === void 0 ? void 0 : _a.call(iconButtonProps, event);
        event.dataTransfer.setDragImage(rowRef.current, 0, 0);
        table.setDraggingRow(row);
    };
    const handleDragEnd = (event) => {
        var _a;
        (_a = iconButtonProps === null || iconButtonProps === void 0 ? void 0 : iconButtonProps.onDragEnd) === null || _a === void 0 ? void 0 : _a.call(iconButtonProps, event);
        table.setDraggingRow(null);
        table.setHoveredRow(null);
    };
    return (React.createElement(MRT_GrabHandleButton, { iconButtonProps: iconButtonProps, onDragStart: handleDragStart, onDragEnd: handleDragEnd, table: table }));
};

const allowedTypes = ['string', 'number'];
const MRT_TableBodyCellValue = ({ cell, table }) => {
    var _a, _b, _c;
    const { getState, options: { enableFilterMatchHighlighting }, } = table;
    const { column, row } = cell;
    const { columnDef } = column;
    const { globalFilter, globalFilterFn } = getState();
    const filterValue = column.getFilterValue();
    let renderedCellValue = cell.getIsAggregated() && columnDef.AggregatedCell
        ? columnDef.AggregatedCell({
            cell,
            column,
            row,
            table,
        })
        : row.getIsGrouped() && !cell.getIsGrouped()
            ? null
            : cell.getIsGrouped() && columnDef.GroupedCell
                ? columnDef.GroupedCell({
                    cell,
                    column,
                    row,
                    table,
                })
                : undefined;
    const isGroupedValue = renderedCellValue !== undefined;
    if (!isGroupedValue) {
        renderedCellValue = cell.renderValue();
    }
    if (enableFilterMatchHighlighting &&
        columnDef.enableFilterMatchHighlighting !== false &&
        renderedCellValue &&
        allowedTypes.includes(typeof renderedCellValue) &&
        ((filterValue &&
            allowedTypes.includes(typeof filterValue) &&
            columnDef.filterVariant === 'text') ||
            (globalFilter &&
                allowedTypes.includes(typeof globalFilter) &&
                column.getCanGlobalFilter()))) {
        const chunks = highlightWords === null || highlightWords === void 0 ? void 0 : highlightWords({
            text: renderedCellValue === null || renderedCellValue === void 0 ? void 0 : renderedCellValue.toString(),
            query: ((_a = filterValue !== null && filterValue !== void 0 ? filterValue : globalFilter) !== null && _a !== void 0 ? _a : '').toString(),
            matchExactly: (filterValue ? columnDef._filterFn : globalFilterFn) !== 'fuzzy',
        });
        if ((chunks === null || chunks === void 0 ? void 0 : chunks.length) > 1 || ((_b = chunks === null || chunks === void 0 ? void 0 : chunks[0]) === null || _b === void 0 ? void 0 : _b.match)) {
            renderedCellValue = (React.createElement("span", { "aria-label": renderedCellValue, role: "note" }, (_c = chunks === null || chunks === void 0 ? void 0 : chunks.map(({ key, match, text }) => (React.createElement(Box, {
                "aria-hidden": "true", component: "span", key: key, sx: match
                    ? {
                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                            ? darken(theme.palette.warning.dark, 0.25)
                            : lighten(theme.palette.warning.light, 0.5),
                        borderRadius: '2px',
                        color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
                        padding: '2px 1px',
                    }
                    : undefined
            }, text)))) !== null && _c !== void 0 ? _c : renderedCellValue));
        }
    }
    if (columnDef.Cell && !isGroupedValue) {
        renderedCellValue = columnDef.Cell({
            cell,
            renderedCellValue,
            column,
            row,
            table,
        });
    }
    return React.createElement(React.Fragment, null, renderedCellValue);
};

const MRT_TableBodyCell = ({ cell, measureElement, numRows, rowIndex, rowRef, table, virtualCell, }) => {
    var _a, _b, _c, _d;
    const theme = useTheme();
    const { getState, options: { editingMode, enableClickToCopy, enableColumnOrdering, enableEditing, enableGrouping, enableRowNumbers, layoutMode, muiTableBodyCellProps, muiTableBodyCellSkeletonProps, rowNumberMode, }, refs: { editInputRefs }, setEditingCell, setHoveredColumn, } = table;
    const { draggingColumn, draggingRow, editingCell, editingRow, hoveredColumn, hoveredRow, density, isLoading, showSkeletons, } = getState();
    const { column, row } = cell;
    const { columnDef } = column;
    const { columnDefType } = columnDef;
    const mTableCellBodyProps = muiTableBodyCellProps instanceof Function
        ? muiTableBodyCellProps({ cell, column, row, table })
        : muiTableBodyCellProps;
    const mcTableCellBodyProps = columnDef.muiTableBodyCellProps instanceof Function
        ? columnDef.muiTableBodyCellProps({ cell, column, row, table })
        : columnDef.muiTableBodyCellProps;
    const tableCellProps = Object.assign(Object.assign({}, mTableCellBodyProps), mcTableCellBodyProps);
    const skeletonProps = muiTableBodyCellSkeletonProps instanceof Function
        ? muiTableBodyCellSkeletonProps({ cell, column, row, table })
        : muiTableBodyCellSkeletonProps;
    const [skeletonWidth, setSkeletonWidth] = useState(0);
    useEffect(() => setSkeletonWidth(isLoading || showSkeletons
        ? columnDefType === 'display'
            ? column.getSize() / 2
            : Math.round(Math.random() * (column.getSize() - column.getSize() / 3) +
                column.getSize() / 3)
        : 100), []);
    const draggingBorders = useMemo(() => {
        const isDraggingColumn = (draggingColumn === null || draggingColumn === void 0 ? void 0 : draggingColumn.id) === column.id;
        const isHoveredColumn = (hoveredColumn === null || hoveredColumn === void 0 ? void 0 : hoveredColumn.id) === column.id;
        const isDraggingRow = (draggingRow === null || draggingRow === void 0 ? void 0 : draggingRow.id) === row.id;
        const isHoveredRow = (hoveredRow === null || hoveredRow === void 0 ? void 0 : hoveredRow.id) === row.id;
        const isFirstColumn = getIsFirstColumn(column, table);
        const isLastColumn = getIsLastColumn(column, table);
        const isLastRow = rowIndex === numRows - 1;
        const borderStyle = isDraggingColumn || isDraggingRow
            ? `1px dashed ${theme.palette.text.secondary} !important`
            : isHoveredColumn || isHoveredRow
                ? `2px dashed ${theme.palette.primary.main} !important`
                : undefined;
        return borderStyle
            ? {
                borderLeft: isDraggingColumn ||
                    isHoveredColumn ||
                    ((isDraggingRow || isHoveredRow) && isFirstColumn)
                    ? borderStyle
                    : undefined,
                borderRight: isDraggingColumn ||
                    isHoveredColumn ||
                    ((isDraggingRow || isHoveredRow) && isLastColumn)
                    ? borderStyle
                    : undefined,
                borderBottom: isDraggingRow || isHoveredRow || isLastRow
                    ? borderStyle
                    : undefined,
                borderTop: isDraggingRow || isHoveredRow ? borderStyle : undefined,
            }
            : undefined;
    }, [draggingColumn, draggingRow, hoveredColumn, hoveredRow, rowIndex]);
    const isEditable = (enableEditing instanceof Function ? enableEditing(row) : enableEditing) &&
        (columnDef.enableEditing instanceof Function
            ? columnDef.enableEditing(row)
            : columnDef.enableEditing) !== false;
    const isEditing = isEditable &&
        editingMode !== 'modal' &&
        (editingMode === 'table' ||
            (editingRow === null || editingRow === void 0 ? void 0 : editingRow.id) === row.id ||
            (editingCell === null || editingCell === void 0 ? void 0 : editingCell.id) === cell.id) &&
        !row.getIsGrouped();
    const handleDoubleClick = (event) => {
        var _a;
        (_a = tableCellProps === null || tableCellProps === void 0 ? void 0 : tableCellProps.onDoubleClick) === null || _a === void 0 ? void 0 : _a.call(tableCellProps, event);
        if (isEditable && editingMode === 'cell') {
            setEditingCell(cell);
            queueMicrotask(() => {
                var _a;
                const textField = editInputRefs.current[column.id];
                if (textField) {
                    textField.focus();
                    (_a = textField.select) === null || _a === void 0 ? void 0 : _a.call(textField);
                }
            });
        }
    };
    const handleDragEnter = (e) => {
        var _a;
        (_a = tableCellProps === null || tableCellProps === void 0 ? void 0 : tableCellProps.onDragEnter) === null || _a === void 0 ? void 0 : _a.call(tableCellProps, e);
        if (enableGrouping && (hoveredColumn === null || hoveredColumn === void 0 ? void 0 : hoveredColumn.id) === 'drop-zone') {
            setHoveredColumn(null);
        }
        if (enableColumnOrdering && draggingColumn) {
            setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null);
        }
    };
    return (React.createElement(TableCell, Object.assign({
        "data-index": virtualCell === null || virtualCell === void 0 ? void 0 : virtualCell.index, ref: (node) => {
            if (node) {
                measureElement === null || measureElement === void 0 ? void 0 : measureElement(node);
            }
        }
    }, tableCellProps, {
        onDragEnter: handleDragEnter, onDoubleClick: handleDoubleClick, sx: (theme) => (Object.assign(Object.assign({
            alignItems: layoutMode === 'grid' ? 'center' : undefined, cursor: isEditable && editingMode === 'cell' ? 'pointer' : 'inherit', justifyContent: layoutMode === 'grid' ? tableCellProps.align : undefined, overflow: 'hidden', p: density === 'compact'
                ? columnDefType === 'display'
                    ? '0 0.5rem'
                    : '0.5rem'
                : density === 'comfortable'
                    ? columnDefType === 'display'
                        ? '0.5rem 0.75rem'
                        : '1rem'
                    : columnDefType === 'display'
                        ? '1rem 1.25rem'
                        : '1.5rem', pl: column.id === 'mrt-row-expand'
                            ? `${row.depth +
                            (density === 'compact'
                                ? 0.5
                                : density === 'comfortable'
                                    ? 0.75
                                    : 1.25)}rem`
                            : undefined, textOverflow: columnDefType !== 'display' ? 'ellipsis' : undefined, whiteSpace: density === 'compact' ? 'nowrap' : 'normal', zIndex: (draggingColumn === null || draggingColumn === void 0 ? void 0 : draggingColumn.id) === column.id ? 2 : column.getIsPinned() ? 1 : 0, '&:hover': {
                                outline: ['table', 'cell'].includes(editingMode !== null && editingMode !== void 0 ? editingMode : '')
                                    ? `1px solid ${theme.palette.text.secondary}`
                                    : undefined,
                                outlineOffset: '-1px',
                                textOverflow: 'clip',
                            }
        }, getCommonCellStyles({
            column,
            table,
            theme,
            tableCellProps,
        })), draggingBorders))
    }),
        React.createElement(React.Fragment, null,
            cell.getIsPlaceholder() ? ((_b = (_a = columnDef.PlaceholderCell) === null || _a === void 0 ? void 0 : _a.call(columnDef, { cell, column, row, table })) !== null && _b !== void 0 ? _b : null) : isLoading || showSkeletons ? (React.createElement(Skeleton, Object.assign({ animation: "wave", height: 20, width: skeletonWidth }, skeletonProps))) : enableRowNumbers &&
                rowNumberMode === 'static' &&
                column.id === 'mrt-row-numbers' ? (rowIndex + 1) : column.id === 'mrt-row-drag' ? (React.createElement(MRT_TableBodyRowGrabHandle, { cell: cell, rowRef: rowRef, table: table })) : columnDefType === 'display' &&
                    (column.id === 'mrt-row-select' ||
                        column.id === 'mrt-row-expand' ||
                        !row.getIsGrouped()) ? ((_c = columnDef.Cell) === null || _c === void 0 ? void 0 : _c.call(columnDef, {
                            cell,
                            renderedCellValue: cell.renderValue(),
                            column,
                            row,
                            table,
                        })) : isEditing ? (React.createElement(MRT_EditCellTextField, { cell: cell, table: table })) : (enableClickToCopy || columnDef.enableClickToCopy) &&
                            columnDef.enableClickToCopy !== false ? (React.createElement(MRT_CopyButton, { cell: cell, table: table },
                                React.createElement(MRT_TableBodyCellValue, { cell: cell, table: table }))) : (React.createElement(MRT_TableBodyCellValue, { cell: cell, table: table })),
            cell.getIsGrouped() && !columnDef.GroupedCell && (React.createElement(React.Fragment, null,
                " (", (_d = row.subRows) === null || _d === void 0 ? void 0 :
                _d.length,
                ")")))));
};
const Memo_MRT_TableBodyCell = memo(MRT_TableBodyCell, (prev, next) => next.cell === prev.cell);

const MRT_TableDetailPanel = ({ parentRowRef, row, rowIndex, table, virtualRow, }) => {
    const { getVisibleLeafColumns, getState, options: { layoutMode, muiTableBodyRowProps, muiTableDetailPanelProps, renderDetailPanel, }, } = table;
    const { isLoading } = getState();
    const tableRowProps = muiTableBodyRowProps instanceof Function
        ? muiTableBodyRowProps({
            isDetailPanel: true,
            row,
            staticRowIndex: rowIndex,
            table,
        })
        : muiTableBodyRowProps;
    const tableCellProps = muiTableDetailPanelProps instanceof Function
        ? muiTableDetailPanelProps({ row, table })
        : muiTableDetailPanelProps;
    return (React.createElement(TableRow, Object.assign({ className: "Mui-TableBodyCell-DetailPanel" }, tableRowProps, {
        sx: (theme) => {
            var _a, _b;
            return (Object.assign({
                display: layoutMode === 'grid' ? 'flex' : 'table-row', position: virtualRow ? 'absolute' : undefined, top: virtualRow
                    ? `${(_b = (_a = parentRowRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) === null || _b === void 0 ? void 0 : _b.height}px`
                    : undefined, transform: virtualRow
                        ? `translateY(${virtualRow === null || virtualRow === void 0 ? void 0 : virtualRow.start}px)`
                        : undefined, width: '100%', zIndex: virtualRow ? 2 : undefined
            }, ((tableRowProps === null || tableRowProps === void 0 ? void 0 : tableRowProps.sx) instanceof Function
                ? tableRowProps.sx(theme)
                : tableRowProps === null || tableRowProps === void 0 ? void 0 : tableRowProps.sx)));
        }
    }),
        React.createElement(TableCell, Object.assign({ className: "Mui-TableBodyCell-DetailPanel", colSpan: getVisibleLeafColumns().length }, tableCellProps, {
            sx: (theme) => (Object.assign({
                backgroundColor: virtualRow
                    ? lighten(theme.palette.background.default, 0.06)
                    : undefined, borderBottom: !row.getIsExpanded() ? 'none' : undefined, display: layoutMode === 'grid' ? 'flex' : 'table-cell', pb: row.getIsExpanded() ? '1rem' : 0, pt: row.getIsExpanded() ? '1rem' : 0, transition: 'all 150ms ease-in-out', width: `${table.getTotalSize()}px`
            }, ((tableCellProps === null || tableCellProps === void 0 ? void 0 : tableCellProps.sx) instanceof Function
                ? tableCellProps.sx(theme)
                : tableCellProps === null || tableCellProps === void 0 ? void 0 : tableCellProps.sx)))
        }), renderDetailPanel && (React.createElement(Collapse, { in: row.getIsExpanded(), mountOnEnter: true, unmountOnExit: true }, !isLoading && renderDetailPanel({ row, table }))))));
};

const MRT_TableBodyRow = ({ columnVirtualizer, measureElement, numRows, row, rowIndex, table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, virtualRow, }) => {
    const { getState, options: { enableRowOrdering, layoutMode, memoMode, muiTableBodyRowProps, renderDetailPanel, }, setHoveredRow, } = table;
    const { draggingColumn, draggingRow, editingCell, editingRow, hoveredRow } = getState();
    const tableRowProps = muiTableBodyRowProps instanceof Function
        ? muiTableBodyRowProps({ row, staticRowIndex: rowIndex, table })
        : muiTableBodyRowProps;
    const handleDragEnter = (_e) => {
        if (enableRowOrdering && draggingRow) {
            setHoveredRow(row);
        }
    };
    const rowRef = useRef(null);
    return (React.createElement(React.Fragment, null,
        React.createElement(TableRow, Object.assign({
            "data-index": virtualRow === null || virtualRow === void 0 ? void 0 : virtualRow.index, onDragEnter: handleDragEnter, selected: row.getIsSelected(), ref: (node) => {
                if (node) {
                    rowRef.current = node;
                    measureElement === null || measureElement === void 0 ? void 0 : measureElement(node);
                }
            }
        }, tableRowProps, {
            sx: (theme) => (Object.assign({
                backgroundColor: lighten(theme.palette.background.default, 0.06), boxSizing: 'border-box', display: layoutMode === 'grid' ? 'flex' : 'table-row', opacity: (draggingRow === null || draggingRow === void 0 ? void 0 : draggingRow.id) === row.id || (hoveredRow === null || hoveredRow === void 0 ? void 0 : hoveredRow.id) === row.id ? 0.5 : 1, position: virtualRow ? 'absolute' : undefined, transition: virtualRow ? 'none' : 'all 150ms ease-in-out', top: virtualRow ? 0 : undefined, width: '100%', '&:hover td': {
                    backgroundColor: (tableRowProps === null || tableRowProps === void 0 ? void 0 : tableRowProps.hover) !== false
                        ? row.getIsSelected()
                            ? `${alpha(theme.palette.primary.main, 0.2)}`
                            : theme.palette.mode === 'dark'
                                ? `${lighten(theme.palette.background.default, 0.12)}`
                                : `${darken(theme.palette.background.default, 0.05)}`
                        : undefined,
                }
            }, ((tableRowProps === null || tableRowProps === void 0 ? void 0 : tableRowProps.sx) instanceof Function
                ? tableRowProps.sx(theme)
                : tableRowProps === null || tableRowProps === void 0 ? void 0 : tableRowProps.sx))), style: Object.assign({
                    transform: virtualRow
                        ? `translateY(${virtualRow === null || virtualRow === void 0 ? void 0 : virtualRow.start}px)`
                        : undefined
                }, tableRowProps === null || tableRowProps === void 0 ? void 0 : tableRowProps.style)
        }),
            virtualPaddingLeft ? (React.createElement("td", { style: { display: 'flex', width: virtualPaddingLeft } })) : null,
            (virtualColumns !== null && virtualColumns !== void 0 ? virtualColumns : row.getVisibleCells()).map((cellOrVirtualCell) => {
                const cell = columnVirtualizer
                    ? row.getVisibleCells()[cellOrVirtualCell.index]
                    : cellOrVirtualCell;
                const props = {
                    cell,
                    key: cell.id,
                    measureElement: columnVirtualizer === null || columnVirtualizer === void 0 ? void 0 : columnVirtualizer.measureElement,
                    numRows,
                    rowIndex,
                    rowRef,
                    table,
                    virtualCell: columnVirtualizer
                        ? cellOrVirtualCell
                        : undefined,
                };
                return memoMode === 'cells' &&
                    cell.column.columnDef.columnDefType === 'data' &&
                    !draggingColumn &&
                    !draggingRow &&
                    (editingCell === null || editingCell === void 0 ? void 0 : editingCell.id) !== cell.id &&
                    (editingRow === null || editingRow === void 0 ? void 0 : editingRow.id) !== row.id ? (React.createElement(Memo_MRT_TableBodyCell, Object.assign({}, props))) : (React.createElement(MRT_TableBodyCell, Object.assign({}, props)));
            }),
            virtualPaddingRight ? (React.createElement("td", { style: { display: 'flex', width: virtualPaddingRight } })) : null),
        renderDetailPanel && !row.getIsGrouped() && (React.createElement(MRT_TableDetailPanel, { parentRowRef: rowRef, row: row, rowIndex: rowIndex, table: table, virtualRow: virtualRow }))));
};
const Memo_MRT_TableBodyRow = memo(MRT_TableBodyRow, (prev, next) => prev.row === next.row && prev.rowIndex === next.rowIndex);

const MRT_TableBody = ({ columnVirtualizer, table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, }) => {
    var _a, _b, _c, _d;
    const { getRowModel, getPrePaginationRowModel, getState, options: { enableGlobalFilterRankedResults, enablePagination, enableRowVirtualization, layoutMode, localization, manualExpanding, manualFiltering, manualGrouping, manualPagination, manualSorting, memoMode, muiTableBodyProps, renderEmptyRowsFallback, rowVirtualizerInstanceRef, rowVirtualizerProps, virtualizerInstanceRef, virtualizerProps, }, refs: { tableContainerRef, tablePaperRef }, } = table;
    const { columnFilters, density, expanded, globalFilter, globalFilterFn, pagination, sorting, } = getState();
    const tableBodyProps = muiTableBodyProps instanceof Function
        ? muiTableBodyProps({ table })
        : muiTableBodyProps;
    const vProps_old = virtualizerProps instanceof Function
        ? virtualizerProps({ table })
        : virtualizerProps;
    const vProps = rowVirtualizerProps instanceof Function
        ? rowVirtualizerProps({ table })
        : rowVirtualizerProps;
    const shouldRankResults = useMemo(() => !manualExpanding &&
        !manualFiltering &&
        !manualGrouping &&
        !manualSorting &&
        enableGlobalFilterRankedResults &&
        globalFilter &&
        globalFilterFn === 'fuzzy' &&
        expanded !== true &&
        !Object.values(sorting).some(Boolean) &&
        !Object.values(expanded).some(Boolean), [
        enableGlobalFilterRankedResults,
        expanded,
        globalFilter,
        manualExpanding,
        manualFiltering,
        manualGrouping,
        manualSorting,
        sorting,
    ]);
    const rows = useMemo(() => {
        if (!shouldRankResults)
            return getRowModel().rows;
        const rankedRows = getPrePaginationRowModel().rows.sort((a, b) => rankGlobalFuzzy(a, b));
        if (enablePagination && !manualPagination) {
            const start = pagination.pageIndex * pagination.pageSize;
            return rankedRows.slice(start, start + pagination.pageSize);
        }
        return rankedRows;
    }, [
        shouldRankResults,
        shouldRankResults ? getPrePaginationRowModel().rows : getRowModel().rows,
        pagination.pageIndex,
        pagination.pageSize,
    ]);
    const rowVirtualizer = enableRowVirtualization
        ? useVirtualizer(Object.assign(Object.assign({
            count: rows.length, estimateSize: () => density === 'compact' ? 37 : density === 'comfortable' ? 58 : 73, getScrollElement: () => tableContainerRef.current, measureElement: typeof window !== 'undefined' &&
                navigator.userAgent.indexOf('Firefox') === -1
                ? (element) => element === null || element === void 0 ? void 0 : element.getBoundingClientRect().height
                : undefined, overscan: 4
        }, vProps_old), vProps))
        : undefined;
    if (rowVirtualizerInstanceRef && rowVirtualizer) {
        rowVirtualizerInstanceRef.current = rowVirtualizer;
    }
    //deprecated
    if (virtualizerInstanceRef && rowVirtualizer) {
        virtualizerInstanceRef.current = rowVirtualizer;
    }
    const virtualRows = rowVirtualizer
        ? rowVirtualizer.getVirtualItems()
        : undefined;
    return (React.createElement(TableBody, Object.assign({}, tableBodyProps, {
        sx: (theme) => (Object.assign({
            display: layoutMode === 'grid' ? 'grid' : 'table-row-group', height: rowVirtualizer
                ? `${rowVirtualizer.getTotalSize()}px`
                : 'inherit', minHeight: !rows.length ? '100px' : undefined, position: 'relative'
        }, ((tableBodyProps === null || tableBodyProps === void 0 ? void 0 : tableBodyProps.sx) instanceof Function
            ? tableBodyProps === null || tableBodyProps === void 0 ? void 0 : tableBodyProps.sx(theme)
            : tableBodyProps === null || tableBodyProps === void 0 ? void 0 : tableBodyProps.sx)))
    }), (_a = tableBodyProps === null || tableBodyProps === void 0 ? void 0 : tableBodyProps.children) !== null && _a !== void 0 ? _a : (!rows.length ? (React.createElement("tr", { style: { display: layoutMode === 'grid' ? 'grid' : 'table-row' } },
        React.createElement("td", {
            colSpan: table.getVisibleLeafColumns().length, style: {
                display: layoutMode === 'grid' ? 'grid' : 'table-cell',
            }
        }, (_b = renderEmptyRowsFallback === null || renderEmptyRowsFallback === void 0 ? void 0 : renderEmptyRowsFallback({ table })) !== null && _b !== void 0 ? _b : (React.createElement(Typography, {
            sx: {
                color: 'text.secondary',
                fontStyle: 'italic',
                maxWidth: `min(100vw, ${(_d = (_c = tablePaperRef.current) === null || _c === void 0 ? void 0 : _c.clientWidth) !== null && _d !== void 0 ? _d : 360}px)`,
                py: '2rem',
                textAlign: 'center',
                width: '100%',
            }
        }, globalFilter || columnFilters.length
            ? localization.noResultsFound
            : localization.noRecordsToDisplay))))) : (React.createElement(React.Fragment, null, (virtualRows !== null && virtualRows !== void 0 ? virtualRows : rows).map((rowOrVirtualRow, rowIndex) => {
                const row = rowVirtualizer
                    ? rows[rowOrVirtualRow.index]
                    : rowOrVirtualRow;
                const props = {
                    columnVirtualizer,
                    key: row.id,
                    measureElement: rowVirtualizer === null || rowVirtualizer === void 0 ? void 0 : rowVirtualizer.measureElement,
                    numRows: rows.length,
                    row,
                    rowIndex: rowVirtualizer ? rowOrVirtualRow.index : rowIndex,
                    table,
                    virtualColumns,
                    virtualPaddingLeft,
                    virtualPaddingRight,
                    virtualRow: rowVirtualizer
                        ? rowOrVirtualRow
                        : undefined,
                };
                return memoMode === 'rows' ? (React.createElement(Memo_MRT_TableBodyRow, Object.assign({}, props))) : (React.createElement(MRT_TableBodyRow, Object.assign({}, props)));
            }))))));
};
const Memo_MRT_TableBody = memo(MRT_TableBody, (prev, next) => prev.table.options.data === next.table.options.data);

const MRT_TableFooterCell = ({ footer, table }) => {
    var _a, _b, _c;
    const { getState, options: { layoutMode, muiTableFooterCellProps }, } = table;
    const { density } = getState();
    const { column } = footer;
    const { columnDef } = column;
    const { columnDefType } = columnDef;
    const mTableFooterCellProps = muiTableFooterCellProps instanceof Function
        ? muiTableFooterCellProps({ column, table })
        : muiTableFooterCellProps;
    const mcTableFooterCellProps = columnDef.muiTableFooterCellProps instanceof Function
        ? columnDef.muiTableFooterCellProps({ column, table })
        : columnDef.muiTableFooterCellProps;
    const tableCellProps = Object.assign(Object.assign({}, mTableFooterCellProps), mcTableFooterCellProps);
    return (React.createElement(TableCell, Object.assign({ align: columnDefType === 'group' ? 'center' : 'left', colSpan: footer.colSpan, variant: "head" }, tableCellProps, {
        sx: (theme) => (Object.assign({
            display: layoutMode === 'grid' ? 'grid' : 'table-cell', fontWeight: 'bold', justifyContent: columnDefType === 'group' ? 'center' : undefined, p: density === 'compact'
                ? '0.5rem'
                : density === 'comfortable'
                    ? '1rem'
                    : '1.5rem', verticalAlign: 'top', zIndex: column.getIsPinned() && columnDefType !== 'group' ? 2 : 1
        }, getCommonCellStyles({
            column,
            table,
            theme,
            tableCellProps,
        })))
    }),
        React.createElement(React.Fragment, null, footer.isPlaceholder
            ? null
            : (_c = (_b = (columnDef.Footer instanceof Function
                ? (_a = columnDef.Footer) === null || _a === void 0 ? void 0 : _a.call(columnDef, {
                    column,
                    footer,
                    table,
                })
                : columnDef.Footer)) !== null && _b !== void 0 ? _b : columnDef.footer) !== null && _c !== void 0 ? _c : null)));
};

const MRT_TableFooterRow = ({ footerGroup, table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, }) => {
    var _a;
    const { options: { layoutMode, muiTableFooterRowProps }, } = table;
    // if no content in row, skip row
    if (!((_a = footerGroup.headers) === null || _a === void 0 ? void 0 : _a.some((header) => (typeof header.column.columnDef.footer === 'string' &&
        !!header.column.columnDef.footer) ||
        header.column.columnDef.Footer)))
        return null;
    const tableRowProps = muiTableFooterRowProps instanceof Function
        ? muiTableFooterRowProps({ footerGroup, table })
        : muiTableFooterRowProps;
    return (React.createElement(TableRow, Object.assign({}, tableRowProps, {
        sx: (theme) => (Object.assign({ backgroundColor: lighten(theme.palette.background.default, 0.04), display: layoutMode === 'grid' ? 'flex' : 'table-row', width: '100%' }, ((tableRowProps === null || tableRowProps === void 0 ? void 0 : tableRowProps.sx) instanceof Function
            ? tableRowProps === null || tableRowProps === void 0 ? void 0 : tableRowProps.sx(theme)
            : tableRowProps === null || tableRowProps === void 0 ? void 0 : tableRowProps.sx)))
    }),
        virtualPaddingLeft ? (React.createElement("th", { style: { display: 'flex', width: virtualPaddingLeft } })) : null,
        (virtualColumns !== null && virtualColumns !== void 0 ? virtualColumns : footerGroup.headers).map((footerOrVirtualFooter) => {
            const footer = virtualColumns
                ? footerGroup.headers[footerOrVirtualFooter.index]
                : footerOrVirtualFooter;
            return (React.createElement(MRT_TableFooterCell, { footer: footer, key: footer.id, table: table }));
        }),
        virtualPaddingRight ? (React.createElement("th", { style: { display: 'flex', width: virtualPaddingRight } })) : null));
};

const MRT_TableFooter = ({ table, virtualColumns, virtualPaddingLeft, virtualPaddingRight, }) => {
    const { getFooterGroups, getState, options: { enableStickyFooter, layoutMode, muiTableFooterProps }, } = table;
    const { isFullScreen } = getState();
    const tableFooterProps = muiTableFooterProps instanceof Function
        ? muiTableFooterProps({ table })
        : muiTableFooterProps;
    const stickFooter = (isFullScreen || enableStickyFooter) && enableStickyFooter !== false;
    return (React.createElement(TableFooter, Object.assign({}, tableFooterProps, {
        sx: (theme) => (Object.assign({
            bottom: stickFooter ? 0 : undefined, display: layoutMode === 'grid' ? 'grid' : 'table-row-group', opacity: stickFooter ? 0.97 : undefined, outline: stickFooter
                ? theme.palette.mode === 'light'
                    ? `1px solid ${theme.palette.grey[300]}`
                    : `1px solid ${theme.palette.grey[700]}`
                : undefined, position: stickFooter ? 'sticky' : undefined, zIndex: stickFooter ? 1 : undefined
        }, ((tableFooterProps === null || tableFooterProps === void 0 ? void 0 : tableFooterProps.sx) instanceof Function
            ? tableFooterProps === null || tableFooterProps === void 0 ? void 0 : tableFooterProps.sx(theme)
            : tableFooterProps === null || tableFooterProps === void 0 ? void 0 : tableFooterProps.sx)))
    }), getFooterGroups().map((footerGroup) => (React.createElement(MRT_TableFooterRow, { footerGroup: footerGroup, key: footerGroup.id, table: table, virtualColumns: virtualColumns, virtualPaddingLeft: virtualPaddingLeft, virtualPaddingRight: virtualPaddingRight })))));
};

const MRT_Table = ({ table }) => {
    var _a, _b, _c, _d;
    const { getFlatHeaders, getState, options: { columns, columnVirtualizerInstanceRef, columnVirtualizerProps, enableColumnResizing, enableColumnVirtualization, enablePinning, enableStickyHeader, enableTableFooter, enableTableHead, layoutMode, memoMode, muiTableProps, }, refs: { tableContainerRef }, } = table;
    const { columnPinning, columnSizing, columnSizingInfo, columnVisibility, isFullScreen, } = getState();
    const tableProps = muiTableProps instanceof Function
        ? muiTableProps({ table })
        : muiTableProps;
    const vProps = columnVirtualizerProps instanceof Function
        ? columnVirtualizerProps({ table })
        : columnVirtualizerProps;
    const columnSizeVars = useMemo(() => {
        const headers = getFlatHeaders();
        const colSizes = {};
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const colSize = header.getSize();
            colSizes[`--header-${parseCSSVarId(header.id)}-size`] = colSize;
            colSizes[`--col-${parseCSSVarId(header.column.id)}-size`] = colSize;
        }
        return colSizes;
    }, [columns, columnSizing, columnSizingInfo, columnVisibility]);
    //get first 16 column widths and average them
    const averageColumnWidth = useMemo(() => {
        var _a, _b, _c, _d;
        if (!enableColumnVirtualization)
            return 0;
        const columnsWidths = (_d = (_c = (_b = (_a = table
            .getRowModel()
            .rows[0]) === null || _a === void 0 ? void 0 : _a.getCenterVisibleCells()) === null || _b === void 0 ? void 0 : _b.slice(0, 16)) === null || _c === void 0 ? void 0 : _c.map((cell) => cell.column.getSize() * 1.2)) !== null && _d !== void 0 ? _d : [];
        return columnsWidths.reduce((a, b) => a + b, 0) / columnsWidths.length;
    }, [table.getRowModel().rows, columnPinning, columnVisibility]);
    const [leftPinnedIndexes, rightPinnedIndexes] = useMemo(() => enableColumnVirtualization && enablePinning
        ? [
            table.getLeftLeafColumns().map((c) => c.getPinnedIndex()),
            table
                .getRightLeafColumns()
                .map((c) => table.getVisibleLeafColumns().length - c.getPinnedIndex() - 1),
        ]
        : [[], []], [columnPinning, enableColumnVirtualization, enablePinning]);
    const columnVirtualizer = enableColumnVirtualization
        ? useVirtualizer(Object.assign({
            count: table.getVisibleLeafColumns().length, estimateSize: () => averageColumnWidth, getScrollElement: () => tableContainerRef.current, horizontal: true, overscan: 3, rangeExtractor: useCallback((range) => [
                ...new Set([
                    ...leftPinnedIndexes,
                    ...defaultRangeExtractor(range),
                    ...rightPinnedIndexes,
                ]),
            ], [leftPinnedIndexes, rightPinnedIndexes])
        }, vProps))
        : undefined;
    if (columnVirtualizerInstanceRef && columnVirtualizer) {
        columnVirtualizerInstanceRef.current = columnVirtualizer;
    }
    const virtualColumns = columnVirtualizer
        ? columnVirtualizer.getVirtualItems()
        : undefined;
    let virtualPaddingLeft;
    let virtualPaddingRight;
    if (columnVirtualizer && (virtualColumns === null || virtualColumns === void 0 ? void 0 : virtualColumns.length)) {
        virtualPaddingLeft = (_b = (_a = virtualColumns[leftPinnedIndexes.length]) === null || _a === void 0 ? void 0 : _a.start) !== null && _b !== void 0 ? _b : 0;
        virtualPaddingRight =
            columnVirtualizer.getTotalSize() -
            ((_d = (_c = virtualColumns[virtualColumns.length - 1 - rightPinnedIndexes.length]) === null || _c === void 0 ? void 0 : _c.end) !== null && _d !== void 0 ? _d : 0);
    }
    const props = {
        table,
        virtualColumns,
        virtualPaddingLeft,
        virtualPaddingRight,
    };
    return (React.createElement(Table, Object.assign({ stickyHeader: enableStickyHeader || isFullScreen }, tableProps, {
        sx: (theme) => (Object.assign({ borderCollapse: 'separate', display: layoutMode === 'grid' ? 'grid' : 'table', tableLayout: layoutMode !== 'grid' && enableColumnResizing ? 'fixed' : undefined }, ((tableProps === null || tableProps === void 0 ? void 0 : tableProps.sx) instanceof Function
            ? tableProps.sx(theme)
            : tableProps === null || tableProps === void 0 ? void 0 : tableProps.sx))), style: Object.assign(Object.assign({}, columnSizeVars), tableProps === null || tableProps === void 0 ? void 0 : tableProps.style)
    }),
        enableTableHead && React.createElement(MRT_TableHead, Object.assign({}, props)),
        memoMode === 'table-body' || columnSizingInfo.isResizingColumn ? (React.createElement(Memo_MRT_TableBody, Object.assign({ columnVirtualizer: columnVirtualizer }, props))) : (React.createElement(MRT_TableBody, Object.assign({ columnVirtualizer: columnVirtualizer }, props))),
        enableTableFooter && React.createElement(MRT_TableFooter, Object.assign({}, props))));
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
const MRT_TableContainer = ({ table }) => {
    const { getState, options: { enableStickyHeader, muiTableContainerProps }, refs: { tableContainerRef, bottomToolbarRef, topToolbarRef }, } = table;
    const { isFullScreen } = getState();
    const [totalToolbarHeight, setTotalToolbarHeight] = useState(0);
    const tableContainerProps = muiTableContainerProps instanceof Function
        ? muiTableContainerProps({ table })
        : muiTableContainerProps;
    useIsomorphicLayoutEffect(() => {
        var _a, _b, _c, _d;
        const topToolbarHeight = typeof document !== 'undefined'
            ? (_b = (_a = topToolbarRef.current) === null || _a === void 0 ? void 0 : _a.offsetHeight) !== null && _b !== void 0 ? _b : 0
            : 0;
        const bottomToolbarHeight = typeof document !== 'undefined'
            ? (_d = (_c = bottomToolbarRef === null || bottomToolbarRef === void 0 ? void 0 : bottomToolbarRef.current) === null || _c === void 0 ? void 0 : _c.offsetHeight) !== null && _d !== void 0 ? _d : 0
            : 0;
        setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight);
    });
    return (React.createElement(TableContainer, Object.assign({}, tableContainerProps, {
        ref: (node) => {
            if (node) {
                tableContainerRef.current = node;
                if (tableContainerProps === null || tableContainerProps === void 0 ? void 0 : tableContainerProps.ref) {
                    //@ts-ignore
                    tableContainerProps.ref.current = node;
                }
            }
        }, sx: (theme) => (Object.assign({
            maxWidth: '100%', maxHeight: enableStickyHeader
                ? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 9999px)`
                : undefined, overflow: 'auto'
        }, ((tableContainerProps === null || tableContainerProps === void 0 ? void 0 : tableContainerProps.sx) instanceof Function
            ? tableContainerProps.sx(theme)
            : tableContainerProps === null || tableContainerProps === void 0 ? void 0 : tableContainerProps.sx))), style: Object.assign({
                maxHeight: isFullScreen
                    ? `calc(100vh - ${totalToolbarHeight}px)`
                    : undefined
            }, tableContainerProps === null || tableContainerProps === void 0 ? void 0 : tableContainerProps.style)
    }),
        React.createElement(MRT_Table, { table: table })));
};

const MRT_TablePaper = ({ table }) => {
    const { getState, options: { enableBottomToolbar, enableTopToolbar, muiTablePaperProps, renderBottomToolbar, renderTopToolbar, }, refs: { tablePaperRef }, } = table;
    const { isFullScreen } = getState();
    const tablePaperProps = muiTablePaperProps instanceof Function
        ? muiTablePaperProps({ table })
        : muiTablePaperProps;
    return (React.createElement(Paper, Object.assign({ elevation: 2 }, tablePaperProps, {
        ref: (ref) => {
            tablePaperRef.current = ref;
            if (tablePaperProps === null || tablePaperProps === void 0 ? void 0 : tablePaperProps.ref) {
                //@ts-ignore
                tablePaperProps.ref.current = ref;
            }
        }, sx: (theme) => (Object.assign({ transition: 'all 150ms ease-in-out' }, ((tablePaperProps === null || tablePaperProps === void 0 ? void 0 : tablePaperProps.sx) instanceof Function
            ? tablePaperProps === null || tablePaperProps === void 0 ? void 0 : tablePaperProps.sx(theme)
            : tablePaperProps === null || tablePaperProps === void 0 ? void 0 : tablePaperProps.sx))), style: Object.assign(Object.assign({}, tablePaperProps === null || tablePaperProps === void 0 ? void 0 : tablePaperProps.style), (isFullScreen
                ? {
                    height: '100vh',
                    margin: 0,
                    maxHeight: '100vh',
                    maxWidth: '100vw',
                    padding: 0,
                    width: '100vw',
                }
                : {}))
    }),
        enableTopToolbar &&
        (renderTopToolbar instanceof Function
            ? renderTopToolbar({ table })
            : renderTopToolbar !== null && renderTopToolbar !== void 0 ? renderTopToolbar : React.createElement(MRT_TopToolbar, { table: table })),
        React.createElement(MRT_TableContainer, { table: table }),
        enableBottomToolbar &&
        (renderBottomToolbar instanceof Function
            ? renderBottomToolbar({ table })
            : renderBottomToolbar !== null && renderBottomToolbar !== void 0 ? renderBottomToolbar : React.createElement(MRT_BottomToolbar, { table: table }))));
};

const MRT_EditRowModal = ({ open, row, table, }) => {
    const { options: { localization }, } = table;
    return (React.createElement(Dialog, { open: open },
        React.createElement(DialogTitle, { textAlign: "center" }, localization.edit),
        React.createElement(DialogContent, null,
            React.createElement("form", { onSubmit: (e) => e.preventDefault() },
                React.createElement(Stack, {
                    sx: {
                        gap: '1.5rem',
                        minWidth: { xs: '300px', sm: '360px', md: '400px' },
                        pt: '1rem',
                        width: '100%',
                    }
                }, row
                    .getAllCells()
                    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
                    .map((cell) => (React.createElement(MRT_EditCellTextField, { cell: cell, key: cell.id, showLabel: true, table: table })))))),
        React.createElement(DialogActions, { sx: { p: '1.25rem' } },
            React.createElement(MRT_EditActionButtons, { row: row, table: table, variant: "text" }))));
};

const MRT_TableRoot = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
    const bottomToolbarRef = useRef(null);
    const editInputRefs = useRef({});
    const filterInputRefs = useRef({});
    const searchInputRef = useRef(null);
    const tableContainerRef = useRef(null);
    const tableHeadCellRefs = useRef({});
    const tablePaperRef = useRef(null);
    const topToolbarRef = useRef(null);
    const initialState = useMemo(() => {
        var _a, _b, _c;
        const initState = (_a = props.initialState) !== null && _a !== void 0 ? _a : {};
        initState.columnOrder =
            (_b = initState.columnOrder) !== null && _b !== void 0 ? _b : getDefaultColumnOrderIds(props);
        initState.globalFilterFn = (_c = props.globalFilterFn) !== null && _c !== void 0 ? _c : 'fuzzy';
        return initState;
    }, []);
    const [columnFilterFns, setColumnFilterFns] = useState(() => Object.assign({}, ...getAllLeafColumnDefs(props.columns).map((col) => {
        var _a, _b, _c, _d;
        return ({
            [getColumnId(col)]: col.filterFn instanceof Function
                ? (_a = col.filterFn.name) !== null && _a !== void 0 ? _a : 'custom'
                : (_d = (_b = col.filterFn) !== null && _b !== void 0 ? _b : (_c = initialState === null || initialState === void 0 ? void 0 : initialState.columnFilterFns) === null || _c === void 0 ? void 0 : _c[getColumnId(col)]) !== null && _d !== void 0 ? _d : getDefaultColumnFilterFn(col),
        });
    })));
    const [columnOrder, setColumnOrder] = useState((_a = initialState.columnOrder) !== null && _a !== void 0 ? _a : []);
    const [density, setDensity] = useState((_b = initialState === null || initialState === void 0 ? void 0 : initialState.density) !== null && _b !== void 0 ? _b : 'comfortable');
    const [draggingColumn, setDraggingColumn] = useState((_c = initialState.draggingColumn) !== null && _c !== void 0 ? _c : null);
    const [draggingRow, setDraggingRow] = useState((_d = initialState.draggingRow) !== null && _d !== void 0 ? _d : null);
    const [editingCell, setEditingCell] = useState((_e = initialState.editingCell) !== null && _e !== void 0 ? _e : null);
    const [editingRow, setEditingRow] = useState((_f = initialState.editingRow) !== null && _f !== void 0 ? _f : null);
    const [globalFilterFn, setGlobalFilterFn] = useState((_g = initialState.globalFilterFn) !== null && _g !== void 0 ? _g : 'fuzzy');
    const [grouping, setGrouping] = useState((_h = initialState.grouping) !== null && _h !== void 0 ? _h : []);
    const [hoveredColumn, setHoveredColumn] = useState((_j = initialState.hoveredColumn) !== null && _j !== void 0 ? _j : null);
    const [hoveredRow, setHoveredRow] = useState((_k = initialState.hoveredRow) !== null && _k !== void 0 ? _k : null);
    const [isFullScreen, setIsFullScreen] = useState((_l = initialState === null || initialState === void 0 ? void 0 : initialState.isFullScreen) !== null && _l !== void 0 ? _l : false);
    const [showAlertBanner, setShowAlertBanner] = useState((_o = (_m = props.initialState) === null || _m === void 0 ? void 0 : _m.showAlertBanner) !== null && _o !== void 0 ? _o : false);
    const [showColumnFilters, setShowColumnFilters] = useState((_p = initialState === null || initialState === void 0 ? void 0 : initialState.showColumnFilters) !== null && _p !== void 0 ? _p : false);
    const [showGlobalFilter, setShowGlobalFilter] = useState((_q = initialState === null || initialState === void 0 ? void 0 : initialState.showGlobalFilter) !== null && _q !== void 0 ? _q : false);
    const [showToolbarDropZone, setShowToolbarDropZone] = useState((_r = initialState === null || initialState === void 0 ? void 0 : initialState.showToolbarDropZone) !== null && _r !== void 0 ? _r : false);
    const displayColumns = useMemo(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return [
            ((_b = (_a = props.state) === null || _a === void 0 ? void 0 : _a.columnOrder) !== null && _b !== void 0 ? _b : columnOrder).includes('mrt-row-drag') && Object.assign(Object.assign(Object.assign({ header: props.localization.move, size: 60 }, props.defaultDisplayColumn), (_c = props.displayColumnDefOptions) === null || _c === void 0 ? void 0 : _c['mrt-row-drag']), { id: 'mrt-row-drag' }),
            ((_e = (_d = props.state) === null || _d === void 0 ? void 0 : _d.columnOrder) !== null && _e !== void 0 ? _e : columnOrder).includes('mrt-row-actions') && Object.assign(Object.assign(Object.assign({ Cell: ({ cell, row }) => (React.createElement(MRT_ToggleRowActionMenuButton, { cell: cell, row: row, table: table })), header: props.localization.actions, size: 70 }, props.defaultDisplayColumn), (_f = props.displayColumnDefOptions) === null || _f === void 0 ? void 0 : _f['mrt-row-actions']), { id: 'mrt-row-actions' }),
            ((_h = (_g = props.state) === null || _g === void 0 ? void 0 : _g.columnOrder) !== null && _h !== void 0 ? _h : columnOrder).includes('mrt-row-expand') &&
            showExpandColumn(props, (_k = (_j = props.state) === null || _j === void 0 ? void 0 : _j.grouping) !== null && _k !== void 0 ? _k : grouping) && Object.assign(Object.assign(Object.assign({
                Cell: ({ row }) => (React.createElement(MRT_ExpandButton, { row: row, table: table })), Header: props.enableExpandAll
                    ? () => React.createElement(MRT_ExpandAllButton, { table: table })
                    : null, header: props.localization.expand, size: 60
            }, props.defaultDisplayColumn), (_l = props.displayColumnDefOptions) === null || _l === void 0 ? void 0 : _l['mrt-row-expand']), { id: 'mrt-row-expand' }),
            ((_o = (_m = props.state) === null || _m === void 0 ? void 0 : _m.columnOrder) !== null && _o !== void 0 ? _o : columnOrder).includes('mrt-row-select') && Object.assign(Object.assign(Object.assign({
                Cell: ({ row }) => (React.createElement(MRT_SelectCheckbox, { row: row, table: table })), Header: props.enableSelectAll && props.enableMultiRowSelection
                    ? () => React.createElement(MRT_SelectCheckbox, { selectAll: true, table: table })
                    : null, header: props.localization.select, size: 60
            }, props.defaultDisplayColumn), (_p = props.displayColumnDefOptions) === null || _p === void 0 ? void 0 : _p['mrt-row-select']), { id: 'mrt-row-select' }),
            ((_r = (_q = props.state) === null || _q === void 0 ? void 0 : _q.columnOrder) !== null && _r !== void 0 ? _r : columnOrder).includes('mrt-row-numbers') && Object.assign(Object.assign(Object.assign({ Cell: ({ row }) => row.index + 1, Header: () => props.localization.rowNumber, header: props.localization.rowNumbers, size: 60 }, props.defaultDisplayColumn), (_s = props.displayColumnDefOptions) === null || _s === void 0 ? void 0 : _s['mrt-row-numbers']), { id: 'mrt-row-numbers' }),
        ].filter(Boolean);
    }, [
        columnOrder,
        grouping,
        props.displayColumnDefOptions,
        props.editingMode,
        props.enableColumnDragging,
        props.enableColumnFilterModes,
        props.enableColumnOrdering,
        props.enableEditing,
        props.enableExpandAll,
        props.enableExpanding,
        props.enableGrouping,
        props.enableRowActions,
        props.enableRowDragging,
        props.enableRowNumbers,
        props.enableRowOrdering,
        props.enableRowSelection,
        props.enableSelectAll,
        props.localization,
        props.positionActionsColumn,
        props.renderDetailPanel,
        props.renderRowActionMenuItems,
        props.renderRowActions,
        (_s = props.state) === null || _s === void 0 ? void 0 : _s.columnOrder,
        (_t = props.state) === null || _t === void 0 ? void 0 : _t.grouping,
    ]);
    const columnDefs = useMemo(() => {
        var _a, _b, _c;
        return prepareColumns({
            aggregationFns: props.aggregationFns,
            columnDefs: [...displayColumns, ...props.columns],
            columnFilterFns: (_b = (_a = props.state) === null || _a === void 0 ? void 0 : _a.columnFilterFns) !== null && _b !== void 0 ? _b : columnFilterFns,
            defaultDisplayColumn: (_c = props.defaultDisplayColumn) !== null && _c !== void 0 ? _c : {},
            filterFns: props.filterFns,
            sortingFns: props.sortingFns,
        });
    }, [
        columnFilterFns,
        displayColumns,
        props.columns,
        (_u = props.state) === null || _u === void 0 ? void 0 : _u.columnFilterFns,
    ]);
    const data = useMemo(() => {
        var _a, _b, _c, _d, _e;
        return (((_a = props.state) === null || _a === void 0 ? void 0 : _a.isLoading) || ((_b = props.state) === null || _b === void 0 ? void 0 : _b.showSkeletons)) &&
            !props.data.length
            ? [
                ...Array(((_d = (_c = props.state) === null || _c === void 0 ? void 0 : _c.pagination) === null || _d === void 0 ? void 0 : _d.pageSize) ||
                    ((_e = initialState === null || initialState === void 0 ? void 0 : initialState.pagination) === null || _e === void 0 ? void 0 : _e.pageSize) ||
                    10).fill(null),
            ].map(() => Object.assign({}, ...getAllLeafColumnDefs(props.columns).map((col) => ({
                [getColumnId(col)]: null,
            }))))
            : props.data;
    }, [props.data, (_v = props.state) === null || _v === void 0 ? void 0 : _v.isLoading, (_w = props.state) === null || _w === void 0 ? void 0 : _w.showSkeletons]);
    //@ts-ignore
    const table = Object.assign(Object.assign({}, useReactTable(Object.assign(Object.assign({ getCoreRowModel: getCoreRowModel(), getExpandedRowModel: getExpandedRowModel(), getFacetedRowModel: getFacetedRowModel(), getFilteredRowModel: getFilteredRowModel(), getGroupedRowModel: getGroupedRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(), onColumnOrderChange: setColumnOrder, onGroupingChange: setGrouping, getSubRows: (row) => row === null || row === void 0 ? void 0 : row.subRows }, props), {
        //@ts-ignore
        columns: columnDefs, data, globalFilterFn: (_y = (_x = props.filterFns) === null || _x === void 0 ? void 0 : _x[globalFilterFn]) !== null && _y !== void 0 ? _y : (_z = props.filterFns) === null || _z === void 0 ? void 0 : _z.fuzzy, initialState, state: Object.assign({
            columnFilterFns,
            columnOrder,
            density,
            draggingColumn,
            draggingRow,
            editingCell,
            editingRow,
            globalFilterFn,
            grouping,
            hoveredColumn,
            hoveredRow,
            isFullScreen,
            showAlertBanner,
            showColumnFilters,
            showGlobalFilter,
            showToolbarDropZone
        }, props.state)
    }))), {
        refs: {
            bottomToolbarRef,
            editInputRefs,
            filterInputRefs,
            searchInputRef,
            tableContainerRef,
            tableHeadCellRefs,
            tablePaperRef,
            topToolbarRef,
        }, setColumnFilterFns: (_0 = props.onColumnFilterFnsChange) !== null && _0 !== void 0 ? _0 : setColumnFilterFns, setDensity: (_1 = props.onDensityChange) !== null && _1 !== void 0 ? _1 : setDensity, setDraggingColumn: (_2 = props.onDraggingColumnChange) !== null && _2 !== void 0 ? _2 : setDraggingColumn, setDraggingRow: (_3 = props.onDraggingRowChange) !== null && _3 !== void 0 ? _3 : setDraggingRow, setEditingCell: (_4 = props.onEditingCellChange) !== null && _4 !== void 0 ? _4 : setEditingCell, setEditingRow: (_5 = props.onEditingRowChange) !== null && _5 !== void 0 ? _5 : setEditingRow, setGlobalFilterFn: (_6 = props.onGlobalFilterFnChange) !== null && _6 !== void 0 ? _6 : setGlobalFilterFn, setHoveredColumn: (_7 = props.onHoveredColumnChange) !== null && _7 !== void 0 ? _7 : setHoveredColumn, setHoveredRow: (_8 = props.onHoveredRowChange) !== null && _8 !== void 0 ? _8 : setHoveredRow, setIsFullScreen: (_9 = props.onIsFullScreenChange) !== null && _9 !== void 0 ? _9 : setIsFullScreen, setShowAlertBanner: (_10 = props.onShowAlertBannerChange) !== null && _10 !== void 0 ? _10 : setShowAlertBanner, setShowColumnFilters: (_11 = props.onShowColumnFiltersChange) !== null && _11 !== void 0 ? _11 : setShowColumnFilters, setShowGlobalFilter: (_12 = props.onShowGlobalFilterChange) !== null && _12 !== void 0 ? _12 : setShowGlobalFilter, setShowToolbarDropZone: (_13 = props.onShowToolbarDropZoneChange) !== null && _13 !== void 0 ? _13 : setShowToolbarDropZone
    });
    if (props.tableFeatures) {
        props.tableFeatures.forEach((feature) => {
            Object.assign(table, feature(table));
        });
    }
    if (props.tableInstanceRef) {
        props.tableInstanceRef.current = table;
    }
    const initialBodyHeight = useRef();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            initialBodyHeight.current = document.body.style.height;
        }
    }, []);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (table.getState().isFullScreen) {
                document.body.style.height = '100vh';
            }
            else {
                document.body.style.height = initialBodyHeight.current;
            }
        }
    }, [table.getState().isFullScreen]);
    //if page index is out of bounds, set it to the last page
    useEffect(() => {
        var _a;
        const { pageIndex, pageSize } = table.getState().pagination;
        const totalRowCount = (_a = props.rowCount) !== null && _a !== void 0 ? _a : table.getPrePaginationRowModel().rows.length;
        const firstVisibleRowIndex = pageIndex * pageSize;
        if (firstVisibleRowIndex > totalRowCount) {
            table.setPageIndex(Math.floor(totalRowCount / pageSize));
        }
    }, [props.rowCount, table.getPrePaginationRowModel().rows.length]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Dialog, { PaperComponent: Box, TransitionComponent: !props.enableRowVirtualization ? Grow : undefined, disablePortal: true, fullScreen: true, keepMounted: false, onClose: () => table.setIsFullScreen(false), open: table.getState().isFullScreen, transitionDuration: 400 },
            React.createElement(MRT_TablePaper, { table: table })),
        !table.getState().isFullScreen && (React.createElement(MRT_TablePaper, { table: table })),
        editingRow && props.editingMode === 'modal' && (React.createElement(MRT_EditRowModal, { row: editingRow, table: table, open: true }))));
};

const MRT_Localization_EN = {
    actions: 'Actions',
    and: 'and',
    cancel: 'Cancel',
    changeFilterMode: 'Change filter mode',
    changeSearchMode: 'Change search mode',
    clearFilter: 'Clear filter',
    clearSearch: 'Clear search',
    clearSort: 'Clear sort',
    clickToCopy: 'Click to copy',
    collapse: 'Collapse',
    collapseAll: 'Collapse all',
    columnActions: 'Column Actions',
    copiedToClipboard: 'Copied to clipboard',
    dropToGroupBy: 'Drop to group by {column}',
    edit: 'Edit',
    expand: 'Expand',
    expandAll: 'Expand all',
    filterArrIncludes: 'Includes',
    filterArrIncludesAll: 'Includes all',
    filterArrIncludesSome: 'Includes',
    filterBetween: 'Between',
    filterBetweenInclusive: 'Between Inclusive',
    filterByColumn: 'Filter by {column}',
    filterContains: 'Contains',
    filterEmpty: 'Empty',
    filterEndsWith: 'Ends With',
    filterEquals: 'Equals',
    filterEqualsString: 'Equals',
    filterFuzzy: 'Fuzzy',
    filterGreaterThan: 'Greater Than',
    filterGreaterThanOrEqualTo: 'Greater Than Or Equal To',
    filterInNumberRange: 'Between',
    filterIncludesString: 'Contains',
    filterIncludesStringSensitive: 'Contains',
    filterLessThan: 'Less Than',
    filterLessThanOrEqualTo: 'Less Than Or Equal To',
    filterMode: 'Filter Mode: {filterType}',
    filterNotEmpty: 'Not Empty',
    filterNotEquals: 'Not Equals',
    filterStartsWith: 'Starts With',
    filterWeakEquals: 'Equals',
    filteringByColumn: 'Filtering by {column} - {filterType} {filterValue}',
    goToFirstPage: 'Go to first page',
    goToLastPage: 'Go to last page',
    goToNextPage: 'Go to next page',
    goToPreviousPage: 'Go to previous page',
    grab: 'Grab',
    groupByColumn: 'Group by {column}',
    groupedBy: 'Grouped by ',
    hideAll: 'Hide all',
    hideColumn: 'Hide {column} column',
    max: 'Max',
    min: 'Min',
    move: 'Move',
    noRecordsToDisplay: 'No records to display',
    noResultsFound: 'No results found',
    of: 'of',
    or: 'or',
    pinToLeft: 'Pin to left',
    pinToRight: 'Pin to right',
    resetColumnSize: 'Reset column size',
    resetOrder: 'Reset order',
    rowActions: 'Row Actions',
    rowNumber: '#',
    rowNumbers: 'Row Numbers',
    rowsPerPage: 'Rows per page',
    save: 'Save',
    search: 'Search',
    selectedCountOfRowCountRowsSelected: '{selectedCount} of {rowCount} row(s) selected',
    select: 'Select',
    showAll: 'Show all',
    showAllColumns: 'Show all columns',
    showHideColumns: 'Show/Hide columns',
    showFilters: 'Show column search',
    hideFilters: 'Hide column search',
    showHideSearch: 'Show/Hide search',
    sortByColumnAsc: 'Sort by {column} ascending',
    sortByColumnDesc: 'Sort by {column} descending',
    sortedByColumnAsc: 'Sorted by {column} ascending',
    sortedByColumnDesc: 'Sorted by {column} descending',
    thenBy: ', then by ',
    toggleDensity: 'Toggle density',
    toggleFullScreen: 'Toggle full screen',
    toggleSelectAll: 'Toggle select all',
    toggleSelectRow: 'Toggle select row',
    toggleVisibility: 'Toggle visibility',
    ungroupByColumn: 'Ungroup by {column}',
    unpin: 'Unpin',
    unpinAll: 'Unpin all',
    unsorted: 'Unsorted',
};

const MaterialReactTable = (_a) => {
    var _b;
    var { aggregationFns, autoResetExpanded = false, columnResizeMode = 'onChange', defaultColumn, defaultDisplayColumn, editingMode = 'modal', enableBottomToolbar = true, enableColumnActions = true, enableColumnFilters = true, enableColumnOrdering = false, enableColumnResizing = false, enableDensityToggle = true, enableExpandAll = true, enableFilterMatchHighlighting = true, enableFilters = true, enableFullScreenToggle = true, enableGlobalFilter = true, enableGlobalFilterRankedResults = true, enableGrouping = false, enableHiding = true, enableMultiRowSelection = true, enableMultiSort = true, enablePagination = true, enablePinning = false, enableRowSelection = false, enableSelectAll = true, enableSorting = true, enableStickyHeader = false, enableTableFooter = true, enableTableHead = true, enableToolbarInternalActions = true, enableTopToolbar = true, filterFns, icons, layoutMode = 'semantic', localization, manualFiltering, manualGrouping, manualPagination, manualSorting, positionActionsColumn = 'first', positionExpandColumn = 'first', positionGlobalFilter = 'right', positionPagination = 'bottom', positionToolbarAlertBanner = 'top', positionToolbarDropZone = 'top', rowNumberMode = 'original', selectAllMode = 'page', sortingFns } = _a, rest = __rest(_a, ["aggregationFns", "autoResetExpanded", "columnResizeMode", "defaultColumn", "defaultDisplayColumn", "editingMode", "enableBottomToolbar", "enableColumnActions", "enableColumnFilters", "enableColumnOrdering", "enableColumnResizing", "enableDensityToggle", "enableExpandAll", "enableFilterMatchHighlighting", "enableFilters", "enableFullScreenToggle", "enableGlobalFilter", "enableGlobalFilterRankedResults", "enableGrouping", "enableHiding", "enableMultiRowSelection", "enableMultiSort", "enablePagination", "enablePinning", "enableRowSelection", "enableSelectAll", "enableSorting", "enableStickyHeader", "enableTableFooter", "enableTableHead", "enableToolbarInternalActions", "enableTopToolbar", "filterFns", "icons", "layoutMode", "localization", "manualFiltering", "manualGrouping", "manualPagination", "manualSorting", "positionActionsColumn", "positionExpandColumn", "positionGlobalFilter", "positionPagination", "positionToolbarAlertBanner", "positionToolbarDropZone", "rowNumberMode", "selectAllMode", "sortingFns"]);
    const _icons = useMemo(() => (Object.assign(Object.assign({}, MRT_Default_Icons), icons)), [icons]);
    const _localization = useMemo(() => (Object.assign(Object.assign({}, MRT_Localization_EN), localization)), [localization]);
    const _aggregationFns = useMemo(() => (Object.assign(Object.assign({}, MRT_AggregationFns), aggregationFns)), []);
    const _filterFns = useMemo(() => (Object.assign(Object.assign({}, MRT_FilterFns), filterFns)), []);
    const _sortingFns = useMemo(() => (Object.assign(Object.assign({}, MRT_SortingFns), sortingFns)), []);
    const _defaultColumn = useMemo(() => (Object.assign(Object.assign({}, MRT_DefaultColumn), defaultColumn)), [defaultColumn]);
    const _defaultDisplayColumn = useMemo(() => (Object.assign(Object.assign({}, MRT_DefaultDisplayColumn), defaultDisplayColumn)), [defaultDisplayColumn]);
    if (rest.enableRowVirtualization || rest.enableColumnVirtualization) {
        layoutMode = 'grid';
    }
    if (rest.enableRowVirtualization) {
        enableStickyHeader = true;
    }
    if (enablePagination === false && manualPagination === undefined) {
        manualPagination = true;
    }
    if (!((_b = rest.data) === null || _b === void 0 ? void 0 : _b.length)) {
        manualFiltering = true;
        manualGrouping = true;
        manualPagination = true;
        manualSorting = true;
    }
    return (React.createElement(MRT_TableRoot, Object.assign({ aggregationFns: _aggregationFns, autoResetExpanded: autoResetExpanded, columnResizeMode: columnResizeMode, defaultColumn: _defaultColumn, defaultDisplayColumn: _defaultDisplayColumn, editingMode: editingMode, enableBottomToolbar: enableBottomToolbar, enableColumnActions: enableColumnActions, enableColumnFilters: enableColumnFilters, enableColumnOrdering: enableColumnOrdering, enableColumnResizing: enableColumnResizing, enableDensityToggle: enableDensityToggle, enableExpandAll: enableExpandAll, enableFilterMatchHighlighting: enableFilterMatchHighlighting, enableFilters: enableFilters, enableFullScreenToggle: enableFullScreenToggle, enableGlobalFilter: enableGlobalFilter, enableGlobalFilterRankedResults: enableGlobalFilterRankedResults, enableGrouping: enableGrouping, enableHiding: enableHiding, enableMultiRowSelection: enableMultiRowSelection, enableMultiSort: enableMultiSort, enablePagination: enablePagination, enablePinning: enablePinning, enableRowSelection: enableRowSelection, enableSelectAll: enableSelectAll, enableSorting: enableSorting, enableStickyHeader: enableStickyHeader, enableTableFooter: enableTableFooter, enableTableHead: enableTableHead, enableToolbarInternalActions: enableToolbarInternalActions, enableTopToolbar: enableTopToolbar, filterFns: _filterFns, icons: _icons, layoutMode: layoutMode, localization: _localization, manualFiltering: manualFiltering, manualGrouping: manualGrouping, manualPagination: manualPagination, manualSorting: manualSorting, positionActionsColumn: positionActionsColumn, positionExpandColumn: positionExpandColumn, positionGlobalFilter: positionGlobalFilter, positionPagination: positionPagination, positionToolbarAlertBanner: positionToolbarAlertBanner, positionToolbarDropZone: positionToolbarDropZone, rowNumberMode: rowNumberMode, selectAllMode: selectAllMode, sortingFns: _sortingFns }, rest)));
};

export { MRT_AggregationFns, MRT_BottomToolbar, MRT_CopyButton, MRT_EditActionButtons, MRT_ExpandButton, MRT_FilterFns, MRT_FilterOptionMenu, MRT_FullScreenToggleButton, MRT_GlobalFilterTextField, MRT_GrabHandleButton, MRT_ShowHideColumnsButton, MRT_SortingFns, MRT_TableHeadCellFilterContainer, MRT_TablePagination, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleGlobalFilterButton, MRT_ToggleRowActionMenuButton, MRT_ToolbarAlertBanner, MRT_ToolbarDropZone, MRT_ToolbarInternalButtons, MRT_TopToolbar, MaterialReactTable as default };
//# sourceMappingURL=material-react-table.esm.js.map
