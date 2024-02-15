import React, { Fragment, useEffect, useState } from 'react'
import { Card } from 'reactstrap'
import { useSelector } from 'react-redux'
import Header from '../../../common_components/HeaderTitle'
import ListGridTable from '../../../common_components/grid_table/ListGridTable'
import { GetApiCall } from '../../../helper/axios'
import CommonApiEndPoint from '../../../helper/commonApiEndPoint'
import { debounce, getIcon, handlePageRefresh } from '../../../helper/commonFunction'
import { useHistory } from 'react-router-dom'
import VariantSelect from '../../../common_components/search_select/VariantSelect'
import SearchItemSidebar from '../../../common_components/SearchItemSidebar'

const ChannelProductList = ({ tabRender, setResetModuleData, resetModuleData, activeTabId, tabId, fullScreenTitleShow, tabShow, itemOption, selectedMasterItemData, setSelectedMasterItemData }) => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const history = useHistory()
    const location_state = history.location.state
    const [isFilterApply, setIsFilterApply] = useState(false)
    const [dataList, setDataList] = useState([])
    const [loading, setLoading] = useState(true)
    const [isPageReset, setIsPageReset] = useState(false)
    const [isNextDataAvailable, setIsNextDataAvailable] = useState()
    const [columnWiseFilter, setColumnWiseFilter] = useState({})
    const [isShowActionMenu, setIsShowActionMenu] = useState(true)
    const [selectedChannelType, setSelectedChannelType] = useState(location_state.channelData)
    const [isNextData, setIsNextData] = useState('1')
    const [masterItemList, setMasterItemList] = useState([])
    const [searchVariantSidebarOpen, setSearchVariantSidebarOpen] = useState(false)
    const [selectedVariantValue, setSelectedVariantValue] = useState('')
    const [selectedVariantId, setSelectedVariantId] = useState('')
    const [newOptionPageLimit, setNewOptionPageLimit] = useState(0)
    const [newOptionData, setNewOptionData] = useState([])
    /**
     * IW0110
     * This function is call on get channel item list
     */
    const fetchData = async (otherFilter, availableData, channel_type = '0') => {
        setLoading(true)
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_channel_item_list}?id=${selected_company_object.id}&limit=${otherFilter.currentPage}&col_filter=${otherFilter.columnFilters.length ? encodeURIComponent(JSON.stringify(otherFilter.columnFilters)) : ''}&per_page=50&order_field=${otherFilter.sorting[0]?.id}&order_by=${otherFilter.sorting[0]?.id ? otherFilter.sorting[0]?.desc ? 'desc' : 'asc' : ''}&filter_data=${otherFilter.is_filter_apply ? encodeURIComponent(JSON.stringify(otherFilter.filter_value)) : ''}&channel_type=${channel_type}&is_action=3`, header)
        if (res.data.status === 'success') {
            let final_data = []
            if (otherFilter.currentPage) {
                availableData.pop()
                final_data = [...availableData, ...res.data.data.row_data]
            } else {
                final_data = [...res.data.data.row_data]
            }
            if (Number(res.data.data.is_next)) {
                final_data.push({
                    show_loader: true,
                    product_name: '',
                    sku: '',
                    mrp: '',
                    inventory: '',
                    sales_price: ''
                })
            }
            setDataList(final_data)
            setIsNextDataAvailable(Number(res.data.data.is_next))
            setLoading(false)
            setIsFilterApply(false)
        } else {
            if (availableData.length && !otherFilter.currentPage) {
                setIsFilterApply(true)
            }
            setIsNextDataAvailable(false)
            setDataList([])
            setLoading(false)
        }
    }
    const handleSearch = (columnWiseFilter, availableData, selectedChannelType) => {
        fetchData(columnWiseFilter, availableData, selectedChannelType)
    }
    const [searchState] = useState({ fn: debounce(handleSearch, 500) })
    const handleFilter = (columnWiseFilter, availableData, selectedChannelType) => {
        searchState.fn(columnWiseFilter, availableData, selectedChannelType)
    }
    useEffect(() => {
        if (((isFilterApply || dataList.length)) || (!dataList.length)) {
            setLoading(true)
            const final_column_filter = Object.keys(columnWiseFilter).length ? columnWiseFilter : { currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }
            handleFilter(final_column_filter, dataList, selectedChannelType)
        }
    }, [columnWiseFilter, selectedChannelType])

    useEffect(() => {
        if (activeTabId === resetModuleData) {
            setLoading(true)
            setResetModuleData('')
            handleFilter({ currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }, [], selectedChannelType)
        }
    }, [resetModuleData])
    /**
    * IW0110
    * This function is get master item data list
    */
    const getMasterItemData = async () => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_master_item_data_list}?filter=&per_page=25&limit=0`, header)
        if (res.data.status === 'success') {
            const item_data = [{ value: '0', label: 'Search more product', type: 'button' }]
            res.data.data.row_data.map(item => {
                item_data.push({ value: item.sku, label: item.title, customAbbreviation: { label: item.title }, image: item.image })
            })
            setMasterItemList(item_data)
        } else {
            setMasterItemList([])
        }
    }
    useEffect(() => {
        if (selected_company_object.id) {
            getMasterItemData()
        }
    }, [selected_company_object.id])
    /**
    * IW0110
    * This function is update selected master item data and table data list
    */
    const updateDataList = (item_id, value) => {
        let item_data = [...selectedMasterItemData]
        const is_available_data = item_data.find(ele => ele.item_id === item_id)
        if (is_available_data?.item_id) {
            item_data = item_data.map(ele => (ele.item_id === is_available_data.item_id ? { item_id, variant_sku: value } : ele))
        } else {
            item_data.push({ item_id, variant_sku: value })
        }
        setSelectedMasterItemData(item_data)
        const channel_data = dataList.map(ele => (ele.id === item_id ? { ...ele, variant: value } : ele))
        setDataList(channel_data)
    }
    /**
    * IW0110
    * This function is handle change variant
    */
    const handleChangeVariant = (value, item_id, item_value = '') => {
        if (value === '0') {
            document.activeElement.blur()
            setSelectedVariantValue(item_value)
            setSelectedVariantId(item_id)
            setSearchVariantSidebarOpen(!searchVariantSidebarOpen)
        } else {
            updateDataList(item_id, value)
        }
    }
    /**
    * IW0110
    * This function is handle search variant sidebar
    */
    const toggleSidebar = (flag, id, option, is_new_item = false) => {
        if (flag) {
            updateDataList(id, option?.value)
            if (option?.value && is_new_item) {
                const item_data = [...masterItemList]
                item_data.push({ value: option.value, label: option.label, customAbbreviation: { label: option.label }, image: option.image })
                setMasterItemList(item_data)
            }
            setSearchVariantSidebarOpen(!searchVariantSidebarOpen)
        } else {
            setSearchVariantSidebarOpen(!searchVariantSidebarOpen)
        }
    }
    /**
    * IW0110
    * This effect is called when user fetch new data then update master item option list
    */
    useEffect(() => {
        if (newOptionData.length) {
            setMasterItemList([...masterItemList, ...newOptionData])
        }
    }, [newOptionData])
    /**
     * IW0110
     * This function is call on reload on data to open pop-up
     */
    useEffect(() => {
        if (selectedMasterItemData?.length) {
            window.addEventListener("beforeunload", handlePageRefresh)
        } else {
            window.removeEventListener("beforeunload", handlePageRefresh)
        }
    }, [selectedMasterItemData])
    const columns = [
        {
            header: Header.product_title,
            accessorKey: 'product_name',
            Cell: ({ row }) => <span>{!row.original.show_loader ? row.original.image ? <img className="channel-table-img" src={row.original.image} /> : getIcon('EmptyImage') : ''} {row.original.product_name}</span>
        },
        {
            header: Header.sku,
            accessorKey: 'sku',
            Cell: ({ row }) => <span>{row.original.sku}</span>
        },
        {
            header: Header.mrp,
            accessorKey: 'mrp',
            muiTableBodyCellProps: { align: 'right' },
            Cell: ({ row }) => <span>{row.original.mrp}</span>
        },
        {
            header: Header.sales_price,
            accessorKey: 'sales_price',
            muiTableBodyCellProps: { align: 'right' },
            Cell: ({ row }) => <span>{row.original.sales_price}</span>
        },
        {
            header: Header.stock,
            accessorKey: 'inventory',
            muiTableBodyCellProps: { align: 'right' },
            Cell: ({ row }) => <span>{row.original.inventory}</span>
        },
        {
            header: Header.master_product_name_variant,
            accessorKey: 'variant',
            size: 260,
            enableHiding: false,
            enableColumnFilter: false,
            enableColumnActions: false,
            enableResizing: false,
            enablePinning: false,
            enableColumnOrdering: false,
            enableSorting: false,
            Cell: ({ row }) => {
                if (!row.original.show_loader) {
                    return (
                        <VariantSelect
                            name={`variant_${row.original.id}`}
                            placeholder='Please select product'
                            dropdownValue={row.original.variant}
                            dropdownList={masterItemList}
                            handleChangeValue={(value) => handleChangeVariant(value, row.original.id, row.original.product_name)}
                            isNextData={isNextData}
                            setIsNextData={setIsNextData}
                            createNewElement='Search more product'
                            setNewOptionPageLimit={setNewOptionPageLimit}
                            newOptionPageLimit={newOptionPageLimit}
                            setNewOptionData={setNewOptionData}
                            isShowOptionMenu={isShowActionMenu}
                            setIsShowOptionMenu={setIsShowActionMenu}
                        />
                    )
                }
            }
        }
    ]
    const filter_panel_field = [
        { title: Header.product_name, name: 'product_name', type: 'text' },
        { title: Header.sku, name: 'sku', type: 'text' },
        { title: Header.mrp, name: 'mrp', type: 'amount' },
        { title: Header.sales_price, name: 'sales_price', type: 'amount' },
        { title: Header.stock, name: 'inventory', type: 'amount' }
    ]

    return (
        <Fragment>
            <Card className='mb-0 munim-loader-add'>
                <div className={`react-dataTable munim-sales-inv-list munim-react-list-tble munim-last-table munim-quo-filed-left ${loading ? `munim-gridview-overflow` : ''} ${dataList.length ? '' : 'munim-no-data-found-tble'}`}>
                    <ListGridTable
                        filterPanelField={filter_panel_field}
                        columns={columns}
                        tableData={dataList}
                        handleFilterChange={setColumnWiseFilter}
                        isFilterApply={isFilterApply}
                        tabId={tabId}
                        activeTabId={activeTabId}
                        moduleId='7_1'
                        tabRender={tabRender}
                        isPageReset={isPageReset}
                        isNextDataAvailable={isNextDataAvailable}
                        setIsPageReset={setIsPageReset}
                        isLoading={loading}
                        initialRowData={{ field: 'product_name', condition: '1', from_value: '', value: '', to_value: '', type: 'text' }}
                        initialFreezeColumn='action'
                        isShowActionMenu={isShowActionMenu}
                        setIsShowActionMenu={setIsShowActionMenu}
                        fullScreenTitleShow={fullScreenTitleShow}
                        tabShow={tabShow}
                        isReportFilter={true}
                        isDropdownFilter={true}
                        itemOption={itemOption}
                        selectedItem={selectedChannelType}
                        handleSelectedItem={(_, value) => setSelectedChannelType(value)}
                    />
                </div >
            </Card >
            {searchVariantSidebarOpen ? <SearchItemSidebar
                open={searchVariantSidebarOpen}
                toggleSidebar={toggleSidebar}
                selectedItemValue={selectedVariantValue}
                selectedItemtId={selectedVariantId}
                itemList={masterItemList.slice(1, masterItemList.length)}
                isNextData={isNextData}
                apiPath={CommonApiEndPoint.get_master_item_data_list}
                name='channel_product_item'
                sidebarPageLimit={newOptionPageLimit}
            /> : ''}
        </Fragment >
    )
}

export default ChannelProductList
