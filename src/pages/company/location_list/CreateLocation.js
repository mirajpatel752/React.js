/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Label, Row } from "reactstrap"
import InputTextField from "../../../common_components/custom_field/InputTextField"
import { useFormik } from "formik"
import { useSelector } from "react-redux"
import ValidationMessage from "../../../common_components/Validation"
import commonRegex from "../../../helper/constants"
import * as yup from 'yup'
import FixSelect from "../../../common_components/search_select/FixSelect"
import CustomDatePicker from '../../../common_components/calender/CustomDatePicker'
import CustomButton from '../../../common_components/custom_field/CustomButton'
import { getCityData, getStateData } from '../../../helper/commonFunction'
import CommonApiEndPoint from '../../../helper/commonApiEndPoint'
import { ApiCall, GetApiCall } from '../../../helper/axios'
import useNotify from '../../../custom_hooks/useNotify'

const CreateLocation = ({ toggleSidebar, flag, setListingShow, locationListData }) => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const today_date = useSelector((state) => state.commonReducer.today_date)
    const companySchema = yup.object().shape({
        gst_in: yup.string().trim()
            .matches(commonRegex.gst_no, ValidationMessage.gst_valid)
            .when('registration_type', {
                is: (registration_type) => ['1', '2'].includes(registration_type),
                then: yup.string().trim()
                    .required(ValidationMessage.is_require)
            })
    })

    const [initialState, setInitialState] = useState({
        company_name: '',
        gst_in: '',
        address: "",
        city: 1,
        state: 12,
        location: '',
        est_date: ''
    })
    const [cityList, setCityList] = useState([])
    const [stateList, setStateList] = useState([])
    const [saveLoader, setSaveLoader] = useState(false)
    const formik = useFormik({
        initialValues: initialState,
        validationSchema: companySchema,
        onSubmit: (value) => {
            handleSave(value)
        },
        enableReinitialize: true
    })

    const handleSave = async () => {
        setSaveLoader(true)
        if (flag === 2) {
            const data = {
                id: locationListData.id,
                company_id: selected_company_object.id,
                company_name: formik.values.company_name,
                gst_in: formik.values.gst_in,
                address: formik.values.address,
                city: formik.values.city,
                state: formik.values.state,
                location: formik.values.location,
                est_date: formik.values.est_date
            }
            const header = { 'access-token': localStorage.getItem('access_token') }
            const res = await ApiCall('PUT', CommonApiEndPoint.update_location, data, header)
            if (res.data.status === 'success') {
                setListingShow(0)
                setSaveLoader(false)
            } else if (res.data.status === 'error') {
                formik.setSubmitting(false)
                setSaveLoader(false)
                useNotify(res.data.message, 'error')
            }
        } else {
            const data = {
                company_id: selected_company_object.id,
                company_name: formik.values.company_name,
                gst_in: formik.values.gst_in,
                address: formik.values.address,
                city: formik.values.city,
                state: formik.values.state,
                location: formik.values.location,
                est_date: formik.values.est_date
            }
            const header = { 'access-token': localStorage.getItem('access_token') }
            const res = await ApiCall('POST', CommonApiEndPoint.create_location, data, header)
            if (res.data.status === 'success') {
                setListingShow(0)
                setSaveLoader(false)
                useNotify(res.data.message, 'success')
            } else if (res.data.status === 'error') {
                formik.setSubmitting(false)
                setSaveLoader(false)
                useNotify(res.data.message, 'error')
            }
        }

    }

    const handleChangeCity = (name, value) => {
        formik.setFieldValue(name, value)
        cityList.find((ele) => {
            if (ele.value === value) {
                formik.setFieldValue('city_name', ele.label)
                return true
            }
        })
    }
    const handleChangeState = (name, value) => {
        formik.setFieldValue(name, value)
    }

    const getState = async () => {
        const state_data = await getStateData(101)
        setStateList(state_data)
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

    useEffect(() => {
        getState()
        getCityList(formik.values.state)
    }, [formik.values.state])


    async function getDetailsLocaltion() {
        const header = { 'access-token': localStorage.getItem('access_token') }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_location_details}?id=${locationListData.id}`, header)
        if (res.data.status === 'success') {
            setInitialState({ ...res.data.data })
        } else if (res.data.statusCode === 404) {
            setInitialState({})
        }
    }

    useEffect(() => {
        if (flag === 2) {
            getDetailsLocaltion()
        }
    }, [locationListData])

    return (
        <>
            <Card className='shadow-none'>
                <CardBody className='p-0'>
                    <Row className=''>
                        <Col md='6' className='mb-1 position-relative '>
                            <div className={`position-relative position-right-0`}>
                                <InputTextField value={formik.values.company_name}
                                    isRequired={false}
                                    placeholder='Barry Tone PVT. LTD.'
                                    label='Company Name'
                                    name='company_name'
                                    handleChange={formik.setFieldValue}
                                    handleBlur={formik.setFieldTouched}
                                    autoComplete='off'
                                    errors={formik.errors.company_name}
                                    touched={formik.touched.company_name}
                                    maxLength='255'
                                />
                            </div>
                        </Col>
                        <Col lg='6' className="mb-1 position-relative" >
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
                                    errors={formik.errors.gst_in}
                                    touched={formik.touched.gst_in}
                                    toUpperCase={true}
                                />
                            </div>
                        </Col>
                        <Col md='12' className='mb-1 position-relative'>
                            <InputTextField value={formik.values.address}
                                isRequired={false}
                                placeholder='Floor No., Building Name'
                                label='Address'
                                name='address'
                                handleChange={formik.setFieldValue}
                                handleBlur={formik.setFieldTouched}
                                autoComplete='off'
                                errors={formik.errors.address}
                                touched={formik.touched.address}
                                maxLength='100'
                            />
                        </Col>
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
                            <Label className='form-label' for='city'>
                                City
                            </Label>
                            <FixSelect
                                id='city'
                                value={formik.values.city}
                                options={cityList}
                                handleBlur={formik.setFieldTouched}
                                errors={formik.errors.city}
                                touched={formik.touched.city}
                                handleChange={handleChangeCity}
                            />
                        </Col>
                        <Col md='6' className='mb-1 position-relative'>
                            <InputTextField value={formik.values.location}
                                isRequired={false}
                                placeholder='Block number 405, India'
                                label='Location'
                                name='location'
                                handleChange={formik.setFieldValue}
                                handleBlur={formik.setFieldTouched}
                                autoComplete='off'
                                errors={formik.errors.location}
                                touched={formik.touched.location}
                                maxLength='100'
                            />
                        </Col>
                        <Col md='6' className='mb-1 position-relative'>
                            <div className='location-date'>
                                <Label className='form-label' for='est_date'>
                                    Est. Date
                                </Label>
                                <CustomDatePicker
                                    value={formik.values.est_date}
                                    placeholder='03-11-2023'
                                    name='est_date'
                                    maxDate={new Date(today_date)}
                                    fieldVal={formik.setFieldValue}
                                    handleChange={formik.setFieldValue}
                                    handleBlur={formik.setFieldTouched}
                                    autoComplete='off'
                                    errors={formik.errors.location}
                                    touched={formik.touched.location}
                                    finValApply={true}
                                />
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <div className='munim-sidebar-footer'>
                <div className='d-flex justify-content-between munim-save'>
                    <CustomButton className='me-1' outline color='secondary' type='button' handleClick={() => { toggleSidebar(false, formik.dirty, ''); setListingShow(0) }} label='Cancel' tabIndex="-1" />
                    <CustomButton loader={saveLoader} className='me-1' color='primary' type='button' disabled={!formik.dirty} handleClick={formik.handleSubmit} nextFocusId={''} label='Save' />
                </div>
            </div>
        </>
    )
}

export default CreateLocation