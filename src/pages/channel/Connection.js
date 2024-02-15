/* eslint-disable no-use-before-define */
import React, { useMemo, useState, useEffect } from 'react'
import { Card, CardBody, Col, Label, Row, TabContent, TabPane, Nav, NavItem, NavLink, FormFeedback } from 'reactstrap'
import { useFormik } from "formik"
import ModuleTitle from '../../common_components/ModuleTitle'
import CommonRouter from '../../helper/commonRoute'
import InputTextField from '../../common_components/custom_field/InputTextField'
import InputPassword from '@components/input-password-toggle'
import { useHistory } from 'react-router'
import CustomButton from '../../common_components/custom_field/CustomButton'
import ValidationMessage, { popUpMessage } from '../../common_components/Validation'
import * as Yup from 'yup'
import useNotify from '../../custom_hooks/useNotify'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import { setCookie, getCookie, generateRandomString, channel_logo, handlePageRefresh } from '../../helper/commonFunction'
import { useDispatch, useSelector } from 'react-redux'
import { ApiCall, GetApiCall } from '../../helper/axios'
import { setShowHeaderAction } from '../../redux/headerActionSlice'
import DiscardModal from '../../common_components/pop_up_modal/DiscardModal'
import { RouterPrompt } from '../../common_components/RouterPrompt'
import ConnectionModel from '../../common_components/pop_up_modal/ConnectionModel'

const ChannelConnection = () => {
    const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
    const history = useHistory()
    const notify = useNotify()
    const dispatch = useDispatch()
    const location_state = history.location.state
    const [active, setActive] = useState('1')
    const [loading, setLoading] = useState(false)
    const [discardPopUpActive, setDiscardPopUpActive] = useState(false)
    const [connectionPopUpActive, setConnectionPopUpActive] = useState(false)
    const [initialState, setInitialState] = useState({
        location_id: ""
    })
    const channelSchema = Yup.object().shape({
        location_id: Yup.string().trim()
            .required(ValidationMessage.is_require)
    })
    const getChannelObj = useMemo(() => {
        if (!history.location.pathname.includes('edit')) {
            if (getCookie('connected_channle_data')) {
                const urlParams = new URLSearchParams(window.location.search)
                const flipkartCode = urlParams.get('code')
                const flipkartState = urlParams.get('state')
                const mergeChannelObj = JSON.parse(getCookie('connected_channle_data'))
                mergeChannelObj.flipkartState = flipkartState
                mergeChannelObj.flipkartCode = flipkartCode
                return { channel_id: mergeChannelObj }
            }
        }
        if (location_state?.channel_id) {
            return location_state
        }
    }, [])

    const formik = useFormik({
        initialValues: initialState,
        enableReinitialize: true,
        validationSchema: channelSchema,
        onSubmit: (value) => {
            handlePass(value)
        }
    })
    /**
      * IW0214
      * This useEffect is call on connecton channle  
      */
    useEffect(async () => {
        try {
            if (getCookie('connected_channle_data')) {
                if (getChannelObj?.channel_id?.flipkartCode && getChannelObj?.channel_id?.flipkartState) {
                    const header = {
                        'access-token': localStorage.getItem('access_token')
                    }
                    const bodyData = {
                        id: selected_company_object.id,
                        code: getChannelObj?.channel_id?.flipkartCode,
                        state: getChannelObj?.channel_id?.flipkartState,
                        channel_type: getChannelObj?.channel_id?.channel_type,
                        channel_name: getChannelObj?.channel_id?.channel_name,
                        is_action: 1
                    }
                    const res = await ApiCall('POST', CommonApiEndPoint.connect_channel, bodyData, header)
                    if (res.data.status === 'success') {
                        notify(res.data.message, 'success')
                        setConnectionPopUpActive(!connectionPopUpActive)
                    } else {
                        notify(res.data.message, 'error')
                        setCookie('connected_channle_data', '', 0)
                        history.push(CommonRouter.channels)
                    }
                }
            }
        } catch (error) {
        }
    }, [])
    const handleCannectionChannel = (flag) => {
        if (flag) {
            history.push(CommonRouter.import_channel_item, { channel_id: getChannelObj?.channel_id })
        } else {
            history.push(CommonRouter.channels)
        }
        setCookie('connected_channle_data', '', 0)
        setConnectionPopUpActive(!connectionPopUpActive)
    }

    const handlePass = async (values) => {
        setLoading(true)
        try {
            const header = {
                'access-token': localStorage.getItem('access_token')
            }
            const data = {
                location_id: values.location_id,
                channel_type: Number(getChannelObj?.channel_id?.channel_type),
                id: selected_company_object.id
            }
            if (!history.location.pathname.includes('edit')) {
                data.channel_name = getChannelObj?.channel_id?.channel_name
                data.is_action = 0
            }
            if (history.location.pathname.includes('edit')) {
                if (formik.initialValues.location_id !== formik.values.location_id) {
                    const res = await ApiCall('PUT', CommonApiEndPoint.update_connect_channel, data, header)
                    if (res.data.status === 'success') {
                        if (getChannelObj?.channel_id?.connection_status === "0") {
                            setCookie('connected_channle_data', JSON.stringify({ ...getChannelObj.channel_id, location_id: values.location_id }), 3)
                            window.location.href = `${process.env.AUTHORIZE_URL}client_id=${process.env.FLIPKART_APP_ID}&redirect_uri=${process.env.FLIPKART_DIRECT_DOMIN}&response_type=code&scope=Seller_Api&state=${generateRandomString(6)}`
                        } else {
                            notify(res.data.message, 'success')
                            formik.handleReset()
                            formik.setSubmitting(false)
                            history.push(CommonRouter.channels)
                        }
                        setLoading(false)
                    } else {
                        notify(res.data.message, 'error')
                    }
                } else {
                    setCookie('connected_channle_data', JSON.stringify({ ...getChannelObj.channel_id, location_id: values.location_id }), 3)
                    window.location.href = `${process.env.AUTHORIZE_URL}client_id=${process.env.FLIPKART_APP_ID}&redirect_uri=${process.env.FLIPKART_DIRECT_DOMIN}&response_type=code&scope=Seller_Api&state=${generateRandomString(6)}`
                }
            } else {
                if (formik.initialValues.location_id !== formik.values.location_id) {
                    const res = await ApiCall('POST', CommonApiEndPoint.connect_channel, data, header)
                    if (res.data.status === 'success') {
                        setLoading(false)
                        setCookie('connected_channle_data', JSON.stringify({ ...getChannelObj.channel_id, location_id: values.location_id }), 3)
                        window.location.href = `${process.env.AUTHORIZE_URL}client_id=${process.env.FLIPKART_APP_ID}&redirect_uri=${process.env.FLIPKART_DIRECT_DOMIN}&response_type=code&scope=Seller_Api&state=${generateRandomString(6)}`
                    } else {
                        notify(res.data.message, 'error')
                    }
                } else {
                    setLoading(false)
                    setCookie('connected_channle_data', JSON.stringify({ ...getChannelObj.channel_id, location_id: values.location_id }), 3)
                    window.location.href = `${process.env.AUTHORIZE_URL}client_id=${process.env.FLIPKART_APP_ID}&redirect_uri=${process.env.FLIPKART_DIRECT_DOMIN}&response_type=code&scope=Seller_Api&state=${generateRandomString(6)}`
                }
            }
        } catch (error) {
        }
    }

    const toggle = tab => setActive(tab)
    const channelDataField = {
        Flipkart: [
            {
                value: formik.values.location_id,
                placeholder: "Enter location id for fetch location data",
                isRequired: true,
                label: "Location ID",
                name: "location_id",
                handleChange: formik.setFieldValue,
                handleBlur: formik.setFieldTouched,
                errors: formik.errors.location_id,
                touched: formik.touched.location_id,
                autoComplete: 'off',
                disabled: history.location.pathname.includes('edit') ? connectionPopUpActive : formik.initialValues.location_id
            }
        ]
    }
    function findValueByKey(obj, key) {
        if (obj && typeof obj === 'object') {
            if (key in obj) {
                return obj[key]
            } else {
                return []
            }
        } else {
            return []
        }
    }
    const channelFieldList = findValueByKey(channelDataField, getChannelObj?.channel_id?.channel_name)
    /**
        * IW0214
        * This function is called when user get channel details
        */
    const getConnectChannel = async () => {
        const header = {
            'access-token': localStorage.getItem('access_token')
        }
        const res = await GetApiCall('GET', `${CommonApiEndPoint.get_connect_channel_details}?id=${selected_company_object?.id}&channel_type=${getChannelObj?.channel_id.channel_type}`, header)
        if (res.data.status === 'success') {
            setInitialState({ location_id: res.data.data.location_id })
        }
    }
    useEffect(() => {
        if (selected_company_object.id) {
            getConnectChannel()
        }
    }, [selected_company_object.id])
    /**
  * IW0214
  * This function is unsaved draft channel PopUp Discard
  */
    const closeDiscardPopUp = (flag = false) => {
        if (flag) {
            formik.handleReset()
            setDiscardPopUpActive(false)
            window.removeEventListener("beforeunload", handlePageRefresh)
        } else {
            setDiscardPopUpActive(false)
        }
    }
    const handleDiscard = () => {
        setDiscardPopUpActive(true)
    }
    /**
  * IW0214
  * This useEffect is Unsaved draft channel PopUp  
  */
    useEffect(() => {
        if (formik.dirty) {
            dispatch(setShowHeaderAction({ display: true, title: 'Unsaved draft channel', mainAction: formik.handleSubmit, secondaryAction: handleDiscard, loader: loading }))
        } else {
            dispatch(setShowHeaderAction({ display: false, title: '', mainAction: formik.handleSubmit, secondaryAction: handleDiscard, loader: loading }))
        }
    }, [formik.dirty, loading])
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
                    <div className="munim-list-company">
                        <ModuleTitle links={history.location.pathname.includes('edit') ? [CommonRouter.channels] : [CommonRouter.channel_list]} breadCrumbTitle={history.location.pathname.includes('view') ? `View ${getChannelObj?.channel_id?.channel_name} Connection` : history.location.pathname.includes('edit') ? `Edit ${getChannelObj?.channel_id?.channel_name} Connection` : `${getChannelObj?.channel_id?.channel_name} Connection`} />
                    </div>
                    <Card className='my-1 munim-card-border'>
                        <Nav tabs className='mb-0 munim-border-bottom'>
                            <NavItem>
                                <NavLink
                                    active={active === '1'}
                                    onClick={() => {
                                        toggle('1')
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><g clipPath="url(#a)"><mask id="b" maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18"><path d="M17.5 17.5V.5H.5v17h17Z" fill="#fff" stroke="#fff" /></mask><g mask="url(#b)" stroke="currentColor" strokeLinejoin="10"><path d="M11.11 2.637a2.11 2.11 0 1 1-4.22 0 2.11 2.11 0 0 1 4.22 0ZM1.582 11.92a2.11 2.11 0 1 1 2.11 3.653 2.11 2.11 0 0 1-2.11-3.654Zm12.727 3.653a2.11 2.11 0 1 1 2.11-3.654 2.11 2.11 0 0 1-2.11 3.654ZM1.629 9.642a7.378 7.378 0 0 1 3.328-5.765m8.088 0a7.378 7.378 0 0 1 3.328 5.765m-4.043 7.04a7.35 7.35 0 0 1-3.328.79 7.353 7.353 0 0 1-3.328-.79" /></g></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h18v18H0z" /></clipPath></defs></svg>
                                    Connection
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={active}>
                            <TabPane tabId='1'>
                                <CardBody>
                                    <div className='munim-connection-logo'>
                                        <img className="w-100" src={channel_logo[getChannelObj?.channel_id?.channel_type]} alt="Channel logo" />
                                    </div>
                                    <Row className='mb-2'>
                                        {
                                            channelFieldList && channelFieldList.map((item) => {
                                                if (item.inputtype === "password") {
                                                    return (
                                                        <MultiInputPasswordForm data={item} />
                                                    )
                                                } else {
                                                    return (
                                                        <MultiInputForm data={item} />
                                                    )
                                                }
                                            })
                                        }
                                    </Row>
                                    <div className='d-flex justify-content-between align-items-center mt-5'>
                                        <CustomButton
                                            className='me-1'
                                            outline
                                            color='secondary'
                                            type='button'
                                            label={'Cancel'}
                                            handleClick={() => (history.location.pathname.includes('edit') ? history.push(CommonRouter.channels) : history.push(CommonRouter.channel_list))}
                                            tabIndex="-1"
                                        />
                                        <CustomButton
                                            className='me-1 munim-btn-blue'
                                            color='primary'
                                            type='button'
                                            disabled={history.location.pathname.includes('edit') ? getChannelObj?.channel_id?.connection_status === "0" ? connectionPopUpActive : !formik.dirty : formik.initialValues.location_id && getChannelObj?.channel_id?.connection_status === "0"}
                                            handleClick={formik.handleSubmit}
                                            loader={loading}
                                            label={getChannelObj?.channel_id?.connection_status === "0" ? 'Connect' : "Save"} />
                                    </div>
                                </CardBody>
                            </TabPane>
                        </TabContent>
                    </Card>

                </Col>
                <RouterPrompt show={formik.dirty} when={formik.dirty} content={popUpMessage.cancel_content} title={popUpMessage.discard_title} closeText='Cancel' frwText='Leave Page' />
                {discardPopUpActive && <DiscardModal discardPopUpActive={discardPopUpActive} popUpTitle={popUpMessage.discard_title} secondaryLabel='Cancel' popUpContent={popUpMessage.discard_content} primaryLabel='Discard Changes' handleDiscardPopUp={closeDiscardPopUp} />}
                <ConnectionModel connectionPopUpActive={connectionPopUpActive} handleConnectionPopUp={handleCannectionChannel} primaryLabel='Import Items' secondaryLabel='Later On' />
            </Row>
        </>
    )
}
export default ChannelConnection

const MultiInputForm = ({ data }) => {
    return (
        <>
            <Col lg='12' className='mt-2'>
                <div className="position-relative">
                    <InputTextField
                        value={data.value}
                        placeholder={data.placeholder}
                        isRequired={data.isRequired}
                        label={data.label}
                        name={data.name}
                        handleChange={data.handleChange}
                        handleBlur={data.handleBlur}
                        errors={data.errors}
                        touched={data.touched}
                        autoComplete={data.autoComplete}
                        disabled={data.disabled}
                    />
                </div>
            </Col>
        </>
    )
}
const MultiInputPasswordForm = ({ data }) => {
    return (
        <>
            <Col lg="12" className='mt-2'>
                <div className="position-relative munim-num-error">
                    <Label className="form-label" for="Password">
                        {data.label}
                    </Label>
                    <InputPassword
                        placeholder={data.placeholder}
                        name={data.name}
                        isRequired={data.isRequired}
                        maxLength={data.maxLength}
                        value={data.value}
                        onBlur={data.onBlur}
                        onChange={data.onChange}
                        invalid={
                            data.errors && data.touched && true
                        }
                        className={data.className}
                    />
                    {data.errors && data.touched && (
                        <FormFeedback tooltip={true}>
                            {data.errors}
                        </FormFeedback>
                    )}
                </div>
            </Col>
        </>
    )
}