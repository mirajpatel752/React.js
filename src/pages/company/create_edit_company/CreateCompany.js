/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import { Save, X } from 'react-feather'
import { useFormik } from "formik"
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ValidationMessage, { popUpMessage } from '../../../common_components/Validation'
import { ApiCall, GetApiCall } from '../../../helper/axios'
import CustomButton from '../../../common_components/custom_field/CustomButton'
import useNotify from '../../../custom_hooks/useNotify'
import { Card, Button, Form, Label, Row, Col, Spinner, CardBody } from 'reactstrap'
import ModuleTitle from '../../../common_components/ModuleTitle'
import { RouterPrompt } from '../../../common_components/RouterPrompt'
import { changeDateSeparator, getCityData, getJsDate, getStateData, getUserIpAddress, handlePageRefresh } from '../../../helper/commonFunction'
import CustomDatePicker from '../../../common_components/calender/CustomDatePicker'
import InputTextField from '../../../common_components/custom_field/InputTextField'
import InputEmailField from '../../../common_components/custom_field/InputEmailField'
import moment from 'moment'
import OptionData from '../../../common_components/OptionData'
import FixSelect from '../../../common_components/search_select/FixSelect'
import CommonApiEndPoint from '../../../helper/commonApiEndPoint'
import CommonRouter from '../../../helper/commonRoute'
import InputNumberField from '../../../common_components/custom_field/InputNumberField'
import { demouser, munimApiEndpoint } from '../../../helper/commonApi'
import commonRegex from '../../../helper/constants'
import { setCompanyDataAvailable, setCompanyIsNext, setCompanyList, setCompleteProfile, setSelectedCompanyObject } from '../../../redux/commonSlice'
// let timer
const CreateCompany = () => {
    const { country_options, organization_option, registration_type_options } = OptionData
    const notify = useNotify()
    const history = useHistory()
    const dispatch = useDispatch()
    const location_state = history.location.state
    const today_date = useSelector((state) => state.commonReducer.today_date)
    const company_list = useSelector((state) => state?.commonReducer?.company_list)
    const user_email = useSelector((state) => state?.commonReducer?.user_email)
    const user_mobile = useSelector((state) => state.commonReducer.user_mobile)
    const user_id = useSelector((state) => state.commonReducer.user_id)
    const [isEditGstLegalInfo, setIsEditGstLegalInfo] = useState(false)
    const [saveLoader, setSaveLoader] = useState(false)
    const [loaderStatus, setLoaderStatus] = useState(true)
    const [stateList, setStateList] = useState([])
    const [gstErrorMessage, setGstErrorMessage] = useState('')
    const [errorPincode, setErrorPincode] = useState('')
    const [gstVerified, setGstVerified] = useState(false)
    const [isReset, setIsReset] = useState(true)
    const [cityList, setCityList] = useState([])
    const [gstVerifyLoader, setGstVerifyLoader] = useState(false)
    const companySchema = yup.object().shape({
        gst_in: yup.string().trim()
            .matches(commonRegex.gst_no, ValidationMessage.gst_valid)
            .when('registration_type', {
                is: (registration_type) => ['1', '2'].includes(registration_type),
                then: yup.string().trim()
                    .required(ValidationMessage.is_require)
            }),
        name: yup.string().trim().required(ValidationMessage.is_require),
        pan_no: yup.string().trim()
            .matches(commonRegex.pan_no, ValidationMessage.pan_valid)
            .max(10, ValidationMessage.pan_valid),
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
        city: yup.string().trim().required(ValidationMessage.is_require),
        establishment_date: yup.date()
            .required(ValidationMessage.is_require)
            .max(new Date(today_date), ValidationMessage.future_date_allow)
    })
    const handleSave = () => {
        addCompanyDetail(formik.values)
    }

    const [initialState] = useState({
        address_line1: '',
        address_line2: '',
        alias_name: '',
        base_currency: 1,
        city: '',
        country: 101,
        email: user_email,
        establishment_date: moment(new Date()).format('YYYY-MM-DD'),
        fax: '',
        gst_applied_from: '',
        gst_in: '',
        industry_type: '',
        legal_name: '',
        mobile: user_mobile,
        name: '',
        org_type: '',
        pan_no: '',
        party_type: '1',
        phone: '',
        pincode: '',
        registration_type: '1',
        gst_type: 1,
        state: 12,
        city_name: '',
        state_name: '',
        email: user_email,
        website: '',
        gst_applied_from: '',
        establishment_date: moment(new Date()).format('YYYY-MM-DD'),
        access_rights: '',
        otp: '',
        userGetOtp: false,
        show_alias_name: false,
        is_gst_verified: true
    })
    const [initialGstInfo, setInitialGstInfo] = useState({
        name: '',
        address_line1: '',
        address_line2: '',
        country: 101,
        state: 12,
        city: '',
        pincode: '',
        city_name: '',
        state_name: '',
        alias_name: ''
    })
    const formik = useFormik({
        initialValues: initialState,
        validationSchema: companySchema,
        enableReinitialize: true,
        onSubmit: (value) => {
            handleSave(value)
        }
    })
    const gst_type_options = ['1', '2'].includes(formik.values.registration_type) ? [...registration_type_options].splice(0, 2) : [...registration_type_options].splice(2, 3)
    /**
     * IW0110
     * This function is call on get state data
     */
    const getState = async () => {
        const state_data = await getStateData(101)
        setStateList(state_data)
        setLoaderStatus(false)
    }
    /**
     * IW0077
     * This function is call on reload on data to open pop-up
     */
    useEffect(() => {
        if (formik.dirty) {
            window.addEventListener("beforeunload", handlePageRefresh)
        } else {
            window.removeEventListener("beforeunload", handlePageRefresh)
        }
    }, [formik.dirty])
    /**
     * IW0077
     * This function is call on save api call
     */
    const addCompanyDetail = async (value) => {
        const ip_address = await getUserIpAddress()
        setSaveLoader(true)
        const data = {
            company_name: value.name.trim(),
            alias_name: value.alias_name,
            legal_name: value.legal_name,
            email: value.email,
            mobile: value.mobile,
            address_line1: value.address_line1,
            address_line2: value.address_line2,
            city: value.city,
            state: value.state,
            country: value.country,
            pincode: value.pincode,
            base_currency: value.base_currency,
            fax: value.fax,
            establishment_date: moment(value.establishment_date).format('YYYY-MM-DD'),
            gst_applied_from: value.gst_applied_from ? moment(value.gst_applied_from).format('YYYY-MM-DD') : '',
            gst_in: value.gst_in,
            industry_type: value.industry_type,
            org_type: value.org_type,
            pan_no: value.pan_no,
            party_type: value.party_type,
            phone: value.phone,
            registration_type: value.registration_type,
            website: value.website
        }
        const header = { 'access-token': localStorage.getItem('access_token'), ip: ip_address }
        const res = await ApiCall('POST', CommonApiEndPoint.create_company, data, header)
        if (res.data.status === 'error' && res.data.statusCode === 401) {
            setSaveLoader(false)
            formik.setSubmitting(false)
        } else if (res.data.status === 'error') {
            setSaveLoader(false)
            formik.setSubmitting(false)
            notify(res.data.message, 'error')
        }
        if (res.data.status === 'success' && res.data.statusCode === 201) {
            if (!value.is_gst_verified) {
                const data = {
                    company_id: res.data.data,
                    gstin: value.gst_in,
                    entity_type: '0',
                    entity_id: res.data.data,
                    user_id
                }
                await ApiCall('POST', CommonApiEndPoint.without_verify_gstin, data, header)
            }
            if (!company_list.length) {
                dispatch(setCompleteProfile(true))
            }
            setSaveLoader(false)
            formik.handleReset()
            window.removeEventListener("beforeunload", handlePageRefresh)
            notify(res.data.message, 'success')
            getCompanyList()
        } else {
            setSaveLoader(false)
            notify(res.data.message, 'error')
        }
    }
    /**
     * IW0110
     * This function is call on company details
     */
    const getCompanyList = async () => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', CommonApiEndPoint.company_list, header)
        if (res.data.status === 'success') {
            const data = res.data.data
            dispatch(setCompanyList(data.company_data))
            dispatch(setCompanyDataAvailable(true))
            dispatch(setCompanyIsNext(data.is_next))
            const final_company_data = { ...data.last_selected_company_obj }
            final_company_data.gst_enabled = data.last_selected_company_obj.gst_in ? 1 : 0
            dispatch(setSelectedCompanyObject(final_company_data))
            history.push(CommonRouter.dashboard)
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
                const gst_appy_date = changeDateSeparator(res.data.data.gst_apply_from, '/', '-')
                formik.setFieldValue('registration_type', registration_type)
                formik.setFieldValue('name', res.data.data.ledger_name)
                formik.setFieldValue('org_type', organization_type)
                formik.setFieldValue('pincode', res.data.data.pincode)
                formik.setFieldValue('address_line1', res.data.data.address_line1)
                formik.setFieldValue('address_line2', res.data.data.address_line2)
                formik.setFieldValue('pan_no', res.data.data.pan_no)
                formik.setFieldValue('legal_name', res.data.data.lgnm)
                formik.setFieldValue('gst_applied_from', moment(getJsDate(gst_appy_date, 'DD-MM-YYYY')).format('YYYY-MM-DD'))
                formik.setFieldValue('establishment_date', moment(getJsDate(gst_appy_date, 'DD-MM-YYYY')).format('YYYY-MM-DD'))
                formik.setFieldValue('is_gst_verified', true)
                setGstVerifyLoader(false)
            } else {
                setIsEditGstLegalInfo(true)
                formik.setFieldValue('is_gst_verified', false)
            }
            setGstErrorMessage('')
            setGstVerified(true)
            PincodeVerify(res.data.data.pincode, true)
        } else {
            setGstVerifyLoader(false)
            setGstVerified(false)
            setGstErrorMessage(res.data.message)
            formik.setFieldValue('name', '')
            formik.setFieldValue('org_type', '')
            formik.setFieldValue('pincode', '')
            formik.setFieldValue('address_line1', '')
            formik.setFieldValue('address_line2', '')
            formik.setFieldValue('pan_no', '')
            formik.setFieldValue('legal_name', '')
            formik.setFieldValue('gst_applied_from', '')
            formik.setFieldValue('establishment_date', '')
            formik.setFieldValue('city', '')
        }
    }
    /**
    * IW0110
    * This effect is called when enter without verify gst number then change gst number to get data
    */
    useEffect(() => {
        if (formik.dirty && formik.values.gst_in.length === 15 && !formik.values.is_gst_verified) {
            GstVerify()
        }
        if (formik.dirty && formik.values.gst_in.length === 15 && gstErrorMessage) {
            setGstErrorMessage('')
        }
    }, [formik.values.gst_in])
    /**
     * IW0079
     * this function is called when user enter gst_no and we fetch gst_data according that
     * here we get pincode also and if that pincode is not verified from our side this function will call and store that data in db.
     */
    const handlePincodeMissing = async (pincode) => {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const data = {
            pincode: pincode ? pincode : formik.values.pincode,
            gst_in: formik.values.gst_in
        }
        const res = await ApiCall('POST', `${munimApiEndpoint}${CommonApiEndPoint.insert_pincode}`, data, header, '', true)
        if (res.data.status === 'success') {
        }
    }
    /**
     * IW0077
     * This function is call on pincode to get city data
     */
    const PincodeVerify = async (pincode, insert_pincode) => {
        formik.setFieldTouched('pincode')
        if (pincode?.length === 6) {
            const header = { 'access-token': localStorage.getItem('access_token') }
            const res = await GetApiCall('GET', `${munimApiEndpoint}${CommonApiEndPoint.pincode_verify}?pincode=${pincode ? pincode : formik.values.pincode}`, header, false, true)
            if (res.data.status === 'success' && res.data.statusCode === 200) {
                formik.setFieldValue('state', res.data.data.state_data[0].value)
                formik.setFieldValue('city', res.data.data.city_data[0].value)
                formik.setFieldValue('city_name', res.data.data.city_data[0].label)
                formik.setFieldValue('state_name', res.data.data.state_data[0].label)
                getCityList(res.data.data.state_data[0].value)
                if (gstVerifyLoader || insert_pincode) {
                    setGstVerifyLoader(false)
                    setIsEditGstLegalInfo(true)
                }
                setErrorPincode('')
            } else {
                if (gstVerifyLoader || insert_pincode) {
                    setIsEditGstLegalInfo(true)
                    setGstVerifyLoader(false)
                    if (insert_pincode) {
                        handlePincodeMissing(pincode)
                        setErrorPincode('')
                    }
                } else {
                    setErrorPincode(res.data.message)
                }
                if (formik.values.gst_in && ['1', '2'].includes(formik.values.registration_type)) {
                    const gst_state_code = formik.values.gst_in.slice(0, 2)
                    const gst_state = stateList.find((ele) => ele.gst_code === gst_state_code)
                    formik.setFieldValue('state_name', formik.values.state_name ? formik.values.state_name : 'Gujarat')
                    formik.setFieldValue('state', gst_state?.value)
                    getCityList(gst_state.value, false)
                    document.getElementById('city').focus()
                }
            }
        }
    }
    const getCityList = async (state_id, isSetCity = false) => {
        const city_data = await getCityData(state_id)
        if (city_data?.length) {
            setCityList(city_data)
            if (isSetCity) {
                formik.setFieldValue('city', city_data[0].value)
                formik.setFieldValue('city_name', city_data[0].label)
            }
        }
    }
    /**
     * IW0110
     * This effect is called when create company without gst then get city data
     */
    useEffect(() => {
        if (['3', '4', '5'].includes(formik.values.registration_type) && !cityList.length) {
            getCityList(formik.values.state)
        }
    }, [formik.values.registration_type])

    const handleChangeState = (name, value) => {
        formik.setFieldValue(name, value)
        getCityList(value, true)
    }
    const pincodeChange = (name, value) => {
        formik.setFieldValue(name, value)
        if (value?.length === 6 && formik.dirty && formik.values.country === 101) {
            PincodeVerify(value, false)
        }
    }
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
    const RegistrationTypeOptionChange = (name, value, gst_type) => {
        formik.handleReset()
        formik.setValues({ ...formik.values, registration_type: value, gst_type })
        if (initialState.state !== formik.values.state) setCityList([])
        if (value !== 1 || value !== 2) {
            setGstErrorMessage('')
        }
    }
    /**
     * IW0079
     * This function called when user want to generate otp
     * here flag is true means user generate otp for the first time and false means user regenerate otp
     */
    const handleOTP = async () => {
        if (!formik.errors.gst_in) {
            setGstVerifyLoader(true)
            GstVerify()
        }
    }
    const handleSubmit = () => {
        if (Object.keys(formik?.errors).length) {
            const error_id = Object.keys(formik.errors)[0]
            document.getElementById(error_id)?.focus()
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
    /**
     * IW0079
     * This function call on set initial gst information
     */
    const handleSaveShipAddress = (flag = false) => {
        formik.setFieldTouched('name')
        formik.setFieldTouched('address_line1')
        formik.setFieldTouched('pincode')
        formik.setFieldTouched('city')
        formik.setFieldTouched('mobile')
        formik.setFieldTouched('establishment_date')
        if (flag) {
            const ship_city_name = cityList.find(ele => ele.value === formik.values.city)
            const ship_state_name = stateList.find(ele => ele.value === formik.values.state)
            formik.setFieldValue('city_name', ship_city_name?.label)
            formik.setFieldValue('state_name', ship_state_name?.label)
        } else {
            formik.setValues({ ...formik.values, ...initialGstInfo })
        }
    }
    /**
     * IW0110
     * This effect call to get initial company details
     */
    useEffect(() => {
        if (isEditGstLegalInfo) {
            setInitialGstInfo({
                name: formik.values.name,
                address_line1: formik.values.address_line1,
                address_line2: formik.values.address_line2,
                country: formik.values.country,
                state: formik.values.state,
                city: formik.values.city,
                pincode: formik.values.pincode,
                city_name: formik.values.city_name,
                state_name: formik.values.state_name ? formik.values.state_name : 'Gujarat'
            })
        }
    }, [isEditGstLegalInfo])

    useEffect(() => {
        getState()
        if (history.location.pathname.includes('create') && !location_state) {
            company_list.length ? history.replace(CommonRouter.company_create) : ''
        }
    }, [])
    const aliasNameCheck = async (flag, company_name, alias_name, name) => {
        formik.setFieldTouched(name)
        if (company_name !== '') {
            const header = { 'access-token': localStorage.getItem('access_token') }
            const data = {
                name: company_name,
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
    /**
     * IW0079
     * This function is called when user click on reset button when user have no company and create company for first time after sign-up.
     */
    const resetCompanyForm = () => {
        formik.handleReset()
        setGstVerified(false)
        formik.setValues({ ...formik.initialValues, gst_type: formik.values.gst_type, registration_type: formik.values.registration_type })
    }
    const handleGstType = (value) => {
        if (formik.values.state !== 12) {
            getCityList(formik.initialValues.state)
        }
        formik.handleReset()
        setGstVerified(false)
        formik.setValues({ ...formik.initialValues, gst_type: value, registration_type: value === 1 ? '1' : '4' })
    }

    return (
        <>
            <Row className='justify-content-center'>
                <Col lg='8' sm='12'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className="munim-list-company"><ModuleTitle breadCrumbTitle='Create Company' links={[`${company_list.length ? CommonRouter.company : ''}`]} url={CommonRouter.company} /></div>
                    </div>
                    <Card className='mt-1 munim-card-border'>
                        {loaderStatus ? <div className='m-auto p-1'>
                            <Spinner size='lg' />
                        </div> : <div className='munim-create-company-card'>
                            <CardBody>
                                <Form>
                                    <Row className='text-center'>
                                        <Col className='d-flex justify-content-center gap-2 mb-1 munim-company-flex'>
                                            <Button outline onClick={() => handleGstType(1)} className={`munim-gst-type  ${formik.values.gst_type === 1 ? 'munim-select-gst-type' : ''}`}>
                                                <span className='me-1'>
                                                    {formik.values.gst_type === 2 ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8 15C4.14 15 1 11.86 1 8C1 4.14 4.14 1 8 1C11.86 1 15 4.14 15 8C15 11.86 11.86 15 8 15ZM8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 8 2Z" fill="black" />
                                                    </svg> : <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8 15C4.14 15 1 11.86 1 8C1 4.14 4.14 1 8 1C11.86 1 15 4.14 15 8C15 11.86 11.86 15 8 15ZM8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 8 2Z" fill="white" />
                                                        <path d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" fill="white" />
                                                    </svg>}
                                                </span>
                                                <span className='fw-bolder'>With GST</span>
                                            </Button>
                                            <Button className={`munim-gst-type  ${formik.values.gst_type === 2 ? 'munim-select-gst-type' : ''}`} outline onClick={() => handleGstType(2)}>
                                                <span className='me-1'>
                                                    {formik.values.gst_type === 1 ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8 15C4.14 15 1 11.86 1 8C1 4.14 4.14 1 8 1C11.86 1 15 4.14 15 8C15 11.86 11.86 15 8 15ZM8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 8 2Z" fill="black" />
                                                    </svg> : <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8 15C4.14 15 1 11.86 1 8C1 4.14 4.14 1 8 1C11.86 1 15 4.14 15 8C15 11.86 11.86 15 8 15ZM8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 8 2Z" fill="white" />
                                                        <path d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" fill="white" />
                                                    </svg>}
                                                </span>
                                                <span className='fw-bolder'>Non-GST</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                    {['1', '2'].includes(formik.values.registration_type) ? <>
                                        <Row className='mb-1'>
                                            <Col lg='12' >
                                                <div className="position-relative">
                                                    <InputTextField
                                                        value={formik.values.gst_in}
                                                        isRequired={['1', '2'].includes(formik.values.registration_type)}
                                                        placeholder='24XXXXXXXXXXXZJ'
                                                        label='GSTIN'
                                                        name='gst_in'
                                                        maxLength='15'
                                                        autoFocus={formik.values.gst_type === 1}
                                                        handleChange={formik.setFieldValue}
                                                        handleBlur={formik.setFieldTouched}
                                                        autoComplete={'off'}
                                                        disabled={!formik.values.is_gst_verified ? false : gstVerified}
                                                        errors={formik.errors.gst_in || gstErrorMessage}
                                                        touched={formik.touched.gst_in || gstErrorMessage}
                                                        toUpperCase={true}
                                                    />
                                                </div>
                                            </Col>
                                            <span>Enter your 15 digit GSTIN number</span>
                                        </Row>
                                        {gstVerified && formik.values.gst_type === 1 ? <>
                                            <div className='position-relative'>
                                                <div className='d-flex justify-content-between align-items-center billing-add-ml'>
                                                    <Label className='form-label d-flex munim-font-color' for='GSTIN legal information'>
                                                        <div className='content-header'>
                                                            <h5 className='card-subtitle mb-0'>GSTIN Legal Information</h5>
                                                        </div>
                                                        <span className='mx-1'>
                                                            {isEditGstLegalInfo ? <>
                                                                <X size={18} className='me-50 cursor-pointer' onClick={(e) => { e.preventDefault(); handleSaveShipAddress(); formik.errors.pincode || formik.errors.address_line1 || formik.errors.city || formik.errors.name || formik.errors.mobile || formik.errors.establishment_date ? setIsEditGstLegalInfo(true) : setIsEditGstLegalInfo(!isEditGstLegalInfo) }} />
                                                                <Save size={18} className='me-50 cursor-pointer' onClick={(e) => { e.preventDefault(); handleSaveShipAddress(true); formik.errors.pincode || formik.errors.address_line1 || formik.errors.city || formik.errors.name || formik.errors.mobile || formik.errors.establishment_date ? setIsEditGstLegalInfo(true) : setIsEditGstLegalInfo(false) }} />
                                                            </> : formik.values.gst_in && !formik.errors.gst_in ? <div className='munim-svg pe-0' onClick={() => { setIsEditGstLegalInfo(!isEditGstLegalInfo) }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                                </svg>
                                                            </div> : ''}
                                                        </span>
                                                    </Label>
                                                </div>
                                                {isEditGstLegalInfo ? <>
                                                    <Row>
                                                        <Col md='6' className='mb-1'>
                                                            <div className={`position-relative position-right-0`}>
                                                                <InputTextField value={formik.values.name}
                                                                    isRequired={true}
                                                                    placeholder='Barry Tone PVT. LTD.'
                                                                    label='Company Name'
                                                                    name='name'
                                                                    handleChange={formik.setFieldValue}
                                                                    handleBlur={formik.setFieldTouched}
                                                                    autoComplete='off'
                                                                    errors={formik.errors.name}
                                                                    touched={formik.touched.name}
                                                                    maxLength='255'
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md='6' className='mb-1'>
                                                            <InputTextField
                                                                value={formik.values.pan_no}
                                                                label='PAN'
                                                                placeholder='BJXXXXXX1H'
                                                                name='pan_no'
                                                                handleChange={formik.setFieldValue}
                                                                handleBlur={formik.setFieldTouched}
                                                                autoComplete='off'
                                                                errors={formik.errors.pan_no}
                                                                touched={formik.touched.pan_no}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md='6' className='mb-1 munim-tooltip-gap'>
                                                            <InputTextField
                                                                value={formik.values.alias_name}
                                                                label='Alias Name'
                                                                placeholder='Jack'
                                                                name='alias_name'
                                                                handleChange={formik.setFieldValue}
                                                                handleBlur={() => aliasNameCheck(false, formik.values.name, formik.values.alias_name, 'alias_name')}
                                                                autoComplete='off'
                                                                tooltipText='If you want to differentiate company then add this alias name, it will see in company selection list in header.'
                                                                maxLength='50'
                                                            />
                                                            {formik.values.show_alias_name ? <p><b>Note:</b> Company has already registered with same name and alias! Please use different alias to differentiate</p> : ''}
                                                        </Col>
                                                        <Col md='6' className='mb-1 munim-tooltip-gap'>
                                                            <InputTextField
                                                                value={formik.values.legal_name}
                                                                label='Legal Name'
                                                                placeholder='Legal Name'
                                                                name='legal_name'
                                                                handleChange={formik.setFieldValue}
                                                                handleBlur={formik.setFieldTouched}
                                                                autoComplete='off'
                                                                tooltipText='A legal name is a name that is registered at the time of incorporation of a company or business. The legal name is generally the name of the company on the PAN.'
                                                                maxLength='255'
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md='6' className='mb-1 position-relative'>
                                                            <InputTextField value={formik.values.address_line1}
                                                                isRequired={true}
                                                                placeholder='Floor No., Building Name'
                                                                label='Address Line 1'
                                                                name='address_line1'
                                                                handleChange={formik.setFieldValue}
                                                                handleBlur={formik.setFieldTouched}
                                                                autoComplete='off'
                                                                errors={formik.errors.address_line1}
                                                                touched={formik.touched.address_line1}
                                                                maxLength='100'
                                                            />
                                                        </Col>
                                                        <Col md='6' className='mb-1 position-relative'>
                                                            <InputTextField value={formik.values.address_line2}
                                                                placeholder='Near by Location, Landmark'
                                                                label='Address Line 2'
                                                                name='address_line2'
                                                                handleChange={formik.setFieldValue}
                                                                handleBlur={formik.setFieldTouched}
                                                                autoComplete='off'
                                                                errors={formik.errors.address_line2}
                                                                touched={formik.touched.address_line2}
                                                                maxLength='100'
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md='6' className='mb-1 position-relative'>
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
                                                                handleChange={pincodeChange}
                                                                handleBlur={formik.setFieldTouched}
                                                                autoComplete='off'
                                                                maxLength={6}
                                                                errors={formik.errors.pincode || errorPincode}
                                                                touched={formik.touched.pincode}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md='6' className='mb-1 position-relative'>
                                                            <Label className='form-label' for='state'>
                                                                State
                                                            </Label>
                                                            <FixSelect
                                                                id='state'
                                                                value={formik.values.state}
                                                                options={stateList}
                                                                handleChange={handleChangeState}
                                                            />
                                                        </Col>
                                                        <Col md='6' className='mb-1 position-relative'>
                                                            <Label className='form-label required-star' for='city'>
                                                                City
                                                            </Label>
                                                            <FixSelect
                                                                id='city'
                                                                value={formik.values.city}
                                                                placeholder='City'
                                                                options={cityList}
                                                                handleBlur={formik.setFieldTouched}
                                                                errors={formik.errors.city}
                                                                touched={formik.touched.city}
                                                                handleChange={handleChangeCity}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </> : <>
                                                    <Col className='mb-1'>
                                                        <span>
                                                            <b>Company Name:</b> {formik.values.gst_in && !formik.errors.gst_in && formik.values.name ? formik.values.name : '-'}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            <b>Address:</b>{formik.values.gst_in && !formik.errors.gst_in ? <> {formik.values.address_line1}{formik.values.address_line1 ? ',' : '-'} {formik.values.address_line2}{formik.values.address_line2 ? ',' : ''} {formik.values.city_name}{formik.values.city_name ? ',' : ''} {formik.values.state_name}{formik.values.state_name ? ',' : ''} {formik.values.pincode ? formik.values.pincode : ''}</> : '-'}
                                                        </span>
                                                    </Col>
                                                </>}
                                            </div>
                                            <Row>
                                                <Col md='6' className='mb-1 position-relative'>
                                                    <InputNumberField value={formik.values.mobile}
                                                        isRequired={true}
                                                        placeholder='99XXXXXX01'
                                                        label='Mobile No.'
                                                        name='mobile'
                                                        maxLength="10"
                                                        handleChange={formik.setFieldValue}
                                                        handleBlur={formik.setFieldTouched}
                                                        autoComplete='off'
                                                        errors={formik.errors.mobile}
                                                        touched={formik.touched.mobile}
                                                    />
                                                </Col>
                                                <Col md='6' className='mb-1 position-relative'>
                                                    <InputEmailField
                                                        isRequired={true}
                                                        value={formik.values.email}
                                                        placeholder='example@domain.com'
                                                        label='Email'
                                                        name='email'
                                                        handleChange={formik.setFieldValue}
                                                        handleBlur={formik.setFieldTouched}
                                                        autoComplete='off'
                                                        errors={formik.errors.email}
                                                        touched={formik.touched.email}
                                                        maxLength='50'
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md='6' className='mb-1 position-relative invalid-date-error company-established-error'>
                                                    <Label className='form-label required-star' for='Company establish from'>
                                                        Company Established From
                                                    </Label>
                                                    <CustomDatePicker
                                                        name='establishment_date'
                                                        value={formik.values.establishment_date}
                                                        fieldVal={formik.setFieldValue}
                                                        setFieldTouch={formik.setFieldTouched}
                                                        maxDate={new Date(today_date)}
                                                        errors={formik.errors.establishment_date}
                                                        touched={formik.touched.establishment_date}
                                                        finValApply={true}
                                                        isReset={isReset}
                                                    />
                                                </Col>
                                                <Col lg='6' className='mb-1 position-relative'>
                                                    <Label className='form-label' for='Registration type'>
                                                        Registration Type
                                                    </Label>
                                                    <FixSelect
                                                        id='registration_type'
                                                        value={formik.values.registration_type}
                                                        disabled={formik.values?.gst_in !== ''}
                                                        options={gst_type_options}
                                                        handleChange={(name, value) => RegistrationTypeOptionChange(name, value, formik.values.gst_type)}
                                                    />
                                                </Col>
                                            </Row>
                                        </> : ''}
                                    </> : <>
                                        <Row className='mt-1'>
                                            <Col md='6' className='mb-1'>
                                                <div className={`position-relative position-right-0`}>
                                                    <InputTextField value={formik.values.name}
                                                        isRequired={true}
                                                        placeholder='Barry Tone PVT. LTD.'
                                                        label='Company Name'
                                                        name='name'
                                                        handleChange={formik.setFieldValue}
                                                        handleBlur={formik.setFieldTouched}
                                                        autoComplete='off'
                                                        errors={formik.errors.name}
                                                        touched={formik.touched.name}
                                                        maxLength='255'
                                                    />
                                                </div>
                                            </Col>
                                            <Col md='6' className='mb-1'>
                                                <InputTextField
                                                    value={formik.values.pan_no}
                                                    label='PAN'
                                                    placeholder='BJXXXXXX1H'
                                                    name='pan_no'
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete='off'
                                                    errors={formik.errors.pan_no}
                                                    touched={formik.touched.pan_no}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md='6' className='mb-1 munim-tooltip-gap'>
                                                <InputTextField
                                                    value={formik.values.alias_name}
                                                    label='Alias Name'
                                                    placeholder='Jack'
                                                    name='alias_name'
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={() => aliasNameCheck(false, formik.values.name, formik.values.alias_name, 'alias_name')}
                                                    autoComplete='off'
                                                    tooltipText='If you want to differentiate company then add this alias name, it will see in company selection list in header'
                                                    maxLength='50'
                                                />
                                                {formik.values.show_alias_name ? <p><b>Note:</b> Company has already registered with same name and alias! Please use different alias to differentiate</p> : ''}
                                            </Col>
                                            <Col md='6' className='mb-1'>
                                                <div className={`position-relative position-right-0 munim-tooltip-gap`}>
                                                    <InputTextField
                                                        value={formik.values.legal_name}
                                                        placeholder='Barry Tone'
                                                        label='Legal Name'
                                                        name='legal_name'
                                                        handleChange={formik.setFieldValue}
                                                        handleBlur={formik.setFieldTouched}
                                                        autoComplete='off'
                                                        tooltipText='A legal name is a name that is registered at the time of incorporation of a company or business. The legal name is generally the name of the company on the PAN.'
                                                        disabled={formik.values.gst_in}
                                                        maxLength='255'
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md='6' className='mb-1 position-relative'>
                                                <InputTextField
                                                    value={formik.values.address_line1}
                                                    placeholder='Floor No., Building Name'
                                                    label='Address Line 1'
                                                    name='address_line1'
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete='off'
                                                    maxLength={100}
                                                />
                                            </Col>
                                            <Col md='6' className='mb-1 position-relative'>
                                                <InputTextField
                                                    value={formik.values.address_line2}
                                                    placeholder='Near by Location, Landmark'
                                                    label='Address Line 2'
                                                    name='address_line2'
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete='off'
                                                    errors={formik.errors.address_line2}
                                                    touched={formik.touched.address_line2}
                                                    maxLength={100}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md='6' className='mb-1 position-relative'>
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
                                                    handleChange={pincodeChange}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete='off'
                                                    maxLength={6}
                                                    errors={formik.errors.pincode || errorPincode}
                                                    touched={formik.touched.pincode}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md='6' className='mb-1 position-relative'>
                                                <Label className='form-label' for='state'>
                                                    State
                                                </Label>
                                                <FixSelect
                                                    id='state'
                                                    value={formik.values.state}
                                                    options={stateList}
                                                    handleChange={handleChangeState}
                                                />
                                            </Col>
                                            <Col md='6' className='mb-1 position-relative'>
                                                <Label className='form-label required-star' for='city'>
                                                    City
                                                </Label>
                                                <FixSelect
                                                    id='city'
                                                    value={formik.values.city}
                                                    placeholder='City'
                                                    options={cityList}
                                                    handleBlur={formik.setFieldTouched}
                                                    errors={formik.errors.city}
                                                    touched={formik.touched.city}
                                                    handleChange={handleChangeCity}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md='6' className='mb-1 position-relative'>
                                                <InputNumberField value={formik.values.mobile}
                                                    isRequired={true}
                                                    placeholder='99XXXXXX01'
                                                    label='Mobile No.'
                                                    name='mobile'
                                                    maxLength="10"
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete='off'
                                                    errors={formik.errors.mobile}
                                                    touched={formik.touched.mobile}
                                                />
                                            </Col>
                                            <Col md='6' className='mb-1 position-relative'>
                                                <InputEmailField
                                                    isRequired={true}
                                                    value={formik.values.email}
                                                    placeholder='example@domain.com'
                                                    label='Email'
                                                    name='email'
                                                    handleChange={formik.setFieldValue}
                                                    handleBlur={formik.setFieldTouched}
                                                    autoComplete='off'
                                                    errors={formik.errors.email}
                                                    touched={formik.touched.email}
                                                    maxLength='50'
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md='6' className='mb-1 position-relative invalid-date-error company-established-error'>
                                                <Label className='form-label required-star' for='Company establish from'>
                                                    Company Established From
                                                </Label>
                                                <CustomDatePicker
                                                    name='establishment_date'
                                                    value={formik.values.establishment_date}
                                                    fieldVal={formik.setFieldValue}
                                                    maxDate={new Date(today_date)}
                                                    setFieldTouch={formik.setFieldTouched}
                                                    errors={formik.errors.establishment_date}
                                                    touched={formik.touched.establishment_date}
                                                    isReset={isReset}
                                                    finValApply={true}
                                                />
                                            </Col>
                                            <Col lg='6' className='mb-1 position-relative'>
                                                <Label className='form-label' for='Registration type'>
                                                    Registration Type
                                                </Label>
                                                <FixSelect
                                                    id='registration_type'
                                                    value={formik.values.registration_type}
                                                    disabled={formik.values?.gst_in !== ''}
                                                    options={gst_type_options}
                                                    handleChange={(name, value) => RegistrationTypeOptionChange(name, value, formik.values.gst_type)}
                                                />
                                            </Col>
                                        </Row>
                                    </>}
                                    <div className='d-flex justify-content-between mt-1 munim-bb-btn-group munim-save'>
                                        <CustomButton
                                            className='me-1'
                                            outline
                                            color='secondary'
                                            type='button'
                                            label={company_list.length ? 'Cancel' : 'Reset'}
                                            handleClick={() => { company_list.length ? history.push(CommonRouter.company) : resetCompanyForm() }}
                                            tabIndex="-1"
                                        />
                                        {!gstVerified && ['1', '2'].includes(formik.values.registration_type) ? <>
                                            <CustomButton
                                                className='me-1 munim-btn-blue'
                                                color='primary'
                                                type='button'
                                                handleClick={() => handleOTP(true)}
                                                label='Verify & Next'
                                                disabled={demouser}
                                                loader={gstVerifyLoader} />
                                        </> : <>
                                            <CustomButton
                                                className='me-1 munim-btn-blue'
                                                color='primary'
                                                type='button'
                                                disabled={(!formik.dirty) || formik.isSubmitting || demouser}
                                                handleClick={() => handleSubmit()}
                                                loader={saveLoader}
                                                label='Create Company' />
                                        </>}
                                    </div>
                                </Form>
                            </CardBody>
                        </div>}
                    </Card>
                    <RouterPrompt show={formik.dirty} when={formik.dirty} content={popUpMessage.cancel_content} title={popUpMessage.discard_title} closeText='Cancel' frwText='Leave Page' />
                    {['1', '2'].includes(formik.values.registration_type) ? <div>
                        <b>
                            Note:
                            <div>1. Suppose, your organization is GST registered so you are able to verify from here.</div>
                            <div>2. Enter GSTIN number and click on Verify & Next.</div>
                            <div>3. It will show the details which you have mentioned on GST portal.</div>
                            <div>4. You want to make any changes to it, you are able to do it, then create a company.</div>
                        </b>
                    </div> : ''}
                </Col>
            </Row >
        </>
    )
}

export default CreateCompany
