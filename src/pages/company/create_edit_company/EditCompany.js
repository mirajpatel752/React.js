/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import { useFormik } from "formik"
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import ValidationMessage, { popUpMessage } from '../../../common_components/Validation'
import { ApiCall, GetApiCall } from '../../../helper/axios'
import CustomButton from '../../../common_components/custom_field/CustomButton'
import useNotify from '../../../custom_hooks/useNotify'
import Hotkeys from 'react-hot-keys'
import { Card, Form, Label, Row, Col, Spinner, CardBody, Button } from 'reactstrap'
import ModuleTitle from '../../../common_components/ModuleTitle'
import { setSelectedCompanyObject } from '../../../redux/commonSlice'
import { setShowHeaderAction } from '../../../redux/headerActionSlice'
import { RouterPrompt } from '../../../common_components/RouterPrompt'
import DiscardModal from '../../../common_components/pop_up_modal/DiscardModal'
import { changeDateSeparator, getCityData, getDetectOs, getJsDate, getStateData, handlePageRefresh } from '../../../helper/commonFunction'
import CustomDatePicker from '../../../common_components/calender/CustomDatePicker'
import InputTextField from '../../../common_components/custom_field/InputTextField'
import InputEmailField from '../../../common_components/custom_field/InputEmailField'
import moment from 'moment'
import OptionData from '../../../common_components/OptionData'
import HelpTooltip from '../../../common_components/tooltip/HelpTooltip'
import FixSelect from '../../../common_components/search_select/FixSelect'
import CommonApiEndPoint from '../../../helper/commonApiEndPoint'
import CommonRouter from '../../../helper/commonRoute'
import InputNumberField from '../../../common_components/custom_field/InputNumberField'
import commonRegex from '../../../helper/constants'
import { munimApiEndpoint } from '../../../helper/commonApi'
import LocationList from '../location_list/LocationList'

const EditCompany = () => {
    const { country_options, organization_option, registration_type_options } = OptionData
    const history = useHistory()
    const notify = useNotify()
    const dispatch = useDispatch()
    const detectOs = getDetectOs(navigator.platform)
    const today_date = useSelector((state) => state.commonReducer.today_date)
    const user_id = useSelector((state) => state.commonReducer.user_id)
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const location_state = history.location.state
    const [saveLoader, setSaveLoader] = useState(false)
    const [loaderStatus, setLoaderStatus] = useState(true)
    const [stateList, setStateList] = useState([])
    const [gstDisable, setGstDisable] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [discardPopUpActive, setDiscardPopUpActive] = useState(false)
    const [isGstChange, setIsGstChange] = useState(false)
    const [errorPincode, setErrorPincode] = useState('')
    const [isReset, setIsReset] = useState(true)
    const [cityList, setCityList] = useState([])
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const companySchema = yup.object().shape({
        gst_in: yup.string().trim()
            .matches(commonRegex.gst_no, ValidationMessage.gst_valid)
            .when('registration_type', {
                is: (registration_type) => ['1', '2'].includes(registration_type),
                then: yup.string().trim()
                    .required(ValidationMessage.is_require)
            }),
        company_name: yup.string().trim().required(ValidationMessage.is_require),
        pan_no: yup.string().trim()
            .matches(commonRegex.pan_no, ValidationMessage.pan_valid)
            .when('registration_type', {
                is: (registration_type) => ['1', '2'].includes(registration_type),
                then: yup.string().trim()
                    .required(ValidationMessage.is_require)
            }),
        address_line1: yup.string().trim()
            .when('registration_type', {
                is: (registration_type) => ['1', '2'].includes(registration_type),
                then: yup.string().trim()
                    .required(ValidationMessage.is_require)
            }),
        pincode: yup.string().trim()
            .required(ValidationMessage.is_require)
            .min(6, ValidationMessage.valid_pincode)
            .max(6, ValidationMessage.valid_pincode),
        mobile: yup.string().trim()
            .matches(commonRegex.mobile_no, ValidationMessage.mn_not_valid)
            .required(ValidationMessage.is_require),
        email: yup.string().trim()
            .required(ValidationMessage.is_require)
            .email(ValidationMessage.valid_email)
            .matches(commonRegex.emailRegex, ValidationMessage.valid_email)
            .max(255),
        phone: yup.string().trim()
            .matches(commonRegex.phone, ValidationMessage.phn_valid),
        city: yup.string().trim().required(ValidationMessage.is_require),
        establishment_date: yup.date()
            .required(ValidationMessage.is_require)
            .max(new Date(today_date), ValidationMessage.future_date_allow)
    })
    const [initialState, setInitialState] = useState({
        company_name: '',
        org_type: '',
        industry_type: '',
        address_line1: '',
        address_line2: '',
        country: 101,
        state: location_state?.company_id ? '' : 12,
        city: '',
        pincode: '',
        phone: '',
        mobile: '',
        email: '',
        logo: '',
        signature: '',
        gst_in: '',
        pan_no: '',
        legal_name: '',
        alias_name: '',
        registration_type: '1',
        party_type: '1',
        gst_applied_from: '',
        establishment_date: '',
        base_currency: 1,
        userGetOtp: false,
        show_alias_name: false,
        is_gst_verified: true
    })
    const formik = useFormik({
        initialValues: initialState,
        validationSchema: companySchema,
        onSubmit: (value) => {
            updateCompanyDetail(value)
        },
        enableReinitialize: true
    })

    const aliasNameCheck = async (flag, com_name, alias_name, name) => {
        formik.setFieldTouched(name)
        if (com_name !== '') {
            const header = { 'access-token': localStorage.getItem('access_token') }
            const data = {
                id: location_state?.company_id,
                company_name: com_name,
                alias_name
            }
            const res = await ApiCall('POST', CommonApiEndPoint.check_company_name, data, header)
            if (res.data.statusCode === 200) {
                if (flag) {
                    return res.data.data
                } else {
                    formik.setFieldValue('show_alias_name', res.data.data)
                }
            }
        }
    }

    const getCompanyDetail = async () => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.company_details}?id=${location_state?.company_id}`, header)
        if (res.data.status === 'success' && res.data.statusCode === 200) {
            let show_alias_name
            if (!history.location.pathname.includes('view')) {
                show_alias_name = await aliasNameCheck(true, res.data.data.company_name, res.data.data.alias_name)
            } else {
                show_alias_name = false
            }
            res.data.data.userGetOtp = false
            res.data.data.show_alias_name = show_alias_name
            res.data.data.establishment_date = moment(res.data.data.establishment_date).format('YYYY-MM-DD')
            setInitialState({ ...res.data.data })
            setGstDisable(res.data.data.gst_in && res.data.data.gst_disabled)
            if (!history.location.pathname.includes('view')) {
                getCityList(res.data.data.state)
            } else {
                setCityList([{ value: res.data.data.city, label: res.data.data.city_name }])
                setStateList([{ value: res.data.data.state, label: res.data.data.state_name }])
            }
            setLoaderStatus(false)
        } else if (res.data.status === 'error') {
            history.replace(CommonRouter.company)
        }
    }
    const updateCompanyDetail = async () => {
        setSaveLoader(true)
        const data = {
            id: location_state?.company_id,
            address_line1: formik.values.address_line1,
            address_line2: formik.values.address_line2,
            alias_name: formik.values.alias_name,
            city: formik.values.city,
            country: formik.values.country,
            email: formik.values.email,
            gst_applied_from: formik.values.gst_applied_from ? moment(formik.values.gst_applied_from).format('YYYY-MM-DD') : '',
            legal_name: formik.values.legal_name,
            mobile: formik.values.mobile,
            company_name: formik.values.company_name.trim(),
            pan_no: formik.values.pan_no,
            pincode: formik.values.pincode,
            registration_type: formik.values.registration_type,
            state: formik.values.state,
            establishment_date: moment(formik.values.establishment_date).format('YYYY-MM-DD'),
            gst_in: formik.values.gst_in
        }
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await ApiCall('PUT', CommonApiEndPoint.update_company, data, header)
        if (res.data.status === 'success' && res.data.statusCode === 200) {
            if (!formik.values.is_gst_verified && initialState.is_gst_verified !== formik.values.is_gst_verified) {
                const data = {
                    company_id: location_state?.company_id,
                    gstin: formik.values.gst_in,
                    entity_type: '0',
                    entity_id: location_state?.company_id,
                    user_id
                }
                await ApiCall('POST', CommonApiEndPoint.without_verify_gstin, data, header)
            }
            notify(res.data.message, 'success')
            setInitialState(formik.values)
            if (selected_company_object.id === location_state?.company_id) {
                const company_object = { ...selected_company_object }
                company_object.mobile = formik.values.mobile
                company_object.email = formik.values.email
                company_object.address_line1 = formik.values.address_line1
                company_object.address_line2 = formik.values.address_line2
                company_object.pincode = formik.values.pincode
                company_object.company_name = formik.values.company_name
                company_object.alias_name = formik.values.alias_name
                company_object.establishment_date = moment(formik.values.establishment_date).format('YYYY-MM-DD')
                company_object.state_id = formik.values.state
                company_object.state = document.getElementsByClassName('ant-select-selection-item')[6]?.innerHTML
                company_object.country = formik.values.country
                company_object.pan_no = formik.values.pan_no
                company_object.gst_applied_from = formik.values.gst_applied_from ? moment(formik.values.gst_applied_from).format('YYYY-MM-DD') : ''
                company_object.gst_in = formik.values.gst_in
                company_object.registration_type = formik.values.registration_type
                company_object.organaization_type = formik.values.org_type
                company_object.party_type = formik.values.party_type
                dispatch(setSelectedCompanyObject(company_object))
            }
            formik.handleReset()
            formik.setSubmitting(false)
            setSaveLoader(false)
            window.removeEventListener("beforeunload", handlePageRefresh)
            history.push(CommonRouter.company)
        } else {
            formik.setSubmitting(false)
            notify(res.data.message, 'error')
            setSaveLoader(false)
        }
    }
    // const industryStateList = async () => {
    //     const header = { 'access-token': localStorage.getItem('access_token') }
    //     const res = await GetApiCall('GET', CommonApiEndPoint.get_industry, header)
    //     if (res.data.status === 'success' && res.data.statusCode === 200 && res.data.data.length > 0) {
    //         let industry_list = []
    //         industry_list = [
    //             {
    //                 value: '',
    //                 label: 'Select industry'
    //             }
    //         ]
    //         res.data.data.map((ele) => {
    //             industry_list.push({ value: Number(ele.id), label: ele.types_of_industries })
    //         })
    //     }
    // }
    const getStateList = async () => {
        const state_data = await getStateData(101)
        setStateList(state_data)
    }
    /**
     * IW0077
     * This function is call on state & currency & industry detail & company details
     */
    useEffect(() => {
        getCompanyDetail()
        if (!history.location.pathname.includes('view')) {
            // industryStateList()
            getStateList()
        }
        if ((history.location.pathname.includes('edit') || history.location.pathname.includes('view')) && !location_state) {
            history.replace(CommonRouter.dashboard)
        }
    }, [])

    const handlePincodeMissing = async () => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const data = {
            pincode: formik.values.pincode,
            gst_in: formik.values.gst_in
        }
        const res = await ApiCall('POST', `${munimApiEndpoint}${CommonApiEndPoint.insert_pincode}`, data, header, '', true)
        if (res.data.status === 'success') {
        }
    }
    /**
     * IW0077
     * This function is call on gst number to get data
     */
    const GstVerify = async () => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${munimApiEndpoint}${CommonApiEndPoint.get_gst_info}?gstin=${formik.values?.gst_in}`, header, false, true)
        if (res.data.status === 'success' && res.data.statusCode === 200) {
            if (res.data.data) {
                let registration_type = ''
                registration_type_options.map((ele) => {
                    if (ele.text.includes(res.data.data.reg_type)) {
                        registration_type = ele.value
                    }
                })
                if (!registration_type) {
                    registration_type = '1'
                }
                let organization_type = ''
                organization_option.find((ele) => {
                    if (ele.text === res.data.data.org_type) {
                        organization_type = ele.value
                        return true
                    }
                })
                if (res.data.data.pincode !== formik.values.pincode) {
                    setIsGstChange(true)
                }
                const gst_apply_date = changeDateSeparator(res.data.data.gst_apply_from, '/', '-')
                formik.setFieldValue('registration_type', registration_type)
                formik.setFieldValue('company_name', res.data.data.company_name)
                formik.setFieldValue('org_type', organization_type)
                formik.setFieldValue('pincode', res.data.data.pincode)
                formik.setFieldValue('address_line1', res.data.data.address_line1)
                formik.setFieldValue('address_line2', res.data.data.address_line2)
                formik.setFieldValue('pan_no', res.data.data.pan_no)
                formik.setFieldValue('legal_name', res.data.data.lgnm)
                formik.setFieldValue('gst_applied_from', moment(getJsDate(gst_apply_date, 'DD-MM-YYYY')).format(''))
                formik.setFieldValue('establishment_date', moment(getJsDate(gst_apply_date, 'DD-MM-YYYY')).format(''))
                formik.setFieldValue('is_gst_verified', true)
            } else {
                formik.setFieldValue('is_gst_verified', false)
            }
            setErrorMessage('')
        } else {
            setErrorMessage(res.data.message)
            formik.setFieldValue('company_name', '')
            formik.setFieldValue('org_type', '')
            formik.setFieldValue('pincode', '')
            formik.setFieldValue('address_line1', '')
            formik.setFieldValue('address_line2', '')
            formik.setFieldValue('pan_no', '')
            formik.setFieldValue('legal_name', '')
            formik.setFieldValue('gst_applied_from', '')
            formik.setFieldValue('establishment_date', '')
            formik.setFieldValue('city', '')
            setIsReset(true)
        }
    }
    /**
     * IW0077
     * This function is call on pincode to get city data
     */
    const PincodeVerify = async () => {
        formik.setFieldTouched('pincode')
        if (formik.values.pincode.length === 6) {
            const header = { 'access-token': localStorage.getItem('access_token') }
            const res = await GetApiCall('GET', `${munimApiEndpoint}${CommonApiEndPoint.pincode_verify}?pincode=${formik.values.pincode}`, header, false, true)
            if (res.data.status === 'success' && res.data.statusCode === 200) {
                formik.setFieldValue('state', res.data.data.state_data[0].value)
                formik.setFieldValue('city', res.data.data.city_data[0].value)
                getCityList(res.data.data.state_data[0].value)
                if (isGstChange) {
                    setIsGstChange(false)
                }
                setErrorPincode('')
            } else {
                if (isGstChange) {
                    handlePincodeMissing()
                    setIsGstChange(false)
                    setErrorPincode('')
                } else {
                    setErrorPincode(res.data.message)
                }
                if (formik.values.gst_in && ['1', '2'].includes(formik.values.registration_type)) {
                    const gst_state_code = formik.values.gst_in.slice(0, 2)
                    const gst_state = stateList.find((ele) => ele.gst_code === gst_state_code)
                    formik.setFieldValue('state', gst_state?.value)
                    getCityList(gst_state?.value)
                }
            }
        }
    }
    const getCityList = async (state_id, isSetCity = false) => {
        if (state_id) {
            const city_data = await getCityData(state_id, selected_company_object.id)
            if (city_data?.length) {
                setCityList(city_data)
                if (isSetCity) {
                    formik.setFieldValue('city', city_data[0].value)
                }
            }
        }
    }
    const handleChangeState = (name, value) => {
        formik.setFieldValue(name, value)
        getCityList(value, true)
    }
    useEffect(() => {
        if (formik.values?.pincode.length === 6 && formik.dirty && formik.values.country === 101) {
            PincodeVerify()
        }
    }, [formik.values.pincode])

    useEffect(() => {
        if (formik.dirty && formik.values.gst_in.length === 15) {
            GstVerify()
        }
    }, [formik.values.gst_in])
    /**
     * IW0077
     * This function is call on change  city
     */
    const handleChangeCity = (name, value) => {
        formik.setFieldValue(name, value)
        cityList.find((ele) => {
            if (ele.value === value) {
                formik.setFieldValue('city_name', ele.label)
                return true
            }
        })
    }
    const closeDiscardPopUp = (flag = false) => {
        if (flag) {
            window.removeEventListener("beforeunload", handlePageRefresh)
            formik.handleReset()
            setIsReset(true)
            setDiscardPopUpActive(false)
            setErrorMessage('')
            if (formik.values.state !== formik.initialValues.state) getCityList(formik.initialValues.state)
        } else {
            setDiscardPopUpActive(false)
        }
    }
    const handleDiscard = () => {
        setDiscardPopUpActive(true)
    }
    useEffect(() => {
        if (formik.dirty) {
            dispatch(setShowHeaderAction({ display: true, title: 'Unsaved draft company', mainAction: handleSubmit, secondaryAction: handleDiscard, loader: saveLoader }))
        } else {
            dispatch(setShowHeaderAction({ display: false, title: '', mainAction: handleSubmit, secondaryAction: handleDiscard, loader: saveLoader }))
        }
    }, [formik.dirty, saveLoader, formik.errors])
    /**
     * IW0077
     * This function is call on shortcut-key
     */
    const onKeyDown = (keyName, e) => {
        e.preventDefault()
        if (keyName === 'alt+s' && !history.location.pathname.includes('view') && (formik.dirty)) {
            handleSubmit()
        }
        if (keyName === 'alt+d' && !history.location.pathname.includes('view') && (formik.dirty)) {
            handleDiscard()
        }
        if (keyName === 'alt+c') {
            history.goBack()
        }
    }
    /**
     * IW0077
     * This function is call on registration type chnage to data reset
    */
    const RegistrationTypeOptionChange = (name, value) => {
        if (history.location.pathname.includes('edit')) {
            formik.setFieldValue(name, value)
            formik.setFieldValue('gst_applied_from', '')
            formik.setFieldValue('gst_in', '')
            formik.setFieldValue('party_type', '1')
            formik.setFieldValue('org_type', '')
            formik.setFieldTouched('gst_in', false)
            formik.setFieldError('gst_in', '')
            if (value !== 1 || value !== 2) {
                setErrorMessage('')
            }
        } else {
            formik.handleReset()
            formik.setFieldValue(name, value)
            if (value !== 1 || value !== 2) {
                setErrorMessage('')
            }
        }
    }
    const handleSubmit = () => {
        if (Object.keys(formik?.errors).length) {
            const error_id = Object.keys(formik.errors)[0]
            document.getElementById(error_id).focus()
            formik.handleSubmit()
        } else {
            formik.handleSubmit()
        }
    }
    useEffect(() => {
        if (formik.values.gst_applied_from || formik.values.establishment_date) {
            setIsReset(false)
        }
    }, [formik.values.gst_applied_from, formik.values.establishment_date])

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }
    /**
     * IW0110
     * This function is call on reload on data to open pop-up
     */
    useEffect(() => {
        if (formik.dirty) {
            window.addEventListener("beforeunload", handlePageRefresh)
        } else {
            window.removeEventListener("beforeunload", handlePageRefresh)
        }
    }, [formik.dirty])

    return (
        <>
            <Row className='justify-content-center'>
                <Col lg='8' sm='12'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <Hotkeys keyName="enter,alt+s,alt+d,alt+c" onKeyDown={onKeyDown} filter={() => true}></Hotkeys>
                        <div className="munim-list-company"><ModuleTitle breadCrumbTitle={history.location.pathname.includes('view') ? 'View Company' : 'Edit Company'} links={location_state.back === true ? [CommonRouter.setting] : [CommonRouter.company]} /></div>
                        <div className='d-flex align-items-center gap-2'>
                            <div className='create-mobil-btn-show desktop-device-none'>
                                <div className='mobil-creat-svg-border' >
                                    <svg width="15" height="15" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" cursor='pointer' className='' onClick={() => setSidebarOpen(true)}>
                                        <path d="M10.8756 6.56H6.50763V10.856H4.49163V6.56H0.123625V4.664H4.49163V0.344H6.50763V4.664H10.8756V6.56Z" fill="#fff" />
                                    </svg>
                                </div>
                            </div>
                            <Button className='add-new-user mobile-device-none' color='primary' onClick={() => setSidebarOpen(true)}>
                                Add Location
                            </Button>
                        </div>
                    </div>
                    <Card className={`mt-1 mb-0 munim-card-border ${history.location.pathname.includes('view') ? 'munim-filed-disabled' : ''}`}>
                        {loaderStatus ? <div className='m-auto p-1'><Spinner size='lg' /></div> : <div>
                            <Card>
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col md='6' sm='12' lg='6' className='mb-1 position-relative'>
                                                <Label className='form-label' for='GSTIN'>
                                                    GSTIN
                                                </Label>
                                                {formik.values.gst_in || !window.location.pathname?.includes('view') ? <InputTextField
                                                    value={formik.values.gst_in}
                                                    isRequired={['1', '2'].includes(formik.values.registration_type)}
                                                    placeholder='24XXXXXXXXXXXZJ'
                                                    name='gst_in'
                                                    maxLength='15'
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete={'off'}
                                                    disabled={['3', '4', '5'].includes(formik.values.registration_type) || gstDisable}
                                                    errors={formik.errors.gst_in || errorMessage}
                                                    touched={formik.touched.gst_in || errorMessage}
                                                    toUpperCase={true}
                                                /> : <div>N/A</div>}
                                            </Col>
                                            <Col md='6' className={`mb-1 ${history.location.pathname.includes('view') ? 'munim-border-right' : ''}`}>
                                                <div className={`position-relative position-right-0`}>
                                                    <InputTextField value={formik.values.company_name}
                                                        isRequired={true}
                                                        placeholder='Barry Tone PVT. LTD.'
                                                        label='Company Name'
                                                        name='company_name'
                                                        handleChange={formik.setFieldValue}
                                                        handleBlur={() => aliasNameCheck(false, formik.values.company_name, formik.values.alias_name, 'company_name')}
                                                        autoComplete='off'
                                                        disabled={history.location.pathname.includes('view')}
                                                        errors={formik.errors.company_name}
                                                        touched={formik.touched.company_name}
                                                        maxLength='255'
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md='3' className='mb-1'>
                                                <div className='position-relative position-right-0'>
                                                    <Label className='form-label' for='PAN'>
                                                        PAN
                                                    </Label>
                                                    {formik.values.pan_no || !window.location.pathname?.includes('view') ? <InputTextField
                                                        isRequired={['1', '2'].includes(formik.values.registration_type)}
                                                        value={formik.values.pan_no}
                                                        placeholder='BJXXXXXX1H'
                                                        name='pan_no'
                                                        handleChange={formik.setFieldValue}
                                                        handleBlur={formik.setFieldTouched}
                                                        autoComplete='off'
                                                        disabled={!formik.values.is_gst_verified ? false : (formik.values.gst_in && (!formik.errors.gst_in && !errorMessage))}
                                                        errors={formik.errors?.pan_no}
                                                        touched={formik.touched?.pan_no}
                                                        toUpperCase={true}
                                                    /> : <div>N/A</div>}
                                                </div>
                                            </Col>
                                            <Col md='3' className=' mb-1'>
                                                <div className={`position-relative position-right-0 ${history.location.pathname.includes('view') ? 'munim-border-right' : ''}`}>
                                                    <Label className='form-label' for='Alias Name'>
                                                        Alias Name
                                                    </Label>
                                                    {formik.values.alias_name || !window.location.pathname?.includes('view') ? <InputTextField
                                                        value={formik.values.alias_name}
                                                        placeholder='Jack'
                                                        name='alias_name'
                                                        handleChange={formik.setFieldValue}
                                                        handleBlur={() => aliasNameCheck(false, formik.values.name, formik.values.alias_name, 'alias_name')}
                                                        autoComplete='off'
                                                        disabled={history.location.pathname.includes('view')}
                                                        errors={formik.errors?.alias_name}
                                                        touched={formik.touched?.alias_name}
                                                        maxLength='50'
                                                        tooltipText='If you want to differentiate company then add this alias name, it will see in company selection list in header.'
                                                    /> : <div>N/A</div>}
                                                </div>
                                                {formik.values.show_alias_name ? <p><b>Note:</b> Company has already registered with same name and alias! Please use different alias to differentiate</p> : ''}
                                            </Col>
                                            <Col md='6' className=''>
                                                <Row>
                                                    <div className='mb-1 position-relative munim-tooltip-gap'>
                                                        <InputTextField value={formik.values.legal_name}
                                                            placeholder='Barry Tone'
                                                            label='Legal Name'
                                                            name='legal_name'
                                                            handleChange={formik.setFieldValue}
                                                            handleBlur={formik.setFieldTouched}
                                                            autoComplete='off'
                                                            disabled={(!formik.values.is_gst_verified ? false : formik.values.gst_in) || history.location.pathname.includes('view')}
                                                            maxLength='255'
                                                            tooltipText='A legal name is a name that is registered at the time of incorporation of a company or business. The legal name is generally the name of the company on the PAN.'
                                                        />
                                                    </div>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md='6' className={`mb-1 position-relative ${history.location.pathname.includes('view') ? 'munim-border-right' : ''}`}>
                                                <Label className='form-label' for='Address Line 1'>
                                                    Address Line 1
                                                </Label>
                                                {formik.values.address_line1 || !history.location.pathname?.includes('view') ? <InputTextField
                                                    value={formik.values.address_line1}
                                                    isRequired={['1', '2'].includes(formik.values.registration_type)}
                                                    placeholder='Floor No., Building Name'
                                                    name='address_line1'
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete='off'
                                                    disabled={history.location.pathname.includes('view')}
                                                    errors={formik.errors.address_line1}
                                                    touched={formik.touched.address_line1}
                                                    maxLength={100}
                                                /> : <div>N/A</div>}
                                            </Col>
                                            <Col md='6' className='mb-1 position-relative'>
                                                <Label className='form-label' for='Address Line 2'>
                                                    Address Line 2
                                                </Label>
                                                {formik.values.address_line2 || !history.location.pathname?.includes('view') ? <InputTextField
                                                    value={formik.values.address_line2}
                                                    placeholder='Near by Location, Landmark'
                                                    name='address_line2'
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete='off'
                                                    disabled={history.location.pathname.includes('view')}
                                                    errors={formik.errors.address_line2}
                                                    touched={formik.touched.address_line2}
                                                    maxLength={100}
                                                /> : <div>N/A</div>}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md='6' className={`mb-1 position-relative ${history.location.pathname.includes('view') ? 'munim-border-right' : ''}`}>
                                                <Label className='form-label' for='country'>
                                                    Country
                                                </Label>
                                                <FixSelect
                                                    id='country'
                                                    value={formik.values.country}
                                                    options={country_options}
                                                    disabled
                                                    handleChange={formik.setFieldValue}
                                                />
                                            </Col>
                                            <Col md='6' className='mb-1 position-relative'>
                                                <InputNumberField value={formik.values.pincode}
                                                    isRequired={true}
                                                    placeholder='39XX01'
                                                    label='Pincode'
                                                    name='pincode'
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete='off'
                                                    maxLength={6}
                                                    disabled={history.location.pathname.includes('view')}
                                                    errors={formik.errors.pincode || errorPincode}
                                                    touched={formik.touched.pincode}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md='6' className={`mb-1 position-relative ${history.location.pathname.includes('view') ? 'munim-border-right' : ''}`}>
                                                <Label className='form-label' for='state'>
                                                    State
                                                </Label>
                                                <FixSelect
                                                    id='state'
                                                    value={formik.values.state}
                                                    options={stateList}
                                                    disabled={history.location.pathname.includes('view')}
                                                    handleChange={handleChangeState}
                                                />
                                            </Col>
                                            <Col md='6' className='mb-1 position-relative'>
                                                <Label className={`form-label ${!history.location.pathname.includes('view') ? 'required-star' : ''} `} for='city'>
                                                    City
                                                </Label>
                                                <FixSelect
                                                    id='city'
                                                    value={formik.values.city}
                                                    options={cityList}
                                                    disabled={history.location.pathname.includes('view')}
                                                    handleBlur={formik.setFieldTouched}
                                                    errors={formik.errors.city}
                                                    touched={formik.touched.city}
                                                    handleChange={handleChangeCity}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md='6' className='mb-1 position-relative'>
                                                <InputNumberField
                                                    value={formik.values.mobile}
                                                    isRequired={true}
                                                    placeholder='99XXXXXX01'
                                                    label='Mobile No.'
                                                    name='mobile'
                                                    maxLength="10"
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete='off'
                                                    disabled={history.location.pathname.includes('view')}
                                                    errors={formik.errors.mobile}
                                                    touched={formik.touched.mobile}
                                                />
                                            </Col>
                                            <Col md='6' className='mb-1 position-relative'>
                                                <div className='d-flex justify-content-between align-items-end position-relative'>
                                                    <Label className='d-flex form-label d-flex munim-gap-6 munim-tooltip-flex' for='Email'>Email
                                                        <HelpTooltip id='email-tooltip' label='The primary email address is shown here. Users are able to change it by clicking on the email preference link.' />
                                                    </Label>
                                                </div>
                                                <InputEmailField
                                                    isRequired={true}
                                                    value={formik.values.email}
                                                    placeholder='example@domain.com'
                                                    name='email'
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete='off'
                                                    disabled
                                                    errors={formik.errors.email}
                                                    touched={formik.touched.email}
                                                    maxLength='50'
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md='6' sm='12' lg='6' className='mb-1'>
                                                <Row>
                                                    <div className='mb-1 position-relative invalid-date-error'>
                                                        <Label className={`form-label ${!history.location.pathname.includes('view') ? 'required-star' : ''} `} for='Company establish from'>
                                                            Company Established From
                                                        </Label>
                                                        <CustomDatePicker
                                                            name='establishment_date'
                                                            value={formik.values.establishment_date}
                                                            fieldVal={formik.setFieldValue}
                                                            setFieldTouch={formik.setFieldTouched}
                                                            finValApply={true}
                                                            isReset={isReset}
                                                            placement='topLeft'
                                                            maxDate={new Date(today_date)}
                                                            disabled={history.location.pathname.includes('view')}
                                                            errors={formik.errors.establishment_date}
                                                            touched={formik.touched.establishment_date}
                                                        />
                                                    </div>
                                                </Row>
                                            </Col>
                                            <Col lg='6' className='mb-1 position-relative'>
                                                <Label className='form-label' for='Registration type'>
                                                    Registration Type
                                                </Label>
                                                <FixSelect
                                                    id='registration_type'
                                                    value={formik.values.registration_type}
                                                    disabled={formik.values?.gst_in !== ''}
                                                    options={registration_type_options}
                                                    handleChange={(name, value) => RegistrationTypeOptionChange(name, value, formik.values.gst_type)}
                                                />
                                            </Col>
                                        </Row>
                                        <div className='d-flex justify-content-between mt-1 munim-bb-btn-group munim-save'>
                                            <CustomButton
                                                className='me-1'
                                                outline
                                                color='secondary'
                                                type='button'
                                                label='Cancel'
                                                handleClick={() => history.goBack()}
                                                tabIndex="-1"
                                            />
                                            {history.location.pathname.includes('view') ? '' : <CustomButton
                                                className='me-1'
                                                color='primary'
                                                type='button'
                                                disabled={(!formik.dirty) || formik.isSubmitting}
                                                handleClick={() => handleSubmit()}
                                                loader={saveLoader}
                                                nextFocusId={!(formik.values?.gst_in !== '') ? 'registration_type' : formik.values.gst_in && !([3, 4, 5].includes(formik.values.registration_type) || gstDisable) ? 'gst_in' : !([3, 4, 5].includes(formik.values.registration_type)) ? 'party_type' : formik.values.gst_applied_from && !(formik.values.is_gst_verified) ? 'gst_applied_from' : 'name'}
                                                label='Save' />}
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                        }
                        <RouterPrompt show={formik.dirty} when={formik.dirty} content={popUpMessage.cancel_content} title={popUpMessage.discard_title} closeText='Cancel' frwText='Leave Page' />
                        {discardPopUpActive && <DiscardModal discardPopUpActive={discardPopUpActive} popUpTitle={popUpMessage.discard_title} secondaryLabel='Cancel' popUpContent={popUpMessage.discard_content} primaryLabel='Discard Changes' handleDiscardPopUp={closeDiscardPopUp} />}
                    </Card >
                    {
                        history.location.pathname.includes('view') ? <div className="mt-2 mb-2 munim-tble-shortcutkey-main">
                            <div className='pe-1'>
                                <span className='text-uppercase fw-bolder munim-shortcut-letter munim-shortcutkey-text-clr'>Shortcuts:</span>
                            </div>
                            <div className="munim-sales-tble-shortcutkey">
                                <div>
                                    <span>
                                        <button className="munim-input-key fw-bold" tabIndex="-1">{detectOs}</button>
                                        <span className='ps-0'> + </span>
                                        <button className="munim-input-key fw-bold" tabIndex="-1">C</button>
                                    </span>
                                    <span className='fw-bold munim-shortcutkey-text-clr'>Cancel</span>
                                </div>
                            </div>
                        </div> : <div className="mt-2 mb-2 munim-tble-shortcutkey-main">
                            <div className='pe-1'>
                                <span className='text-uppercase fw-bolder munim-shortcut-letter munim-shortcutkey-text-clr'>Shortcuts:</span>
                            </div>
                            <div className="munim-sales-tble-shortcutkey" >
                                <div>
                                    <span>
                                        <button className="munim-input-key fw-bold" tabIndex="-1">{detectOs}</button>
                                        <span className='ps-0'> + </span>
                                        <button className="munim-input-key fw-bold" tabIndex="-1">S</button>
                                    </span>
                                    <span className='fw-bold munim-shortcutkey-text-clr'>Save</span>
                                </div>
                                <div>
                                    <span>
                                        <button className="munim-input-key fw-bold" tabIndex="-1">{detectOs}</button>
                                        <span className='ps-0'> + </span>
                                        <button className="munim-input-key fw-bold" tabIndex="-1">C</button>
                                    </span>
                                    <span className='fw-bold munim-shortcutkey-text-clr'>Cancel</span>
                                </div>
                                <div>
                                    <span>
                                        <button className="munim-input-key fw-bold" tabIndex="-1">{detectOs}</button>
                                        <span className='ps-0'> + </span>
                                        <button className="munim-input-key fw-bold" tabIndex="-1">D</button>
                                    </span>
                                    <span className='fw-bold munim-shortcutkey-text-clr'>Discard</span>
                                </div>
                            </div>
                        </div>
                    }
                </Col>
            </Row>
            <LocationList toggleSidebar={toggleSidebar} listing={true} sidebarOpen={sidebarOpen} />

        </>
    )
}

export default EditCompany
