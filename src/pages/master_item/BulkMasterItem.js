import React, { Fragment, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ApiCall, GetApiCall } from '../../helper/axios'
import { debounce, handlePageRefresh } from '../../helper/commonFunction'
import { Card, CardTitle } from 'reactstrap'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import ModuleTitle from '../../common_components/ModuleTitle'
import Header from '../../common_components/HeaderTitle'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import ListGridTable from '../../common_components/grid_table/ListGridTable'
import CustomButton from '../../common_components/custom_field/CustomButton'
import MultiSelectWithSearch from '../../common_components/custom_field/MultiSelectWithSearch'
import SearchItemSidebar from '../../common_components/SearchItemSidebar'
import useNotify from '../../custom_hooks/useNotify'

let isLoading = false
const BulkMasterItem = () => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const notify = useNotify()
    const [dataList, setDataList] = useState([])
    const [loading, setLoading] = useState(true)
    const [isNextDataAvailable, setIsNextDataAvailable] = useState()
    const [columnWiseFilter, setColumnWiseFilter] = useState({})
    const [isShowActionMenu, setIsShowActionMenu] = useState(true)
    const [resetModuleData, setResetModuleData] = useState('')
    const [isPageReset, setIsPageReset] = useState(false)
    const [isFilterApply, setIsFilterApply] = useState(false)
    const [selectedMapProduct, setSelectedMapProduct] = useState([])
    const [pageLimit, setPageLimit] = useState(0)
    const [channelProductList, setChannelProductList] = useState([])
    const [isNextProductData, setIsNextProductData] = useState('1')
    const [searchProductSidebarOpen, setSearchProductSidebarOpen] = useState(false)
    const [selectedProductId, setSelectedProductId] = useState('')
    const [selectedProductValue, setSelectedProductValue] = useState('')
    /**
     * IW0110
     * This function is call on get master mapped item list
     */
    const fetchData = async (otherFilter, availableData) => {
        setLoading(true)
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_master_item_data_list}?limit=${otherFilter.currentPage}&col_filter=${otherFilter.columnFilters.length ? encodeURIComponent(JSON.stringify(otherFilter.columnFilters)) : ''}&per_page=50&order_field=${otherFilter.sorting[0]?.id}&order_by=${otherFilter.sorting[0]?.id ? otherFilter.sorting[0]?.desc ? 'desc' : 'asc' : ''}&filter_data=${otherFilter.is_filter_apply ? encodeURIComponent(JSON.stringify(otherFilter.filter_value)) : ''}&is_action=1`, header)
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
                    title: ''
                })
            }
            setDataList(final_data)
            setIsNextDataAvailable(Number(res.data.data.is_next))
            setIsFilterApply(false)
        } else if (res.data.statusCode === 404) {
            if (!otherFilter.currentPage) {
                setIsFilterApply(true)
            }
            setDataList([])
            setLoading(false)
            setIsNextDataAvailable(false)
        }
        setLoading(false)
    }
    /**
     * IW0110
     * This function is called when user search to get any product data
     */
    const handleSearch = (columnWiseFilter, availableData) => {
        fetchData(columnWiseFilter, availableData)
    }
    const [searchState] = useState({ fn: debounce(handleSearch, 500) })
    const handleFilter = (columnWiseFilter, availableData) => {
        searchState.fn(columnWiseFilter, availableData)
    }
    useEffect(() => {
        if ((dataList.length || isFilterApply) || (selected_company_object.id && !dataList.length)) {
            setLoading(true)
            const final_column_filter = Object.keys(columnWiseFilter).length ? columnWiseFilter : { currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }
            handleFilter(final_column_filter, dataList)
        }
    }, [selected_company_object.id, columnWiseFilter])

    useEffect(() => {
        if (resetModuleData) {
            setLoading(true)
            setResetModuleData('')
            handleFilter({ currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }, [])
        }
    }, [resetModuleData])
    /**
    * IW0110
    * This function is call on get master channel list
    */
    const getMasterChannelItem = async (limit = 0) => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_master_channel_item}?per_page=25&limit=${limit}&filter=`, header)
        if (res.data.status === 'success') {
            setIsNextProductData(res.data.data.is_next)
            const item_data = []
            if (limit === 0) {
                item_data.push({ value: '0', label: 'Search more product', type: 'button' })
                res.data.data.row_data.map((item) => {
                    item_data.push({ value: item.id, label: item.product_name, image: item.image })
                })
                setChannelProductList(item_data)
            } else {
                const merge_data = [...channelProductList, ...res.data.data.row_data]
                merge_data.map(item => {
                    item_data.push({ value: item.id ? item.id : item.value, label: item.product_name ? item.product_name : item.label, image: item.image })
                })
                item_data.map(ele => {
                    if (ele.value === '0') ele.type = 'button'
                    return ele
                })
                setChannelProductList(item_data)
            }
        } else {
            setChannelProductList([])
        }
        isLoading = false
    }
    useEffect(() => {
        if (selected_company_object.id) {
            getMasterChannelItem(0)
        }
    }, [selected_company_object.id])
    /**
     * IW0110
     * Here comes when get channel product data using lazy loading
     */
    const handleApiPageLimit = (name, value) => {
        setPageLimit(value)
        if (value && isNextProductData === '1') {
            if (isLoading) {
                return
            }
            isLoading = true
            setTimeout(() => {
                getMasterChannelItem(value)
            }, 300)
        }
    }
    /**
    * IW0110
    * This function is update selected master item data and table data list
    */
    const updateDataList = (item_id, option) => {
        let item_data = [...selectedMapProduct]
        const is_available_data = item_data.find(ele => ele.variant_sku === item_id)
        if (is_available_data?.variant_sku) {
            item_data = item_data.map(ele => (ele.item_id === is_available_data.item_id ? { variant_sku: item_id, item_id: option?.map(ele => ele.value) } : ele))
        } else {
            item_data.push({ variant_sku: item_id, item_id: option?.map(ele => ele.value) })
        }
        // Here, remove item when selected item option data not available
        const remove_ids = []
        item_data.forEach((ele, index) => {
            if (!ele.item_id?.length) remove_ids.push(index)
        })
        if (remove_ids.length) {
            remove_ids.forEach(ele => {
                item_data.splice(ele, 1)
            })
        }
        setSelectedMapProduct(item_data)
        const product_data = dataList.map(ele => (ele.sku === item_id ? { ...ele, map_product: option } : ele))
        setDataList(product_data)
    }
    /**
     * IW0110
     * This function is handle product change value
     */
    const handleChangeMapProduct = (value, item_id, item_value) => {
        if (value === '0') {
            setSelectedProductId(item_id)
            setSelectedProductValue(item_value)
            setSearchProductSidebarOpen(!searchProductSidebarOpen)
        } else {
            updateDataList(item_id, value)
        }
    }
    const handleBlurMapProduct = () => {
        document.activeElement.blur()
    }
    /**
    * IW0110
    * This function is handle search product sidebar
    */
    const toggleSidebar = (flag, id, option, is_new_item = false, new_data = []) => {
        if (flag) {
            updateDataList(id, option)
            if (new_data.length && is_new_item) {
                const item_data = [...channelProductList]
                new_data.forEach(ele => {
                    item_data.push(ele)
                })
                setChannelProductList(item_data)
            }
            setSearchProductSidebarOpen(!searchProductSidebarOpen)
        } else {
            setSearchProductSidebarOpen(!searchProductSidebarOpen)
        }
    }
    /**
    * IW0110
    * This function is handle mapped channel items
    */
    const handleBulkItem = async (map_items) => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const data = {
            map_items,
            is_action: 1
        }
        const res = await ApiCall('POST', CommonApiEndPoint.map_channel_items, data, header)
        if (res.data.status === 'success') {
            notify(res.data.message, 'success')
            setLoading(true)
            handleFilter({ currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }, [])
            getMasterChannelItem(0)
        } else {
            notify(res.data.message, 'error')
        }
    }
    /**
    * IW0110
    * This function is cancel bulk items data
    */
    const handleCancelBulkItem = () => {
        setSelectedMapProduct([])
        const product_data = dataList.map(ele => { return { ...ele, map_product: [] } })
        setDataList(product_data)
    }
    /**
     * IW0110
     * This function is call on reload on data to open pop-up
     */
    useEffect(() => {
        if (selectedMapProduct.length) {
            window.addEventListener("beforeunload", handlePageRefresh)
        } else {
            window.removeEventListener("beforeunload", handlePageRefresh)
        }
    }, [selectedMapProduct])
    const columns = [
        {
            header: Header.product,
            accessorKey: 'title',
            Cell: ({ row }) => <span>{row.original.title}</span>
        },
        {
            header: Header.map_product,
            accessorKey: 'map_product',
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
                        <MultiSelectWithSearch
                            name={`product_${row.original.title}`}
                            value={row.original.map_product}
                            option={channelProductList}
                            handleChange={(_, value) => handleChangeMapProduct(value, row.original.sku, row.original.title)}
                            handleBlur={handleBlurMapProduct}
                            multipleSelect={true}
                            pageLimit={pageLimit}
                            setPageLimit={handleApiPageLimit}
                            placeholder='Please select product'
                            isShowOptionMenu={isShowActionMenu}
                            setIsShowOptionMenu={setIsShowActionMenu}
                        />
                    )
                }
            }
        }
    ]
    const filter_panel_field = [{ title: Header.product, name: 'title', type: 'text' }]

    const bulkItemNameSet = () => {
        return (
            <CardTitle tag='h4' className='mt-1'>
                {'Bulk Master Item Mapping'}
            </CardTitle>
        )
    }

    return (
        <>
            <div className='d-flex justify-content-between align-items-center munim-list-company'>
                <ModuleTitle
                    breadCrumbTitle='Bulk Master Item Mapping'
                />
            </div>
            <Fragment>
                <Card className='mt-1 mb-0 munim-card-border munim-loader-add'>
                    <div className={`react-dataTable munim-sales-inv-list munim-bulk-master-table munim-fixed-action munim-react-list-tble munim-last-table munim-quo-filed-left ${dataList.length < 9 ? 'munim-overflow-hidden' : 'overflow-hidden'} ${dataList.length ? '' : 'munim-no-data-found-tble'}`}>
                        <ListGridTable
                            columns={columns}
                            tableData={dataList}
                            handleFilterChange={setColumnWiseFilter}
                            isFilterApply={isFilterApply}
                            moduleId='2_2_6'
                            isNextDataAvailable={isNextDataAvailable}
                            filterPanelField={filter_panel_field}
                            isLoading={loading}
                            setIsPageReset={setIsPageReset}
                            isPageReset={isPageReset}
                            initialRowData={{ field: 'title', condition: '1', from_value: '', value: '', to_value: '', type: 'text' }}
                            initialFreezeColumn='action'
                            fullScreenTitleShow={true}
                            tabShow={bulkItemNameSet}
                            isReportFilter={true}
                            isShowActionMenu={isShowActionMenu}
                            setIsShowActionMenu={setIsShowActionMenu}
                        />
                    </div>
                </Card>
                <div className='d-flex justify-content-between mt-1 munim-bb-btn-group munim-save'>
                    <CustomButton
                        className='me-1'
                        outline
                        color='secondary'
                        type='button'
                        label='Cancel'
                        tabIndex="-1"
                        disabled={!selectedMapProduct.length}
                        handleClick={handleCancelBulkItem}
                    />
                    <CustomButton
                        className='me-1'
                        color='primary'
                        type='button'
                        label='Save'
                        disabled={!selectedMapProduct.length}
                        handleClick={() => handleBulkItem(selectedMapProduct)}
                    />
                </div>
            </Fragment>
            {searchProductSidebarOpen ? <SearchItemSidebar
                open={searchProductSidebarOpen}
                toggleSidebar={toggleSidebar}
                selectedItemtId={selectedProductId}
                selectedItemValue={selectedProductValue}
                itemList={channelProductList.slice(1, channelProductList.length)}
                isNextData={isNextProductData}
                apiPath={CommonApiEndPoint.get_master_channel_item}
                multipleSelect={true}
                selectedItemData={dataList.find(ele => ele.sku === selectedProductId)?.map_product}
                name='bulk_master_item'
                sidebarPageLimit={pageLimit}
            /> : ''}
        </>
    )
}

export default BulkMasterItem