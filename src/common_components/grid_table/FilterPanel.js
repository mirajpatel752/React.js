import React, { useState, useEffect, Fragment } from 'react'
import Sidebar from '@components/sidebar'
import { useFormik } from "formik"
import * as yup from 'yup'
import ValidationMessage, { popUpMessage } from '../Validation'
import { Form, Row, Col, Card, Label, InputGroup, Input } from 'reactstrap'
import { debounce, handlePageRefresh } from '../../helper/commonFunction'
import FixSelect from '../search_select/FixSelect'
import OptionData from '../OptionData'
import InputTextField from '../custom_field/InputTextField'
import { Trash2 } from 'react-feather'
import CustomButton from '../custom_field/CustomButton'
import CustomReportModal from '../pop_up_modal/CustomReportModal'
import InputNumberField from '../custom_field/InputNumberField'
import InputAmountField from '../custom_field/InputAmountField'
import CustomDatePicker from '../calender/CustomDatePicker'
import MultiSelectWithoutData from '../custom_field/MultiSelectWithoutData'
import MultiSelectWithData from '../custom_field/MultiSelectWithData'
import MultipleRadioButton from '../custom_field/MultipleRadioButton'
import { useSelector } from 'react-redux'
import { ApiCall, GetApiCall } from '../../helper/axios'
import { useHistory } from 'react-router-dom'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import DiscardModal from '../pop_up_modal/DiscardModal'
import MultiSelectWithSearch from '../custom_field/MultiSelectWithSearch'
import useNotify from '../../custom_hooks/useNotify'

let isLoading = false
const FilterPanel = ({ panelOpen, fieldOption, handleFilterPanel, moduleId, isReportFilter, appliedFilter, tabId, initialRowData, saveLoader, setSaveLoader, setCurrentPage, getCustomFilterList, includeItemCheckBox, globalFilterOrButtonHide = false }) => {
    const { dateFilterCondition, numberFilterCondition, statusFilterCondition, selectFilterCondition, textFilterCondition, yes_no_options, numberFilterCustomCondition } = OptionData
    const history = useHistory()
    const notify = useNotify()
    const isFullScreen = useSelector((state) => state.listViewReducer.isFullScreen)
    const location_state = history.location.state
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const user_id = useSelector((state) => state.commonReducer.user_id)
    const user_name = useSelector((state) => state.commonReducer.user_fname_lname)
    const [finalFieldOption, setFinalFieldOption] = useState([])
    const [isDateReset, setIsDateReset] = useState(false)
    const [allApiData, setAllApiData] = useState({ search_field: '', search_value: '', search_isNext: '', search_data: [], search_page: 0 })
    const [initialState, setInitialState] = useState({
        filter_name: '',
        visibility_preference: 0,
        shared_with_user: [],
        is_filter_save: false,
        tab_id: tabId,
        filter_value: [[{ field: '', condition: '1', from_value: '', value: '', to_value: '', type: 'text' }]]
    })
    const [defaultSelectedData, setDefaultSelectedData] = useState({})
    const [isOpenCustomReportModal, setIsOpenCustomReportModal] = useState(false)
    const [isFilterReset, setIsFilterReset] = useState(false)
    const [sharedUserList, setSharedUserList] = useState([])
    const [discardPopUpActive, setDiscardPopUpActive] = useState(false)
    const filterSchema = yup.object().shape({
        filter_name: yup.string()
            .when('visibility_preference', {
                is: () => location_state?.customFilterDetail?.is_edit,
                then: yup.string()
                    .required(ValidationMessage.is_require)
            }),
        shared_with_user: yup.mixed()
            .when('visibility_preference', {
                is: visibility_preference => location_state?.customFilterDetail?.is_edit && visibility_preference === 2,
                then: yup.mixed()
                    .test({
                        message: ValidationMessage.is_require,
                        test: (value) => value && value.length
                    })
            }),
        filter_value: yup.array().of(
            yup.array().of(
                yup.object().shape({
                    from_value: yup.mixed().test({
                        message: ValidationMessage.is_require,
                        test: (value) => ((typeof value === 'number') || (typeof value === 'object' && value.value) || (value && value.length))
                    }),
                    to_value: yup.mixed()
                        .when('condition', {
                            is: condition => condition === '11',
                            then: yup.mixed()
                                .required(ValidationMessage.is_require)
                        })
                })
            )
        )
    })
    const getSharedUserData = async () => {
        if (user_id) {
            const header = { 'access-token': localStorage.getItem('access_token') }
            const res = await GetApiCall('GET', `${CommonApiEndPoint.get_company_user}?id=${selected_company_object.id}&excepted_user_id=${user_id}&module_id=${moduleId}`, header)
            if (res.data.status === 'success') {
                setSharedUserList(res.data.data)
                return res.data.data
            } else {
                setSharedUserList([])
                return []
            }
        }
    }
    /**
     * IW0079
     * Here we modify filter value and shard user data according our use before save data.
     */
    const handleSave = async (values, saveFilter) => {
        setSaveLoader(true)
        const final_filter_value = []
        let total_filter_count = 0
        values.filter_value.map((item) => {
            const filter_value = []
            total_filter_count += item.length
            item.map(data => {
                if ((data.type === 'status' || data.type === 'select') && Array.isArray(data.from_value)) {
                    const final_value = []
                    const final_selected_value = []
                    data.from_value.map(ele => {
                        final_value.push(data.type === 'status' ? ele.value : ele.text ? ele.text : ele.label)
                        final_selected_value.push(ele.value)
                    })
                    if (data.type === 'select') {
                        data.selected_values = final_selected_value
                    }
                    data.value = final_value
                } else if (data.condition === '11') {
                    data.value = [data.from_value, data.to_value]
                } else if (typeof data.from_value === 'object' && data.type === 'select') {
                    data.selected_values = [data.from_value.value]
                    data.value = data.from_value.text ? data.from_value.text : data.from_value.label
                } else {
                    data.value = data.from_value
                }
                filter_value.push(data)
            })
            final_filter_value.push(filter_value)
        })
        const final_shared_user = []
        if (values.visibility_preference === 2) {
            values.shared_with_user.map((ele) => {
                final_shared_user.push(ele.value)
            })
        }
        if (final_shared_user.length) {
            final_shared_user.push(user_id)
        }
        const data = {
            company_id: selected_company_object.id,
            ...values,
            filter_value: final_filter_value,
            shared_with_user: final_shared_user,
            module_id: moduleId,
            tab_id: tabId,
            type: isReportFilter ? '1' : '0',
            filter_count: total_filter_count,
            is_include_item_det: includeItemCheckBox

        }
        delete data['is_filter_save']
        delete data['is_filter_apply']
        if (saveFilter) {
            const header = {
                'access-token': localStorage.getItem('access_token'), id: selected_company_object.id
            }
            if (location_state?.customFilterDetail?.id) {
                data.id = location_state?.customFilterDetail?.id
                const res = await ApiCall('PUT', CommonApiEndPoint.update_filter, data, header)
                if (res.data.status === 'success') {
                    handleFilterPanel(true, { ...data, is_filter_apply: false, filter_value: '', is_filter_save: false }, false)
                    setCurrentPage(0)
                    history.replace({
                        ...history.location,
                        state: {
                            ...location_state,
                            customFilterDetail: {
                                ...location_state.customFilterDetail,
                                editMode: false,
                                filter_count: data.filter_count,
                                filter_name: data.filter_name
                            }
                        }
                    })
                    getCustomFilterList()
                } else {
                    notify(res.data.message, 'error')
                    setSaveLoader(false)
                }
            } else {
                const res = await ApiCall('POST', CommonApiEndPoint.create_filter, data, header)
                if (res.data.status === 'success') {
                    handleFilterPanel(true, { ...data, id: res.data.data.id, is_filter_apply: false, filter_value: '', is_filter_save: false }, false)
                    setCurrentPage(0)
                    history.replace({
                        ...history.location,
                        state: {
                            ...location_state,
                            customFilterDetail: {
                                editMode: false,
                                filter_count: data.filter_count,
                                filter_name: data.filter_name,
                                id: res.data.data.id,
                                is_edit: true,
                                module_id: data.module_id,
                                tab_id: data.tab_id
                            }
                        }
                    })
                } else {
                    notify(res.data.message, 'error')
                    setSaveLoader(false)
                }
            }

        } else {
            handleFilterPanel(true, { ...data, is_filter_apply: true, is_filter_save: true, shared_with_user: values.shared_with_user })
        }
    }
    const formik = useFormik({
        initialValues: initialState,
        validationSchema: filterSchema,
        enableReinitialize: true,
        onSubmit: values => {
            /** status 1 means click on save filter it's call only for create time  */
            if (formik.status && !location_state?.customFilterDetail?.is_edit) {
                getSharedUserData()
                setIsOpenCustomReportModal(true)
            } else {
                handleSave(values, formik.status)
            }
        }
    })
    /**
      * IW0079
      * This function is call to set reload site pop-up
      */
    useEffect(() => {
        if (formik.dirty) {
            window.addEventListener("beforeunload", handlePageRefresh)
        } else {
            window.removeEventListener("beforeunload", handlePageRefresh)
        }
    }, [formik.dirty])
    /**
     * IW0079
     * when filter is apply, but not saved, and user come again and change any filter we have to set is_filter_save flag to enable apply filter
     */
    const handleChangeFilterCondition = () => {
        if (formik.values.is_filter_save) {
            setIsFilterReset(false)
            formik.setFieldValue('is_filter_save', false)
        }
    }
    /**
     * IW0079
     * This function is add new row in last of particular card
     */
    const handleAndClick = (addIndex) => {
        const final_group_data = [...formik.values.filter_value[addIndex], initialRowData]
        formik.setFieldValue(`filter_value.${addIndex}`, final_group_data)
        handleChangeFilterCondition()
    }
    /**
     * IW0079
     * This function is add new card at last in filter value
     */
    const handleOrClick = () => {
        const final_group_data = [...formik.values.filter_value, [initialRowData]]
        formik.setFieldValue(`filter_value`, final_group_data)
        handleChangeFilterCondition()
    }
    /**
     * IW0079
     * This function is remove row from specific card of filter values
     */
    const handleDeleteRow = (cardIndex, rowIndex) => {
        const card_data = [...formik.values.filter_value[cardIndex]]
        card_data.splice(rowIndex, 1)
        if (card_data.length) {
            formik.setFieldValue(`filter_value.${cardIndex}`, card_data)
        } else {
            const final_filter_value = [...formik.values.filter_value]
            final_filter_value.splice(cardIndex, 1)
            formik.setFieldValue('filter_value', final_filter_value)
        }
        handleChangeFilterCondition()
    }
    /**
     * IW0079
     * tis function is called to when user close custom report modal
     * here flag and get value, we have to save filter data else just close modal
     */
    const handleCustomReportModal = (flag, value) => {
        if (flag) {
            handleSave({ ...formik.values, ...value }, formik.status)
        } else {
            setIsOpenCustomReportModal(false)
        }
    }
    /**
     * IW0079
     * This function is check that field has error and field is touched or not
     */
    const fieldValueValidation = (cardIndex, rowIndex, value) => {
        return {
            errors:
                formik.errors?.filter_value
                && formik.errors?.filter_value[cardIndex]
                && formik.errors?.filter_value[cardIndex][rowIndex]
                && formik.errors?.filter_value[cardIndex][rowIndex][value],
            touched:
                formik.touched?.filter_value
                && formik.touched?.filter_value[cardIndex]
                && formik.touched?.filter_value[cardIndex][rowIndex]
                && formik.touched?.filter_value[cardIndex][rowIndex][value]
        }
    }
    /**
     * IW0079
     * here we set all api data to set values according it
     */
    const changeAllApiData = (isNext, pageCount, field, search_value, data) => {
        setAllApiData((oldData) => {
            const field_name = search_value ? 'search' : field
            const final_data = pageCount ? [...oldData[`${field_name}_data`], ...data] : [...data]
            return { ...oldData, [`${field_name}_data`]: final_data, search_value, search_field: search_value ? field : '', [`${field_name}_page`]: pageCount, [`${field_name}_isNext`]: isNext }
        })
    }
    /**
     * IW0079
     * @param {*} field_data in this we get apiEndPoint and set field name
     * all api related this filter panel will call here and set data accordingly field name
     */
    const getAllApiData = async (field_data, searchValue = '', pageCount = 0) => {
        const header = {
            'access-token': localStorage.getItem('access_token')
        }
        const selected_ids = !searchValue ? field_data.selected_ids ? field_data.selected_ids : defaultSelectedData[field_data.api_field] ? defaultSelectedData[field_data.api_field].selected_ids : '' : ''
        if (field_data.apiEndPoint === 'get_staff_list') {
            const res = await GetApiCall('GET', `${CommonApiEndPoint[field_data.apiEndPoint]}?id=${selected_company_object.id}&limit=${pageCount}&filter=${searchValue}&selected_ids=${selected_ids}&per_page=50`, header)
            if (res.data.status === 'success' && res.data.statusCode === 200) {
                const managerData = []
                managerData.push({ value: user_id, label: `${user_name[0]} ${user_name[1]}` })
                res.data.data.map((item) => {
                    managerData.push({ value: item.id, label: `${item.fname} ${item.lname}` })
                })
                changeAllApiData(res.data.data.is_next, pageCount, field_data.api_field, searchValue, managerData)
            }
        } else {
            const res = await GetApiCall('GET', `${CommonApiEndPoint[field_data.apiEndPoint]}?id=${selected_company_object.id}&limit=${pageCount}&filter=${searchValue}&selected_ids=${selected_ids}&per_page=50`, header)
            if (res.data.status === 'success' && res.data.statusCode === 200) {
                changeAllApiData(res.data.data.is_next, pageCount, field_data.api_field, searchValue, res.data.data.row_data)
            }
        }
        isLoading = false
    }
    /**
     * IW0079
     * here we set page value when user not scroll but search and for first time when field change
     */
    const getDataRelatedField = (field_data, search_value = '', page_value) => {
        const page = page_value ? page_value : search_value ? allApiData.search_page : allApiData[`${field_data.api_field}_page`]
        getAllApiData(field_data, search_value, page)
    }
    const handleInitialState = (initialRowData) => {
        if (!location_state?.customFilterDetail?.id) {
            setInitialState({
                ...initialState,
                filter_value: [[initialRowData]]
            })
            if (appliedFilter.is_filter_apply) {
                const api_call_data = {}
                appliedFilter.filter_value.map((cardData) => {
                    cardData.map((rowData) => {
                        if (rowData.type === 'select') {
                            api_call_data[rowData.api_field] = api_call_data[rowData.api_field] ? {
                                apiEndPoint: rowData.apiEndPoint,
                                selected_ids: [...new Set([...api_call_data[rowData.api_field].selected_ids, ...rowData.selected_values])],
                                api_field: rowData.api_field
                            } : {
                                apiEndPoint: rowData.apiEndPoint,
                                selected_ids: rowData.selected_values ? [...rowData.selected_values] : '',
                                api_field: rowData.api_field
                            }
                        }
                    })
                })
                setDefaultSelectedData(api_call_data)
                Object.keys(api_call_data)?.map((key) => {
                    getDataRelatedField(api_call_data[key])
                })
                setTimeout(() => {
                    formik.setValues({ ...appliedFilter })
                }, 10)
            }
        }
    }
    /**
     * IW0079
     * Here we set field option as per user's priority in main table like first column to last column
     * also we set initial row data according first field it will help when user add new row
     */
    useEffect(() => {
        if (fieldOption.length) {
            const final_field_option = []
            fieldOption.map((ele) => {
                final_field_option.push({ value: ele.name, label: ele.title })
            })
            handleInitialState(initialRowData)
            setFinalFieldOption(final_field_option)
        }
    }, [fieldOption.length])
    /**
     * IW0079
     * to get filter detail on edit filter panel
     */
    const getFilterDetail = async () => {
        const all_user = await getSharedUserData()
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_filter_detail}?id=${location_state?.customFilterDetail?.id}`, header)
        if (res.data.status === 'success') {
            const share_with_user_value = []
            appliedFilter?.shared_with_user?.map((ele) => {
                share_with_user_value.push(ele.value)
            })
            const shared_user = appliedFilter?.shared_with_user ? all_user?.filter(ele => share_with_user_value.includes(ele.value)) : all_user?.filter(ele => res.data.data.shared_with_user.includes(ele.value))
            res.data.data.shared_with_user = shared_user
            setInitialState(res.data.data)
            const api_call_data = {}
            const current_filter_data = appliedFilter.filter_value ? appliedFilter.filter_value : res.data.data.filter_value
            current_filter_data.map((cardData) => {
                cardData.map((rowData) => {
                    if (rowData.type === 'select') {
                        api_call_data[rowData.api_field] = api_call_data[rowData.api_field] ? {
                            apiEndPoint: rowData.apiEndPoint,
                            selected_ids: [...new Set([...api_call_data[rowData.api_field].selected_ids, ...rowData.selected_values])],
                            api_field: rowData.api_field
                        } : {
                            apiEndPoint: rowData.apiEndPoint,
                            selected_ids: [...rowData.selected_values],
                            api_field: rowData.api_field
                        }
                    }
                })
            })
            setDefaultSelectedData(api_call_data)
            Object.keys(api_call_data)?.map((key) => {
                getDataRelatedField(api_call_data[key])
            })
            if (appliedFilter.filter_value) {
                setTimeout(() => {
                    formik.setValues({ ...appliedFilter })
                }, 10)
            }
        } else {
            handleFilterPanel(false)
        }
    }
    useEffect(() => {
        if (location_state?.customFilterDetail?.id) {
            getFilterDetail()
        }
    }, [location_state?.customFilterDetail?.id])
    /**
     * IW0079
     * field and sub field change here we get card and row index from name
     * and row_detail is for updated new data
     */
    const changeFieldData = (name, row_detail) => {
        const final_name = name.split('.')
        const cardIndex = Number(final_name[1])
        const rowIndex = Number(final_name[2])
        const final_card_data = [...formik.values.filter_value[cardIndex]]
        final_card_data.splice(rowIndex, 1, { ...formik.values.filter_value[cardIndex][rowIndex], ...row_detail })
        const final_filter_value = [...formik.values.filter_value]
        final_filter_value.splice(cardIndex, 1, final_card_data)
        formik.setFieldValue('filter_value', [...final_filter_value])
    }
    /**
     * IW0079
     * Here comes when user change field value here we set condition according field and remove already selected value
     */
    const handleFieldChange = (name, value) => {
        const selected_field = fieldOption.find(ele => ele.name === value)
        const type = selected_field.subField ? selected_field.subField[0].type : selected_field.type
        const condition_value = type === 'status' ? statusFilterCondition[0].value : type === 'select' ? selectFilterCondition[0].value : type === 'text' ? textFilterCondition[0].value : type === 'number' || type === 'number_option' || type === 'amount' ? numberFilterCondition[0].value : type === 'date' ? dateFilterCondition[0].value : ''
        const final_row_data = {
            to_value: '',
            from_value: condition_value === '12' || !condition_value ? '1' : '',
            field: value,
            type,
            condition: !condition_value ? '3' : condition_value,
            bal_type: selected_field.bal_type ? selected_field.bal_type : '',
            option_data: type.includes('status') || (type.includes('number_option') && selected_field.option_data) ? selected_field.option_data : '',
            subField: selected_field.subField ? selected_field.subField : [],
            sub_field: selected_field.subField ? selected_field.subField[0].name : '',
            apiEndPoint: selected_field.apiEndPoint ? selected_field.apiEndPoint : '',
            api_field: selected_field.api_field ? selected_field.api_field : ''
        }
        if (selected_field.apiEndPoint && !allApiData[`${selected_field.api_field}_data`]?.length) {
            getDataRelatedField(selected_field)
        }
        changeFieldData(name, final_row_data)
        handleChangeFilterCondition()
    }
    /**
     * IW0079
     * Here comes when user change sub field value here we set condition according sub field and remove already selected value
     */
    const handleSubFieldChange = (name, value) => {
        const sub_field_data = formik.getFieldProps(name).value
        sub_field_data.subField?.find((ele) => {
            if (ele.name === value) {
                const condition_value = ele.type === 'status' ? statusFilterCondition[0].value : ele.type === 'select' ? selectFilterCondition[0].value : ele.type === 'text' ? textFilterCondition[0].value : ele.type === 'number' || ele.type === 'amount' ? numberFilterCondition[0].value : ele.type === 'date' ? dateFilterCondition[0].value : ''
                const final_row_data = {
                    to_value: '',
                    from_value: condition_value === '12' || !condition_value ? '1' : '',
                    type: ele.type,
                    condition: !condition_value ? '3' : condition_value,
                    sub_field: value
                }
                changeFieldData(name, final_row_data)
                return true
            }
        })
        handleChangeFilterCondition()
    }
    /**
     * IW0079
     * user change condition, here we check if data is in drop down list, select first value by default.
     */
    const handleChangeCondition = (name, value) => {
        let final_name = name.split('.')
        final_name.pop()
        final_name = final_name.join('.')
        const previous_condition = formik.values[`${final_name}.condition`]
        if (value === '12') {
            formik.setFieldValue(`${final_name}.from_value`, '1')
        } else if (!((['1', '2', '9', '10'].includes(value) && ['1', '2', '9', '10'].includes(previous_condition)) || (['3', '4', '5', '6', '7', '8'].includes(previous_condition) && ['3', '4', '5', '6', '7', '8'].includes(value)) || (previous_condition === '11' && value === '11'))) {
            formik.setFieldValue(`${final_name}.from_value`, '')
            const field_data = formik.getFieldProps(final_name).value
            if (field_data.type === 'date') {
                setIsDateReset(true)
            }
        }
        formik.setFieldValue(name, value)
        handleChangeFilterCondition()
    }
    /**
     * IW0079
     * when user change from and to value
     */
    const handleChangeFieldValue = (name, value) => {
        formik.setFieldValue(name, value)
        handleChangeFilterCondition()
    }
    /**
     * IW0079
     * This call when user reset applied filter changes
     */
    const handleFilterReset = () => {
        formik.handleReset()
        if (location_state?.customFilterDetail?.id) {
            if (!formik.dirty) {
                setIsFilterReset(true)
            }
        } else {
            handleFilterPanel(true, {
                filter_name: '',
                visibility_preference: 0,
                shared_with_user: [],
                is_filter_save: false,
                tab_id: tabId,
                filter_value: [[{ field: '', condition: '1', from_value: '', value: '', to_value: '', type: 'text' }]],
                is_filter_apply: false
            })
        }
    }
    /**
     * IW0079
     * This function is call to handle discard pop-up modal for filter panel close
     */
    const handleDiscardPopUp = (flag = false) => {
        if (flag) {
            formik.handleReset()
            window.removeEventListener("beforeunload", handlePageRefresh)
            setDiscardPopUpActive(false)
            handleFilterPanel(false)
        } else {
            setDiscardPopUpActive(false)
        }
    }
    const filterPanelClose = () => {
        const is_changes = formik.dirty ? formik.values.is_filter_save : !isFilterReset
        if (!is_changes) {
            setDiscardPopUpActive(true)
        } else {
            handleFilterPanel(false)
        }
    }
    /**
     * IW0079
     * Here comes when get data using lazy loading
     */
    const handleApiPageLimit = (name, value) => {
        if (isLoading) {
            return
        }
        isLoading = true
        const field_data = formik.getFieldProps(name).value
        const page = allApiData.search_value ? allApiData.search_page : allApiData[`${field_data.api_field}_page`]
        const is_NextAvail = allApiData.search_value ? allApiData.search_isNext : allApiData[`${field_data.api_field}_isNext`]
        if (page !== value && Number(is_NextAvail)) {
            getDataRelatedField(field_data, allApiData.search_value, value)
        }
    }
    /**
     * IW0079
     * get data from api when user try to search in any field value
     */
    const searchData = (field_data, search_value) => {
        if (search_value?.length) {
            if (field_data.api_field === 'country') {
                setAllApiData((oldData) => {
                    const available_data = oldData[`${field_data.api_field}_data`].filter((ele) => ele.label.toLowerCase().includes(search_value.toLowerCase()))
                    return { ...oldData, search_field: field_data.api_field, search_value, search_isNext: '0', search_data: available_data, search_page: 0 }
                })
            } else {
                getDataRelatedField(field_data, search_value)
            }
        } else {
            setAllApiData((oldData) => {
                return { ...oldData, search_field: '', search_value: '', search_isNext: '', search_data: [], search_page: 0 }
            })
        }
    }
    const [searchState] = useState({ fn: debounce(searchData, 500) })
    const handleInputChange = (name, value) => {
        const field_data = formik.getFieldProps(name).value
        searchState.fn(field_data, value)
    }
    /**
     * IW0079
     * here come when user change field value where field get data from API
     */
    const changeValueOfApiField = (name, value) => {
        const field_data = formik.getFieldProps(name).value
        if ((['1', '2'].includes(field_data.condition) && value.length) || ['3', '4'].includes(field_data.condition)) {
            const new_added_value = ['3', '4'].includes(field_data.condition) ? value : value[value.length - 1]
            const is_available_data = allApiData[`${field_data.api_field}_data`].find(data => data.value === new_added_value.value)
            if (!is_available_data) {
                setAllApiData((oldData) => {
                    return { ...oldData, [`${field_data.api_field}_data`]: [...oldData[`${field_data.api_field}_data`], new_added_value], search_field: '', search_value: '', search_isNext: '', search_data: [], search_page: 0 }
                })
            } else {
                setAllApiData((oldData) => {
                    return { ...oldData, search_field: '', search_value: '', search_isNext: '', search_data: [], search_page: 0 }
                })
            }
            handleChangeFieldValue(`${name}.from_value`, value)
        } else {
            handleChangeFieldValue(`${name}.from_value`, [])
            setAllApiData((oldData) => {
                return { ...oldData, search_field: '', search_value: '', search_isNext: '', search_data: [], search_page: 0 }
            })
        }
    }

    useEffect(() => {
        if (panelOpen && isFullScreen) {
            const tabIndexRemove = document.querySelector(".MuiDialog-container")
            tabIndexRemove.setAttribute('tabindex', '')
        }
    }, [panelOpen, isFullScreen])


    return (
        <>
            <Sidebar
                size='half'
                open={panelOpen}
                title='Filter'
                wrapClassName='munim-sidebar'
                contentClassName='pt-0 p-0 munim-global-sidebar'
                toggleSidebar={filterPanelClose}
            >
                <Form className='p-2 munim-side-form munim-new-grid-filter'>
                    {location_state?.customFilterDetail?.is_edit && <Card className='munim-globel-card-box p-1 mb-1'>
                        <Row>
                            <Col className='mb-1 position-relative'>
                                <InputTextField
                                    value={formik.values.filter_name}
                                    placeholder='Enter name'
                                    name='filter_name'
                                    label='Name'
                                    handleChange={formik.setFieldValue}
                                    handleBlur={formik.setFieldTouched}
                                    errors={formik.errors.filter_name}
                                    touched={formik.touched.filter_name}
                                    autoComplete='off'
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md='8'>
                                <Label for='Visibility preference' className='mb-1'>
                                    Visibility preference
                                </Label>
                                <MultipleRadioButton
                                    name='visibility_preference'
                                    label={['Only Me', 'Everyone', 'Only selected users']}
                                    handleChange={formik.setFieldValue}
                                    value={formik.values.visibility_preference}
                                />
                            </Col>
                            {formik.values.visibility_preference === 2 && <>
                                <Col md='4' className='position-relative munim-side-select-invalid'>
                                    <div>
                                        <Label for='Select users'>
                                            Select users
                                        </Label>
                                        <MultiSelectWithData
                                            option={sharedUserList}
                                            handleChange={formik.setFieldValue}
                                            name='shared_with_user'
                                            value={formik.values.shared_with_user}
                                            errors={formik.errors.shared_with_user}
                                            handleBlur={formik.setFieldTouched}
                                            touched={formik.touched.shared_with_user}
                                            isOptionEqualToValue={(option, value) => { return option.value === value.value }}
                                        />
                                    </div>
                                </Col>
                            </>}
                        </Row>
                    </Card>}
                    {formik.values.filter_value.map((element, cardIndex) => <Fragment key={`filter_panel_${cardIndex}`}>
                        <Card className='munim-globel-card-box p-1 mb-0'>
                            {element.map((item, rowIndex) => <Fragment key={`filter_panel_${cardIndex}_${rowIndex}`} >
                                <div className='position-relative munim-sidebar-field d-flex gap-1 munim-sm-columm'>
                                    <div className='w-100'>
                                        <Label className='form-label' for={`filter_value.${cardIndex}.${rowIndex}.field`}>
                                            Field
                                        </Label>
                                        <FixSelect
                                            id={`filter_value.${cardIndex}.${rowIndex}`}
                                            value={item.field}
                                            options={finalFieldOption}
                                            disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                            handleChange={handleFieldChange}
                                            showToolTip={true}
                                        />
                                    </div>
                                    {item.subField?.length ? <div className='w-100'>
                                        <Label className='form-label' for={`filter_value.${cardIndex}.${rowIndex}.field`}>
                                            Sub Field
                                        </Label>
                                        <FixSelect
                                            id={`filter_value.${cardIndex}.${rowIndex}`}
                                            value={item.sub_field}
                                            options={item.subField.map(ele => { return { value: ele.name, label: ele.title } })}
                                            handleChange={handleSubFieldChange}
                                            showToolTip={true}
                                            disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                        />
                                    </div> : ''}
                                    {item.type !== 'status_option' ? <div className='w-100'>
                                        <Label className='form-label' for={`filter_value.${cardIndex}.${rowIndex}.condition`}>
                                            Condition
                                        </Label>
                                        <FixSelect
                                            id={`filter_value.${cardIndex}.${rowIndex}.condition`}
                                            value={item.condition}
                                            showToolTip={true}
                                            options={item.type === 'number_option' ? numberFilterCustomCondition : item.type === 'status' ? statusFilterCondition : item.type === 'select' ? selectFilterCondition : item.type === 'text' ? textFilterCondition : item.type === 'number' || item.type === 'amount' ? numberFilterCondition : dateFilterCondition}
                                            disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                            handleChange={handleChangeCondition}
                                        />
                                    </div> : ''}
                                    <div className={`${item.type === 'date' ? 'invalid-date-error munim-date-error' : ''} position-relative w-100`}>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <h6>
                                                {item.condition === '11' ? 'From Value' : 'Value'}
                                            </h6>
                                        </div>
                                        {item.apiEndPoint && ['1', '2', '3', '4'].includes(item.condition) ? <>
                                            <MultiSelectWithSearch
                                                value={item.from_value ? item.from_value : ['3', '4'].includes(item.condition) ? '' : []}
                                                option={allApiData.search_field === item.api_field ? allApiData.search_data : allApiData[`${item.api_field}_data`] ? allApiData[`${item.api_field}_data`] : []}
                                                handleChange={changeValueOfApiField}
                                                multipleSelect={['1', '2'].includes(item.condition)}
                                                name={`filter_value.${cardIndex}.${rowIndex}`}
                                                handleBlur={formik.setFieldTouched}
                                                dynamicClassName=''
                                                handleInputChange={handleInputChange}
                                                pageLimit={allApiData.search_field === item.api_field ? allApiData.search_page : allApiData[`${item.api_field}_page`]}
                                                setPageLimit={handleApiPageLimit}
                                                errors={fieldValueValidation(cardIndex, rowIndex, 'from_value').errors}
                                                touched={fieldValueValidation(cardIndex, rowIndex, 'from_value').touched}
                                                disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                            />
                                        </> : ['1', '2', '9', '10'].includes(item.condition) && item.type !== 'status' ? <>
                                            <MultiSelectWithoutData
                                                value={item.from_value ? item.from_value : []}
                                                handleChange={handleChangeFieldValue}
                                                name={`filter_value.${cardIndex}.${rowIndex}.from_value`}
                                                handleBlur={formik.setFieldTouched}
                                                errors={fieldValueValidation(cardIndex, rowIndex, 'from_value').errors}
                                                disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                                touched={fieldValueValidation(cardIndex, rowIndex, 'from_value').touched}
                                            />
                                        </> : ((['3', '4'].includes(item.condition) && item.type.includes('status')) || item.condition === '12' || (['3', '4', '12'].includes(item.condition) && item.option_data && item.type.includes('number_option'))) ? <>
                                            <FixSelect
                                                id={`filter_value.${cardIndex}.${rowIndex}.from_value`}
                                                value={item.from_value}
                                                options={item.condition === '12' ? yes_no_options : item.option_data ? OptionData[item.option_data] : []}
                                                disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                                handleChange={handleChangeFieldValue}
                                            />
                                        </> : item.type === 'status' ? <>
                                            <MultiSelectWithData
                                                option={OptionData[item.option_data]}
                                                handleChange={handleChangeFieldValue}
                                                name={`filter_value.${cardIndex}.${rowIndex}.from_value`}
                                                errors={formik.errors.shared_with_user}
                                                handleBlur={formik.setFieldTouched}
                                                disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                                touched={formik.touched.shared_with_user}
                                                value={item.from_value ? item.from_value : []}
                                            />
                                        </> : item.type === 'text' ? <>
                                            <InputTextField
                                                value={item.from_value}
                                                placeholder='Enter value'
                                                name={`filter_value.${cardIndex}.${rowIndex}.from_value`}
                                                handleChange={handleChangeFieldValue}
                                                handleBlur={formik.setFieldTouched}
                                                disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                                autoComplete='off'
                                                errors={fieldValueValidation(cardIndex, rowIndex, 'from_value').errors}
                                                touched={fieldValueValidation(cardIndex, rowIndex, 'from_value').touched}
                                            />
                                        </> : (item.type === 'number' || item.type === 'number_option') ? <>
                                            <InputNumberField
                                                value={item.from_value}
                                                placeholder='Enter value'
                                                name={`filter_value.${cardIndex}.${rowIndex}.from_value`}
                                                handleChange={handleChangeFieldValue}
                                                handleBlur={formik.setFieldTouched}
                                                disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                                autoComplete='off'
                                                maxLength={15}
                                                errors={fieldValueValidation(cardIndex, rowIndex, 'from_value').errors}
                                                touched={fieldValueValidation(cardIndex, rowIndex, 'from_value').touched}
                                            />
                                        </> : item.type === 'amount' ? <> <InputGroup className='input-group-merge input-op-bal-dropdown'>
                                            <InputAmountField
                                                value={item.from_value}
                                                name={`filter_value.${cardIndex}.${rowIndex}.from_value`}
                                                handleChange={handleChangeFieldValue}
                                                className='text-end'
                                                handleBlur={formik.setFieldTouched}
                                                disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                                errors={fieldValueValidation(cardIndex, rowIndex, 'from_value').errors}
                                                touched={fieldValueValidation(cardIndex, rowIndex, 'from_value').touched}
                                                autoComplete='off'
                                            />
                                            {item.bal_type ? <Input
                                                type='select'
                                                name={`filter_value.${cardIndex}.${rowIndex}.bal_type`}
                                                id={`filter_value.${cardIndex}.${rowIndex}.bal_type`}
                                                value={item.bal_type}
                                                disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                                onChange={(e) => handleChangeFieldValue(`filter_value.${cardIndex}.${rowIndex}.bal_type`, Number(e.target.value))}
                                                onBlur={() => { }}
                                            >
                                                <option value={1}>Cr</option>
                                                <option value={2}>Dr</option>
                                            </Input> : ''}
                                        </InputGroup>
                                        </> : <>
                                            <CustomDatePicker
                                                value={item.from_value}
                                                fieldVal={handleChangeFieldValue}
                                                finValApply={true}
                                                isReset={isDateReset}
                                                disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                                setFieldTouch={formik.setFieldTouched}
                                                name={`filter_value.${cardIndex}.${rowIndex}.from_value`}
                                                errors={fieldValueValidation(cardIndex, rowIndex, 'from_value').errors}
                                                touched={fieldValueValidation(cardIndex, rowIndex, 'from_value').touched}
                                            />
                                        </>}
                                    </div>
                                    {item.condition === '11' && <div className={`${item.type === 'date' ? 'invalid-date-error munim-date-error' : ''} position-relative w-100`}>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <h6>
                                                To Value
                                            </h6>
                                        </div>
                                        {item.type === 'text' ? <>
                                            <InputTextField
                                                value={item.to_value}
                                                placeholder='Enter value'
                                                name={`filter_value.${cardIndex}.${rowIndex}.to_value`}
                                                handleChange={handleChangeFieldValue}
                                                handleBlur={formik.setFieldTouched}
                                                autoComplete='off'
                                                disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                                errors={fieldValueValidation(cardIndex, rowIndex, 'to_value').errors}
                                                touched={fieldValueValidation(cardIndex, rowIndex, 'to_value').touched}
                                            />
                                        </> : item.type === 'number' ? <>
                                            <InputNumberField
                                                value={item.to_value}
                                                placeholder='Enter value'
                                                name={`filter_value.${cardIndex}.${rowIndex}.to_value`}
                                                handleChange={handleChangeFieldValue}
                                                disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                                handleBlur={formik.setFieldTouched}
                                                autoComplete='off'
                                                maxLength={15}
                                                errors={fieldValueValidation(cardIndex, rowIndex, 'to_value').errors}
                                                touched={fieldValueValidation(cardIndex, rowIndex, 'to_value').touched}
                                            />
                                        </> : item.type === 'amount' ? <>
                                            <InputGroup className='input-group-merge input-op-bal-dropdown'>
                                                <InputAmountField
                                                    value={item.to_value}
                                                    name={`filter_value.${cardIndex}.${rowIndex}.to_value`}
                                                    handleChange={handleChangeFieldValue}
                                                    disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                                    className='text-end'
                                                    handleBlur={formik.setFieldTouched}
                                                    errors={fieldValueValidation(cardIndex, rowIndex, 'to_value').errors}
                                                    touched={fieldValueValidation(cardIndex, rowIndex, 'to_value').touched}
                                                    autoComplete='off'
                                                />
                                                {item.bal_type ? <Input
                                                    disabled={true}
                                                    type='select'
                                                    id={`filter_value.${cardIndex}.${rowIndex}.bal_type_to_value`}
                                                    value={item.bal_type}
                                                >
                                                    <option value={1}>Cr</option>
                                                    <option value={2}>Dr</option>
                                                </Input> : ''}
                                            </InputGroup>
                                        </> : <>
                                            <CustomDatePicker
                                                value={item.to_value}
                                                fieldVal={handleChangeFieldValue}
                                                finValApply={true}
                                                setFieldTouch={formik.setFieldTouched}
                                                disabled={location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit}
                                                name={`filter_value.${cardIndex}.${rowIndex}.to_value`}
                                                errors={fieldValueValidation(cardIndex, rowIndex, 'to_value').errors}
                                                touched={fieldValueValidation(cardIndex, rowIndex, 'to_value').touched}
                                            />
                                        </>}
                                    </div>}
                                    <div className='position-absolute munim-global-card-delete'>
                                        {(location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit) || (formik.values.filter_value.length === 1 && element.length === 1) ? '' : <Trash2 role='button' size={16} onClick={() => handleDeleteRow(cardIndex, rowIndex)} />}
                                    </div>
                                </div>
                                {(element.length - 1) === rowIndex ? location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit ? '' : <div className='munim-cancel munim-attchment-btn mt-1 mb-0'>
                                    <CustomButton type='button' outline color='secondary' label='AND' handleClick={() => handleAndClick(cardIndex)} />
                                </div> : <div className='munim-horizontal-and-or my-1' >
                                    <p className='fw-bold'>
                                        AND
                                    </p>
                                </div>}
                            </Fragment>
                            )}
                        </Card>
                        {!globalFilterOrButtonHide ? (formik.values.filter_value.length - 1) === cardIndex ? location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit ? '' : <div className='px-1 munim-cancel munim-attchment-btn mt-1 mb-0'>
                            <CustomButton type='button' outline color='secondary' label='OR' handleClick={() => handleOrClick()} />
                        </div> : <div className='munim-horizontal-and-or my-1' >
                            <p className='fw-bold'>
                                OR
                            </p>
                        </div> : ''}
                    </Fragment>
                    )}
                </Form>
                {isOpenCustomReportModal ? <CustomReportModal isOpen={isOpenCustomReportModal} sharedUserList={sharedUserList} handleModal={handleCustomReportModal} saveLoader={saveLoader} /> : ''}
                {location_state?.customFilterDetail?.id && !location_state.customFilterDetail.is_edit ? "" : <div className='d-flex justify-content-between munim-bb-btn-group munim-save position-absolute w-100 border-top p-2 munim-global-card-footer flex-wrap gap-1'>
                    <CustomButton className='me-1' outline color='secondary' type='button' disabled={!formik.dirty} handleClick={() => { setIsDateReset(true); handleFilterReset() }} label={location_state?.customFilterDetail?.id ? 'Reset' : 'Remove All'} tabIndex="-1" />
                    <div>
                        {/* 
                        *iw0110
                        *hide this button because no need
                        <CustomButton className='me-1' color='primary' type='button' disabled={!formik.dirty} handleClick={() => { formik.setStatus(1); formik.handleSubmit() }} label={isReportFilter ? 'Save Custom Report' : 'Save Custom List'} loader={formik.status && !isOpenCustomReportModal ? saveLoader : ''} /> 
                        */}
                        <CustomButton className='me-1' color='primary' type='button' disabled={formik.dirty ? formik.values.is_filter_save : !isFilterReset} handleClick={() => { formik.setStatus(0); formik.handleSubmit() }} label='Apply Filter' loader={!formik.status ? saveLoader : ''} />
                    </div>
                </div>}
            </Sidebar>
            <DiscardModal
                discardPopUpActive={discardPopUpActive}
                popUpTitle={popUpMessage.discard_title}
                secondaryLabel='Cancel'
                popUpContent={popUpMessage.discard_content}
                primaryLabel='Discard changes'
                handleDiscardPopUp={handleDiscardPopUp}
            />
        </>
    )
}

export default FilterPanel
