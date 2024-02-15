import React, { Fragment, useEffect, useState } from 'react'
import { Card } from 'reactstrap'
import { useSelector } from 'react-redux'
import Header from '../../common_components/HeaderTitle'
import ListGridTable from '../../common_components/grid_table/ListGridTable'
import { GetApiCall } from '../../helper/axios'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { channel_logo, debounce } from '../../helper/commonFunction'
import OptionData from '../../common_components/OptionData'

const PackedOrdersList = ({ tabRender, setResetModuleData, resetModuleData, activeTabId, tabId, fullScreenTitleShow,
    tabShow, itemOption, setSelectedItem, selectedItem, dataList = [], setDataList, rowSelection, setRowSelection, isUpdateOrder }) => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const [isFilterApply, setIsFilterApply] = useState(false)
    // const [dataList, setDataList] = useState([])
    const [loading, setLoading] = useState(true)
    const [isPageReset, setIsPageReset] = useState(false)
    const [isNextDataAvailable, setIsNextDataAvailable] = useState()
    const [columnWiseFilter, setColumnWiseFilter] = useState({ currentPage: 0 })
    const [isShowActionMenu, setIsShowActionMenu] = useState(true)

    const fetchData = async (otherFilter, availableData, activeTabId, channel_type = '0') => {
        setLoading(true)
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_order_list}?id=${selected_company_object.id}&per_page=50&limit=${otherFilter?.currentPage}&is_action=${Number(activeTabId) - 1}&channel_type=${channel_type}`, header)
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
                    channel_type: '',
                    product_title: '',
                    order_id: '',
                    order_qty: '',
                    status: '',
                    total_price: ''
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

    const handleSearch = (columnWiseFilter, availableData, activeTabId, selectedItem) => {
        fetchData(columnWiseFilter, availableData, activeTabId, selectedItem)
    }
    const [searchState] = useState({ fn: debounce(handleSearch, 500) })
    const handleFilter = (columnWiseFilter, availableData, activeTabId, selectedItem) => {
        searchState.fn(columnWiseFilter, availableData, activeTabId, selectedItem)
    }
    useEffect(() => {
        if (((isFilterApply || dataList.length)) || (!dataList.length)) {
            setLoading(true)
            handleFilter(columnWiseFilter, dataList, activeTabId, selectedItem)
        }
    }, [columnWiseFilter, selectedItem, isUpdateOrder])

    useEffect(() => {
        if (activeTabId === resetModuleData) {
            setLoading(true)
            setResetModuleData('')
            handleFilter({ currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }, [], activeTabId)
        }
    }, [resetModuleData])

    const columns = [
        {
            header: Header.order_id,
            accessorKey: 'order_id',
            Cell: ({ row }) => <span>{row.original.order_id} </span>
        },
        {
            header: Header.channel,
            accessorKey: 'channel_type',
            Cell: ({ row }) => <span>{row.original.channel_type ? <img src={channel_logo[row.original.channel_type]} width='20px' height='20px' /> : null}</span>
        },
        {
            header: Header.status,
            accessorKey: 'status',
            filterSelectOptions: OptionData.orders_status,
            Cell: ({ row }) => <span>{OptionData.orders_status.find(ele => ele.value === row.original.status)?.text}</span>
        },
        {
            header: Header.product_name,
            accessorKey: 'product_title',
            Cell: ({ row }) => <span>{row.original.product_title}</span>
        },
        {
            header: Header.order_amt,
            accessorKey: 'total_price',
            size: 100,
            muiTableBodyCellProps: { align: 'right' },
            Cell: ({ row }) => <span>{row.original.total_price}</span>
        }
    ]

    const filter_panel_field = [
        { title: Header.order_id, name: 'order_id', type: 'text' },
        { title: Header.channel, name: 'channel_type', type: 'text' },
        { title: Header.status, name: 'status', type: 'status_option', option_data: 'orders_status' },
        { title: Header.product_name, name: 'product_title', type: 'text' },
        { title: Header.order_amt, name: 'total_price', type: 'amount' }
    ]

    return (
        <Fragment>
            <Card className='mb-0'>
                <div className={`react-dataTable munim-sales-inv-list munim-react-list-tble munim-last-table munim-quo-filed-left ${loading ? `munim-gridview-overflow` : ''} ${dataList.length ? '' : 'munim-no-data-found-tble'}`}>
                    <ListGridTable
                        filterPanelField={filter_panel_field}
                        columns={columns}
                        tableData={dataList}
                        handleFilterChange={setColumnWiseFilter}
                        isFilterApply={isFilterApply}
                        tabId={tabId}
                        activeTabId={activeTabId}
                        moduleId='6_3'
                        tabRender={tabRender}
                        isPageReset={isPageReset}
                        isNextDataAvailable={isNextDataAvailable}
                        setIsPageReset={setIsPageReset}
                        isLoading={loading}
                        initialRowData={{ field: 'order_id', condition: '1', from_value: '', value: '', to_value: '', type: 'text' }}
                        initialFreezeColumn='action'
                        isShowActionMenu={isShowActionMenu}
                        setIsShowActionMenu={setIsShowActionMenu}
                        fullScreenTitleShow={fullScreenTitleShow}
                        tabShow={tabShow}
                        isReportFilter={true}
                        isDropdownFilter={true}
                        handleSelectedItem={(_, value) => setSelectedItem(value)}
                        selectedItem={selectedItem}
                        itemOption={itemOption}
                        isRowSelection={true}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                    />
                </div >
            </Card >
        </Fragment >
    )
}

export default PackedOrdersList
