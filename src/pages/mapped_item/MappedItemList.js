import { useHistory } from 'react-router-dom'
import { Edit, MoreVertical } from 'react-feather'
import { UncontrolledButtonDropdown, Button, DropdownItem, Card, DropdownToggle, DropdownMenu } from 'reactstrap'
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '../../common_components/HeaderTitle'
import ListGridTable from '../../common_components/grid_table/ListGridTable'
import { GetApiCall } from '../../helper/axios'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { channel_logo, debounce } from '../../helper/commonFunction'
import AddChannelSidebar from '../master_item/master_mapped_items/AddChannel'

const ChannelItemList = ({ tabRender, setResetModuleData, resetModuleData, activeTabId, tabId, getCustomFilterList, fullScreenTitleShow,
  tabShow, searchTerm, handleSearchTerm }) => {
  const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
  const isMobile = useSelector((state) => state.windowResizeReducer.isMobile)
  const history = useHistory()
  const location_state = history.location.state
  const [isFilterApply, setIsFilterApply] = useState(false)
  const [channelItemListData, setChannelItemListData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPageReset, setIsPageReset] = useState(false)
  const [isNextDataAvailable, setIsNextDataAvailable] = useState()
  const [columnWiseFilter, setColumnWiseFilter] = useState({ currentPage: 0 })
  const [isShowActionMenu, setIsShowActionMenu] = useState(true)
  const [addChannelSidebarOpen, setAddChannelSidebarOpen] = useState(false)
  const [addChannelData, setAddChannelData] = useState()
  const [addChannelId, setAddChannelId] = useState()
  const [channelConnectList, setChannelConnectList] = useState([])


  const getChannelItemList = async (otherFilter, availableData, filter_id, activeTabId, search_activity = '') => {
    setLoading(true)
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    const res = await GetApiCall('GET', `${CommonApiEndPoint.get_channel_mapped_items}?id=${selected_company_object.id}&channel_type=0&per_page=50&limit=${otherFilter?.currentPage}&filter=${search_activity}&is_action=${activeTabId}&col_filter=${otherFilter?.columnFilters?.length ? encodeURIComponent(JSON.stringify(otherFilter.columnFilters)) : ''}&order_field=${otherFilter?.sorting?.length && otherFilter?.sorting[0]?.id}&order_by=${otherFilter?.sorting && otherFilter?.sorting[0]?.id ? otherFilter?.sorting[0]?.desc ? 'desc' : 'asc' : ''}&filter_data=${otherFilter?.is_filter_apply ? encodeURIComponent(JSON.stringify(otherFilter?.filter_value)) : ''}`, header)
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
          opening_stock: '',
          product_name: '',
          published_on: '',
          sales_price: '',
          sku: ''
        })
      }
      setChannelItemListData(final_data)
      setIsNextDataAvailable(Number(res.data.data.is_next))
      setLoading(false)
      setIsFilterApply(false)
    } else {
      if (!otherFilter.currentPage) {
        setIsFilterApply(true)
      }
      setIsNextDataAvailable(false)
      setChannelItemListData([])
      setLoading(false)
    }
  }

  const handleSearch = (columnWiseFilter, availableData, filter_id, activeTabId) => {
    getChannelItemList(columnWiseFilter, availableData, filter_id, activeTabId)
  }
  const [searchState] = useState({ fn: debounce(handleSearch, 500) })
  const handleFilter = (columnWiseFilter, availableData, filter_id, activeTabId) => {
    searchState.fn(columnWiseFilter, availableData, filter_id, activeTabId)
  }
  useEffect(() => {
    if (((isFilterApply || channelItemListData.length)) || (!channelItemListData.length)) {
      setLoading(true)
      handleFilter(columnWiseFilter, channelItemListData, searchTerm ? searchTerm : location_state?.customFilterDetail?.id, activeTabId)
    }
  }, [columnWiseFilter, searchTerm])

  useEffect(() => {
    if (activeTabId === resetModuleData) {
      setLoading(true)
      setResetModuleData('')
      handleFilter({ currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }, [], location_state?.customFilterDetail?.id, activeTabId)
    }
  }, [resetModuleData])

  const onAddChannel = (value) => {
    setAddChannelData(value)
    setAddChannelSidebarOpen(true)
    setAddChannelId(value)
  }
  const categorySidebar = (value) => {
    if (value) {
      handleFilter({ currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }, [], location_state?.customFilterDetail?.id, activeTabId)
    }
    setAddChannelSidebarOpen(false)
  }

  async function getChannelConnectList() {
    const header = { 'access-token': localStorage.getItem('access_token') }
    const res = await GetApiCall('GET', `${CommonApiEndPoint.get_connect_channel}?id=${selected_company_object.id}&channel_type=0&per_page=50&limit=${0}&is_action=1`, header)
    if (res.data.status === 'success' && res.data.data.row_data.length > 0) {
      const channel_data = []
      res.data.data.row_data.map(item => {
        channel_data.push({
          text: item.channel_name,
          value: item.id,
          channeltype: item.channel_type
        })
      })
      setChannelConnectList(channel_data)
    } else if (res.data.statusCode === 404) {
      setChannelConnectList([])
    }
  }

  useEffect(() => {
    getChannelConnectList()
  }, [])

  const accessRightsForAction = (data) => {
    return channelItemListData.length ? <div className='column-action munim-payment-list-btn'>
      <UncontrolledButtonDropdown>
        {

          !isMobile ? <Button outline className='w-100 munim-button-link-none' onClick={(e) => { e.preventDefault(); onAddChannel(data) }} >
            {/* <Edit size={14} className='me-50' /> */}
            Add to Channel
          </Button> : ""}
        <>
          {isMobile ? <DropdownToggle color=''><MoreVertical size={15} /></DropdownToggle> : <DropdownToggle outline className='dropdown-toggle-split' caret></DropdownToggle>
          }
        </>
        <DropdownMenu end container="body">
          {
            channelConnectList && channelConnectList.map((item, i) => {
              return (
                <DropdownItem key={i} className='w-100' onClick={(e) => { e.preventDefault(); onAddChannel(item) }}>
                  <img className="published-table-img" src={channel_logo[item.channeltype]} alt="Channel logo" /> {item.text}
                </DropdownItem>
              )
            })
          }
          {isMobile ? <DropdownItem className='w-100' onClick={(e) => { e.preventDefault(); onAddChannel(data) }} >
            <Edit size={14} className='me-50' />
            Add to Channel
          </DropdownItem> : ''}
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    </div> : ''
  }

  const columns = [
    {
      header: Header.sr,
      accessorKey: 'id',
      enableColumnFilter: false,
      enableColumnActions: false,
      enableColumnActions: false,
      size: 70,
      Cell: ({ row }) => <span>{!row.original.show_loader ? row.index + 1 : ''}</span>
    },
    {
      header: Header.product_name,
      accessorKey: 'product_name',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.product_name}</span>
    },
    {
      header: Header.sku,
      accessorKey: 'sku',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.sku}</span>
    },
    {
      header: Header.selling_price,
      accessorKey: 'sales_price',
      muiTableBodyCellProps: { align: 'right' },
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.sales_price}</span>
    },
    {
      header: Header.stock_qty,
      accessorKey: 'opening_stock',
      muiTableBodyCellProps: { align: 'right' },
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.opening_stock}</span>
    },
    {
      header: Header.published_on,
      enableColumnFilter: false,
      enableColumnActions: false,
      enableSorting: false,
      accessorKey: 'published_on',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.published_on && row.original.published_on.map((item, i) => {
        return (
          <img key={i} className="published-table-img" src={channel_logo[item]} alt="Channel logo" />
        )
      })}</span>

    },
    {
      header: isMobile ? <div className="munim-mob-action-icon">
        <svg viewBox="0 0 45 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5911 27.9643C-0.119874 24.5008 -2.92551 12.8215 3.34367 5.1441C11.6246 -4.99641 27.2187 0.995454 28.6759 13.2076C28.7629 13.9362 28.4421 14.3403 27.7135 14.4201C26.2618 14.5886 26.3705 13.947 26.115 12.7617C25.013 7.67967 22.1784 4.48256 17.6111 3.17037C3.27298 -0.945648 -3.82266 19.5909 10.0968 25.5121C11.1135 25.9471 11.5757 26.7681 10.7547 27.6761C10.6115 27.8337 10.4246 27.9451 10.2175 27.9964C10.0104 28.0477 9.79239 28.0365 9.5911 27.9643Z" fill="black" />
          <path d="M9.45699 20.2161C7.84756 20.4172 6.67311 17.4431 6.43387 16.2469C4.40033 5.94866 19.1517 2.31112 22.1095 12.0602C22.4847 13.3107 21.892 14.3221 20.5164 13.9632C20.4324 13.9409 20.3542 13.9012 20.2867 13.8469C20.2193 13.7926 20.1641 13.7247 20.1249 13.6478C19.6029 12.5984 19.2223 11.4566 18.4339 10.6519C16.4548 8.62924 13.5621 8.19969 11.1915 9.93962C8.18286 12.1363 7.92187 15.0362 10.4085 18.6393C10.4583 18.7095 10.4931 18.7896 10.5109 18.8747C10.5287 18.9598 10.529 19.048 10.5118 19.1341C10.3886 19.7865 10.037 20.1472 9.45699 20.2161Z" fill="black" />
          <path d="M17.4306 31.4162C17.8003 31.5612 17.9145 31.4488 17.7731 31.0791C16.5008 27.7913 15.2538 24.5072 14.0323 21.2268C11.7704 15.1479 19.7088 12.3259 21.8293 19.6336C21.8384 19.6658 21.855 19.6953 21.8776 19.7198C21.9003 19.7443 21.9283 19.7629 21.9593 19.7742C21.9903 19.7854 22.0234 19.7889 22.0557 19.7843C22.0879 19.7797 22.1185 19.7672 22.1447 19.7478C23.939 18.461 25.6916 18.4954 27.4025 19.8511C27.4702 19.9055 27.555 19.9346 27.643 19.9336C27.7311 19.9327 27.8169 19.9016 27.8864 19.8457C29.6517 18.4247 31.4406 18.3849 33.253 19.7261C33.3209 19.7747 33.4022 19.8009 33.4852 19.8009C33.5681 19.8009 33.6486 19.7747 33.7152 19.7261C37.2494 17.1216 39.457 19.1823 40.7347 22.5861C41.8167 25.4515 43.4534 29.3555 44.0243 31.302C47.1833 41.9863 35.8194 48.0053 27.0219 47.9999C19.8393 47.9944 17.2675 43.5087 13.1677 37.6908C10.6992 34.1892 13.1297 29.7415 17.4306 31.4162ZM31.1053 30.0188C30.1266 30.6278 29.4361 30.4466 29.0337 29.4751C28.3758 27.8983 26.5054 21.9553 25.2385 21.3409C24.6186 21.0401 24.0912 21.1561 23.6562 21.6889C23.2285 22.2037 23.1216 22.7419 23.3355 23.3038C24.1148 25.3301 24.8706 27.3691 25.6028 29.4207C26.0378 30.655 25.7007 31.5576 24.2435 31.4271C24.1047 31.4141 23.9722 31.3624 23.8608 31.2779C23.7494 31.1934 23.6635 31.0794 23.6127 30.9486C22.0432 26.9395 20.4954 22.8996 18.9693 18.8289C18.7555 18.2598 18.364 17.872 17.7949 17.6653C17.0953 17.408 16.5787 17.6128 16.2452 18.2797C15.9444 18.8778 15.919 19.4995 16.1691 20.1447C18.4999 26.162 20.7817 32.1937 23.0147 38.24C23.0404 38.3105 23.0517 38.3854 23.048 38.4601C23.0443 38.5348 23.0255 38.6079 22.9929 38.675C22.6848 39.3057 22.1972 39.5576 21.5303 39.4307C21.3315 39.3959 21.1544 39.2869 21.0355 39.1263L17.2131 33.9989C16.6259 33.2123 15.9281 33.0999 15.1197 33.6618C14.3205 34.2218 14.3204 35.0972 14.8805 35.8856C17.2584 39.2495 18.6902 41.2432 19.1759 41.8666C24.6404 48.859 39.7723 45.1453 42.0016 36.5979C42.9694 32.8951 39.2069 25.3428 37.7714 21.7052C37.3872 20.7301 36.7528 20.5253 35.8684 21.0908C34.0143 22.2816 36.4773 26.8163 37.07 28.4855C37.3237 29.1996 37.0809 29.631 36.3414 29.7796C35.5041 29.9463 34.9495 29.6726 34.6776 28.9586C33.7605 26.5698 32.8398 24.2028 31.9155 21.8575C31.6146 21.089 31.0836 20.8625 30.3223 21.1778C29.3364 21.5874 29.0083 22.2725 29.3382 23.2331C30.0088 25.1978 30.6993 27.1679 31.4098 29.1434C31.4664 29.3022 31.4671 29.4755 31.4117 29.6347C31.3563 29.794 31.2482 29.9295 31.1053 30.0188Z" fill="black" />
        </svg></div> : Header.action,
      accessorKey: 'action',
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'right' },
      size: isMobile ? 50 : 140,
      enableHiding: false,
      enableResizing: false,
      enablePinning: false,
      enableColumnFilter: false,
      enableColumnActions: false,
      enableColumnOrdering: false,
      enableSorting: false,
      Cell: ({ row }) => !row.original.show_loader && accessRightsForAction(row.original)
    }
  ]

  const filter_panel_field = [
    { title: Header.product_name, name: 'product_name', type: 'text' },
    { title: Header.sku, name: 'sku', type: 'text' },
    { title: Header.sales_price, name: 'sales_price', type: 'number' },
    { title: Header.opening_stock, name: 'opening_stock', type: 'number' }
  ]

  return (
    <>
      <Fragment>
        <Card className='mb-0'>
          <div className={`react-dataTable munim-sales-inv-list munim-react-list-tble munim-last-table munim-quo-filed-left ${loading ? `munim-gridview-overflow` : ''} ${channelItemListData.length ? '' : 'munim-no-data-found-tble'}`}>
            <ListGridTable
              columnFilterHide={false}
              isGlobalSearch={false}
              searchTerm={searchTerm}
              handleSearchTerm={handleSearchTerm}
              showTopToolbar={true}
              filterPanelField={filter_panel_field}
              columns={columns}
              tableData={channelItemListData}
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
              getCustomFilterList={getCustomFilterList}
              fullScreenTitleShow={fullScreenTitleShow}
              tabShow={tabShow}
              isReportFilter={true}
            />
          </div >
        </Card >
      </Fragment >
      {addChannelSidebarOpen ? <AddChannelSidebar channelFlag={true} addChannelId={addChannelId} open={addChannelSidebarOpen} toggleSidebar={categorySidebar} addChannelData={addChannelData} /> : null}
    </>

  )
}

export default ChannelItemList
