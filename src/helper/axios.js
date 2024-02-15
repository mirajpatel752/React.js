import axios from 'axios'
import { handlePageRefresh } from './commonFunction'
import CryptoJS from "crypto-js"
import CommonRouter from './commonRoute'

const createGuest = require('cross-domain-storage/guest')
const { apiEndpoint, isLocal } = require('./commonApi')
const service = axios.create({
  headers: {

  }
})
const handleSuccess = (response) => {
  return response
}

const handleError = (error) => {
  return Promise.reject(error)
}
service.interceptors.response.use(handleSuccess, handleError)

/**
 * IW0079
 * When someone changes in local storage detail at that time that person account will logout for security purpose
 */
const renewToken = () => {
  if (isLocal) {
    window.removeEventListener("beforeunload", handlePageRefresh)
    const accountLocalStorage = createGuest(`${process.env.LOGIN_DOMAIN}/log-in?is_logout`)
    return new Promise(async (resolve) => {
      accountLocalStorage.remove('is_log', function (err, value) {
        if (!value) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('_ett')
          localStorage.removeItem('userData')
          document.cookie = `ent_dt =;expires=${new Date()}`
          localStorage.removeItem('refresh_tokens')
          localStorage.removeItem('user_ip')
          localStorage.removeItem('check_log')
          window.location.href = CommonRouter.redirect_to_account
        }
      })
      accountLocalStorage.remove('logged_app', function () { })
      accountLocalStorage.remove('common_data', function () { })
      resolve()
    })
  } else {
    if (!window.location.pathname.includes('/pdf-preview') || !window.location.pathname.includes('/p/')) {
      window.removeEventListener("beforeunload", handlePageRefresh)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_tokens')
      localStorage.removeItem('userData')
      // window.location.href = CommonRouter.log_in
    }
  }
}
export const ApiCall = async (method, path, payload, header, timeout = 10000, isMain, responseType = 'json') => {
  if (header && !header['access-token'] && (!path.includes('generate-user-otp') && !path.includes('update-aff-visit-count'))) {
    renewToken()
  } else {
    try {
      const responce = await service.request({
        method,
        url: isMain ? path : `${apiEndpoint}${path}`,
        responseType,
        data: payload,
        timeout,
        headers: header
      })
      return responce
    } catch (error) {
      if (error.message === 'Network Error') {
        console.log(`${error}, Server is not responding, please try again after some time`)
      }
      if (error.response?.data?.statusCode === 401 && header && !header['access-token']) {
        if (error.response.data.access_expire) {
          renewToken()
        } else if (error.response.data.refresh_expire) {
          return error.response
        }
      } else {
        return error.response
      }
    }
  }
}

const onCheckLogin = async () => {
  return new Promise(async (resolve) => {
    if (isLocal) {
      const get_is_login = await createGuest(`${process.env.LOGIN_DOMAIN}/log-in?is_check_storage`)
      get_is_login.get('is_log', (error, value) => {
        if (value) {
          get_is_login.close()
          resolve(true)
        } else {
          renewToken()
          resolve(false)
        }
      })
    }
  })
}

/**
 * IW0079
 * here flag is true when api call occur and user is not login
 */
export const GetApiCall = async (method, path, header, flag = false, isMain, responseType = 'json') => {
  if (!header['access-token'] && !flag) {
    renewToken()
  } else {
    try {
      onCheckLogin()
      const responce = await service.request({
        method,
        url: isMain ? path : `${apiEndpoint}${path}`,
        responseType,
        headers: header
      })
      return responce
    } catch (error) {
      if (error.message === 'Network Error') {
        console.log(`${error}, Server is not responding, please try again after some time`)
      }
      if (error.response?.data?.statusCode === 401) {
        if (error.response.data.access_expire) {
          renewToken()
        } else {
          return error.response
        }
      } else {
        return error.response
      }
    }
  }
}
