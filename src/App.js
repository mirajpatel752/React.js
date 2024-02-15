/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
import React, { useContext, useEffect, useState } from 'react'
import Router from './router/Router'
import Spinner from './@core/components/spinner/Fallback-spinner'
import { isUserLoggedIn } from '@utils'
import { useDispatch } from 'react-redux'
import { GetApiCall } from './helper/axios'
import { handleLogin } from '@store/authentication'
import { isLocal, munimApiEndpoint } from './helper/commonApi'
import CommonApiEndPoint from './helper/commonApiEndPoint'
import CommonRouter from './helper/commonRoute'
import createGuest from 'cross-domain-storage/guest'
import { AbilityContext } from '@src/utility/context/Can'
import { handleLogout, setSelectedCompanyObject, setUserEmail, setUserId, setUserMobile, setTodayDate, setCompanyList, setCompanyIsNext, setCompanyDataAvailable, setUserName, setUserFirstLastName } from './redux/commonSlice'
import { setIsMobile } from './redux/windowResizeSlice'

const App = () => {
  const dispatch = useDispatch()
  const [preLoading, setPreLoading] = useState(true)
  const ability = useContext(AbilityContext)

  // eslint-disable-next-line no-unused-vars
  let timer
  useEffect(() => {
    if ((localStorage.getItem('_ett') - Date.parse(new Date())) > 901000) {
      startTimer()
    }
  }, [localStorage.getItem('_ett')])

  const startTimer = () => {
    timer = setInterval(() => countDown(), 900000)
  }
  const countDown = () => {
    const current_time = Date.parse(new Date())
    if ((localStorage.getItem('_ett') - current_time) < 9010000) {
      getRenewToken()
      clearInterval(timer)
    }
  }

  /**
* IW0214
* This effect is called to renew-token when user check 30 days and logs in, and restarts the system.
*/
  useEffect(() => {
    if (localStorage.getItem('_ett') && localStorage.getItem('access_token') && localStorage.getItem('refresh_tokens') && localStorage.getItem('_ett') < Date.parse(new Date())) {
      getRenewToken()
    }
  }, [])

  const userDetails = async () => {
    if (isLocal) {

      if (!isUserLoggedIn() && (window.location.pathname.includes(CommonRouter.redirect_to_account))) {
        setPreLoading(false)
      } else {
        const get_is_login = createGuest(`${process.env.LOGIN_DOMAIN}/log-in?is_check_storage`)
        get_is_login.get('is_log', function (error, value) {
          if (value) {
            if ((!localStorage.getItem('refresh_tokens') || !localStorage.getItem('access_token'))) {
              const get_access_token = createGuest(`${process.env.LOGIN_DOMAIN}/log-in?is_check_storage`)
              get_access_token.get('common_data', async function (error, value) {
                if (value) {
                  const parse_data = JSON.parse(value)
                  const passe_usr_data = JSON.parse(parse_data.userData)
                  localStorage.setItem('_ett', parse_data._ett)
                  localStorage.setItem('access_token', parse_data.access_token)
                  localStorage.setItem('refresh_tokens', parse_data.refresh_tokens)
                  localStorage.setItem('userData', parse_data.userData)
                  dispatch(handleLogin({
                    ...passe_usr_data,
                    ability: [
                      {
                        action: 'manage',
                        subject: 'all'
                      }
                    ]
                  }))
                  userProfile()
                } else {
                  window.location.href = CommonRouter.redirect_to_account
                }
              })
            } else {
              const get_access_token = createGuest(`${process.env.LOGIN_DOMAIN}/log-in?is_check_storage`)
              get_access_token.get('common_data', async function (error, value) {
                if (value) {
                  const parse_data = JSON.parse(value)
                  localStorage.setItem('access_token', parse_data.access_token)
                  localStorage.setItem('refresh_tokens', parse_data.refresh_tokens)
                  userProfile()
                } else {
                  window.location.href = CommonRouter.redirect_to_account
                }
              })
            }
          } else {
            window.location.href = CommonRouter.redirect_to_account
          }
        })
      }
    } else {
      userProfile()
    }
  }

  const userProfile = async () => {
    try {
      const header = {
        'access-token': localStorage.getItem('access_token')
      }
      const res = await GetApiCall('GET', `${munimApiEndpoint}${CommonApiEndPoint.get_profile}`, header, false, true)
      if (res.data.status === 'success' && res.data.statusCode === 200) {
        localStorage.setItem('userData', JSON.stringify({ ...res.data.data }))
        dispatch(setUserMobile(res.data.data.mobile))
        dispatch(setUserFirstLastName([res.data.data.fname, res.data.data.lname]))
        dispatch(setUserName(res.data.data))
        dispatch(setUserEmail(res.data.data.email))
        dispatch(setUserId(res.data.data.user_id))
        const today_date_time = new Date()
        today_date_time.setHours(0, 0, 0, 0)
        dispatch(setTodayDate(today_date_time))
        getCompanyList()
        dispatch(handleLogin({
          ...res.data.data,
          role: 'admin',
          email: res.data.data.email,
          ability: [
            {
              action: 'manage',
              subject: 'all'
            }
          ]
        }))
        ability.update([
          {
            action: 'manage',
            subject: 'all'
          }
        ])
      } else if (res?.data && res.data.status === 'error' && res.data.statusCode === 401) {
        getRenewToken()
      } else if (res?.data.statusCode === 404) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_tokens')
        window.location.href = CommonRouter.redirect_to_account
      }
    } catch (error) {

    }
  }

  const getRenewToken = async (flag) => {
    const header = { 'refresh-token': localStorage.getItem('refresh_tokens') }
    const res = await GetApiCall('GET', `${munimApiEndpoint}${CommonApiEndPoint.renew_token}`, header, true, true)
    if (res.data.status === 'success' && res.data.statusCode === 200) {
      const current_time = new Date()
      startTimer()
      localStorage.setItem('_ett', current_time ? Number(current_time.getTime()) + 10800000 : '')
      localStorage.setItem('access_token', res.data.data.access_token)
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
      localStorage.removeItem('refresh_tokens')
      localStorage.removeItem('userData')
      dispatch(handleLogout())
      dispatch(setSelectedCompanyObject({}))
      dispatch(setCompanyList([]))
      dispatch(setCompanyDataAvailable(false))
      setPreLoading(false)
    }
    if (flag) await userDetails()
  }
  /**
  * IW0110
  * This function is call on get company list
  */
  const getCompanyList = async () => {
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    const res = await GetApiCall('GET', CommonApiEndPoint.company_list, header)
    if (res.data.status === 'success' && res.data.data?.company_data?.length > 0) {
      const data = res.data.data
      dispatch(setCompanyList(data.company_data))
      dispatch(setCompanyIsNext(data.is_next))
      if (data.last_selected_company !== null || data.last_selected_company !== '') {
        if (data.last_selected_company === '0') {
          dispatch(setCompanyDataAvailable(false))
        } else {
          dispatch(setSelectedCompanyObject(data.last_selected_company_obj))
          dispatch(setCompanyDataAvailable(true))
          setPreLoading(false)
        }
      }
    } else {
      dispatch(setCompanyDataAvailable(true))
      setPreLoading(false)
    }
  }
  /** IW0214 This useEffect is centralize login and    useDetails  get data*/
  useEffect(() => {
    const get_response_url = window.location.search
    if (isLocal && get_response_url) {
      const urlParams = new URLSearchParams(window.location.search)
      const myParam = urlParams.get('response_data')
      const decode_data = myParam ? atob(myParam) : ''
      if (decode_data) {
        const parse_data = JSON.parse(decode_data)
        localStorage.setItem('_ett', parse_data._ett)
        localStorage.setItem('access_token', parse_data.access_token)
        localStorage.setItem('refresh_tokens', parse_data.refresh_tokens)
        window.location.href = CommonRouter.dashboard
        if (!localStorage.getItem('_ett') || ((localStorage.getItem('_ett') - Date.parse(new Date())) < 901000)) {
          getRenewToken(true)
        }
      }
    }

    userDetails()
    const handleWindowResize = () => {
      const window_size = window.innerWidth < 768 && window.innerHeight <= 1024
      dispatch(setIsMobile(window_size))
    }
    if (window.innerWidth < 768 && window.innerHeight <= 1024) {
      handleWindowResize()
    }
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  return <>{preLoading ? <Spinner /> : <Router />}</>
}

export default App
