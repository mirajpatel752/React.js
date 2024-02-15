import { useHistory } from 'react-router-dom'
import { Card } from 'reactstrap'
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '../../common_components/HeaderTitle'
import ListGridTable from '../../common_components/grid_table/ListGridTable'
import { GetApiCall } from '../../helper/axios'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { debounce } from '../../helper/commonFunction'

const ChannelItemList = ({ tabRender, setResetModuleData, resetModuleData, activeTabId, tabId, fullScreenTitleShow,
  tabShow, itemOption, selectedItem, setSelectedItem }) => {
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

  const fetchData = async (otherFilter, availableData, filter_id, activeTabId, selectedItem) => {
    setLoading(true)
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    const res = await GetApiCall('GET', `${CommonApiEndPoint.get_channel_item_list}?id=${selected_company_object.id}&per_page=50&limit=${otherFilter?.currentPage}&col_filter=${otherFilter?.columnFilters?.length ? encodeURIComponent(JSON.stringify(otherFilter.columnFilters)) : ''}&order_field=${otherFilter?.sorting?.length && otherFilter?.sorting[0]?.id}&order_by=${otherFilter?.sorting && otherFilter?.sorting[0]?.id ? otherFilter?.sorting[0]?.desc ? 'desc' : 'asc' : ''}&filter_data=${otherFilter?.is_filter_apply ? encodeURIComponent(JSON.stringify(otherFilter?.filter_value)) : ''}&is_action=${activeTabId}&channel_type=${selectedItem ? selectedItem : '0'}`, header)
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
          inventory: '',
          product_name: '',
          sales_price: '',
          mrp: '',
          sku: ''
        })
      }
      setDataList(final_data)
      setIsNextDataAvailable(Number(res.data.data.is_next))
      setLoading(false)
      setIsFilterApply(false)
    } else {
      if (!otherFilter.currentPage) {
        setIsFilterApply(true)
      }
      setIsNextDataAvailable(false)
      setDataList([])
      setLoading(false)
    }
  }

  const handleSearch = (columnWiseFilter, availableData, filter_id, activeTabId, selectedItem) => {
    fetchData(columnWiseFilter, availableData, filter_id, activeTabId, selectedItem)
  }
  const [searchState] = useState({ fn: debounce(handleSearch, 500) })
  const handleFilter = (columnWiseFilter, availableData, filter_id, activeTabId, selectedItem) => {
    searchState.fn(columnWiseFilter, availableData, filter_id, activeTabId, selectedItem)
  }
  useEffect(() => {
    if (((isFilterApply || dataList.length)) || (!dataList.length)) {
      setLoading(true)
      const final_column_filter = Object.keys(columnWiseFilter).length ? columnWiseFilter : { currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }
      handleFilter(final_column_filter, dataList, location_state?.customFilterDetail?.id, activeTabId, selectedItem)
    }
  }, [columnWiseFilter, selectedItem])

  useEffect(() => {
    if (activeTabId === resetModuleData) {
      setLoading(true)
      setResetModuleData('')
      handleFilter({ currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }, [], location_state?.customFilterDetail?.id, activeTabId, selectedItem)
    }
  }, [resetModuleData])

  const columns = [
    {
      header: Header.sr,
      accessorKey: 'id',
      enableColumnFilter: false,
      enableColumnActions: false,
      Cell: ({ row }) => <span>{!row.original.show_loader ? row.index + 1 : ''}</span>
    },
    {
      header: Header.title,
      accessorKey: 'product_name',
      Cell: ({ row }) => <span>{row.original.product_name} </span>
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
    }
  ]

  const filter_panel_field = [
    { title: Header.title, name: 'product_name', type: 'text' },
    { title: Header.sku, name: 'sku', type: 'text' },
    { title: Header.mrp, name: 'mrp', type: 'number' },
    { title: Header.sales_price, name: 'sales_price', type: 'number' }
  ]

  return (
    <Fragment>
      <Card className='mb-0'>
        <div className={`react-dataTable munim-sales-inv-list munim-react-list-tble munim-last-table munim-quo-filed-left ${loading ? `munim-gridview-overflow` : ''} ${dataList.length ? '' : 'munim-no-data-found-tble'}`}>
          <ListGridTable
            columnFilterHide={false}
            showTopToolbar={true}
            filterPanelField={filter_panel_field}
            columns={columns}
            tableData={dataList}
            enableRowDragging={true}
            handleFilterChange={setColumnWiseFilter}
            isFilterApply={isFilterApply}
            tabId={tabId}
            activeTabId={activeTabId}
            moduleId='3_1'
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
            handleSelectedItem={(_, value) => setSelectedItem(value)}
            selectedItem={selectedItem}
            itemOption={itemOption}
            dropdowmPlaceholder='Select channel name'
          />
        </div >
      </Card >
    </Fragment >
  )
}

export default ChannelItemList
