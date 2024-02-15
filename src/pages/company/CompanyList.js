/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
import { useHistory } from 'react-router-dom'
import { Edit, Eye, MoreVertical } from 'react-feather'
import { UncontrolledButtonDropdown, Button, DropdownItem, Card, DropdownToggle, DropdownMenu } from 'reactstrap'
import React, { Fragment, useEffect, useState } from 'react'
import CommonRouter from '../../helper/commonRoute'
import { useSelector, useDispatch } from 'react-redux'
import Header from '../../common_components/HeaderTitle'
import ListGridTable from '../../common_components/grid_table/ListGridTable'
import { GetApiCall } from '../../helper/axios'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { debounce } from '../../helper/commonFunction'
import moment from 'moment'
import OptionData from '../../common_components/OptionData'
import LocationList from './location_list/LocationList'

import { setCompanyDataAvailable, setCompanyIsNext, setCompanyList, setSelectedCompanyObject } from '../../redux/commonSlice'
import RangeDatePicker from '../../common_components/calender/RangeDatePicker'

const CompanyList = ({ tabRender, setResetModuleData, resetModuleData, activeTabId, tabId, getCustomFilterList, fullScreenTitleShow,
  tabShow }) => {
  const isMobile = useSelector((state) => state.windowResizeReducer.isMobile)
  const history = useHistory()
  const dispatch = useDispatch()
  const location_state = history.location.state
  const [isFilterApply, setIsFilterApply] = useState(false)
  const [companyListData, setCompanyListData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPageReset, setIsPageReset] = useState(false)
  const [isNextDataAvailable, setIsNextDataAvailable] = useState()
  const [columnWiseFilter, setColumnWiseFilter] = useState({})
  const [isShowActionMenu, setIsShowActionMenu] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const getCompanyData = async (otherFilter, availableData, filter_id, activeTabId) => {
    setLoading(true)
    if (activeTabId === '1') {
      const header = {
        'access-token': localStorage.getItem('access_token')
      }
      const res = await GetApiCall('GET', `${CommonApiEndPoint.get_my_company_list}?per_page=50&limit=${otherFilter?.currentPage}&col_filter=${otherFilter?.columnFilters?.length ? encodeURIComponent(JSON.stringify(otherFilter.columnFilters)) : ''}&comp_role=&order_field=${otherFilter?.sorting?.length && otherFilter?.sorting[0]?.id}&order_by=${otherFilter?.sorting && otherFilter?.sorting[0]?.id ? otherFilter?.sorting[0]?.desc ? 'desc' : 'asc' : ''}&filter_id=${!otherFilter?.is_filter_apply && filter_id ? filter_id : otherFilter?.id ? otherFilter?.id : ''}&filter_data=${otherFilter?.is_filter_apply ? encodeURIComponent(JSON.stringify(otherFilter?.filter_value)) : ''}`, header)
      if (res.data.status === 'success') {
        if (otherFilter.currentPage) {
          setCompanyListData([...availableData, ...res.data.data.row_data])
        } else {
          setCompanyListData([...(res.data.data.row_data)])
        }
        setIsNextDataAvailable(Number(res.data.data.is_next))
        setLoading(false)
        setIsFilterApply(false)
      } else {
        if (availableData.length && !otherFilter.currentPage) {
          setIsFilterApply(true)
        }
        setIsNextDataAvailable(false)
        setCompanyListData([])
        setLoading(false)
      }
    }
  }

  const handleSearch = (columnWiseFilter, availableData, filter_id, activeTabId) => {
    getCompanyData(columnWiseFilter, availableData, filter_id, activeTabId)
  }
  const [searchState] = useState({ fn: debounce(handleSearch, 500) })
  const handleFilter = (columnWiseFilter, availableData, filter_id, activeTabId) => {
    searchState.fn(columnWiseFilter, availableData, filter_id, activeTabId)
  }
  useEffect(() => {
    if ((activeTabId === '1' && (isFilterApply || companyListData.length)) || (!companyListData.length)) {
      setLoading(true)
      handleFilter(columnWiseFilter, companyListData, location_state?.customFilterDetail?.id, activeTabId)
    }
  }, [columnWiseFilter])

  useEffect(() => {
    if (activeTabId === resetModuleData) {
      setLoading(true)
      setResetModuleData('')
      handleFilter({ currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }, [], location_state?.customFilterDetail?.id, activeTabId)
    }
  }, [resetModuleData])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const updateLastSelectedCompany = async (companyObject) => {
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    const res = await GetApiCall('PUT', `${CommonApiEndPoint.update_last_selected_company}?id=${companyObject?.id}`, header)
    if (res.data.status === 'success') {
      getCompanyList()
    }
  }
  const getCompanyList = async () => {
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    const res = await GetApiCall('GET', CommonApiEndPoint.company_list, header)
    if (res.data.status === 'success') {
      const data = res.data.data
      dispatch(setCompanyList(data.company_data))
      dispatch(setCompanyIsNext(data.is_next))
      if (data.last_selected_company !== null || data.last_selected_company !== '') {
        if (data.last_selected_company === '0') {
          dispatch(setCompanyDataAvailable(true))
        } else {
          dispatch(setSelectedCompanyObject(data.last_selected_company_obj))
          history.push(CommonRouter.channels)
        }
      }
    } else {
      dispatch(setCompanyDataAvailable(true))
    }
  }

  const accessRightsForAction = (data) => {
    return <div className='column-action munim-payment-list-btn'>
      <UncontrolledButtonDropdown>
        {

          !isMobile ? <Button outline className='w-100 munim-button-link-none' onClick={(e) => { e.preventDefault(); history.push(CommonRouter.company_edit, { company_id: data.id }) }} >
            <Edit size={14} className='me-50' />
            Edit
          </Button> : ""
        }
        {isMobile ? <DropdownToggle color=''><MoreVertical size={15} /></DropdownToggle> : <DropdownToggle outline className='dropdown-toggle-split' caret></DropdownToggle>
        }
        <DropdownMenu end container="body">
          {isMobile ? <DropdownItem className='w-100' onClick={(e) => { e.preventDefault(); history.push(CommonRouter.company_edit, { company_id: data.id }) }} >
            <Edit size={14} className='me-50' />
            Edit
          </DropdownItem> : ''}
          <DropdownItem className='w-100' onClick={(e) => { e.preventDefault(); updateLastSelectedCompany(data) }}>
            View Channel
          </DropdownItem>
          <DropdownItem className='w-100' onClick={(e) => { e.preventDefault(); setSidebarOpen(true) }}>
            Add Location
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    </div >
  }

  const columns = [
    {
      header: Header.company_name,
      accessorKey: 'company_name',
      Cell: ({ row }) => <span><Button outline className='munim-button-link-none' onClick={(e) => { e.preventDefault(); history.push(CommonRouter.company_edit, { company_id: row.original.id }) }} >{row.original.company_name}</Button></span>
    },
    {
      header: Header.alias_name,
      accessorKey: 'alias_name',
      Cell: ({ row }) => <span className='munim-font-color'>{companyListData.length && row.original.alias_name ? row.original.alias_name : ''}</span>
    },
    {
      header: Header.legal_name,
      accessorKey: 'legal_name',
      Cell: ({ row }) => <span className='munim-font-color'>{companyListData.length && row.original.legal_name ? row.original.legal_name : ''}</span>
    },
    {
      header: Header.gst_in,
      accessorKey: 'gst_in',
      Cell: ({ row }) => <span className='munim-font-color'>{companyListData.length && row.original.gst_in ? row.original.gst_in : ''}</span>
    },
    {
      header: Header.gst_applicable_from,
      accessorKey: 'gst_applied_from',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.gst_applied_from ? moment(row.original.gst_applied_from).format('DD-MM-YYYY') : ''}</span>
    },
    {
      header: Header.mobile_no,
      accessorKey: 'mobile',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.mobile ? row.original.mobile : ''}</span>
    },
    {
      header: Header.email,
      accessorKey: 'email',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.email ? row.original.email : ''}</span>
    },
    {
      header: Header.registration_type,
      accessorKey: 'registration_type',
      filterVariant: 'select',
      filterSelectOptions: OptionData.registration_type_options,
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.registration_type === '1' ? 'Regular (With GST)' : row.original.registration_type === '2' ? 'Composition (With GST)' : row.original.registration_type === '3' ? 'Consumer (Without GST)' : row.original.registration_type === '4' ? 'Unregistered (Without GST)' : row.original.registration_type === '5' ? 'Unknown (Without GST)' : ''}</span>
    },
    {
      header: Header.party_type,
      accessorKey: 'party_type',
      filterVariant: 'select',
      filterSelectOptions: OptionData.party_type_options,
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.party_type === '1' ? 'Not Applicable' : row.original.party_type === '2' ? 'Deemed Export' : row.original.party_type === '3' ? 'Embassy/UN Body' : row.original.party_type === '4' ? 'SEZ' : ''}</span>
    },
    {
      header: Header.organization_type,
      accessorKey: 'organaization_type',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.organaization_type === '1' ? 'Foreign Company' : row.original.organaization_type === '2' ? 'Foreign Limited Liability Partnership' : row.original.organaization_type === '3' ? 'Government Department' : row.original.organaization_type === '4' ? 'Hindu Undivided Family' : row.original.organaization_type === '5' ? 'Limited Liability Partnership' : row.original.organaization_type === '6' ? 'Local Authority' : row.original.organaization_type === '7' ? 'Others' : row.original.organaization_type === '8' ? 'Partnership' : row.original.organaization_type === '9' ? 'Private Limited Company' : row.original.organaization_type === '10' ? 'Proprietorship' : row.original.organaization_type === '11' ? 'Public Limited Company' : row.original.organaization_type === '12' ? 'Public Sector Undertaking' : row.original.organaization_type === '13' ? 'Society/ Club/ Trust/ AOP' : row.original.organaization_type === '14' ? 'Statutory Body' : row.original.organaization_type === '15' ? 'Unlimited Company' : ''}</span>
    },
    {
      header: Header.industry,
      accessorKey: 'industry',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.industry === '1' ? 'AGRICULTURE AND ALLIED INDUSTRIES' : row.original.industry === '2' ? 'AUTOMOBILES' : row.original.industry === '3' ? 'AUTO COMPONENTS' : row.original.industry === '4' ? 'AVIATION' : row.original.industry === '5' ? 'BANKING' : row.original.industry === '6' ? 'BIOTECHNOLOGY' : row.original.industry === '7' ? 'CEMENT' : row.original.industry === '8' ? 'CHEMICALS' : row.original.industry === '9' ? 'CONSUMER DURABLES' : row.original.industry === '10' ? 'DEFENCE MANUFACTURING' : row.original.industry === '11' ? 'E-COMMERCE' : row.original.industry === '12' ? 'EDUCATION AND TRAINING' : row.original.industry === '13' ? 'ELECTRONICS SYSTEM DESIGN & MANUFACTURING' : row.original.industry === '14' ? 'ENGINEERING AND CAPITAL GOODS' : row.original.industry === '15' ? 'FINANCIAL SERVICES' : row.original.industry === '16' ? 'FMCG' : row.original.industry === '17' ? 'GEMS AND JEWELLERY' : row.original.industry === '18' ? 'HEALTHCARE' : row.original.industry === '19' ? 'INFRASTRUCTURE' : row.original.industry === '20' ? 'INSURANCE' : row.original.industry === '21' ? 'IT & BPM' : row.original.industry === '22' ? 'MANUFACTURING' : row.original.industry === '23' ? 'MEDIA AND ENTERTAINMENT' : row.original.industry === '24' ? 'MEDICAL DEVICES' : row.original.industry === '25' ? 'METALS AND MINING' : row.original.industry === '26' ? 'MSME' : row.original.industry === '27' ? 'OIL AND GAS' : row.original.industry === '28' ? 'PHARMACEUTICALS' : row.original.industry === '29' ? 'PORTS' : row.original.industry === '30' ? 'POWER' : row.original.industry === '31' ? 'RAILWAYS' : row.original.industry === '32' ? 'REAL ESTATE' : row.original.industry === '33' ? 'RENEWABLE ENERGY' : row.original.industry === '34' ? 'RETAIL' : row.original.industry === '35' ? 'ROADS' : row.original.industry === '36' ? 'SCIENCE AND TECHNOLOGY' : row.original.industry === '37' ? 'SERVICES' : row.original.industry === '38' ? 'STEEL' : row.original.industry === '39' ? 'TELECOMMUNICATIONS' : row.original.industry === '40' ? 'TEXTILES' : row.original.industry === '41' ? 'TOURISM AND HOSPITALITY' : row.original.industry === '42' ? 'OTHER' : ''}</span>
    },
    {
      header: Header.pan_it_no,
      accessorKey: 'pan_no',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.pan_no ? row.original.pan_no : ''}</span>
    },
    {
      header: Header.address_line1,
      accessorKey: 'address_line1',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.address_line1 ? row.original.address_line1 : ''}</span>
    },
    {
      header: Header.address_line2,
      accessorKey: 'address_line2',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.address_line2 ? row.original.address_line2 : ''}</span>
    },
    {
      header: Header.pincode,
      accessorKey: 'pincode',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.pincode ? row.original.pincode : ''}</span>
    },
    {
      header: Header.city,
      accessorKey: 'city',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.city ? row.original.city : ''}</span>
    },
    {
      header: Header.state,
      accessorKey: 'state`',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.state ? row.original.state : ''}</span>
    },
    {
      header: Header.country,
      accessorKey: 'country',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.country ? row.original.country : ''}</span>
    },
    {
      header: Header.company_establish_date,
      accessorKey: 'com_established_date',
      Cell: ({ row }) => <span className='munim-font-color'>{row.original.establishment_date ? moment(row.original.establishment_date).format('DD-MM-YYYY') : ''}</span>,
      Filter: ({ column }) => (
        <RangeDatePicker
          handleDateChangeFormat={(e) => { (e[0] && e[1]) && column.setFilterValue([moment(e[0]).format('DD-MM-YYYY'), moment(e[1]).format('DD-MM-YYYY')]) }}
          handleResetDate={(e) => column.setFilterValue(e)}
          value={column.getFilterValue()}
        />
      )
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
      size: isMobile ? 50 : 130,
      enableHiding: false,
      enableResizing: false,
      enablePinning: false,
      enableColumnFilter: false,
      enableColumnActions: false,
      enableColumnOrdering: false,
      enableSorting: false,
      Cell: ({ row }) => accessRightsForAction(row.original)
    }
  ]
  const column_visibility = {
    alias_name: true,
    legal_name: false,
    gst_applied_from: false,
    email: false,
    registration_type: false,
    party_type: false,
    industry: false,
    pan_no: false,
    address_line1: false,
    address_line2: false,
    pincode: false,
    country: false,
    com_established_date: false
  }
  const filter_panel_field = [
    { title: Header.company_name, name: 'company_name', type: 'text' },
    { title: Header.alias_name, name: 'alias_name', type: 'text' },
    { title: Header.legal_name, name: 'legal_name', type: 'text' },
    { title: Header.gst_in, name: 'gst_in', type: 'text' },
    { title: Header.gst_applicable_from, name: 'gst_applied_from', type: 'date' },
    { title: Header.mobile_no, name: 'mobile', type: 'number_option' },
    { title: Header.email, name: 'email', type: 'text' },
    { title: Header.registration_type, name: 'registration_type', type: 'text' },
    { title: Header.party_type, name: 'party_type', type: 'text' },
    { title: Header.organization_type, name: 'organization_type', type: 'text' },
    { title: Header.industry, name: 'industry', type: 'text' },
    { title: Header.pan_it_no, name: 'pan_it_no', type: 'text' },
    { title: Header.pincode, name: 'pincode', type: 'number_option' },
    { title: Header.city, name: 'city', type: 'text' },
    { title: Header.state, name: 'state', type: 'text' },
    { title: Header.country, name: 'country', type: 'text' },
    { title: Header.company_establish_date, name: 'establishment_date', type: 'date' }
  ]
  const extra_filter_field = [
    { title: Header.address_line1, name: 'address_line1', type: 'text' },
    { title: Header.address_line2, name: 'address_line2', type: 'text' }
  ]


  return (
    <Fragment>
      <Card className='mb-0'>
        <div className={`react-dataTable munim-sales-inv-list munim-react-list-tble munim-last-table munim-quo-filed-left ${loading ? `munim-gridview-overflow` : ''} ${companyListData.length ? '' : 'munim-no-data-found-tble'}`}>
          <ListGridTable
            columns={columns}
            tableData={companyListData}
            enableRowDragging={true}
            columnVisibility={column_visibility}
            handleFilterChange={setColumnWiseFilter}
            isFilterApply={isFilterApply}
            tabId={tabId}
            activeTabId={activeTabId}
            moduleId='3_1'
            tabRender={tabRender}
            isPageReset={isPageReset}
            filterPanelField={filter_panel_field}
            extraFilterField={extra_filter_field}
            isNextDataAvailable={isNextDataAvailable}
            setIsPageReset={setIsPageReset}
            isLoading={loading}
            initialRowData={{ field: 'company_name', condition: '1', from_value: '', value: '', to_value: '', type: 'text' }}
            sloganHeading='Do estimate for win the deal!'
            sloganDetail="With perfect estimation, give your customers an offer they can't reject!"
            sloganButtonText='Create Quotation'
            sloganButtonUrl={CommonRouter.company_create}
            sloganLinkUrl='https://themunim.com/helpdesk/quotation/'
            initialFreezeColumn='action'
            isShowActionMenu={isShowActionMenu}
            setIsShowActionMenu={setIsShowActionMenu}
            getCustomFilterList={getCustomFilterList}
            fullScreenTitleShow={fullScreenTitleShow}
            tabShow={tabShow}
          />
        </div >
      </Card >
      <LocationList toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
    </Fragment >
  )
}

export default CompanyList
