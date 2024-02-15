import React, { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, Card, CardTitle, ListGroup, ListGroupItem, UncontrolledCollapse } from "reactstrap"
import Header from "../../common_components/HeaderTitle"
import ModuleTitle from "../../common_components/ModuleTitle"
import { GetApiCall } from "../../helper/axios"
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { handleMenuCollapsed } from '@store/layout'
import { debounce } from '../../helper/commonFunction'
import CommonApiEndPoint from "../../helper/commonApiEndPoint"
import CommonRouter from "../../helper/commonRoute"
import { useHistory } from "react-router-dom"
import ListGridTable from "../../common_components/grid_table/ListGridTable"
import moment from "moment"
import OptionData from "../../common_components/OptionData"

const CustomerOutstanding = () => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const user_name = useSelector((state) => state.commonReducer.user_name)
    const user_mobile = useSelector((state) => state.commonReducer.user_mobile)
    const dispatch = useDispatch()
    const history = useHistory()
    const location_state = history.location.state
    const [dataList, setDataList] = useState([])
    const [loading, setLoading] = useState(true)
    const [columnWiseFilter, setColumnWiseFilter] = useState({})
    const [isFilterApply, setIsFilterApply] = useState(false)
    const [isNextDataAvailable, setIsNextDataAvailable] = useState()
    const [userData, setUserData] = useState({})
    const action_activity = [
        '',
        'Create',
        'Update',
        'Delete',
        'Cancel',
        'Upload',
        'Attach',
        'Create-attach',
        'Update-attach',
        'Remove-attach',
        'Import',
        'User',
        'Permission',
        'Invitation',
        'Print',
        'Active',
        'Deactive'
    ]
    useEffect(() => {
        dispatch(handleMenuCollapsed(true))
    }, [])
    /**
     * IW0110
     * This function is call on get activity list
     */
    const fetchData = async (otherFilter, availableData, filter_id) => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_user_activity}?id=${selected_company_object.id}&limit=${otherFilter.currentPage}&order_field=${otherFilter.sorting[0]?.id}&order_by=${otherFilter.sorting[0]?.id ? otherFilter.sorting[0]?.desc ? 'desc' : 'asc' : ''}&col_filter=${otherFilter.columnFilters.length ? encodeURIComponent(JSON.stringify(otherFilter.columnFilters)) : ''}&per_page=50&filter_id=${!otherFilter.is_filter_apply && filter_id ? filter_id : otherFilter.id ? otherFilter.id : ''}&filter_data=${otherFilter.is_filter_apply ? encodeURIComponent(JSON.stringify(otherFilter.filter_value)) : ''}`, header)
        if (res.data.status === 'success' && res.data.data.row_data?.length > 0) {
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
                    action: 1,
                    activity_details: [],
                    activity_log: '',
                    created: '',
                    mobile: '',
                    module: '',
                    user_name: ''
                })
            }
            setDataList(final_data)
            setIsNextDataAvailable(Number(res.data.data.is_next))
            setUserData(res.data.data.user_data)
            setLoading(false)
            setIsFilterApply(false)
        } else if (res.data.statusCode === 404) {
            if (!otherFilter.currentPage) {
                setIsFilterApply(true)
            }
            setIsNextDataAvailable(false)
            setDataList([])
            setUserData({})
            setLoading(false)
        } else {
            setLoading(false)
        }
    }
    /**
     * IW0110
     * This function is called when user search to get any activity data
     */
    const handleSearch = (columnWiseFilter, availableData, filter_id) => {
        fetchData(columnWiseFilter, availableData, filter_id)
    }
    const [searchState] = useState({ fn: debounce(handleSearch, 500) })
    const handleFilter = (columnWiseFilter, availableData, filter_id) => {
        searchState.fn(columnWiseFilter, availableData, filter_id)
    }
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
    /**
     * IW0110
     * This function is handle view less or more data
     */
    const changeButtonText = (id) => {
        const button_text = document.getElementById(`btn_${id}`).innerText
        document.getElementById(`btn_${id}`).innerText = button_text === 'View Less' ? 'View More' : 'View Less'
    }
    /**
     * IW0110
     * This function is return activity details
     */
    const activityDetails = ({ buttonLabel, data, id }) => {
        return (
            <Fragment>
                <Button size='sm' color='primary' className='border-0' id={`btn_${id}`} onClick={() => changeButtonText(id)} outline >
                    {buttonLabel}
                </Button>
                <UncontrolledCollapse toggler={`btn_${id}`}>
                    <ListGroup className='' flush>
                        {data.map((item, index) => <ListGroupItem className='list-group-item justify-content-between pt-0' key={`listGroupItem_${index}`}>
                            <span>
                                <span className='munim-activity-log'>{item.old} <b>{item.old !== '' && item.new !== '' ? 'to ' : ''}{item.old.includes('Amount') && !isNaN(item.new) && item.new ? Number(item.new).toFixed(selected_company_object.decimal_places) : item.new}.</b></span>
                            </span>
                        </ListGroupItem>
                        )}
                    </ListGroup>
                </UncontrolledCollapse>
            </Fragment>
        )
    }
    const columns = [
        {
            header: Header.activity,
            accessorKey: 'activity_log',
            size: 400,
            enableSorting: false,
            Cell: ({ row }) => <span>{row.original.show_loader ? '' : row.original.activity_log ? <><span dangerouslySetInnerHTML={{ __html: row.original.activity_log?.replace('{{user_name}}', user_name ? user_name : user_mobile) }} /><div className='view-more-less-more-button'>
                {row.original.activity_details.length > 0 ? activityDetails({ buttonLabel: 'View More', data: row.original.activity_details, id: row.index + 1 }) : ''}
            </div></> : '-'}</span>
        },
        {
            header: Header.module,
            accessorKey: 'module',
            Cell: ({ row }) => <span>{row.original.show_loader ? '' : row.original.module ? row.original?.module : '-'}</span>
        },
        {
            header: Header.operation,
            accessorKey: 'action',
            filterVariant: 'select',
            filterSelectOptions: OptionData.activity_operation_option,
            Cell: ({ row }) => <span>{row.original.show_loader ? '' : row.original.action ? action_activity[row.original?.action] : '-'}</span>
        },
        {
            header: Header.user,
            accessorKey: 'user_id',
            enableColumnFilter: false,
            Cell: ({ row }) => <span>{row.original.show_loader ? '' : row.original.user_id ? userData[row.original.user_id] : '-'}</span>
        },
        {
            header: Header.date_and_time,
            accessorKey: 'created',
            enableColumnFilter: false,
            Cell: ({ row }) => <span>{row.original.show_loader ? '' : row.original.created ? moment(row.original.created).format('MMMM Do YYYY, h:mm a') : ''}</span>
        }
    ]
    const filter_panel_field = [
        { title: Header.activity, name: 'activity_log', type: 'text' },
        { title: Header.module, name: 'module', type: 'text' },
        { title: Header.operation, name: 'action', type: 'status_option', option_data: 'activity_operation_option' },
        // { title: Header.user, name: 'user_id', type: 'amount' },
        { title: Header.date_and_time, name: 'created', type: 'date' }
    ]
    const activityNameSet = () => {
        return (
            <CardTitle tag='h4' className='mt-1'>
                {'User Activity'}
            </CardTitle>
        )
    }

    return (
        <>
            <div className="munim-list-company d-flex align-items-center">
                <ModuleTitle
                    breadCrumbTitle='User Activity'
                    links={[CommonRouter.setting]}
                />
            </div >
            <Fragment>
                <Card className='mt-1 munim-card-border munim-loader-add'>
                    <div className={`react-dataTable munim-sales-inv-list munim-web-report munim-tble-auto munim-quo-filed-left ${loading && columnWiseFilter.currentPage ? `munim-gridview-overflow` : ''} ${dataList.length ? '' : 'munim-no-data-found-tble'}`}>
                        <ListGridTable
                            columns={columns}
                            tableData={dataList}
                            handleFilterChange={setColumnWiseFilter}
                            isFilterApply={isFilterApply}
                            moduleId='10_1'
                            filterPanelField={filter_panel_field}
                            isNextDataAvailable={isNextDataAvailable}
                            isLoading={loading}
                            groupingExpanded={true}
                            fullScreenTitleShow={true}
                            tabShow={activityNameSet}
                            initialRowData={{ field: 'activity_log', condition: '1', from_value: '', value: '', to_value: '', type: 'text' }}
                        />
                    </div>
                </Card>
            </Fragment>
        </>
    )
}
export default CustomerOutstanding
