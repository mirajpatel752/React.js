/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unneeded-ternary */

import React, { useState, useEffect } from "react"
import { Button, Card, Badge } from "reactstrap"
import ModuleTitle from "../../common_components/ModuleTitle"
import CommonRouter from "../../helper/commonRoute"
import { GetApiCall } from "../../helper/axios"
import CommonApiEndPoint from "../../helper/commonApiEndPoint"
import { useSelector } from 'react-redux'
import { useHistory } from "react-router-dom"
import moment from 'moment'
import Header from '../../common_components/HeaderTitle'
import ListGridTable from '../../common_components/grid_table/ListGridTable'
import { Download } from 'react-feather'
import ImportLogProgress from "../dashboard/component/ImportLogProgress"
import { bucketPathUrl } from "../../helper/commonApi"
import { debounce } from "../../helper/commonFunction"
import OptionData from "../../common_components/OptionData"
import RangeDatePicker from "../../common_components/calender/RangeDatePicker"
const ImportData = () => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const history = useHistory()
    const location_state = history.location.state
    const [fileLogData, setFileLogData] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isNextDataAvailable, setIsNextDataAvailable] = useState()
    const [resetCurrentPage, setResetCurrentPage] = useState(false)
    const [progressVal, setProgressVal] = useState(0)
    const [totalFileCount, setTotalFileCount] = useState(0)
    const [successFileCount, setSuccessFileCount] = useState(0)
    const [progressShow, setProgressShow] = useState(false)
    const [columnWiseFilter, setColumnWiseFilter] = useState({})
    const [isFilterApply, setIsFilterApply] = useState(false)
    const [isPageReset, setIsPageReset] = useState(false)
    const fetchData = async (otherFilter, availableData) => {
        setIsLoading(true)
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_import_log_list}?id=${selected_company_object.id}&limit=${otherFilter.currentPage}&per_page=${50}&col_filter=${otherFilter?.columnFilters?.length ? encodeURIComponent(JSON.stringify(otherFilter.columnFilters)) : ''}&order_field=${otherFilter?.sorting?.length && otherFilter?.sorting[0]?.id}&order_by=${otherFilter?.sorting && otherFilter?.sorting[0]?.id ? otherFilter?.sorting[0]?.desc ? 'desc' : 'asc' : ''}&filter_data=${otherFilter?.is_filter_apply ? encodeURIComponent(JSON.stringify(otherFilter?.filter_value)) : ''}`, header)
        if (res.data.status === 'success') {
            let final_data = []
            res.data.data.row_data.map((row) => {
                final_data.push({ ...row })
            })
            if ((res.data.data.is_next) && otherFilter.currentPage) {
                final_data.push({
                    show_loader: true,
                    org_file_name: '',
                    filing_type: '',
                    select_period: '',
                    status: '',
                    success_ctn: '',
                    error_ctn: '',
                    error_file: '',
                    check_sheet: '',
                    created: ''
                })
            }
            if (otherFilter.currentPage) {
                const previous_data = [...availableData]
                final_data = [...previous_data, ...final_data]
                final_data.pop()
            }
            setFileLogData(final_data)
            setIsNextDataAvailable(Number(res.data.data.is_next))
            setIsLoading(false)
            setIsFilterApply(false)
        } else {
            if (!otherFilter.currentPage) {
                setIsFilterApply(true)
            }
            setFileLogData([])
            setIsNextDataAvailable(0)
            setIsLoading(false)
        }
    }

    const getImportFileLogListData = async (flag = false) => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_import_progress}?id=${selected_company_object.id}`, header)
        if (res.data.status === 'success') {
            setProgressVal(res.data.data.import_progress_per)
            setTotalFileCount(res.data.data.total_file_count)
            setSuccessFileCount(res.data.data.total_import_file)
            if (res.data.data.import_progress_per === 100) {
                setProgressShow(false)
                if (!flag) {
                    setTimeout(() => {
                        handleFilter({ currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' })
                    }, 1000)
                }
            }
            if (res.data.data.import_progress_per !== 100 && res.data.data.import_progress_per !== undefined && res.data.data.import_progress_per !== null && history.location.pathname.includes("imported-file-log")) {
                if (res.data.data.show_progressbar_status !== 0) {
                    setTimeout(() => {
                        getImportFileLogListData()
                    }, 2000)
                }
                if (res.data.data.show_progressbar_status === 1) {
                    setProgressShow(true)
                }
            }
        }
    }
    const handleDownloadErrorFile = (value) => {
        window.open(`${bucketPathUrl}import_data/error_import/channel_item_import/${value}`, '_blank')
    }
    const handleSearch = (columnWiseFilter, availableData, filter_id) => {
        fetchData(columnWiseFilter, availableData, filter_id)
    }
    const [searchState] = useState({ fn: debounce(handleSearch, 500) })
    const handleFilter = (columnWiseFilter, availableData, filter_id) => {
        searchState.fn(columnWiseFilter, availableData, filter_id)
    }
    useEffect(() => {
        if (fileLogData.length) {
            handleFilter(columnWiseFilter, fileLogData)
        }
    }, [columnWiseFilter.currentPage])

    useEffect(() => {
        if ((fileLogData.length || isFilterApply) || (selected_company_object.id && !fileLogData.length)) {
            const final_column_filter = Object.keys(columnWiseFilter).length ? columnWiseFilter : { currentPage: 0, sorting: [{ id: '', desc: false }], columnFilters: [], is_filter_apply: false, filter_value: '' }
            handleFilter(final_column_filter, fileLogData, location_state?.customFilterDetail?.id)
        }
    }, [selected_company_object.id, columnWiseFilter, location_state])

    useEffect(() => {
        getImportFileLogListData(true)
    }, [])
    const openModule = () => {
        history.push(CommonRouter.menu_import_file_log)
    }


    const columns = [
        {
            header: Header.sr_no,
            enableResizing: false,
            enableHiding: false,
            enableColumnFilter: false,
            enableColumnActions: false,
            accessorKey: 'id',
            Cell: ({ row }) => <span>{row.original.show_loader ? '' : row.index + 1}</span>
        },
        {
            header: Header.file_name,
            accessorKey: 'file_name',
            Cell: ({ row }) => <span>{row.original.file_name}</span>
        },
        {
            header: Header.channel_name,
            accessorKey: 'channel_type',
            filterVariant: 'select',
            filterSelectOptions: OptionData.channel_options,
            Cell: ({ row }) => <span>{row.original.channel_type === "1" ? "Flipkart" : row.original.channel_type === "2" ? "Amazon" : row.original.channel_type === "3" ? "Meesho" : row.original.channel_type === "4" ? "Ajio" : row.original.channel_type === "5" ? "JioMart" : row.original.channel_type === "6" ? "Myntra" : row.original.channel_type === "7" ? "ebay" : row.original.channel_type === "8" ? "ShopClues" : row.original.channel_type === "9" ? "Snapdeal" : row.original.channel_type === "10" ? "Shopee" : row.original.channel_type === "11" ? "Limeroad" : row.original.channel_type === "12" ? "Shopify" : "-"}</span>
        },
        {
            header: Header.status,
            accessorKey: 'status',
            filterVariant: 'select',
            filterSelectOptions: OptionData.import_status_option,
            Cell: ({ row }) => <span>{row.original.status === "0" ? <Badge pill color='light-primary' className='badge-color-top me-1'>Pending</Badge> : row.original.status === "1" ? <Badge pill color='light-info' className='me-1'>In Progress</Badge> : row.original.status === "2" ? <Badge pill color='light-success' className=''>Success</Badge> : row.original.status === "3" ? <Badge pill color='light-danger' className='me-1'>Failed</Badge> : row.original.status === '4' ? <Badge pill color='light-warning' className='me-1'>Partial Success</Badge> : <Badge pill color='light-danger' className='me-1'>Invalid file template</Badge>}</span>
        },
        {
            header: Header.success_count,
            accessorKey: 'success_count',
            Cell: ({ row }) => <span>{row.original.success_count?.length ? row.original.success_count : "0"}</span>
        },
        {
            header: Header.fail_count,
            accessorKey: 'error_count',
            Cell: ({ row }) => <span>{row.original.error_count?.length ? row.original.error_count : "0"}</span>
        },
        {
            header: Header.user,
            accessorKey: 'user_name',
            Cell: ({ row }) => <span>{row.original.user_name}</span>
        },
        {
            header: Header.download_file,
            accessorKey: 'error_file',
            enableSorting: false,
            enableColumnFilter: false,
            enableColumnActions: false,
            Cell: ({ row }) => <span>{
                row.original.status === "2" ? "" : row.original.status === "0" ? "" : <Button outline className='w-100 munim-button-link-none' onClick={(e) => { e.preventDefault(); handleDownloadErrorFile(row.original.error_file) }}>
                    <Download size={14} className='me-50' />
                    Download
                </Button>}
            </span>
        },
        {
            header: Header.date_and_time,
            accessorKey: 'created',
            Cell: ({ row }) => <span>{moment(row.original.created).format("DD-MM-YYYY hh:mm A")}</span>,
            Filter: ({ column }) => (
                <RangeDatePicker
                    handleDateChangeFormat={(e) => { (e[0] && e[1]) && column.setFilterValue([moment(e[0]).format('DD-MM-YYYY'), moment(e[1]).format('DD-MM-YYYY')]) }}
                    handleResetDate={(e) => column.setFilterValue(e)}
                    value={column.getFilterValue()}
                />
            )
        }
    ]

    const filter_panel_field = [
        { title: Header.file_name, name: 'file_name', type: 'text' },
        { title: Header.channel_type, name: 'channel_type', type: 'status_option', option_data: 'channel_options' },
        { title: Header.status, name: 'status', type: 'status_option', option_data: 'import_status_option' },
        { title: Header.success_count, name: 'success_count', type: 'number' },
        { title: Header.fail_count, name: 'error_count', type: 'number' },
        { title: Header.user, name: 'user_name', type: 'text' },
        { title: Header.date_and_time, name: 'created', type: 'date' }
    ]

    const masterItemNameSet = () => {
        return (<>
            <CardTitle tag='h4' className='mt-1'>
                {'Import Log'}
            </CardTitle>
        </>
        )
    }

    return (
        <>
            {
                progressShow && <ImportLogProgress setProgressShow={setProgressShow} progressVal={progressVal} totalFileCount={totalFileCount} successFileCount={successFileCount} />
            }
            <div className='d-flex justify-content-between align-items-center munim-user-activity-header'>
                <div className='flex-1 mobile-flex-unset'>
                    <ModuleTitle breadCrumbTitle='Import Data' links={[CommonRouter.setting]} active={'1'} section={5} module={'3'} status={{ color: 'light-success', status: 'Received' }} />
                </div>
            </div>
            <Card className='mt-1 munim-card-border'>
                <div className="table-responsive munim-horizontal-scroll-hide munim-table-br">
                    <div className={`mb-0 ${fileLogData.length < 9 ? 'munim-overflow-hidden' : 'overflow-hidden'}`}>
                        <div className={`react-dataTable munim-unit-tble invoice-data-table-height munim-fixed-action munim-quo-filed-left munim-react-list-tble ${!isLoading && fileLogData.length ? '' : 'munim-no-data-found-tble'}`}>
                            <ListGridTable
                                filterPanelField={filter_panel_field}
                                columns={columns}
                                handleFilterChange={setColumnWiseFilter}
                                tableData={fileLogData}
                                isFilterApply={isFilterApply}
                                showTopToolbar={false}
                                initialFreezeColumn='action'
                                isReportFilter={true}
                                isLoading={isLoading}
                                toggleSidebar={openModule}
                                setIsPageReset={setIsPageReset}
                                isPageReset={isPageReset}
                                initialRowData={{ field: 'file_name', condition: '1', from_value: '', value: '', to_value: '', type: 'text' }}
                                isNextDataAvailable={isNextDataAvailable}
                                footerId='import_log'
                                tabShow={masterItemNameSet}
                                loaderRemoveOn={20}
                                resetCurrentPage={resetCurrentPage}
                                setResetCurrentPage={setResetCurrentPage}
                                fullScreenTitleShow={true}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </>

    )
}
export default ImportData
