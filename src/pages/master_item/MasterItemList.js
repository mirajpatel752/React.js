import React, { Fragment, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Eye, Edit, MoreVertical } from 'react-feather'
import { useSelector } from 'react-redux'
import { ApiCall, GetApiCall } from '../../helper/axios'
import useNotify from '../../custom_hooks/useNotify'
import DeleteModal from '../../common_components/pop_up_modal/DeleteModal'
import { debounce, getDetectOs, getIcon } from '../../helper/commonFunction'
import {
  Card,
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledButtonDropdown,
  CardTitle
} from 'reactstrap'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import ModuleTitle from '../../common_components/ModuleTitle'
import Header from '../../common_components/HeaderTitle'
import Hotkeys from 'react-hot-keys'
import OptionData from '../../common_components/OptionData'
import CommonRouter from '../../helper/commonRoute'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import ListGridTable from '../../common_components/grid_table/ListGridTable'
import { bucketPathUrl } from '../../helper/commonApi'

const MasterItemList = () => {
  const notify = useNotify()
  const history = useHistory()
  const location_state = history.location.state
  const detectOs = getDetectOs(navigator.platform)
  const isMobile = useSelector((state) => state.windowResizeReducer.isMobile)
  const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveLoader, setSaveLoader] = useState(false)
  // const [deleteId, setDeleteId] = useState('')
  const [deletePopUpActive, setDeletePopUpActive] = useState(false)
  const [isNextDataAvailable, setIsNextDataAvailable] = useState()
  const [columnWiseFilter, setColumnWiseFilter] = useState({})
  const [isPageReset, setIsPageReset] = useState(false)
  const [isFilterApply, setIsFilterApply] = useState(false)
  /**
   * IW0110
   * This function is call on get item list
   */
  const fetchData = async (otherFilter, availableData) => {
    setLoading(true)
    const header = { 'access-token': localStorage.getItem('access_token') }
    const res = await GetApiCall('GET', `${CommonApiEndPoint.get_master_item_list}?id=${selected_company_object.id}&limit=${otherFilter.currentPage}&col_filter=${otherFilter.columnFilters.length ? encodeURIComponent(JSON.stringify(otherFilter.columnFilters)) : ''}&per_page=50&order_field=${otherFilter.sorting[0]?.id}&order_by=${otherFilter.sorting[0]?.id ? otherFilter.sorting[0]?.desc ? 'desc' : 'asc' : ''}&filter_data=${otherFilter.is_filter_apply ? encodeURIComponent(JSON.stringify(otherFilter.filter_value)) : ''}`, header)
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
          categories: '',
          gst_rate: '',
          image: '',
          opening_stock: '',
          status: '',
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
   * This function is called when user search to get any series data
   */
  const handleSearch = (columnWiseFilter, availableData, filter_id) => {
    fetchData(columnWiseFilter, availableData, filter_id)
  }
  const [searchState] = useState({ fn: debounce(handleSearch, 500) })
  const handleFilter = (columnWiseFilter, availableData, filter_id) => {
    searchState.fn(columnWiseFilter, availableData, filter_id)
  }

  useEffect(() => {
    if ((dataList.length || isFilterApply) || (selected_company_object.id && !dataList.length)) {
      setLoading(true)
      const final_column_filter = Object.keys(columnWiseFilter).length ? columnWiseFilter : { currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }
      handleFilter(final_column_filter, dataList, location_state?.customFilterDetail?.id)
    }
  }, [selected_company_object.id, columnWiseFilter, location_state])
  /**
   * IW0110
   * This function is call on delete item api call
   */
  const handleDeleteAction = async (deleteID) => {
    setSaveLoader(true)
    const header = { 'access-token': localStorage.getItem('access_token'), id: selected_company_object.id }
    const res = await ApiCall('DELETE', `${CommonApiEndPoint.delete_master_item}?id=${deleteID}`, null, header)
    if (res.data.status === 'success') {
      notify(res.data.message, 'success')
      setDeletePopUpActive(!deletePopUpActive)
      setSaveLoader(false)
      setIsPageReset(true)
    } else {
      notify(res.data.message, 'error')
      setDeletePopUpActive(!deletePopUpActive)
      setSaveLoader(false)
    }
  }
  /**
   * IW0110
   * This function is call on open delete pop-up
   */
  const handleDeletePopUp = (flag = false) => {
    if (flag) {
      // handleDeleteAction(deleteId)
      handleDeleteAction()
    } else {
      setDeletePopUpActive(!deletePopUpActive)
    }
  }
  /**
   * IW0110
   * This function is call on short-cut key
   */
  const onKeyDown = (keyName, e) => {
    e.preventDefault()
    if (keyName === 'alt+n' && !history.location.pathname.includes('view')) {
      history.push(CommonRouter.mi_create)
    }
  }
  const accessRightsForAction = (row) => {
    return dataList.length ? <div className='column-action munim-payment-list-btn'>
      <UncontrolledButtonDropdown>
        {!isMobile ? <Button outline className='w-100 munim-button-link-none' onClick={(e) => { e.preventDefault(); history.push(CommonRouter.mi_edit, { item_id: row.id }) }} >
          <Edit size={14} className='me-50' />
          Edit
        </Button> : ''}
        {!isMobile ? <DropdownToggle outline className='dropdown-toggle-split' caret></DropdownToggle> : <DropdownToggle color=''>
          <MoreVertical size={15} />
        </DropdownToggle>}
        <DropdownMenu end container="body">
          {isMobile ? <DropdownItem className='w-100' onClick={(e) => { e.preventDefault(); history.push(CommonRouter.mi_edit, { item_id: row.id }) }} >
            <Edit size={14} className='me-50' />
            Edit
          </DropdownItem> : ''}
          <DropdownItem className='w-100' onClick={(e) => { e.preventDefault(); history.push(CommonRouter.mi_view, { item_id: row.id }) }} >
            <Eye size={14} className='me-50' />
            <span className='align-middle'>View</span>
          </DropdownItem>
          {/* <DropdownItem
            tag='a'
            href='/'
            className='w-100'
            onClick={e => {
              e.preventDefault()
              setDeleteId(row.id)
              handleDeletePopUp()
            }}
          >
            <Trash2 size={14} className='me-50' />
            <span className='align-middle'>Delete</span>
          </DropdownItem> */}
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    </div> : ''
  }
  const columns = [
    {
      header: Header.product,
      accessorKey: 'title',
      Cell: ({ row }) => <div className='d-flex'>{row.original.image ? <img src={`${bucketPathUrl}assets/images/items/${row.original.image}`} width='20px' height='20px' /> : getIcon('EmptyImage')} <div className={`munim-button-link-none ms-1`} onClick={(e) => { e.preventDefault(); history.push(CommonRouter.mi_edit, { item_id: row.original.id }) }}>{row.original.title}</div></div>
    },
    {
      header: Header.inventory,
      accessorKey: 'inventory',
      Cell: ({ row }) => <span>{row.original.inventory ? row.original.inventory : loading ? '' : '-'}</span>
    },
    {
      header: Header.category,
      accessorKey: 'categories',
      Cell: ({ row }) => <span>{row.original.categories ? row.original.categories : loading ? '' : '-'}</span>
    },
    {
      header: Header.gst_rate,
      accessorKey: 'gst_rate',
      muiTableBodyCellProps: { align: 'right' },
      Cell: ({ row }) => <span>{row.original.gst_rate ? row.original.gst_rate : loading ? '' : '-'} {(Number(row.original.gst_rate) || Number(row.original.gst_rate) === 0) && !row.original.show_loader ? '%' : ''}</span>
    },
    {
      header: Header.status,
      accessorKey: 'status',
      filterVariant: 'select',
      filterSelectOptions: OptionData.active_options,
      Cell: ({ row }) => <span>{row.original.show_loader ? '' : row.original.status === '1' ? 'Active' : 'Inactive'}</span>
    },
    {
      header: isMobile ? <div className="munim-mob-action-icon">
        <svg viewBox="0 0 45 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5911 27.9643C-0.119874 24.5008 -2.92551 12.8215 3.34367 5.1441C11.6246 -4.99641 27.2187 0.995454 28.6759 13.2076C28.7629 13.9362 28.4421 14.3403 27.7135 14.4201C26.2618 14.5886 26.3705 13.947 26.115 12.7617C25.013 7.67967 22.1784 4.48256 17.6111 3.17037C3.27298 -0.945648 -3.82266 19.5909 10.0968 25.5121C11.1135 25.9471 11.5757 26.7681 10.7547 27.6761C10.6115 27.8337 10.4246 27.9451 10.2175 27.9964C10.0104 28.0477 9.79239 28.0365 9.5911 27.9643Z" fill="black" />
          <path d="M9.45699 20.2161C7.84756 20.4172 6.67311 17.4431 6.43387 16.2469C4.40033 5.94866 19.1517 2.31112 22.1095 12.0602C22.4847 13.3107 21.892 14.3221 20.5164 13.9632C20.4324 13.9409 20.3542 13.9012 20.2867 13.8469C20.2193 13.7926 20.1641 13.7247 20.1249 13.6478C19.6029 12.5984 19.2223 11.4566 18.4339 10.6519C16.4548 8.62924 13.5621 8.19969 11.1915 9.93962C8.18286 12.1363 7.92187 15.0362 10.4085 18.6393C10.4583 18.7095 10.4931 18.7896 10.5109 18.8747C10.5287 18.9598 10.529 19.048 10.5118 19.1341C10.3886 19.7865 10.037 20.1472 9.45699 20.2161Z" fill="black" />
          <path d="M17.4306 31.4162C17.8003 31.5612 17.9145 31.4488 17.7731 31.0791C16.5008 27.7913 15.2538 24.5072 14.0323 21.2268C11.7704 15.1479 19.7088 12.3259 21.8293 19.6336C21.8384 19.6658 21.855 19.6953 21.8776 19.7198C21.9003 19.7443 21.9283 19.7629 21.9593 19.7742C21.9903 19.7854 22.0234 19.7889 22.0557 19.7843C22.0879 19.7797 22.1185 19.7672 22.1447 19.7478C23.939 18.461 25.6916 18.4954 27.4025 19.8511C27.4702 19.9055 27.555 19.9346 27.643 19.9336C27.7311 19.9327 27.8169 19.9016 27.8864 19.8457C29.6517 18.4247 31.4406 18.3849 33.253 19.7261C33.3209 19.7747 33.4022 19.8009 33.4852 19.8009C33.5681 19.8009 33.6486 19.7747 33.7152 19.7261C37.2494 17.1216 39.457 19.1823 40.7347 22.5861C41.8167 25.4515 43.4534 29.3555 44.0243 31.302C47.1833 41.9863 35.8194 48.0053 27.0219 47.9999C19.8393 47.9944 17.2675 43.5087 13.1677 37.6908C10.6992 34.1892 13.1297 29.7415 17.4306 31.4162ZM31.1053 30.0188C30.1266 30.6278 29.4361 30.4466 29.0337 29.4751C28.3758 27.8983 26.5054 21.9553 25.2385 21.3409C24.6186 21.0401 24.0912 21.1561 23.6562 21.6889C23.2285 22.2037 23.1216 22.7419 23.3355 23.3038C24.1148 25.3301 24.8706 27.3691 25.6028 29.4207C26.0378 30.655 25.7007 31.5576 24.2435 31.4271C24.1047 31.4141 23.9722 31.3624 23.8608 31.2779C23.7494 31.1934 23.6635 31.0794 23.6127 30.9486C22.0432 26.9395 20.4954 22.8996 18.9693 18.8289C18.7555 18.2598 18.364 17.872 17.7949 17.6653C17.0953 17.408 16.5787 17.6128 16.2452 18.2797C15.9444 18.8778 15.919 19.4995 16.1691 20.1447C18.4999 26.162 20.7817 32.1937 23.0147 38.24C23.0404 38.3105 23.0517 38.3854 23.048 38.4601C23.0443 38.5348 23.0255 38.6079 22.9929 38.675C22.6848 39.3057 22.1972 39.5576 21.5303 39.4307C21.3315 39.3959 21.1544 39.2869 21.0355 39.1263L17.2131 33.9989C16.6259 33.2123 15.9281 33.0999 15.1197 33.6618C14.3205 34.2218 14.3204 35.0972 14.8805 35.8856C17.2584 39.2495 18.6902 41.2432 19.1759 41.8666C24.6404 48.859 39.7723 45.1453 42.0016 36.5979C42.9694 32.8951 39.2069 25.3428 37.7714 21.7052C37.3872 20.7301 36.7528 20.5253 35.8684 21.0908C34.0143 22.2816 36.4773 26.8163 37.07 28.4855C37.3237 29.1996 37.0809 29.631 36.3414 29.7796C35.5041 29.9463 34.9495 29.6726 34.6776 28.9586C33.7605 26.5698 32.8398 24.2028 31.9155 21.8575C31.6146 21.089 31.0836 20.8625 30.3223 21.1778C29.3364 21.5874 29.0083 22.2725 29.3382 23.2331C30.0088 25.1978 30.6993 27.1679 31.4098 29.1434C31.4664 29.3022 31.4671 29.4755 31.4117 29.6347C31.3563 29.794 31.2482 29.9295 31.1053 30.0188Z" fill="black" />
        </svg></div> : Header.action,
      accessorKey: 'action',
      muiTableHeadCellProps: { align: 'right' },
      muiTableBodyCellProps: { align: 'right' },
      size: isMobile ? 50 : 130,
      enableHiding: false,
      enableColumnFilter: false,
      enableColumnActions: false,
      enableResizing: false,
      enablePinning: false,
      enableColumnOrdering: false,
      enableSorting: false,
      Cell: ({ row }) => !row.original.show_loader && accessRightsForAction(row.original)
    }
  ]

  const filter_panel_field = [
    { title: Header.product, name: 'title', type: 'text' },
    { title: Header.category, name: 'categories', type: 'text' },
    { title: Header.inventory, name: 'inventory', type: 'text' },
    { title: Header.gst_rate, name: 'gst_rate', type: 'number' },
    { title: Header.status, name: 'status', type: 'status_option', option_data: 'active_options' }
  ]
  const column_visibility = {
    title: true,
    categories: true,
    inventory: true,
    gst_rate: true,
    status: true
  }
  const masterItemNameSet = () => {
    return (<>
      <CardTitle tag='h4' className='mt-1'>
        {'Master Item'}
      </CardTitle>
    </>
    )
  }
  return (
    <>
      <div className='d-flex justify-content-between align-items-center munim-list-company'>
        <Hotkeys keyName="alt+n,enter" onKeyDown={onKeyDown} filter={() => true}></Hotkeys>
        <div>
          <ModuleTitle
            breadCrumbTitle='Master Item'
            url={CommonRouter.master_item}
          />
        </div>
        <div className='d-flex align-items-center gap-2'>
          <>
            <div className='create-mobil-btn-show desktop-device-none'>
              <div className='mobil-creat-svg-border'>
                <svg width="15" height="15" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" cursor='pointer' className='' onClick={() => history.push(CommonRouter.mi_create)}>
                  <path d="M10.8756 6.56H6.50763V10.856H4.49163V6.56H0.123625V4.664H4.49163V0.344H6.50763V4.664H10.8756V6.56Z" fill="#fff" />
                </svg>
              </div>
            </div>
            <Button className='add-new-user mobile-d-none' color='primary' onClick={() => history.push(CommonRouter.mi_create)} >
              Create Item
            </Button>
          </>
        </div>
      </div>
      <Fragment>
        <Card className='mt-1 mb-0 munim-card-border munim-loader-add'>
          <div className={`react-dataTable munim-sales-inv-list munim-fixed-action munim-react-list-tble munim-last-table munim-quo-filed-left ${dataList.length < 9 ? 'munim-overflow-hidden' : 'overflow-hidden'} ${dataList.length ? '' : 'munim-no-data-found-tble'}`}>
            <ListGridTable
              columns={columns}
              tableData={dataList}
              handleFilterChange={setColumnWiseFilter}
              columnVisibility={column_visibility}
              isFilterApply={isFilterApply}
              moduleId='3_10'
              isNextDataAvailable={isNextDataAvailable}
              filterPanelField={filter_panel_field}
              isLoading={loading}
              setIsPageReset={setIsPageReset}
              isPageReset={isPageReset}
              initialRowData={{ field: 'title', condition: '1', from_value: '', value: '', to_value: '', type: 'text' }}
              initialFreezeColumn='action'
              fullScreenTitleShow={true}
              tabShow={masterItemNameSet}
              isReportFilter={true}
            />
          </div>
        </Card>
        <DeleteModal
          deletePopUpActive={deletePopUpActive}
          popUpTitle='Delete Item'
          loader={saveLoader}
          secondaryLabel='Cancel'
          primaryLabel='Delete'
          popUpContent='Are you sure, you want to delete this item?'
          handleDeletePopUp={handleDeletePopUp}
        />
      </Fragment>
      <div className="mt-2 mb-2 munim-tble-shortcutkey-main">
        <div className='pe-1'>
          <span className='text-uppercase fw-bolder munim-shortcut-letter munim-shortcutkey-text-clr'>Shortcuts:</span>
        </div>
        <div className="munim-sales-tble-shortcutkey" >
          <div>
            <span>
              <button className="munim-input-key fw-bold" tabIndex="-1">{detectOs}</button>
              <span className='ps-0'> + </span>
              <button className="munim-input-key fw-bold" tabIndex="-1">N</button>
            </span>
            <span className='fw-bold munim-shortcutkey-text-clr'>Create Item</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default MasterItemList