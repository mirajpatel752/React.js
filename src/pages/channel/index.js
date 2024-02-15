/* eslint-disable no-unused-expressions */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-use-before-define */
import React, { Fragment, useState, useEffect } from 'react'
import Hotkeys from 'react-hot-keys'
import ModuleTitle from '../../common_components/ModuleTitle'
import CommonRouter from '../../helper/commonRoute'
import { Button, Card, UncontrolledButtonDropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap'
import { Edit, File, MoreVertical, Settings, Trash, Sidebar } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { channel_logo, debounce, getDetectOs } from '../../helper/commonFunction'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { ApiCall, GetApiCall } from '../../helper/axios'
import ListGridTable from '../../common_components/grid_table/ListGridTable'
import Header from '../../common_components/HeaderTitle'
import { handleMenuCollapsed } from '@store/layout'
import moment from 'moment'
import useNotify from '../../custom_hooks/useNotify'
import OptionData from '../../common_components/OptionData'
import RangeDatePicker from '../../common_components/calender/RangeDatePicker'

const Channel = () => {
    const dispatch = useDispatch()
    const notify = useNotify()
    const history = useHistory()
    const location_state = history.location.state
    const detectOs = getDetectOs(navigator.platform)
    const isMobile = useSelector((state) => state.windowResizeReducer.isMobile)
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const [dataList, setDataList] = useState([])
    const [isFilterApply, setIsFilterApply] = useState(false)
    const [columnWiseFilter, setColumnWiseFilter] = useState({})
    const [loading, setLoading] = useState(true)
    const [customFilterList, setCustomFilterList] = useState([])
    const [isNextDataAvailable, setIsNextDataAvailable] = useState()
    const [isPageReset, setIsPageReset] = useState(false)
    const [isShowActionMenu, setIsShowActionMenu] = useState(true)
    useEffect(() => {
        dispatch(handleMenuCollapsed(false))
    }, [])
    /**
     * IW0214
     * This function is call on get channel item list
     */
    async function fetchData(otherFilter, availableData) {
        setLoading(true)
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_connect_channel}?id=${selected_company_object.id}&per_page=50&limit=${otherFilter?.currentPage}&col_filter=${otherFilter?.columnFilters?.length ? encodeURIComponent(JSON.stringify(otherFilter.columnFilters)) : ''}&order_field=${otherFilter?.sorting?.length && otherFilter?.sorting[0]?.id}&order_by=${otherFilter?.sorting && otherFilter?.sorting[0]?.id ? otherFilter?.sorting[0]?.desc ? 'desc' : 'asc' : ''}&filter_data=${otherFilter?.is_filter_apply ? encodeURIComponent(JSON.stringify(otherFilter?.filter_value)) : ''}&is_action=0`, header)
        if (res.data.status === 'success' && res.data.data.row_data.length > 0) {
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
                    channel_name: "",
                    connection_status: "",
                    channel_type: "",
                    id: "",
                    status: "",
                    updated: ""
                })
            }
            setDataList(final_data)
            setIsNextDataAvailable(Number(res.data.data.is_next))
            setLoading(false)
            setDataList(final_data)
            setIsNextDataAvailable(Number(res.data.data.is_next))
            setIsFilterApply(false)
        } else if (res.data.statusCode === 404) {
            if (!otherFilter.currentPage) {
                setIsFilterApply(true)
            }
            setIsNextDataAvailable(false)
            setLoading(false)
            setDataList([])
        }
    }
    /**
     * IW0214
     * This function is called when user search to get any channel item
     */
    const handleSearch = (columnWiseFilter, availableData, filter_id) => {
        fetchData(columnWiseFilter, availableData, filter_id)
    }
    const [searchState] = useState({ fn: debounce(handleSearch, 500) })
    const handleFilter = (columnWiseFilter, availableData, filter_id) => {
        searchState.fn(columnWiseFilter, availableData, filter_id)
    }
    /**
        * IW0214
        * This useEffect infinite scroll get  data
        */
    useEffect(() => {
        if ((dataList.length || isFilterApply) && selected_company_object.id) {
            setLoading(true)
            handleFilter(columnWiseFilter, dataList, location_state?.customFilterDetail?.id)
        }
    }, [columnWiseFilter])

    useEffect(() => {
        if (selected_company_object.id) {
            setLoading(true)
            handleFilter({ currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }, dataList, location_state?.customFilterDetail?.id)
        }
    }, [selected_company_object.id, location_state])

    useEffect(() => {
        if (location_state?.customFilterDetail?.filter_name) {
            const is_available = customFilterList.find((item) => item.filter_name === location_state.customFilterDetail.filter_name)
            if (!is_available) {
                if (customFilterList.length) {
                    setCustomFilterList([...customFilterList, location_state.customFilterDetail])
                } else {
                    setCustomFilterList([{ filter_name: 'Quotation' }, location_state.customFilterDetail])
                }
            }
        } else {
        }
    }, [location_state])
    /**
     * IW0214
     * This function is call on short-cut key
     */
    const onKeyDown = (keyName, e) => {
        e.preventDefault()
        if (keyName === 'alt+n') {
            history.push(CommonRouter.channel_list)
        }
    }
    const openModule = () => {
        history.push(CommonRouter.channel_list)
    }
    /**
     * IW0214
     * This function is call on Enable  or Disable status  
     */
    const onchangeStatus = async (values) => {
        try {
            const header = {
                'access-token': localStorage.getItem('access_token')
            }
            const data = {
                status: values.status === "1" ? 0 : 1,
                channel_type: Number(values.channel_type),
                id: selected_company_object.id
            }
            const res = await ApiCall('PUT', CommonApiEndPoint.update_connect_channel, data, header)
            if (res.data.status === 'success') {
                handleFilter({ currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }, dataList, location_state?.customFilterDetail?.id)
                notify(res.data.message, 'success')
            } else {
                notify(res.data.message, 'error')
            }
        } catch (error) {
        }
    }

    const accessRightsForAction = (data) => {
        return <div className='column-action munim-payment-list-btn'>
            <UncontrolledButtonDropdown>
                {
                    !isMobile ? <Button outline className='w-100 munim-button-link-none' onClick={(e) => { e.preventDefault(); history.push(CommonRouter.channel_connection_edit, { channel_id: data }) }} >
                        <Edit size={14} className='me-50' />
                        Edit
                    </Button> : ''
                }
                {isMobile ? <DropdownToggle color=''><MoreVertical size={15} /></DropdownToggle> : <DropdownToggle outline className='dropdown-toggle-split' caret></DropdownToggle>
                }
                <DropdownMenu end container="body">
                    <DropdownItem disabled={data.connection_status === "1" ? false : true} className='w-100' onClick={() => onchangeStatus(data)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="feather feather-tag" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M9.99994 7.93012C9.59055 7.93012 9.19036 8.05151 8.84997 8.27896C8.50958 8.5064 8.24428 8.82967 8.08761 9.20789C7.93095 9.58611 7.88996 10.0023 7.96982 10.4038C8.04969 10.8053 8.24683 11.1741 8.53631 11.4636C8.82578 11.7531 9.1946 11.9502 9.59612 12.0301C9.99764 12.11 10.4138 12.069 10.792 11.9123C11.1703 11.7557 11.4935 11.4904 11.721 11.15C11.9484 10.8096 12.0698 10.4094 12.0698 10C12.0698 9.72817 12.0163 9.459 11.9123 9.20787C11.8083 8.95673 11.6558 8.72854 11.4636 8.53633C11.2714 8.34412 11.0432 8.19165 10.7921 8.08764C10.5409 7.98362 10.2718 7.9301 9.99994 7.93012ZM2.18744 16.25C2.49389 16.2495 2.79365 16.3396 3.04908 16.5089L4.92181 14.6361C4.09899 13.7339 3.53102 12.629 3.27619 11.4348C3.02135 10.2406 3.08883 9.00016 3.47169 7.84066L3.34345 7.93109C3.27578 7.97869 3.19198 7.99745 3.11048 7.98326C3.02898 7.96906 2.95645 7.92308 2.90886 7.85541C2.86127 7.78774 2.8425 7.70394 2.8567 7.62244C2.87089 7.54094 2.91688 7.46841 2.98454 7.42082L4.00263 6.70312C4.04515 6.67328 4.09443 6.65452 4.14603 6.64853C4.19763 6.64255 4.2499 6.64953 4.29812 6.66885C4.34634 6.68816 4.38898 6.7192 4.42217 6.75916C4.45536 6.79911 4.47806 6.84671 4.48822 6.89766L4.74025 7.98656C4.7587 8.06717 4.74438 8.15181 4.70043 8.22187C4.65648 8.29192 4.5865 8.34164 4.50589 8.3601C4.42528 8.37855 4.34064 8.36423 4.27059 8.32028C4.20054 8.27633 4.15081 8.20635 4.13236 8.12574L4.09185 7.95074C3.70792 9.06008 3.64387 10.2551 3.907 11.3991C4.17013 12.5431 4.74984 13.59 5.57986 14.4202C5.63844 14.4788 5.67135 14.5582 5.67135 14.6411C5.67135 14.724 5.63844 14.8034 5.57986 14.862L3.49095 16.9509C3.68286 17.2412 3.77236 17.5872 3.74526 17.9342C3.71815 18.2811 3.576 18.6091 3.34135 18.8661C3.10669 19.1231 2.79295 19.2944 2.44989 19.3528C2.10683 19.4113 1.75408 19.3535 1.44757 19.1887C1.14106 19.0239 0.898336 18.7615 0.757893 18.4431C0.617449 18.1247 0.587321 17.7685 0.672286 17.431C0.757251 17.0935 0.952446 16.7941 1.22692 16.5802C1.50139 16.3662 1.83943 16.25 2.18744 16.25ZM17.8124 16.25C18.1604 16.25 18.4985 16.3662 18.773 16.5802C19.0474 16.7941 19.2426 17.0935 19.3276 17.431C19.4125 17.7685 19.3824 18.1247 19.242 18.4431C19.1015 18.7615 18.8588 19.0239 18.5523 19.1887C18.2458 19.3535 17.893 19.4113 17.55 19.3528C17.2069 19.2944 16.8932 19.1231 16.6585 18.8661C16.4239 18.6091 16.2817 18.2811 16.2546 17.9342C16.2275 17.5872 16.317 17.2412 16.5089 16.9509L14.636 15.0781C13.7336 15.9005 12.6287 16.4682 11.4346 16.723C10.2405 16.9778 9.00011 16.9106 7.84056 16.5282L7.93103 16.6565C7.97862 16.7242 7.99739 16.808 7.98319 16.8895C7.969 16.971 7.92301 17.0435 7.85534 17.0911C7.78768 17.1387 7.70388 17.1574 7.62238 17.1432C7.54087 17.129 7.46835 17.0831 7.42076 17.0154L6.70306 15.9973C6.67323 15.9548 6.65447 15.9055 6.64849 15.8539C6.64251 15.8023 6.6495 15.75 6.66881 15.7018C6.68813 15.6536 6.71916 15.611 6.75911 15.5778C6.79906 15.5446 6.84666 15.5219 6.89759 15.5117L7.9865 15.2597C8.02641 15.2505 8.06774 15.2494 8.10811 15.2562C8.14848 15.263 8.18712 15.2777 8.2218 15.2995C8.25649 15.3213 8.28655 15.3496 8.31027 15.383C8.33398 15.4164 8.35089 15.4541 8.36003 15.494C8.36917 15.534 8.37036 15.5753 8.36353 15.6157C8.3567 15.656 8.34198 15.6947 8.32022 15.7293C8.29845 15.764 8.27007 15.7941 8.23669 15.8178C8.20332 15.8415 8.16559 15.8584 8.12568 15.8676L7.95068 15.9081C9.06001 16.2921 10.255 16.3562 11.3991 16.0931C12.5431 15.8299 13.59 15.2502 14.4201 14.4201C14.4787 14.3615 14.5582 14.3286 14.641 14.3286C14.7239 14.3286 14.8034 14.3615 14.862 14.4201L16.9508 16.5089C17.2062 16.3396 17.506 16.2495 17.8124 16.25ZM2.18744 0.625C2.46974 0.624981 2.74677 0.701445 2.9891 0.846266C3.23143 0.991087 3.42999 1.19886 3.56369 1.44749C3.69739 1.69613 3.76123 1.97634 3.74843 2.25835C3.73563 2.54036 3.64667 2.81364 3.49099 3.04914L5.36384 4.92188C6.26598 4.09895 7.37085 3.53091 8.56505 3.27605C9.75924 3.0212 10.9998 3.08872 12.1592 3.47168L12.0688 3.34352C12.0212 3.27585 12.0025 3.19205 12.0167 3.11055C12.0309 3.02904 12.0769 2.95652 12.1445 2.90893C12.2122 2.86133 12.296 2.84257 12.3775 2.85676C12.459 2.87095 12.5315 2.91694 12.5791 2.98461L13.2968 4.00266C13.3267 4.04517 13.3454 4.09446 13.3514 4.14607C13.3574 4.19767 13.3504 4.24995 13.3311 4.29817C13.3118 4.3464 13.2808 4.38904 13.2408 4.42224C13.2008 4.45543 13.1532 4.47813 13.1023 4.48828L12.0134 4.74035C11.933 4.7582 11.8488 4.74352 11.7792 4.69952C11.7096 4.65553 11.6602 4.58579 11.6418 4.50552C11.6235 4.42525 11.6376 4.34097 11.6811 4.27107C11.7246 4.20117 11.794 4.15133 11.8742 4.13242L12.0491 4.09195C10.9397 3.70856 9.74489 3.64477 8.60098 3.90788C7.45707 4.17099 6.41018 4.75039 5.57978 5.57996C5.52118 5.63855 5.44171 5.67146 5.35884 5.67146C5.27598 5.67146 5.19651 5.63855 5.1379 5.57996L3.04908 3.49102C2.84581 3.62536 2.61394 3.71031 2.372 3.73907C2.13005 3.76784 1.88473 3.73962 1.65563 3.65668C1.42653 3.57373 1.22 3.43836 1.05255 3.26138C0.885091 3.08439 0.761345 2.87069 0.691195 2.63736C0.621045 2.40403 0.606436 2.15752 0.648534 1.91753C0.690631 1.67755 0.788269 1.45073 0.933648 1.2552C1.07903 1.05968 1.26812 0.900859 1.48582 0.791435C1.70351 0.682012 1.94378 0.625016 2.18744 0.625ZM17.8124 0.625C18.0561 0.625025 18.2963 0.682027 18.514 0.791454C18.7317 0.900882 18.9208 1.0597 19.0662 1.25523C19.2116 1.45075 19.3092 1.67756 19.3513 1.91754C19.3934 2.15753 19.3788 2.40403 19.3086 2.63735C19.2385 2.87068 19.1147 3.08438 18.9473 3.26136C18.7798 3.43834 18.5733 3.57372 18.3442 3.65666C18.1151 3.73961 17.8698 3.76783 17.6279 3.73908C17.3859 3.71032 17.1541 3.62539 16.9508 3.49105L15.0781 5.36391C15.901 6.26603 16.4691 7.3709 16.7239 8.5651C16.9788 9.7593 16.9113 10.9998 16.5283 12.1593L16.6565 12.0689C16.7242 12.0213 16.808 12.0025 16.8895 12.0167C16.971 12.0309 17.0435 12.0769 17.0911 12.1446C17.1387 12.2123 17.1575 12.2961 17.1433 12.3776C17.1291 12.4591 17.0831 12.5316 17.0154 12.5792L15.9973 13.2969C15.9548 13.3267 15.9055 13.3455 15.8539 13.3515C15.8023 13.3574 15.75 13.3505 15.7018 13.3312C15.6536 13.3118 15.6109 13.2808 15.5777 13.2408C15.5445 13.2009 15.5218 13.1533 15.5117 13.1023L15.2596 12.0134C15.2501 11.9734 15.2487 11.9319 15.2554 11.8913C15.262 11.8507 15.2766 11.8119 15.2984 11.777C15.3201 11.7421 15.3486 11.7118 15.382 11.6879C15.4155 11.6641 15.4534 11.647 15.4935 11.6379C15.5336 11.6287 15.5751 11.6275 15.6156 11.6345C15.6562 11.6414 15.6949 11.6563 15.7297 11.6782C15.7645 11.7002 15.7945 11.7288 15.8182 11.7625C15.8418 11.7961 15.8586 11.8341 15.8675 11.8743L15.908 12.0492C16.2914 10.9398 16.3552 9.74495 16.0921 8.60105C15.8289 7.45714 15.2495 6.41024 14.42 5.57984C14.3614 5.52124 14.3285 5.44176 14.3285 5.35889C14.3285 5.27601 14.3614 5.19653 14.42 5.13793L16.5088 3.04914C16.3531 2.81363 16.2641 2.54035 16.2513 2.25832C16.2385 1.9763 16.3024 1.69608 16.4361 1.44744C16.5698 1.1988 16.7684 0.991034 17.0107 0.846221C17.2531 0.701408 17.5301 0.62496 17.8124 0.625ZM10.8731 6.34168C11.2602 6.43389 11.6301 6.58725 11.9689 6.79598L12.681 6.47957L13.5202 7.31879L13.2041 8.03066C13.4129 8.36955 13.5663 8.73958 13.6585 9.1268L14.385 9.40641V10.5933L13.6585 10.873C13.5663 11.2601 13.4129 11.63 13.2042 11.9688L13.5206 12.6809L12.681 13.5203L11.9691 13.2041C11.6302 13.4129 11.2602 13.5663 10.873 13.6585L10.5934 14.3851H9.4065L9.12681 13.6585C8.7397 13.5663 8.36978 13.413 8.03099 13.2042L7.31892 13.5206L6.47962 12.6811L6.79583 11.9692C6.58703 11.6303 6.43363 11.2603 6.34142 10.8731L5.61486 10.5934V9.40656L6.34142 9.12691C6.43361 8.73976 6.58699 8.3698 6.79576 8.03098L6.47935 7.31898L7.31861 6.47973L8.03068 6.79613C8.36949 6.58741 8.73942 6.43405 9.12654 6.34184L9.40622 5.61527H10.5931L10.8731 6.34168Z" fill="currentColor" />
                        </svg>{data.status === "1" ? "Disable" : "Enable"}
                    </DropdownItem>
                    <DropdownItem className={`${data.connection_status === "0" ? true : data.status === "0" ? "channel-import-button" : ""}w-100`} disabled={data.connection_status === "0" ? true : data.status === "0" ? true : false} onClick={() => history.push(CommonRouter.master_import_data, { is_channel_import: true })}>
                        <File className='me-50' size={15} /> Import Items
                    </DropdownItem>
                    <DropdownItem className='w-100'>
                        <Settings className='me-50' size={15} />Resync
                    </DropdownItem>
                    <DropdownItem className='w-100'>
                        <Trash className='me-50' size={15} />Delete
                    </DropdownItem>
                    <DropdownItem className='w-100' onClick={() => history.push(CommonRouter.channel_product_mapping, { channelData: data.channel_type })}>
                        <Sidebar className='me-50' size={15} />Product Mapping
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledButtonDropdown>
        </div>
    }

    const columns = [
        {
            header: Header.channel_name,
            accessorKey: 'channel_name',
            Cell: ({ row }) => <div><img className="channel-table-img" src={channel_logo[row.original.channel_type]} alt="" /> <Button outline className='munim-button-link-none' onClick={(e) => { e.preventDefault(); history.push(CommonRouter.channel_connection_edit, { channel_id: row.original }) }}>{row.original.channel_name}</Button></div>
        },
        {
            header: Header.last_connected,
            accessorKey: 'last_connected',
            Cell: ({ row }) => <span className='identix-font-color'>{row.original.last_connected ? moment(row.original.last_connected).format('DD-MM-YYYY') : ''}</span>,
            Filter: ({ column }) => (
                <RangeDatePicker
                    handleDateChangeFormat={(e) => { (e[0] && e[1]) && column.setFilterValue([moment(e[0]).format('DD-MM-YYYY'), moment(e[1]).format('DD-MM-YYYY')]) }}
                    handleResetDate={(e) => column.setFilterValue(e)}
                    value={column.getFilterValue()}
                />
            )
        },
        {
            header: Header.status,
            accessorKey: 'status',
            filterVariant: 'select',
            filterSelectOptions: OptionData.status_options,
            Cell: ({ row }) => <span>{row.original.status === "1" ? "Enable" : "Disable"}</span>
        },
        {
            header: Header.connection_status,
            accessorKey: 'connection_status',
            filterVariant: 'select',
            filterSelectOptions: OptionData.connection_status,
            Cell: ({ row }) => <span className={`${row.original.connection_status === "1" ? "channel-connection-connected" : "channel-connection-not-connected"}`}>{row.original.connection_status === "1" ? "Connected" : "Not connected"}</span>
        },
        {
            header: isMobile ? <div className="munim-mob-action-icon">
                <svg viewBox="0 0 45 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5911 27.9643C-0.119874 24.5008 -2.92551 12.8215 3.34367 5.1441C11.6246 -4.99641 27.2187 0.995454 28.6759 13.2076C28.7629 13.9362 28.4421 14.3403 27.7135 14.4201C26.2618 14.5886 26.3705 13.947 26.115 12.7617C25.013 7.67967 22.1784 4.48256 17.6111 3.17037C3.27298 -0.945648 -3.82266 19.5909 10.0968 25.5121C11.1135 25.9471 11.5757 26.7681 10.7547 27.6761C10.6115 27.8337 10.4246 27.9451 10.2175 27.9964C10.0104 28.0477 9.79239 28.0365 9.5911 27.9643Z" fill="currentColor" />
                    <path d="M9.45699 20.2161C7.84756 20.4172 6.67311 17.4431 6.43387 16.2469C4.40033 5.94866 19.1517 2.31112 22.1095 12.0602C22.4847 13.3107 21.892 14.3221 20.5164 13.9632C20.4324 13.9409 20.3542 13.9012 20.2867 13.8469C20.2193 13.7926 20.1641 13.7247 20.1249 13.6478C19.6029 12.5984 19.2223 11.4566 18.4339 10.6519C16.4548 8.62924 13.5621 8.19969 11.1915 9.93962C8.18286 12.1363 7.92187 15.0362 10.4085 18.6393C10.4583 18.7095 10.4931 18.7896 10.5109 18.8747C10.5287 18.9598 10.529 19.048 10.5118 19.1341C10.3886 19.7865 10.037 20.1472 9.45699 20.2161Z" fill="currentColor" />
                    <path d="M17.4306 31.4162C17.8003 31.5612 17.9145 31.4488 17.7731 31.0791C16.5008 27.7913 15.2538 24.5072 14.0323 21.2268C11.7704 15.1479 19.7088 12.3259 21.8293 19.6336C21.8384 19.6658 21.855 19.6953 21.8776 19.7198C21.9003 19.7443 21.9283 19.7629 21.9593 19.7742C21.9903 19.7854 22.0234 19.7889 22.0557 19.7843C22.0879 19.7797 22.1185 19.7672 22.1447 19.7478C23.939 18.461 25.6916 18.4954 27.4025 19.8511C27.4702 19.9055 27.555 19.9346 27.643 19.9336C27.7311 19.9327 27.8169 19.9016 27.8864 19.8457C29.6517 18.4247 31.4406 18.3849 33.253 19.7261C33.3209 19.7747 33.4022 19.8009 33.4852 19.8009C33.5681 19.8009 33.6486 19.7747 33.7152 19.7261C37.2494 17.1216 39.457 19.1823 40.7347 22.5861C41.8167 25.4515 43.4534 29.3555 44.0243 31.302C47.1833 41.9863 35.8194 48.0053 27.0219 47.9999C19.8393 47.9944 17.2675 43.5087 13.1677 37.6908C10.6992 34.1892 13.1297 29.7415 17.4306 31.4162ZM31.1053 30.0188C30.1266 30.6278 29.4361 30.4466 29.0337 29.4751C28.3758 27.8983 26.5054 21.9553 25.2385 21.3409C24.6186 21.0401 24.0912 21.1561 23.6562 21.6889C23.2285 22.2037 23.1216 22.7419 23.3355 23.3038C24.1148 25.3301 24.8706 27.3691 25.6028 29.4207C26.0378 30.655 25.7007 31.5576 24.2435 31.4271C24.1047 31.4141 23.9722 31.3624 23.8608 31.2779C23.7494 31.1934 23.6635 31.0794 23.6127 30.9486C22.0432 26.9395 20.4954 22.8996 18.9693 18.8289C18.7555 18.2598 18.364 17.872 17.7949 17.6653C17.0953 17.408 16.5787 17.6128 16.2452 18.2797C15.9444 18.8778 15.919 19.4995 16.1691 20.1447C18.4999 26.162 20.7817 32.1937 23.0147 38.24C23.0404 38.3105 23.0517 38.3854 23.048 38.4601C23.0443 38.5348 23.0255 38.6079 22.9929 38.675C22.6848 39.3057 22.1972 39.5576 21.5303 39.4307C21.3315 39.3959 21.1544 39.2869 21.0355 39.1263L17.2131 33.9989C16.6259 33.2123 15.9281 33.0999 15.1197 33.6618C14.3205 34.2218 14.3204 35.0972 14.8805 35.8856C17.2584 39.2495 18.6902 41.2432 19.1759 41.8666C24.6404 48.859 39.7723 45.1453 42.0016 36.5979C42.9694 32.8951 39.2069 25.3428 37.7714 21.7052C37.3872 20.7301 36.7528 20.5253 35.8684 21.0908C34.0143 22.2816 36.4773 26.8163 37.07 28.4855C37.3237 29.1996 37.0809 29.631 36.3414 29.7796C35.5041 29.9463 34.9495 29.6726 34.6776 28.9586C33.7605 26.5698 32.8398 24.2028 31.9155 21.8575C31.6146 21.089 31.0836 20.8625 30.3223 21.1778C29.3364 21.5874 29.0083 22.2725 29.3382 23.2331C30.0088 25.1978 30.6993 27.1679 31.4098 29.1434C31.4664 29.3022 31.4671 29.4755 31.4117 29.6347C31.3563 29.794 31.2482 29.9295 31.1053 30.0188Z" fill="currentColor" />
                </svg></div> : Header.action,
            accessorKey: 'action',
            muiTableHeadCellProps: { align: 'center' },
            muiTableBodyCellProps: { align: 'right' },
            size: isMobile ? 50 : 170,
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
    const filter_panel_field = [
        { title: Header.channel_name, name: 'channel_name', type: 'text' },
        { title: Header.last_connected, name: 'last_connected', type: 'date' },
        { title: Header.status, name: 'status', type: 'status_option', option_data: 'status_options' },
        { title: Header.connection_status, name: 'connection_status', type: 'status_option', option_data: 'connection_status' }
    ]
    const extra_filter_field = [
        { title: Header.channel_name, name: 'channel_name', type: 'text' },
        { title: Header.last_connected, name: 'last_connected', type: 'date' },
        { title: Header.status, name: 'status', type: 'status_option', option_data: 'status_options' },
        { title: Header.connection_status, name: 'connection_status', type: 'status_option', option_data: 'connection_status' }
    ]
    const column_visibility = {
        channel_name: true,
        last_connected: true,
        status: true,
        connection_status: true
    }

    return (
        <>
            <Hotkeys keyName="alt+n,enter" onKeyDown={onKeyDown} filter={() => true}></Hotkeys>
            <div className='d-flex justify-content-between align-items-center munim-list-company'>
                <div>
                    <ModuleTitle breadCrumbTitle='Channel' />
                </div>
                <div className='d-flex align-items-center gap-2'>
                    <>
                        <div className='create-mobil-btn-show desktop-device-none'>
                            <div className='mobil-creat-svg-border'>
                                <svg width="15" height="15" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" cursor='pointer' className='' onClick={(e) => { e.preventDefault(); openModule() }}>
                                    <path d="M10.8756 6.56H6.50763V10.856H4.49163V6.56H0.123625V4.664H4.49163V0.344H6.50763V4.664H10.8756V6.56Z" fill="#fff" />
                                </svg>
                            </div>
                        </div>
                        <div className='d-flex align-items-center gap-2'>
                            <Button className='add-new-user mobile-d-none' color='primary' onClick={openModule}>
                                Add Channel
                            </Button>
                        </div> </>
                </div>

            </div>
            <Fragment>
                <Card className='mt-1 mb-0 munim-card-border munim-loader-add'>
                    <div className={`react-dataTable munim-sales-inv-list munim-fixed-action munim-react-list-tble munim-last-table munim-quo-filed-left ${dataList.length === 1 || dataList.length === 0 || dataList.length < 9 ? 'munim-overflow-hidden' : 'overflow-hidden'} ${dataList.length ? '' : 'munim-no-data-found-tble'}`}>
                        <ListGridTable
                            columns={columns}
                            tableData={dataList}
                            handleFilterChange={setColumnWiseFilter}
                            columnVisibility={column_visibility}
                            isFilterApply={isFilterApply}
                            moduleId='2_4'
                            filterPanelField={filter_panel_field}
                            isNextDataAvailable={isNextDataAvailable}
                            isLoading={loading}
                            toggleSidebar={openModule}
                            setIsPageReset={setIsPageReset}
                            isPageReset={isPageReset}
                            extraFilterField={extra_filter_field}
                            initialRowData={{ field: 'channel_name', condition: '1', from_value: '', value: '', to_value: '', type: 'text' }}
                            sloganAccessRights={selected_company_object.access_rights?.includes('2_4_1')}
                            initialFreezeColumn='action'
                            isShowActionMenu={isShowActionMenu}
                            setIsShowActionMenu={setIsShowActionMenu}
                            fullScreenTitleShow={true}
                            isReportFilter={true}

                        />
                    </div>
                </Card>
            </Fragment>
            < div className="mt-2 mb-2 munim-tble-shortcutkey-main">
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
export default Channel