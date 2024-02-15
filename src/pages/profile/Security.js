/* eslint-disable no-use-before-define */
// ** React Imports
import React, { Fragment, useState, useEffect } from 'react'
// ** Reactstrap Imports
import { Row, Col, Form, CardBody, CardTitle, CardHeader, FormFeedback, Label, InputGroup, InputGroupText } from 'reactstrap'
// ** Third Party Components
import * as Yup from 'yup'
import { useFormik } from "formik"
import { useHistory } from 'react-router-dom'
// ** Custom Components
import ValidationMessage, { popUpMessage } from '../../common_components/Validation'
import { ApiCall } from "../../helper/axios"
import CustomButton from '../../common_components/custom_field/CustomButton'
import DiscardModal from '../../common_components/pop_up_modal/DiscardModal'
import useNotify from '../../custom_hooks/useNotify'
import { setShowHeaderAction } from '../../redux/headerActionSlice'
import Hotkeys from 'react-hot-keys'
import { useDispatch, useSelector } from 'react-redux'
import { RouterPrompt } from '../../common_components/RouterPrompt'
import InputPasswordToggle from '@components/input-password-toggle'
import { handlePageRefresh } from '../../helper/commonFunction'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import CommonRouter from '../../helper/commonRoute'
import { appRedirection, munimApiEndpoint } from '../../helper/commonApi'
import InputNumberField from '../../common_components/custom_field/InputNumberField'
import { setUserName } from '../../redux/commonSlice'

let final_timer = ''
const Security = ({ activeTab, passState }) => {
  const company_list = useSelector((state) => state.commonReducer.company_list)
  const is_admin = useSelector((state) => state.commonReducer.is_admin)
  const user_data = useSelector((state) => state.commonReducer)
  const selected_pass_availabel = useSelector((state) => state.commonReducer.is_pass_available)
  const user_mobile = useSelector((state) => state.commonReducer.mobile)
  const history = useHistory()
  const notify = useNotify()
  const dispatch = useDispatch()
  const [otpVerified, setOtpVerified] = useState(false)
  const [loader, setLoader] = useState(false)
  const [otpResendDisable, setOtpResendDisable] = useState(false)
  const [otpGetDisable, setOtpGetDisable] = useState(false)
  const [discardPopUpActive, setDiscardPopUpActive] = useState(false)
  const [otpRemainingTime, setOtpRemainingTime] = useState(60)
  const [finalSchema, setFinalSchema] = useState()

  const countDown = (time) => {
    let remaining_time = time
    final_timer = setInterval(() => {
      remaining_time -= 1
      setOtpRemainingTime(remaining_time)
      if (remaining_time < 1) {
        clearInterval(final_timer)
      }
    }, 1000)
  }

  const otpSchema = {
    otp: Yup.string().trim()
      .required(ValidationMessage.otp_req)
      .min(6, ValidationMessage.otp_min_max)
      .max(6, ValidationMessage.otp_min_max)
  }

  const oldPassSchema = {
    old_password: Yup.string().trim().required(ValidationMessage.is_require)
  }

  const newPassSchema = {
    new_password: Yup.string().trim().required(ValidationMessage.is_require)
      .min(6, ValidationMessage.valid_password),
    confirm_password: Yup.string().trim()
      .oneOf([Yup.ref('new_password'), null], ValidationMessage.new_confirm_pass).required(ValidationMessage.is_require)
  }

  useEffect(() => {
    if (selected_pass_availabel) {
      setFinalSchema(Yup.object().shape({ ...oldPassSchema, ...newPassSchema }))
    } else {
      setFinalSchema(Yup.object().shape({ ...otpSchema, ...newPassSchema }))
    }
  }, [selected_pass_availabel])

  const formik = useFormik({
    initialValues: passState,
    enableReinitialize: true,
    validationSchema: finalSchema,
    onSubmit: values => {
      setLoader(true)
      //setSubmitPassLoading(true)
      // eslint-disable-next-line no-use-before-define
      handlePass(values)
    }
  })
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
   * IW0111
   * submit password data only
   */
  const handlePass = async (values) => {
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    try {
      const dataObj = { new_password: values.new_password, confirm_password: values.confirm_password }
      if (values.otp) {
        dataObj.is_new_pass = 1
      } else if (values.old_password) {
        dataObj.old_password = values.old_password
      }
      const res = await ApiCall('POST', `${munimApiEndpoint}${CommonApiEndPoint.change_password}`, dataObj, header, 10000, true)
      if (res.data.status === 'success') {
        notify(res.data.message, 'success')
        formik.handleReset()
        dispatch(setUserName({ ...user_data, is_pass_available: true }))
        window.removeEventListener("beforeunload", handlePageRefresh)
        setLoader(false)
        setOtpResendDisable(false)
        setOtpGetDisable(false)
        if (history.location.state?.moveSecurity) {
          history.push({ pathname: CommonRouter.user_account, state: { tab: '1' } })
        }
      } else {
        notify(res.data.message, 'error', appRedirection)
        setLoader(false)
      }
      setLoader(false)
    } catch (error) {
    }
  }

  const handleDiscard = () => {
    setDiscardPopUpActive(true)
    setOtpResendDisable(false)
  }

  useEffect(() => {
    if (activeTab !== '2' && formik.dirty) {
      formik.handleReset()
      history.push({ pathname: CommonRouter.user_account, state: { tab: activeTab } })
      setOtpRemainingTime(60)
    } else {
      setOtpVerified(false)
      setOtpResendDisable(false)
      setOtpGetDisable(false)
    }
    clearInterval(final_timer)
    setOtpRemainingTime(0)
  }, [activeTab])

  const handleDiscardPopUp = (flag = false) => {
    if (flag) {
      formik.handleReset()
      window.removeEventListener("beforeunload", handlePageRefresh)
      setDiscardPopUpActive(false)
      setOtpVerified(false)
      setOtpGetDisable(false)
    } else {
      setDiscardPopUpActive(false)
    }
  }

  useEffect(() => {
    if (formik.dirty) {
      dispatch(setShowHeaderAction({ display: true, title: 'Unsaved draft user account', mainAction: formik.handleSubmit, secondaryAction: handleDiscard, loader }))
    } else {
      dispatch(setShowHeaderAction({ display: false, title: '', mainAction: formik.handleSubmit, secondaryAction: handleDiscard, loader }))
    }
  }, [formik.dirty, loader])
  /**
   * IW0111
   * This function is call on redirect page on cancel button
   */
  // const redirectPage = () => {
  //   if (company_list.length) {
  //     history.push(CommonRouter.setting)
  //   } else {
  //     history.push(CommonRouter.company_create)
  //   }
  // }
  const onKeyDown = (keyName, e) => {
    e.preventDefault()
  }

  const generateOtp = async () => {
    formik.setFieldValue('otp', '')
    setOtpVerified(false)
    setOtpResendDisable(true)
    setOtpGetDisable(true)
    const data = { mobile: user_mobile }
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    const res = await ApiCall("POST", `${munimApiEndpoint}${CommonApiEndPoint.generate_otp}`, data, header, 10000, true)
    if (res.data.status === "success" && res.data.statusCode === 200) {
      if (window.location.hostname === 'ecommerce.themunim.com') {
        countDown(60)
        formik.setFieldTouched('otp', false)
      } else {
        formik.setFieldValue('otp', res.data.data.mobile_otp)
        verifyOTP(res.data.data.mobile_otp)
      }
      notify(res.data.message, 'success')
      formik.setSubmitting(false)
    } else {
      setOtpResendDisable(false)
      formik.setSubmitting(false)
      notify(res.data.message, 'error')
    }
  }

  const verifyOTP = async (otp) => {
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    const data = {
      otp_type: '1',
      otp,
      mobile: user_mobile
    }
    const res = await ApiCall('POST', `${munimApiEndpoint}${CommonApiEndPoint.verify_user_otp}`, data, header, 10000, true)
    if (res.data.status === "success" && res.data.statusCode === 200) {
      setOtpVerified(true)
    } else {
      formik.setSubmitting(false)
      notify(res.data.message, 'error')
    }
  }

  useEffect(() => {
    if (formik.values.otp?.length === 6) {
      verifyOTP(formik.values.otp)
    }
  }, [formik.values.otp])
  return (
    <Fragment>
      <Form>
        <Hotkeys keyName="enter" onKeyDown={onKeyDown} filter={() => true}></Hotkeys>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Change Password</CardTitle>
        </CardHeader>
        <CardBody className='pt-1'>
          <Row>
            {selected_pass_availabel ? <Col sm='6' className='mb-1 position-relative mt-1'>
              <div className="position-relative identix-num-error">
                <Label className="form-label required-star" for="Current password">
                  Current Password
                </Label>
                <InputPasswordToggle
                  placeholder="Current Password"
                  name="old_password"
                  maxLength='16'
                  value={formik.values.old_password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={is_admin}
                  invalid={
                    formik.errors.old_password && formik.touched.old_password && true
                  }
                  className="input-group-merge"
                />
                {formik.errors.old_password && formik.touched.old_password && (
                  <FormFeedback tooltip={true}>
                    {formik.errors.old_password}
                  </FormFeedback>
                )}
              </div>
            </Col> : ''}
            {!selected_pass_availabel ? <Col sm='6' className='mb-1 position-relative mt-1'>
              <div className='d-flex align-items-end justify-content-start identix-mobile-div-otp-dec w-100 identix-sign-in-resend'>
                <div className="position-relative w-100">
                  <Label className="form-label required-star" for="Mobile No">
                    Mobile No.
                  </Label>
                  <InputGroup>
                    <InputGroupText className="border-end-0">
                      +91
                    </InputGroupText>
                    <InputNumberField
                      value={formik.values.mobile}
                      isRequired={true}
                      placeholder='99XXXXXX01'
                      name='mobile'
                      maxLength='10'
                      className='ms-0 border-start num-input-bdr'
                      handleChange={formik.setFieldValue}
                      handleBlur={formik.setFieldTouched}
                      autoComplete='off'
                      disabled
                      errors={formik.errors.mobile}
                      touched={formik.touched.mobile}
                    />
                  </InputGroup>
                </div>
                {!otpGetDisable && <div className="pt-0 position-relative identix-send-otp-btn w-100">
                  <CustomButton
                    type='button'
                    color='primary'
                    disabled={otpRemainingTime !== 0}
                    label='Get OTP'
                    handleClick={generateOtp}
                  />
                </div>}
              </div>
            </Col> : ''}
            {otpGetDisable ? <Col sm='6' className='mb-1 position-relative mt-1'>
              <div className='d-flex align-items-end justify-content-start identix-mobile-div-otp-dec w-100 identix-sign-in-resend'>
                <div className="position-relative w-100">
                  <Label className="form-label required-star" for="Get OTP">
                    Get OTP
                  </Label>
                  <InputNumberField
                    value={formik.values.otp}
                    isRequired={true}
                    placeholder='Enter OTP'
                    className={otpVerified ? 'otp-verify-icon' : ''}
                    name='otp'
                    handleChange={formik.setFieldValue}
                    handleBlur={formik.setFieldTouched}
                    autoComplete='off'
                    maxLength={6}
                    disabled={otpVerified}
                    errors={formik.errors.otp || (!otpVerified && formik.values.otp?.length === 6 ? 'Please enter valid OTP!' : '')}
                    touched={formik.touched.otp}
                    onHoverTooltip={true}
                  />
                  {formik.errors.otp && formik.touched.otp && (
                    <FormFeedback tooltip={true}>
                      {formik.errors.otp}
                    </FormFeedback>
                  )}
                </div>
                {!otpVerified && <div className="pt-0 position-relative identix-send-otp-btn w-100">
                  <CustomButton
                    type='button'
                    color='primary'
                    disabled={otpResendDisable && otpRemainingTime !== 0}
                    label='Resend'
                    handleClick={generateOtp}
                  />
                </div>}
              </div>
            </Col> : ''}
            {otpResendDisable && !otpVerified && otpRemainingTime !== 0 ? <Col md='12' className='position-relative w-100'>
              You can request another OTP {otpRemainingTime} sec
            </Col> : ''}
          </Row>
          <Row>
            <Col sm='6' className='mb-1 position-relative mt-1'>
              <div className="mb-1 position-relative identix-num-error">
                <Label className="form-label required-star" for="New password">
                  New Password
                </Label>
                <InputPasswordToggle
                  placeholder="New Password"
                  name="new_password"
                  maxLength='16'
                  value={formik.values.new_password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={is_admin || (!selected_pass_availabel && !otpVerified) || (otpGetDisable && !formik.dirty)}
                  invalid={
                    (!selected_pass_availabel && !otpVerified) ? false : (formik.errors.new_password && formik.touched.new_password) && true
                  }
                  className="input-group-merge"
                />
                {formik.errors.new_password && formik.touched.new_password && (
                  <FormFeedback tooltip={true} dangerouslySetInnerHTML={{ __html: formik.errors.new_password }}>
                  </FormFeedback>
                )}
              </div>
            </Col>
            <Col sm='6' className='mb-1 position-relative mt-1'>
              <div className="mb-1 position-relative identix-num-error">
                <Label className="form-label required-star" for="Confirm password">
                  Confirm Password
                </Label>
                <InputPasswordToggle
                  placeholder="Confirm Password"
                  name="confirm_password"
                  maxLength='16'
                  value={formik.values.confirm_password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={is_admin || (!selected_pass_availabel && !otpVerified) || (otpGetDisable && !formik.dirty)}
                  invalid={
                    (!selected_pass_availabel && !otpVerified) ? false : (formik.errors.confirm_password && formik.touched.confirm_password) && true
                  }
                  className="input-group-merge"
                />
                {formik.errors.confirm_password && formik.touched.confirm_password && (
                  <FormFeedback tooltip={true}>
                    {formik.errors.confirm_password}
                  </FormFeedback>
                )}
              </div>
            </Col>
          </Row>
          <div className='d-flex justify-content-between identix-bb-btn-group identix-save'>
            <CustomButton
              type='button'
              outline
              color='secondary'
              label='Cancel'
              handleClick={() => { company_list.length ? history.push(CommonRouter.setting) : history.push(CommonRouter.company_create) }}
              tabIndex="-1"
            />
            {!is_admin ? <CustomButton
              type='button'
              handleClick={formik.handleSubmit}
              color='primary'
              label='Save'
              disabled={(formik.errors.new_password && formik.errors.confirm_password) || !selected_pass_availabel ? !otpVerified : otpVerified}
              loader={loader}
            /> : ''}
          </div>
        </CardBody>
      </Form>
      <RouterPrompt
        show={formik.dirty}
        when={formik.dirty}
        content={popUpMessage.cancel_content}
        title={popUpMessage.discard_title}
        closeText='Cancel'
        frwText='Leave Page'
      />
      <DiscardModal
        discardPopUpActive={discardPopUpActive}
        popUpTitle={popUpMessage.discard_title}
        secondaryLabel='Cancel'
        popUpContent={popUpMessage.discard_content}
        primaryLabel='Discard Changes'
        handleDiscardPopUp={handleDiscardPopUp}
      />
    </Fragment>
  )
}
export default Security