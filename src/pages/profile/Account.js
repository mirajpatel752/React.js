/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-use-before-define */
// ** React Imports
import React, { Fragment, useState, useEffect } from 'react'
// ** Third Party Components
import * as Yup from 'yup'
import { useFormik } from "formik"
import moment from 'moment'
import { useHistory } from 'react-router-dom'
//** Custom Components
import ValidationMessage, { popUpMessage, notifyMessage } from '../../common_components/Validation'
import { GetApiCall, ApiCall } from "../../helper/axios"
import CustomButton from '../../common_components/custom_field/CustomButton'
import useNotify from '../../custom_hooks/useNotify'
import Avatar from '@components/avatar'
import Hotkeys from 'react-hot-keys'
// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Spinner, CardText, InputGroupText, InputGroup, Button } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import DiscardModal from '../../common_components/pop_up_modal/DiscardModal'
import { setUserFirstLastName, setUserName } from '../../redux/commonSlice'
import { setShowHeaderAction } from '../../redux/headerActionSlice'
import { RouterPrompt } from '../../common_components/RouterPrompt'
import { handlePageRefresh } from '../../helper/commonFunction'
import InputEmailField from '../../common_components/custom_field/InputEmailField'
import InputTextField from '../../common_components/custom_field/InputTextField'
import WarningModal from '../../common_components/pop_up_modal/WarningModal'
import emailRegex from '../../helper/constants'
import PasswordConfirmation from '../../common_components/pop_up_modal/PasswordConfirmation'
import CommonApiEndPoint from '../../helper/commonApiEndPoint'
import CommonRouter from '../../helper/commonRoute'
import InputNumberField from '../../common_components/custom_field/InputNumberField'
import { appRedirection, isLocal, munimApiEndpoint } from '../../helper/commonApi'
import createGuest from 'cross-domain-storage/guest'

let timer = ''
const UserAccountDetail = ({ activeTab, formState, setFormState, changeEmailAddress, setChangeEmailAddress }) => {
  // ** Hooks
  const history = useHistory()
  const notify = useNotify()
  const dispatch = useDispatch()
  const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
  const user_data = useSelector((state) => state.commonReducer)
  const selected_pass_availabel = useSelector((state) => state.commonReducer.is_pass_available)
  const [acceptLoader, setAcceptLoader] = useState(false)
  const [declineLoader, setDeclineLoader] = useState(false)
  const [step, setStep] = useState(0)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [discardPopUpActive, setDiscardPopUpActive] = useState(false)
  const [acceptDeclineIndex, setAcceptDeclineIndex] = useState('')
  const [reciveInvitation, setReciveInvitation] = useState([])
  const [showPopUp, setShowPopUp] = useState(false)
  const [finalSchema, setFinalSchema] = useState()
  const [remainigTime, setRemainigTime] = useState(60)
  const [mobileVerified, setMobileVerified] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [mobileGetOtpDisable, setMobileGetOtpDisable] = useState(false)
  const [emailGetOtpDisable, setEmailGetOtpDisable] = useState(false)
  const [emailFieldDisable, setEmailFieldDisable] = useState(true)
  const [changeEmail, setChangeEmail] = useState(changeEmailAddress)
  const [changeMobile, setChangeMobile] = useState(false)
  const [mobileEmailotpType, setMobileEmailOtpType] = useState(0)
  const [acceptedToken, setAcceptedToken] = useState('')
  const [passwordPopUpActive, setPasswordPopUpActive] = useState(false)
  const [passwordVerifyLoader, setPasswordVerifyLoader] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [passwordVerifyType, setPasswordVerifyType] = useState(0)
  const [emailValid, setEmailValid] = useState(true)
  const [generateOTPLoader, setGenetateOTPLoader] = useState(false)
  const [completeProfile, setCompleteProfile] = useState(false)
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState(false)
  const [discard, setDiscard] = useState(false)

  const formSchema = {
    fname: Yup.string().trim()
      .min(2, ValidationMessage.to_short),
    lname: Yup.string().trim()
      .min(2, ValidationMessage.to_short),
    email: Yup.string().trim()
      // .required(ValidationMessage.is_require)
      .email(ValidationMessage.valid_email)
      .matches(emailRegex, ValidationMessage.valid_email),
    mobile: Yup.string().trim()
      .required(ValidationMessage.is_require)
      .matches(/^[6-9]\d{9}$/gi, ValidationMessage.mn_not_valid)
      .required(ValidationMessage.is_require)
  }
  const secondStepSchema = {
    mobile_otp: (mobileEmailotpType === 2 && completeProfile === true) || mobileEmailotpType === 1 ? Yup.string().trim()
      .required(ValidationMessage.otp_req)
      .min(6, ValidationMessage.otp_min_max)
      .max(6, ValidationMessage.otp_min_max) : false,
    email_otp: mobileEmailotpType === 2 ? Yup.string().trim()
      .required(ValidationMessage.otp_req)
      .min(6, ValidationMessage.otp_min_max)
      .max(6, ValidationMessage.otp_min_max) : false
  }
  useEffect(() => {
    if (step === 2) {
      setFinalSchema(Yup.object().shape({ ...formSchema, ...secondStepSchema }))
    } else {
      setFinalSchema(Yup.object().shape({ ...formSchema }))
    }
  }, [step])

  const countDown = (time) => {
    let remaining_time = time
    timer = setInterval(() => {
      remaining_time -= 1
      setRemainigTime(remaining_time)
      if (remaining_time < 1) {
        clearInterval(timer)
      }
    }, 1000)
  }
  const receiveInvitationData = async () => {
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    const recive_invitation = []
    const res = await GetApiCall('GET', CommonApiEndPoint.receive_invitations, header)
    if (res.data?.status === 'success' && res.data?.statusCode === 200) {
      if (res.data.data.length) {
        res.data.data.map((ele) => {
          recive_invitation.push({
            company_name: ele.company_name,
            location: ele.is_support === '1' ? moment(ele.last_login).format('LLLL') : `Last Login was ${moment(ele.last_login).format('LLLL')}`,
            first_char_name: `${ele.company_name.charAt(0)}`,
            support: ele.is_support,
            id: ele.id,
            token: ele.token,
            email: ele.email,
            company_id: ele.company_id
          })
        })
        setReciveInvitation(recive_invitation)
      } else {
        setReciveInvitation([])
      }
      setLoading(false)
    } else {
      setReciveInvitation([])
      setLoading(false)
    }
  }
  /**
   * IW0079
   * This function is called when the user take any action on company change warining modal popup
   */
  const closePopUp = async (name, flag, accept_token) => {
    const header = {
      'access-token': localStorage.getItem('access_token'), id: selected_company_object.id
    }
    const data = {
      token: accept_token ? accept_token : acceptedToken,
      is_company_change: flag ? 1 : 0
    }
    const res = await ApiCall('POST', CommonApiEndPoint.accept_invitation, data, header)
    if (res.data.status === 'success' && res.data.statusCode === 200) {
      notify(res.data.message, 'success')
      receiveInvitationData()
      setAcceptLoader(false)
      if (flag) {
        history.push('/')
        location.reload()
      }
      setShowPopUp(false)
    } else {
      notify(res.data.message, 'error')
      setAcceptLoader(false)
      setShowPopUp(false)
    }
  }
  const handleAcceptInvitation = (token, index, support) => {
    setAcceptedToken(token)
    setShowPopUp(true)
    if (support === '1') {
      setShowPopUp(false)
      closePopUp('', false, token)
    }
    setAcceptDeclineIndex(index)
    setAcceptLoader(true)
  }
  const handleDeclineInvitation = async (token, email, company_id, index) => {
    setAcceptDeclineIndex(index)
    setDeclineLoader(true)
    const header = {
      'access-token': localStorage.getItem('access_token'), id: selected_company_object.id
    }
    const data = {
      token
    }
    const res = await ApiCall(
      'POST',
      CommonApiEndPoint.decline_invitation,
      data,
      header
    )

    if (res.data.status === 'success' && res.data.statusCode === 200) {
      let removeIndex
      reciveInvitation.find((element, i) => {
        if (element.company_id === company_id && element.email === email) {
          removeIndex = i
          return true
        }
      })
      reciveInvitation.splice(removeIndex, 1)
      const detail = [...reciveInvitation]
      setReciveInvitation(detail)
      notify(res.data.message, 'success')
      receiveInvitationData()
      setDeclineLoader(false)
    } else {
      notify(res.data.message, 'error')
      setDeclineLoader(false)
    }
  }
  const formik = useFormik({
    initialValues: formState,
    enableReinitialize: true,
    validationSchema: finalSchema,
    // onChange:(e) => {
    //
    //
    // },
    onSubmit: values => {
      // eslint-disable-next-line no-use-before-define  
      if ((step === 1 && !mobileEmailotpType && !mobileVerified && !emailVerified) || (step === 0 && changeEmailAddress && formik.values.email)) {
        notify(notifyMessage.otp_error_message, 'error')
        setFormSubmitted(false)
      } else {
        handleForm(values)
      }
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

  useEffect(() => {
    if (formik.values.email && !emailValid) {
      setEmailValid(true)
    }

  }, [formik.values.email])

  const getRenewToken = async () => {
    const header = { 'refresh-token': localStorage.getItem('refresh_tokens') }
    const res = await GetApiCall('GET', `${munimApiEndpoint}${CommonApiEndPoint.renew_token}`, header, true, true)
    if (res.data.status === 'success' && res.data.statusCode === 200) {
      const current_time = new Date()
      localStorage.setItem('access_token', res.data.data.access_token)
      localStorage.setItem('_ett', current_time ? Number(current_time.getTime()) + 10800000 : '')
      if (isLocal) {
        const set_is_login = createGuest(`${process.env.LOGIN_DOMAIN}/log-in?is_check_storage`)
        set_is_login.get('is_log', function (error, value) {
          if (value) {
            const current_time = Date.parse(new Date(new Date()))
            set_is_login.set('common_data', JSON.stringify({ _ett: current_time + 10800000, access_token: res.data.data.access_token, refresh_tokens: localStorage.getItem('refresh_tokens'), userData: JSON.stringify(localStorage.getItem('userData')) }))
          }
        })
      }
    } else {
      localStorage.removeItem('access_token')
    }
  }
  /* 
** IW0111
submit form data only (except password)*/
  const handleForm = async (values) => {
    if (step === 1 || step === 2) {
      generateOtp(1)
    } else {
      setLoader(true)
      if (formik.dirty) {
        const header = {
          'access-token': localStorage.getItem('access_token')
        }
        const data = {
          fname: values.fname,
          lname: values.lname,
          email: values.email,
          mobile: values.mobile
        }
        try {
          const res = await ApiCall('PUT', `${munimApiEndpoint}${CommonApiEndPoint.update_profile}`, data, header, 10000, true)
          if (res.data.status === 'success') {
            notify(res.data.message, 'success')
            dispatch(setUserName({ ...user_data, fname: values.fname, lname: values.lname, email: values.email, mobile: values.mobile }))
            if (formik.initialValues.email !== values.email || formik.initialValues.mobile !== values.mobile) {
              getRenewToken()
            }
            dispatch(setUserFirstLastName([values.fname, values.lname]))
            window.removeEventListener("beforeunload", handlePageRefresh)
            setFormState(values)
            setStep(0)
            setMobileEmailOtpType(0)
            setFormSubmitted(false)
            setChangeMobile(false)
            setChangeEmail(formik.initialValues.email ? changeEmailAddress : !changeEmailAddress)
            setLoader(false)
            setMobileVerified(false)
            setEmailVerified(false)
            setTimeout(0)
            setRemainigTime(0)
            if (mobileEmailotpType === 1) {
              setMobileGetOtpDisable(false)
            } else if (mobileEmailotpType === 2) {
              setChangeEmailAddress(false)
              setEmailFieldDisable(true)
              setEmailGetOtpDisable(false)
            }
            formik.handleReset()
          } else {
            formik.setSubmitting(false)
            setLoader(false)
            setFormSubmitted(false)
            notify(res.data.message, 'error')
          }
        } catch (error) {
        }
      }
    }
  }
  const resendOtp = (otpType) => {
    if (otpType === 1 && !formik.errors.mobile) {
      formik.setFieldValue('mobile_otp', '')
      generateOtp(2, 1)
    } else if (otpType === 2 && !formik.errors.email && !formik.errors.mobile) {
      formik.setFieldValue('email_otp', '')
      formik.setFieldValue('mobile_otp', '')
      setMobileVerified(false)
      setEmailVerified(false)
      generateOtp(2, 2)
    }
  }
  const handleDiscardPopUp = (flag = false) => {
    if (flag) {
      clearInterval(timer)
      setRemainigTime(0)
      window.removeEventListener("beforeunload", handlePageRefresh)
      setDiscardPopUpActive(false)
      setStep(0)
      setMobileEmailOtpType(0)
      setTimeout(0)
      setFormSubmitted(false)
      setChangeMobile(false)
      setChangeEmail(formik.initialValues.email ? changeEmailAddress : !changeEmailAddress)
      setLoader(false)
      setMobileVerified(false)
      setEmailVerified(false)
      setEmailGetOtpDisable(false)
      setMobileGetOtpDisable(false)
      setEmailFieldDisable(true)
      formik.handleReset()
    } else {
      setDiscardPopUpActive(false)
    }
  }
  const handleDiscard = () => {
    setDiscardPopUpActive(true)
  }

  useEffect(() => {
    if (formik.dirty) {
      dispatch(setShowHeaderAction({ display: true, title: 'Unsaved draft user account', mainAction: handleUserAccountGetOtp, secondaryAction: handleDiscard, loader }))
    } else {
      dispatch(setShowHeaderAction({ display: false, title: '', mainAction: handleUserAccountGetOtp, secondaryAction: handleDiscard, loader }))
    }
  }, [formik.dirty, loader])

  useEffect(() => {
    if (activeTab !== '1' && formik.dirty) {
      formik.handleReset()
      history.push({ pathname: CommonRouter.user_account, state: { tab: activeTab } })
      if (changeEmail || changeMobile) {
        clearInterval(timer)
        setRemainigTime(0)
        setStep(0)
        setMobileEmailOtpType(0)
        setTimeout(0)
        setFormSubmitted(false)
        setChangeMobile(false)
        setChangeEmail(formik.initialValues.email ? changeEmailAddress : !changeEmailAddress)
        setLoader(false)
        setMobileVerified(false)
        setEmailVerified(false)
      }
    }
  }, [activeTab])

  useEffect(() => {
    // receiveInvitationData()
    setLoading(false)
  }, [changeEmailAddress])

  const handleUserAccountGetOtp = () => {
    if (formik.errors.email || formik.errors.mobile) {
      setGenetateOTPLoader(false)
    } else {
      if (!formSubmitted) {
        setFormSubmitted(true)
      }
    }
  }
  useEffect(() => {
    if (formSubmitted) {
      formik.handleSubmit()
      if (step === 2) {
        formik.setTouched({ ...formik.touched, email_otp: mobileEmailotpType === 2, mobile_otp: mobileEmailotpType === 1 })
      }
    }
  }, [formSubmitted])

  // useEffect(() => {
  //   setFormSubmitted(false)
  // }, [formik.errors])
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
  const onUserPermissionPage = (token, id) => {
    const data = { token, id }
    history.push(CommonRouter.edit_accept_up_setting, { staff_id: id, user_data: data })
  }
  const verifyOTP = async (otpType) => {
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    let data
    if (otpType === 1) {
      data = {
        otp_type: 1,
        otp: formik.values.mobile_otp,
        mobile: formik.values.mobile
      }
    } else {
      data = {
        otp_type: 2,
        otp: formik.values.email_otp,
        email: formik.values.email
      }
    }
    const res = await ApiCall("POST", `${munimApiEndpoint}${CommonApiEndPoint.verify_user_otp}`, data, header, 10000, true)
    if (res.data.status === "success" && res.data.statusCode === 200) {
      if (otpType === 1) {
        setMobileVerified(true)
      } else {
        setEmailVerified(true)
      }
      setFormSubmitted(false)
    } else {
      notify(res.data.message, 'error')
      setFormSubmitted(false)
    }
  }
  /**
  * IW0079
  * This effect called when user enter mobile OTP
  */
  useEffect(() => {
    if (formik.values.mobile_otp?.length === 6) {
      verifyOTP(1)
    }
  }, [formik.values.mobile_otp])
  /**
   * IW0079
   * This effect called when user enter email OTP
   */
  useEffect(() => {
    if (formik.values.email_otp?.toString()?.length === 6) {
      verifyOTP(2)
    }
  }, [formik.values.email_otp])
  /**
   * IW0079
   * This effect called when email and mobile verified with respective OTP.
   */
  useEffect(() => {
    if ((mobileEmailotpType === 1 && mobileVerified) || (mobileEmailotpType === 2 && mobileVerified && emailVerified)) {
      if (!completeProfile && mobileEmailotpType === 1 && (formik.initialValues.mobile === formik.values.mobile)) {
        setStep(4)
      } else {
        setStep(3)
      }
      clearInterval(timer)
    }
  }, [mobileVerified, emailVerified])

  const generateOtp = async (action, otpType) => {
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    const data = {
      user_name: formik.values.fname,
      action
    }
    if (action === 1) {
      if (mobileEmailotpType === 1) {
        data.mobile = formik.values.mobile
        data.otp_type = mobileEmailotpType
      } else {
        data.email = formik.values.email
        data.mobile = formik.values.mobile
        data.otp_type = mobileEmailotpType
      }
    }
    if (action === 2) {
      if (otpType === 1) {
        data.mobile = formik.values.mobile
        data.otp_type = otpType
      } else {
        data.email = formik.values.email
        data.mobile = formik.values.mobile
        data.otp_type = otpType
      }
    }
    if ((step === 1 && !otpType) || (step === 2 && otpType)) {
      const res = await ApiCall("POST", `${munimApiEndpoint}${CommonApiEndPoint.change_email_mobile}`, data, header, 10000, true)
      if (res.data.status === "success" && res.data.statusCode === 200) {
        setEmailValid(true)
        setGenetateOTPLoader(false)
        setStep(2)
        if (window.location.hostname === 'ecommerce.themunim.com') {
          if (action === 1) {
            countDown(60)
            formik.setTouched({ ...formik.touched, mobile_otp: false, email_otp: false })
          } else if (otpType === 1) {
            countDown(60)
            formik.setFieldTouched('mobile_otp', false)
          } else if (otpType === 2) {
            countDown(60)
            formik.setFieldTouched('email_otp', false)
            formik.setFieldTouched('mobile_otp', false)
          }
        } else {
          if (mobileEmailotpType === 1) {
            formik.setFieldValue('mobile_otp', res.data.data.mobile_otp)
            setMobileVerified(true)
          } else {
            formik.setFieldValue('email_otp', res.data.data.email_otp)
            formik.setFieldValue('mobile_otp', res.data.data.mobile_otp)
            setEmailVerified(true)
            setMobileVerified(true)
          }
        }
        if (formik.initialValues.mobile !== formik.values.mobile && mobileVerified) {
          setStep(3)
        }
        notify(res.data.message, 'success')
        setFormSubmitted(false)
        formik.setSubmitting(false)
      } else {
        if (res.data?.data?.verify === false) {
          setEmailValid(false)
        }
        if (mobileEmailotpType === 1) {
          setMobileVerified(true)
        } else if (!changeEmailAddress) {
          setChangeEmail(true)
        }
        setGenetateOTPLoader(false)
        setMobileEmailOtpType(0)
        formik.setSubmitting(false)
        setFormSubmitted(false)
        setEmailGetOtpDisable(true)
        setEmailFieldDisable(true)
        notify(res.data.message, 'error')
        if (formik.initialValues.mobile !== formik.values.mobile) {
          setStep(4)
        }
      }
    }
  }
  const handleEmailMobileGetOTP = (otpType) => {
    formik.setFieldValue('mobile_otp', '')
    formik.setFieldValue('email_otp', '')
    setMobileVerified(false)
    setEmailVerified(false)
    if (otpType === 2) {
      setCompleteProfile(true)
      setEmailFieldDisable(false)
      setChangeEmail(formik.initialValues.email ? changeEmailAddress : !changeEmailAddress)
    } else if (otpType === 1) {
      if (changeEmailAddress === true) {
        setChangeEmail(true)
        formik.setFieldValue('email', '')
      }
      if (formik.initialValues.mobile !== formik.values.mobile) {
        setStep(1)
      }
    }
    setGenetateOTPLoader(true)
    setMobileEmailOtpType(otpType)
    handleUserAccountGetOtp()
  }
  const handleSetPassword = (name, e) => {
    setCurrentPassword(e)
  }
  /**
  * IW0110
  * This function is called when user change email or mobile no. then check current password confirmation
  */
  const handlePassword = async (type) => {
    if (selected_pass_availabel && type === 2) {
      setPasswordPopUpActive(true)
      setPasswordVerifyType(type)
      setCurrentPassword('')
    } else if (changeEmailAddress === true && !selected_pass_availabel && type === 2) {
      setStep(1)
      if (type === 1) {
        setChangeMobile(true)
        setChangeEmail(false)
        setMobileGetOtpDisable(true)
        setEmailGetOtpDisable(false)
      } else {
        setChangeEmail(false)
        handleEmailMobileGetOTP(type)
        setEmailGetOtpDisable(true)
        setMobileGetOtpDisable(false)
      }
    } else {
      setStep(1)
      if (type === 1) {
        setChangeMobile(true)
        handleEmailMobileGetOTP(type)
        setCompleteProfile(false)
        setMobileGetOtpDisable(true)
        setEmailGetOtpDisable(false)
      } else {
        setChangeEmail(true)
        setEmailGetOtpDisable(true)
        setMobileGetOtpDisable(false)
      }
    }
  }
  const handlePasswordPopup = async (flag = false) => {
    if (flag) {
      setPasswordVerifyLoader(true)
      const header = {
        'access-token': localStorage.getItem('access_token')
      }
      const data = {
        password: currentPassword
      }
      const res = await ApiCall('POST', `${munimApiEndpoint}${CommonApiEndPoint.verify_password}`, data, header, 10000, true)
      if (res.data.status === 'success' && res.data.data.verify === true) {
        if (passwordVerifyType === 2) {
          setChangeEmail(true)
          setChangeMobile(true)
          setEmailGetOtpDisable(true)
          setStep(1)
        } else if (passwordVerifyType === 1) {
          setChangeMobile(true)
          setMobileGetOtpDisable(true)
          setStep(1)
        }
        setPasswordVerifyLoader(false)
        setPasswordPopUpActive(false)
        // notify(res.data.message, 'success')
      } else {
        setPasswordPopUpActive(true)
        setPasswordVerifyLoader(false)
        setCurrentPassword('')
        notify(res.data.message, 'error', appRedirection)
      }
    } else {
      setCompleteProfile(false)
      setPasswordPopUpActive(false)
    }
  }

  const handleSetPasswordClick = () => {
    handlePasswordPopup()
    if (!selected_pass_availabel) {
      formik.handleReset()
      setDiscard(true)
    }
  }

  useEffect(() => {
    if (!formik.dirty && discard) {
      history.push({ pathname: CommonRouter.user_account, state: { tab: '2', moveSecurity: true } })
      setDiscard(false)
    }
  }, [discard, formik.dirty])

  return (
    <Fragment >
      {loading ? <div className='m-auto p-1 d-flex justify-content-center align-items-center'><Spinner size="large" /></div> : <>
        <Hotkeys keyName="enter" onKeyDown={onKeyDown} filter={() => true}></Hotkeys>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Profile Details</CardTitle>
        </CardHeader>
        <CardBody className='pt-1'>
          <Row>
            <Col sm='6' lg='6' className='mb-1 position-relative'>
              <InputTextField
                value={formik.values.fname}
                label='First Name'
                placeholder='Barry'
                name='fname'
                handleChange={formik.setFieldValue}
                handleBlur={formik.setFieldTouched}
                autoComplete='off'
                errors={formik.errors?.fname}
                touched={formik.touched?.fname}
                maxLength='20'
              />
            </Col>
            <Col sm='6' className='mb-1 position-relative'>
              <InputTextField
                value={formik.values.lname}
                label='Last Name'
                placeholder='Tone'
                name='lname'
                handleChange={formik.setFieldValue}
                handleBlur={formik.setFieldTouched}
                autoComplete='off'
                errors={formik.errors?.lname}
                touched={formik.touched?.lname}
                maxLength='20'
              />
            </Col>
            <Col sm='6' className='mb-1 position-relative'>
              <label className={`form-label ${(formik.values.email || changeEmail)}`}>Email</label>
              <div className='d-flex identix-api-pwd gap-1 w-100'>
                <div className='position-relative identix-num-error w-100 user-account'>
                  <InputEmailField
                    value={formik.values.email}
                    placeholder='example@domain.com'
                    name='email'
                    handleChange={formik.setFieldValue}
                    handleBlur={formik.setFieldTouched}
                    autoComplete='off'
                    disabled={formik.initialValues.email ? !changeEmail : changeEmail || step === 2 || emailVerified}
                    errors={(formik.errors?.email) || (!emailValid ? 'Please enter valid email address!' : '')}
                    touched={formik.touched?.email || true}
                    maxLength='50'
                  />
                </div>
                {step === 1 && emailGetOtpDisable ? <CustomButton
                  type='button'
                  handleClick={() => handleEmailMobileGetOTP(2)}
                  loader={generateOTPLoader}
                  disabled={(!remainigTime && step === 2 && mobileEmailotpType === 2) || (formik.initialValues.email === formik.values.email) || !formik.values.email}
                  color='primary'
                  label='Get OTP'
                /> : changeEmailAddress === true || !user_data.user_email ? <CustomButton
                  type='button'
                  disabled={(!emailValid || (formik.values?.email?.length === 0 ? true : false) || formik.errors?.email) || !emailFieldDisable || step === 1 || step === 2 || step === 3 || step === 4}
                  color='primary'
                  label='Set'
                  handleClick={() => handlePassword(2)}
                /> : <CustomButton
                  type='button'
                  disabled={!emailFieldDisable || step === 2 || step === 3 || step === 4}
                  color='primary'
                  label='Change'
                  handleClick={() => handlePassword(2)}
                />}
              </div>
            </Col>
            <Col lg="6" md="6" sm="12" className='mb-1 position-relative mid-device-width-col'>
              <label className='form-label required-star'>Mobile No.</label>
              <div className='d-flex identix-api-pwd gap-1 w-100'>
                <div className='position-relative identix-num-error w-100'>
                  <InputGroup className='input-group-merge text-end identix-num-error'>
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
                      disabled={!changeMobile || step === 2 || !mobileVerified || step === 3}
                      errors={formik.errors.mobile}
                      touched={formik.touched.mobile}
                    />
                  </InputGroup>
                </div>
                {step === 4 && mobileGetOtpDisable ? <CustomButton
                  type='button'
                  handleClick={() => handleEmailMobileGetOTP(1)}
                  loader={generateOTPLoader}
                  disabled={(!remainigTime && step === 2 && mobileEmailotpType === 1) || (formik.initialValues.mobile === formik.values.mobile)}
                  color='primary'
                  label='Get OTP'
                /> : <CustomButton
                  type='button'
                  color='primary'
                  disabled={changeMobile || step === 1 || step === 2 || step === 3}
                  label='Change'
                  handleClick={() => handlePassword(1)}
                />}
              </div>
            </Col>
            {step === 1 ? '' : <>
              <Row>
                {(completeProfile === true && mobileEmailotpType === 2) ? <Col md='3' className={!remainigTime && step === 2 && mobileEmailotpType === 2 ? 'align-items-end d-flex justify-content-start tab-justify-ends mobile-block mob-mt-1' : ''}>
                  <div className='d-flex align-items-end justify-content-start identix-mobile-div-otp-dec w-100'>
                    <div className='mb-1 pe-0 position-relative w-100'>
                      <InputNumberField value={formik.values.email_otp}
                        isRequired={true}
                        placeholder='OTP'
                        className={emailVerified ? 'otp-verify-icon' : ''}
                        label='Email OTP'
                        name='email_otp'
                        handleChange={formik.setFieldValue}
                        handleBlur={formik.setFieldTouched}
                        autoComplete='off'
                        maxLength={6}
                        disabled={emailVerified}
                        errors={formik.errors.email_otp}
                        touched={formik.touched.email_otp}
                      />
                    </div>
                  </div>
                </Col> : ''}
                {(completeProfile === true && mobileEmailotpType === 2) || mobileEmailotpType === 1 ? <Col md={(completeProfile === true && mobileEmailotpType === 2) ? '3' : '6'} className={!remainigTime && mobileEmailotpType === 1 ? 'align-items-end d-flex justify-content-start tab-justify-ends mobile-block mob-mt-1' : ''}>
                  <div className='d-flex align-items-end justify-content-start identix-mobile-div-otp-dec w-100'>
                    <div className='mb-1 pe-0 position-relative w-100'>
                      <InputNumberField value={formik.values.mobile_otp}
                        isRequired={true}
                        placeholder='OTP'
                        className={mobileVerified ? 'otp-verify-icon' : ''}
                        label='Mobile OTP'
                        name='mobile_otp'
                        handleChange={formik.setFieldValue}
                        handleBlur={formik.setFieldTouched}
                        autoComplete='off'
                        maxLength={6}
                        disabled={mobileVerified}
                        errors={formik.errors.mobile_otp}
                        touched={formik.touched.mobile_otp}
                      />
                    </div>
                  </div>
                </Col> : ''}
                {!remainigTime && step === 2 && mobileEmailotpType === 2 ? <Col md='3' className={'align-items-end d-flex justify-content-start tab-justify-ends mobile-block mob-mt-1'}>
                  <div className='mb-1 position-relative identix-send-otp-btn w-100'>
                    {/* <CustomButton color='primary' label='Resend' /> */}
                    <button className="btn btn-primary d-block w-auto" type='button' onClick={() => resendOtp(2)} disabled={emailVerified && mobileVerified} block loader={loader}>
                      <div className="identix-otp-send-btn">
                        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.5455 4.81818V1L19.4545 7.36364L10.5455 13.7273V9.90909C7.01364 9.90909 3.76818 10.0364 1 15C1 11.85 1.31818 4.81818 10.5455 4.81818Z" stroke="white" strokeWidth="2" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </Col> : ''}
                {!remainigTime && step === 2 && mobileEmailotpType === 1 ? <Col md='3' className={'align-items-end d-flex justify-content-start tab-justify-ends mobile-block mob-mt-1'}>
                  <div className='mb-1 position-relative identix-send-otp-btn w-100'>
                    {/* <CustomButton color='primary' label='Resend' /> */}
                    <button className="btn btn-primary d-block w-auto" type='button' onClick={() => resendOtp(1)} disabled={mobileVerified} block loader={loader}>
                      <div className="identix-otp-send-btn">
                        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.5455 4.81818V1L19.4545 7.36364L10.5455 13.7273V9.90909C7.01364 9.90909 3.76818 10.0364 1 15C1 11.85 1.31818 4.81818 10.5455 4.81818Z" stroke="white" strokeWidth="2" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </Col> : ''}
              </Row>
              {remainigTime && step === 2 ? <Row>
                <Col md='12' className='mb-1 position-relative'>
                  You can request another OTP in {remainigTime} sec
                </Col>
              </Row> : ''}
            </>}
          </Row>
          <div className='d-flex justify-content-between identix-bb-btn-group identix-save mt-1'>
            <CustomButton
              type='button'
              outline
              color='secondary'
              label='Cancel'
              handleClick={() => { history.goBack() }}
              tabIndex="-1"
            />
            {<CustomButton
              type='button'
              handleClick={handleUserAccountGetOtp}
              color='primary'
              label='Save'
              disabled={!formik.dirty || step === 1 || step === 2 || step === 4 || (changeEmailAddress === true && formik.values.email ? (!emailVerified && !mobileVerified) : false)}
              loader={loader}
            />}
          </div>
        </CardBody>
        {reciveInvitation?.length > 0 &&
          <Card className='card-transaction'>
            <CardHeader>
              <div>
                <CardTitle tag='h4'>Pending Invitation</CardTitle>
                <CardText className='font-small-3'>Get access of company by accept the invitation.</CardText>
              </div>
            </CardHeader>
            <CardBody> {reciveInvitation.map((item, i) => <Fragment key={`receiveInvitation_${i}`}>
              <hr />
              <div key={item.id} className='transaction-item gap-1'>
                <div className={`d-flex identix-invitation-avtar ${item.support === '1' ? 'cursor-pointer' : ''}`} onClick={item.support === '1' ? () => onUserPermissionPage(item.token, item.id) : ''}>
                  <Avatar icon={(item.first_char_name).toUpperCase()} />
                  <div>
                    <h6 className='transaction-title'>{item.company_name}</h6>
                    <small>{item.location}</small>
                  </div>
                </div>
                <div className='d-flex identix-invitation-sm-button'>
                  <CustomButton
                    type='button'
                    color='primary'
                    loader={acceptLoader && i === acceptDeclineIndex}
                    handleClick={() => handleAcceptInvitation(item.token, i, item.support)}
                    label='Accept'
                  />
                  <CustomButton
                    outline
                    type='button'
                    color='primary'
                    loader={declineLoader && i === acceptDeclineIndex}
                    handleClick={() => handleDeclineInvitation(item.token, item.email, item.company_id, i)}
                    label='Decline'
                  />
                </div>
              </div>
            </Fragment>
            )}</CardBody>
          </Card>}
      </>
      }
      {showPopUp ? <WarningModal
        WarningPopUpActive={showPopUp}
        popUpTitle='Company Change Warning!'
        popUpContent='Do you want to change company?'
        handleWarningPopUp={closePopUp}
        primaryLabel='Yes'
        secondaryLabel='No'
      /> : ''}
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
      <PasswordConfirmation
        currentPassword={currentPassword}
        handleSetPassword={handleSetPassword}
        loader={passwordVerifyLoader}
        btn_color='primary'
        label='Continue'
        passwordPopUpActive={passwordPopUpActive}
        handlePasswordPopup={handlePasswordPopup}
        popUpTitle='Password Confirmation'
        passwordMessage={`Are you sure you want to change your ${passwordVerifyType === 2 ? 'email' : 'mobile no.'}?`}
        displaySecurityLink={true}
        handleSetPasswordClick={handleSetPasswordClick}
      />
    </Fragment>
  )
}
export default UserAccountDetail
