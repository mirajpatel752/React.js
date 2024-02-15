import React, { useCallback, useEffect, useState } from 'react'
import MaterialReactTable, { MRT_FullScreenToggleButton, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton } from 'material-react-table'
import { Filter, Trash2 } from 'react-feather'
import { Badge, Button, Col, Label, Input, Row, Spinner, Tooltip } from 'reactstrap'
import { setFullScreenView } from '../../redux/listViewSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import FilterPanel from './FilterPanel'
import EmptyList from '../EmptyList'
import { useFormik } from 'formik'
import { Box } from '@mui/material'
import FixSelect from '../search_select/FixSelect'

const ListGridTable = ({ columns, tableData, handleFilterChange, columnVisibility = {}, isFilterApply, filterPanelField, tabId, activeTabId, moduleId, statusOption, isReportFilter, isNextDataAvailable, isLoading, initialRowData, sloganHeading, sloganDetail, sloganButtonText, sloganButtonUrl, sloganLinkUrl, sloganAccessRights, toggleSidebar, initialFreezeColumn, enableGrouping = false, tabRender, extraFilterField = [], showListWithoutFilter = false, sloganOptionData, resetCurrentPage = false, setResetCurrentPage, sloganButtonUrlState, isPageReset, setIsPageReset, columnFilterHide = false, sortingHide = false, isShowActionMenu, setIsShowActionMenu, isLedgerReport = false, globalFilterHide = false, fullScreenTitleShow = true, tabShow, getCustomFilterList, enableShowGrouping = false, groupingState, handleGroupingList, includeItemCheckBox, groupingExpanded, globalFilterOrButtonHide, hideShowColumnHide = false, isGlobalSearch = false, handleSearchTerm, searchTerm, isDropdownFilter = false, selectedItem, handleSelectedItem, itemOption = [], isRowSelection = false, rowSelection, setRowSelection, dropdowmPlaceholder }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const location_state = history.location.state
    const isFullScreen = useSelector((state) => state.listViewReducer.isFullScreen)
    const isMobile = useSelector((state) => state.windowResizeReducer.isMobile)
    const [openFilterPanel, setOpenFilterPanel] = useState(false)
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const [saveLoader, setSaveLoader] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [density, setDensity] = useState('compact')
    const [colVisibility, setColVisibility] = useState(columnVisibility)
    const [columnPinning, setColumPinning] = useState({ left: [], right: [initialFreezeColumn] })
    const [isScrolling, setIsScrolling] = useState(false)
    const [isFilterChange, setIsFilterChange] = useState(false)
    const handleFocusRowColumn = (focus_id) => {
        document.getElementById(focus_id).focus()
    }

    const formik = useFormik({
        initialValues: {
            sorting: [{ id: '', desc: false }],
            columnFilters: [],
            appliedFilter: { is_filter_apply: false, filter_value: '' }
        }
    })
    const callFilterChange = () => {
        setCurrentPage(0)
        handleFilterChange({ currentPage: 0, sorting: formik.values.sorting, columnFilters: formik.values.columnFilters, ...formik.values.appliedFilter })
    }
    useEffect(() => {
        if (isFilterChange || formik.dirty) {
            if (formik.dirty && !isFilterChange) {
                setIsFilterChange(true)
            }
            callFilterChange()
        }
    }, [formik.values.sorting, formik.values.columnFilters, formik.values.appliedFilter])
    const handleKeyDown = (e, column, row) => {
        const table_ele = document.getElementById(`munim_table_container_${tabId ? `${moduleId}_${tabId}` : moduleId}`)
        const table_dimension = table_ele.getBoundingClientRect()
        e.preventDefault()
        if (e.keyCode === 40 && e.target.parentNode.nextSibling) {
            const focus_ele = document.getElementById(`${e.target.parentNode.nextSibling.id}_${column.id}`).getBoundingClientRect()
            if ((table_dimension.bottom - focus_ele.top) < focus_ele.height) {
                table_ele.scrollBy(0, table_dimension.bottom - focus_ele.top)
            }
            handleFocusRowColumn(`${e.target.parentNode.nextSibling.id}_${column.id}`, table_dimension.bottom)
        } else if (e.keyCode === 38 && e.target.parentNode.previousSibling) {
            const focus_ele_from_top = document.getElementById(`${e.target.parentNode.previousSibling.id}_${column.id}`).getBoundingClientRect().top
            const header_height = document.getElementById(`munim_table_header_${tabId ? `${moduleId}_${tabId}` : moduleId}`).offsetHeight
            if ((focus_ele_from_top - (table_dimension.top)) < header_height) {
                table_ele.scrollBy(0, focus_ele_from_top - table_dimension.top - header_height)
            }
            handleFocusRowColumn(`${e.target.parentNode.previousSibling.id}_${column.id}`, table_dimension.top)
        } else if (e.keyCode === 37 && e.target.previousSibling?.id) {
            const focus_ele = document.getElementById(e.target.previousSibling.id).getBoundingClientRect()
            let fix_ele_width = 0
            if (columnPinning.left.length) {
                columnPinning.left.map(ele => {
                    fix_ele_width += document.getElementById(`${row.id}_${ele}`).offsetWidth
                })
            }
            if (focus_ele.left - table_dimension.left - fix_ele_width < focus_ele.width) {
                table_ele.scrollBy(focus_ele.left - table_dimension.left - fix_ele_width, 0)
            }
            handleFocusRowColumn(e.target.previousSibling.id)
        } else if (e.keyCode === 39 && e.target.nextSibling?.id) {
            let fix_ele_width = 0
            if (columnPinning.right.length) {
                columnPinning.right.map(ele => {
                    fix_ele_width += document.getElementById(`${row.id}_${ele}`)?.offsetWidth
                })
            }
            const focus_ele_from_right = document.getElementById(e.target.nextSibling.id).getBoundingClientRect().right
            if (table_dimension.right - fix_ele_width - focus_ele_from_right < 0) {
                table_ele.scrollBy(focus_ele_from_right - table_dimension.right + fix_ele_width + 6, 0)
            }
            handleFocusRowColumn(e.target.nextSibling.id)
        } else if (e.keyCode === 13) {
            // Cancel the default action, if needed
            const event = new MouseEvent('dblclick', {
                view: window,
                bubbles: true,
                cancelable: true
            })
            // Trigger the element with a click
            document.getElementById(`${row.id}_${column.id}`).dispatchEvent(event)
        } else if ((e.ctrlKey && e.shiftKey && e.keyCode === 82) || (e.ctrlKey && e.keyCode === 82) || (e.keyCode === 116)) {
            window.location.reload()
        }
    }
    useEffect(() => {
        if (location_state?.customFilterDetail && (!location_state?.customFilterDetail.tab_id || location_state?.customFilterDetail.tab_id === Number(tabId))) {
            setOpenFilterPanel(location_state?.customFilterDetail.editMode)
        }
    }, [location_state])
    const handleScrolling = (e) => {
        if ((e.scrollHeight - e.scrollTop - e.clientHeight < 5) && isNextDataAvailable && !isLoading) {
            setIsScrolling(true)
        } else {
            setIsScrolling(false)
        }
    }
    useEffect(() => {
        const table_footer = document.getElementById(`munim_table_footer_${tabId ? `${moduleId}_${tabId}` : moduleId}`)
        if (isLoading && currentPage) {
            table_footer.innerHTML = `<div class='m-auto d-flex justify-content-center align-items-end munim-data-table-loader ${isFullScreen ? 'munim-data-table-full-screen-loader' : 'munim-data-table-next-loader'}'}><div role='status' class='spinner-border-sm spinner-border'></div></div>`
        } else {
            table_footer.innerHTML = ""
        }
    }, [isLoading, currentPage])

    useEffect(() => {
        if (isScrolling) {
            handleFilterChange({ currentPage: currentPage + 1, sorting: formik.values.sorting, columnFilters: formik.values.columnFilters, ...formik.values.appliedFilter })
            setCurrentPage(currentPage + 1)
        }
    }, [isScrolling])
    useEffect(() => {
        if (isPageReset) {
            handleFilterChange({ currentPage: 0, sorting: formik.values.sorting, columnFilters: formik.values.columnFilters, ...formik.values.appliedFilter })
            setCurrentPage(0)
            setIsPageReset(false)
        }
    }, [isPageReset])

    /**
     * IW0079
     * This effect call when component unmount
     */
    useEffect(() => {
        return () => {
            dispatch(setFullScreenView(false))
        }
    }, [])
    /**
     * IW0079
     * This effect call when table is without top toolbar
     * and global search is available outside of the table
     * When user search any data from there just change the current page for laze loading
     */
    useEffect(() => {
        if (resetCurrentPage) {
            callFilterChange()
            setResetCurrentPage(false)
        }
    }, [resetCurrentPage])
    useEffect(() => {
        if (location_state?.customFilterDetail?.filter_name && formik.dirty) {
            setIsFilterChange(true)
            formik.handleReset()
        } else {
            setCurrentPage(0)
        }
    }, [location_state?.customFilterDetail?.filter_name])
    const customFilterPanel = () => {
        const filter_count = formik.values.appliedFilter?.filter_count ? formik.values.appliedFilter.filter_count : location_state?.customFilterDetail?.filter_count ? location_state.customFilterDetail.filter_count : 0
        return (
            <Label for='custom-tooltip-filter' id='custom-tooltip-filter' className='m-0'>
                <Tooltip
                    placement='bottom'
                    isOpen={tooltipOpen}
                    target='custom-tooltip-filter'
                    toggle={() => setTooltipOpen(!tooltipOpen)}
                >
                    Filter
                </Tooltip>
                <Button size="sm" outline onClick={!isLoading && !openFilterPanel ? () => setOpenFilterPanel(true) : () => { }} className='position-relative munim-small-badge-btn p-0 border-0'>
                    <Filter size={14} color='#1773EA' width={'17px'} height={'auto'} stroke='#0000008a' />
                    {filter_count ? <Badge color="danger" className='position-absolute translate-middle munim-filter-badge'>
                        {filter_count}
                    </Badge> : ''}
                </Button>
            </Label >
        )
    }
    /**
     * This useEffect is use to close filter tooltip
     */
    useEffect(() => {
        if (!openFilterPanel) {
            setTooltipOpen(false)
        }
    }, [openFilterPanel])
    /**
     * IW0079
     * Call on change of full screen view
     */
    const handleFullScreenChange = (e) => {
        setTooltipOpen(false)
        dispatch(setFullScreenView(e))
    }
    /**
     * IW0079
     * here comes when user close filter panel
     * flag is true means call api and fetch data according new filter else just close the panel
     */
    const handleFilterPanel = (flag, data, isSetData = true) => {
        if (flag) {
            if (isSetData) {
                formik.setFieldValue('appliedFilter', { ...data })
            } else {
                formik.setFieldValue('appliedFilter', {})
            }
            setSaveLoader(false)
            setOpenFilterPanel(false)
        } else {
            setSaveLoader(false)
            setOpenFilterPanel(false)
        }
    }
    /**
     * IW0077
     * column filter in add data type.
     */
    const handleFilterColumn = (name) => {
        const filter_value = name(formik.values.columnFilters)
        if (filter_value?.length) {
            const final_filter_value = []
            filter_value.map((item) => {
                [...filterPanelField, ...extraFilterField].find(ele => {
                    if (item.id === ele.name) {
                        final_filter_value.push({ ...item, data_type: ele.type })
                        return true
                    }
                })

            })
            formik.setFieldValue('columnFilters', [...final_filter_value])
        } else {
            formik.setFieldValue('columnFilters', [])
        }
    }
    /**
     * IW0079
     * this effect is called to update visibility and  pinned state according local storage
     */
    useEffect(() => {
        const hide_show_data = localStorage.getItem(tabId ? `${moduleId}_${tabId}` : moduleId)
        if (hide_show_data) {
            setColVisibility({ ...JSON.parse(hide_show_data).visibility })
            setColumPinning({ ...JSON.parse(hide_show_data).pin })
        }
    }, [tabId])
    /**
     * IW0079
     * This function is for column visibility changes
     */
    const handleColumnVisibilityChange = (value) => {
        const visible_column = typeof value === 'object' ? value : value()
        setColVisibility(previousState => { return { ...previousState, ...visible_column } })
    }
    /**
     * IW0079
     * this effect is called to update local storage data for column visibility and pinned
     */
    useEffect(() => {
        localStorage.setItem(tabId ? `${moduleId}_${tabId}` : moduleId, JSON.stringify({ visibility: colVisibility, pin: columnPinning }))
    }, [colVisibility, columnPinning])
    /**
     * IW0079
     * This function is for column freezing
     */
    const handleColumnPinningChange = useCallback((updatedPinnedColumns) => {
        setColumPinning(updatedPinnedColumns)
    }, [])

    /**
     * IW0111
     * This function reset infinite scrolling page to 0 when change tab
     */
    useEffect(() => {
        if (activeTabId) {
            setCurrentPage(0)
            formik.handleReset()
        }
    }, [activeTabId])
    const handleGroupingChange = (updatedGroup) => {
        handleGroupingList(updatedGroup)
        callFilterChange()
    }

    const handleGroupChipColor = ['text-green', 'text-teal', 'text-slateblue', 'text-royalblue', 'text-orchid', 'text-purple', 'text-darkslategray', 'text-peru', 'text-darkkhaki']

    const applyTagStyle = () => {
        if (groupingState?.length) {
            setTimeout(() => {
                const all_tag_ele = [...document.querySelectorAll('.MuiChip-filled')]
                all_tag_ele.map((ele, index) => {
                    ele.classList.add(handleGroupChipColor[index])
                })
            }, 100)
        }
        return ''
    }
    return (
        <>
            <MaterialReactTable
                columns={!isReportFilter && !isFilterApply && !location_state?.customFilterDetail?.id && !tableData.length && !isLoading ? [] : columns}
                data={isLoading && !currentPage ? [] : tableData}
                enablePagination={false}
                manualFiltering
                muiToolbarAlertBannerChipProps={{
                    className: applyTagStyle(),
                    size: 'small'
                }}
                manualSorting
                enableExpanding={enableGrouping}
                enableGrouping={enableShowGrouping}
                enableColumnOrdering={!isMobile}
                enablePinning
                enableExpandAll
                columnResizeMode="onChange"
                enableGlobalFilter={false}
                enableTableHead
                enableColumnResizing
                enableStickyHeader
                enableStickyFooter
                enableBottomToolbar={false}
                enableColumnFilters={!columnFilterHide}
                enableSorting={!sortingHide}
                enableTopToolbar={!showListWithoutFilter}
                enableHiding={!hideShowColumnHide}
                getRowId={(row) => row.id}
                enableRowSelection={isRowSelection ? (row) => row.id : ''}
                onRowSelectionChange={setRowSelection}
                rowCount={isNextDataAvailable ? tableData.length - 1 : tableData.length}
                renderTopToolbarCustomActions={() => (
                    <>
                        {!location_state?.customFilterDetail?.id && tabRender && (!isFullScreen || moduleId === '6_2_3') ? <>{tabRender()}</> : tabShow && (isFullScreen || moduleId) && (isFullScreen && fullScreenTitleShow) ? <>{tabShow()}</> : <Box></Box>}
                    </>
                )}
                renderToolbarInternalActions={({ table }) => (
                    (<>{tableData.length || isFilterApply ? <Box>
                        <div className='d-flex align-items-center munim-margin-bottom-4'>
                            {/* along-side built-in buttons in whatever order you want them */}
                            {isDropdownFilter ? <div className='munim-dropdown-btn'>
                                <FixSelect
                                    id='global_select'
                                    value={selectedItem}
                                    options={itemOption}
                                    handleChange={handleSelectedItem}
                                    placeholder={dropdowmPlaceholder}
                                />
                            </div> : null}
                            {isGlobalSearch ? <Input
                                placeholder='Search'
                                id='global-search'
                                autoComplete="off"
                                className='munim-inv-list-search w-100'
                                type="search"
                                value={searchTerm}
                                onChange={e => handleSearchTerm(e.target.value)}
                            /> : ''}
                            {!globalFilterHide && customFilterPanel()}
                            {!columnFilterHide ? <MRT_ToggleFiltersButton table={{ ...table }} /> : ''}
                            {!hideShowColumnHide ? <MRT_ShowHideColumnsButton table={{ ...table }} /> : ''}
                            <MRT_ToggleDensePaddingButton table={{ ...table }} />
                            {!isMobile ? <MRT_FullScreenToggleButton table={{ ...table }} /> : ''}
                        </div>
                    </Box> : <Box>
                        {isDropdownFilter ? <div className='d-flex align-items-center munim-margin-bottom-4'>
                            <div className='munim-dropdown-btn'>
                                <FixSelect
                                    id='global_select'
                                    value={selectedItem}
                                    options={itemOption}
                                    handleChange={handleSelectedItem}
                                />
                            </div>
                        </div> : null}
                    </Box>}</>)
                )}
                icons={{
                    MoreVertIcon: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="black" />
                    </svg>
                    ),
                    DragHandleIcon: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 9H4V11H20V9ZM4 15H20V13H4V15Z" fill="black" />
                    </svg>
                    )
                }}
                onGroupingChange={handleGroupingChange}
                onColumnFiltersChange={handleFilterColumn}
                onIsFullScreenChange={handleFullScreenChange}
                onColumnVisibilityChange={handleColumnVisibilityChange}
                onColumnPinningChange={handleColumnPinningChange}
                onSortingChange={(value) => formik.setFieldValue('sorting', value())}
                onDensityChange={setDensity}
                initialState={{ density: 'compact', expanded: groupingExpanded ? groupingExpanded : false, columnVisibility: colVisibility, columnPinning: { left: [], right: [initialFreezeColumn] } }}
                state={{
                    currentPage,
                    sorting: formik.values.sorting,
                    columnFilters: formik.values.columnFilters,
                    isFullScreen,
                    density,
                    columnPinning,
                    grouping: groupingState ? groupingState : [],
                    columnVisibility: colVisibility,
                    rowSelection: rowSelection ? rowSelection : []
                    // isLoading
                }}
                renderEmptyRowsFallback={() => (
                    <>
                        {isLoading && !currentPage ? <div className={`m-auto p-1 d-flex justify-content-center align-items-center ${isLoading && !currentPage ? 'munim-data-table-loader' : 'munim-data-table-next-loader'}`}>
                            <Spinner size='lg' />
                        </div> : !isReportFilter && !isFilterApply && !location_state?.customFilterDetail?.id && !tableData.length && !isLoading && sloganDetail ? <div className='munim-slogan munim-datagrid-empty-list'>
                            <EmptyList
                                heading={sloganHeading}
                                detail={sloganDetail}
                                button_text={sloganButtonText}
                                button_url={sloganButtonUrl}
                                button_url_state={sloganButtonUrlState}
                                link_url={sloganLinkUrl}
                                access_rights={sloganAccessRights}
                                toggleSidebar={toggleSidebar}
                                optionData={sloganOptionData} />
                        </div> : <>
                            {!isLoading && !tableData.length && (isFilterApply || location_state?.customFilterDetail?.id || !sloganDetail) ? <div className='munim-under-no-data'>
                                <p>
                                    There are no records to display
                                </p>
                            </div> : ''}
                        </>}
                    </>
                )}
                muiTableProps={{
                    className: 'munim-custom-table'
                }}
                muiTableHeadProps={{
                    id: `munim_table_header_${tabId ? `${moduleId}_${tabId}` : moduleId}`,
                    className: !isReportFilter && !isFilterApply && !location_state?.customFilterDetail?.id && !tableData.length ? 'd-none' : ''
                }}
                muiTableHeadCellProps={{
                    className: 'munim-custom-table-head'
                }}
                muiTableBodyCellProps={({ cell, column, row }) => ({
                    className: density === 'compact' ? 'munim-compact-table-cell' : density === 'comfortable' ? 'munim-comfortable-table-cell' : density === 'spacious' ? 'munim-spacious-table-cell' : '',
                    tabIndex: "1",
                    id: cell.id,
                    onKeyDown: (e) => handleKeyDown(e, column, row, tableData.length)
                })}
                muiTableBodyRowProps={({ row }) => ({
                    className: row.id % (isLedgerReport ? 52 : 50) === 0 && isLoading ? 'munim-tble-loader-remove' : '',
                    id: row.id
                })}
                muiTableFooterProps={() => ({
                    id: `munim_table_footer_${tabId ? `${moduleId}_${tabId}` : moduleId}`
                })}
                muiTableContainerProps={{
                    sx: { maxHeight: '600px' },
                    id: `munim_table_container_${tabId ? `${moduleId}_${tabId}` : moduleId}`,
                    onScroll: (event) => {
                        // eslint-disable-next-line no-unused-expressions
                        if (isShowActionMenu) setIsShowActionMenu(false)
                        if (event.target.scrollTop) {
                            handleScrolling(event.target)
                        }
                    }
                }}
            />
            {
                openFilterPanel && !globalFilterHide ? <FilterPanel
                    panelOpen={openFilterPanel}
                    moduleId={moduleId}
                    fieldOption={filterPanelField}
                    handleFilterPanel={handleFilterPanel}
                    setCurrentPage={setCurrentPage}
                    appliedFilter={formik.values.appliedFilter}
                    statusOption={statusOption}
                    isReportFilter={isReportFilter}
                    tabId={tabId}
                    initialRowData={initialRowData}
                    saveLoader={saveLoader}
                    setSaveLoader={setSaveLoader}
                    globalFilterOrButtonHide={globalFilterOrButtonHide}
                    includeItemCheckBox={includeItemCheckBox}
                    getCustomFilterList={getCustomFilterList}
                /> : null
            }
        </>
    )
}

export default ListGridTable
