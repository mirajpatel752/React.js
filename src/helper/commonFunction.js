import React from 'react'
import { Settings } from "react-feather"
import { GetApiCall } from "./axios"
import axios from 'axios'
import stateOfIndia from '../common_components/stateOfIndia.json'
import CommonApiEndPoint from './commonApiEndPoint'
import CryptoJS from "crypto-js"
import { bucketUrl } from './commonApi'

/**
 * IW0077
 * This function is called detect os.
 */
function getDetectOs(navigator) {
   if (navigator === 'MacIntel') {
      return 'OPTION'
   } else {
      return 'ALT'
   }
}
/**
  * IW0118
  * This function is call on if focus on save or save before active element and press tab to focus move on first active field. 
  */
function handleFocusTab(e, nextFocusId) {
   if (e.keyCode === 9 && nextFocusId && !e.shiftKey) {
      e?.preventDefault()
      e.stopPropagation()
      window.stop()
      document.getElementById(nextFocusId)?.focus()
   }
}
/**
 * IW0077
 * This function is called when user get cookies
 */
const getCookie = (cname) => {
   cname = (cname !== undefined) ? cname : 'flash_msg'
   const name = `${cname}=`
   const cookieSplitData = document.cookie.split(';')
   for (let i = 0; i < cookieSplitData.length; i++) {
      let cookieData = cookieSplitData[i]
      while (cookieData.charAt(0) === ' ') {
         cookieData = cookieData.substring(1)
      }
      if (cookieData.indexOf(name) === 0) {
         return cookieData.substring(name.length, cookieData.length)
      }
   }
   return null
}

const setCookie = (name, value, excookie) => {
   const systemDate = new Date()
   systemDate.setTime(systemDate.getTime() + (excookie * 60 * 1000))
   const expires = `expires=${systemDate.toUTCString()}`
   document.cookie = `${name}=${value};${expires};path=/; SameSite=None; Secure`
}

function getJsDate(date, format = 'DD-MM-YYYY') {
   const splitDate = date.split('-')
   switch (format) {
      case 'DD-MM-YYYY':
         return new Date(splitDate[2], Number(splitDate[1]) - 1, splitDate[0])
      case 'MM-DD-YYYY':
         return new Date(splitDate[2], Number(splitDate[0]) - 1, splitDate[1])
      case 'YYYY-MM-DD':
         return new Date(splitDate[0], Number(splitDate[1]) - 1, splitDate[2])
      default:
         break
   }
   return new Date()
}
function changeDateSeparator(date = '', existing_separator, replace_separator) {
   return date.replaceAll(existing_separator, replace_separator)
}

function getTime(date) {
   return new Date(date).getTime()
}

function getJsTime(jsDate) {
   return (jsDate).getTime()
}
function handlePageRefresh(event) {
   const e = event || window.event
   // Cancel the event
   e.preventDefault()
   if (e) {
      e.returnValue = '' // Legacy method for cross browser support
   }
   return '' // Legacy method for cross browser support
}
function debounce(fn, time) {
   let timer
   return function (...args) {
      clearTimeout(timer)
      timer = setTimeout(() => {
         fn(...args)
      }, time)
   }
}
const getIcon = (str, size) => {
   switch (str) {
      case 'Settings':
         return <Settings size={size} />
      case 'Dashboard':
         return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="feather feather-tag">
            <path d="M5.66667 13.7917C6.20232 13.7917 6.72595 13.6328 7.17134 13.3352C7.61672 13.0376 7.96385 12.6147 8.16884 12.1198C8.37383 11.6249 8.42746 11.0803 8.32296 10.555C8.21846 10.0296 7.96051 9.54702 7.58175 9.16825C7.20298 8.78949 6.7204 8.53154 6.19504 8.42704C5.66967 8.32254 5.12512 8.37617 4.63023 8.58116C4.13535 8.78615 3.71237 9.13328 3.41477 9.57866C3.11717 10.024 2.95833 10.5477 2.95833 11.0833C2.96053 11.801 3.24658 12.4886 3.75401 12.996C4.26145 13.5034 4.94905 13.7895 5.66667 13.7917ZM5.66667 9.625C5.9551 9.625 6.23705 9.71053 6.47687 9.87077C6.71669 10.031 6.90361 10.2588 7.01399 10.5253C7.12437 10.7917 7.15325 11.085 7.09698 11.3678C7.04071 11.6507 6.90182 11.9106 6.69786 12.1145C6.49391 12.3185 6.23406 12.4574 5.95117 12.5136C5.66828 12.5699 5.37506 12.541 5.10859 12.4307C4.84211 12.3203 4.61435 12.1334 4.45411 11.8935C4.29386 11.6537 4.20833 11.3718 4.20833 11.0833C4.21052 10.6972 4.36487 10.3276 4.63789 10.0546C4.9109 9.78154 5.28057 9.62719 5.66667 9.625ZM13.7083 13.1667V10.6667C13.7083 10.5009 13.7742 10.3419 13.8914 10.2247C14.0086 10.1075 14.1676 10.0417 14.3333 10.0417C14.4991 10.0417 14.6581 10.1075 14.7753 10.2247C14.8925 10.3419 14.9583 10.5009 14.9583 10.6667V13.1667C14.9583 13.3324 14.8925 13.4914 14.7753 13.6086C14.6581 13.7258 14.4991 13.7917 14.3333 13.7917C14.1676 13.7917 14.0086 13.7258 13.8914 13.6086C13.7742 13.4914 13.7083 13.3324 13.7083 13.1667ZM11.7083 13.1667V9C11.7083 8.83424 11.7742 8.67527 11.8914 8.55806C12.0086 8.44085 12.1676 8.375 12.3333 8.375C12.4991 8.375 12.6581 8.44085 12.7753 8.55806C12.8925 8.67527 12.9583 8.83424 12.9583 9V13.1667C12.9583 13.3324 12.8925 13.4914 12.7753 13.6086C12.6581 13.7258 12.4991 13.7917 12.3333 13.7917C12.1676 13.7917 12.0086 13.7258 11.8914 13.6086C11.7742 13.4914 11.7083 13.3324 11.7083 13.1667ZM9.625 13.1667V11.5C9.625 11.3342 9.69085 11.1753 9.80806 11.0581C9.92527 10.9408 10.0842 10.875 10.25 10.875C10.4158 10.875 10.5747 10.9408 10.6919 11.0581C10.8092 11.1753 10.875 11.3342 10.875 11.5V13.1667C10.875 13.3324 10.8092 13.4914 10.6919 13.6086C10.5747 13.7258 10.4158 13.7917 10.25 13.7917C10.0842 13.7917 9.92527 13.7258 9.80806 13.6086C9.69085 13.4914 9.625 13.3324 9.625 13.1667ZM15.25 0.875H2.75C2.25272 0.875 1.77581 1.07254 1.42417 1.42417C1.07254 1.77581 0.875 2.25272 0.875 2.75V15.25C0.875 15.7473 1.07254 16.2242 1.42417 16.5758C1.77581 16.9275 2.25272 17.125 2.75 17.125H15.25C15.7473 17.125 16.2242 16.9275 16.5758 16.5758C16.9275 16.2242 17.125 15.7473 17.125 15.25V2.75C17.125 2.25272 16.9275 1.77581 16.5758 1.42417C16.2242 1.07254 15.7473 0.875 15.25 0.875ZM15.875 15.25C15.8728 15.4151 15.8063 15.5728 15.6896 15.6896C15.5728 15.8063 15.4151 15.8728 15.25 15.875H2.75C2.58491 15.8728 2.42719 15.8063 2.31044 15.6896C2.1937 15.5728 2.12716 15.4151 2.125 15.25V6.29167H15.875V15.25ZM15.875 5.04167H2.125V2.75C2.12716 2.58491 2.1937 2.42719 2.31044 2.31044C2.42719 2.1937 2.58491 2.12716 2.75 2.125H15.25C15.4151 2.12716 15.5728 2.1937 15.6896 2.31044C15.8063 2.42719 15.8728 2.58491 15.875 2.75V5.04167ZM7.54167 3.58333C7.53951 3.74842 7.47297 3.90614 7.35622 4.02289C7.23948 4.13963 7.08176 4.20617 6.91667 4.20833H6.08333C5.91757 4.20833 5.7586 4.14249 5.64139 4.02527C5.52418 3.90806 5.45833 3.74909 5.45833 3.58333C5.45833 3.41757 5.52418 3.2586 5.64139 3.14139C5.7586 3.02418 5.91757 2.95833 6.08333 2.95833H6.91667C7.08176 2.96049 7.23948 3.02703 7.35622 3.14378C7.47297 3.26052 7.53951 3.41824 7.54167 3.58333ZM5.04167 3.58333C5.03951 3.74842 4.97297 3.90614 4.85622 4.02289C4.73948 4.13963 4.58176 4.20617 4.41667 4.20833H3.58333C3.41757 4.20833 3.2586 4.14249 3.14139 4.02527C3.02418 3.90806 2.95833 3.74909 2.95833 3.58333C2.95833 3.41757 3.02418 3.2586 3.14139 3.14139C3.2586 3.02418 3.41757 2.95833 3.58333 2.95833H4.41667C4.58176 2.96049 4.73948 3.02703 4.85622 3.14378C4.97297 3.26052 5.03951 3.41824 5.04167 3.58333Z" fill="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.8335 1.66663V7.49996H16.6668" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
         </svg>

      case 'Master-Item':
         return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.9452 4.15109L13.1787 0.587734C12.7781 0.208711 12.2537 0 11.7022 0H4.53125C3.3466 0 2.38281 0.963789 2.38281 2.14844V17.8516C2.38281 19.0362 3.3466 20 4.53125 20H15.4688C16.6534 20 17.6172 19.0362 17.6172 17.8516V5.7118C17.6172 5.12395 17.3723 4.55508 16.9452 4.15109ZM15.8071 4.6875H12.8906C12.7829 4.6875 12.6953 4.59988 12.6953 4.49219V1.74359L15.8071 4.6875ZM15.4688 18.8281H4.53125C3.99277 18.8281 3.55469 18.39 3.55469 17.8516V2.14844C3.55469 1.60996 3.99277 1.17188 4.53125 1.17188H11.5234V4.49219C11.5234 5.24605 12.1368 5.85938 12.8906 5.85938H16.4453V17.8516C16.4453 18.39 16.0072 18.8281 15.4688 18.8281Z" fill="currentColor" />
            <path d="M14.1797 7.8125H5.58594C5.26234 7.8125 5 8.07484 5 8.39844C5 8.72203 5.26234 8.98438 5.58594 8.98438H14.1797C14.5033 8.98438 14.7656 8.72203 14.7656 8.39844C14.7656 8.07484 14.5033 7.8125 14.1797 7.8125ZM14.1797 10.9375H5.58594C5.26234 10.9375 5 11.1998 5 11.5234C5 11.847 5.26234 12.1094 5.58594 12.1094H14.1797C14.5033 12.1094 14.7656 11.847 14.7656 11.5234C14.7656 11.1998 14.5033 10.9375 14.1797 10.9375ZM8.42656 14.0625H5.58594C5.26234 14.0625 5 14.3248 5 14.6484C5 14.972 5.26234 15.2344 5.58594 15.2344H8.42656C8.75016 15.2344 9.0125 14.972 9.0125 14.6484C9.0125 14.3248 8.75016 14.0625 8.42656 14.0625Z" fill="currentColor" />
         </svg>

      case 'CompanyList':
         return <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.9894 1.80199C16.5839 1.39566 16.0447 1.17188 15.471 1.17188H14.502V0.976562C14.502 0.438086 14.0639 0 13.5254 0H6.49414C5.95567 0 5.51758 0.438086 5.51758 0.976562V1.17188H4.54504C3.36297 1.17188 2.4002 2.13461 2.39887 3.31793L2.38281 17.8492C2.38219 18.4235 2.60512 18.9636 3.01055 19.3699C3.41602 19.7762 3.95527 20 4.52899 20H15.4549C16.637 20 17.5998 19.0373 17.6011 17.8539L17.6172 3.3227C17.6179 2.74836 17.3949 2.20828 16.9894 1.80199ZM6.68945 1.17188H13.3301V2.34375H6.68945V1.17188ZM16.4305 17.8526C16.4298 18.3905 15.9922 18.8281 15.4549 18.8281H4.52899C4.2682 18.8281 4.02309 18.7264 3.83879 18.5417C3.65449 18.357 3.55317 18.1115 3.55344 17.8505L3.56949 3.31926C3.57008 2.78133 4.0077 2.34375 4.54504 2.34375H5.51758V2.53906C5.51758 3.07754 5.95567 3.51562 6.49414 3.51562H13.5254C14.0639 3.51562 14.502 3.07754 14.502 2.53906V2.34375H15.471C15.7318 2.34375 15.9769 2.44547 16.1612 2.63016C16.3455 2.81484 16.4469 3.06035 16.4466 3.32137L16.4305 17.8526Z" fill="currentColor" />
            <path d="M10.1991 7.81246H14.3621C14.6856 7.81246 14.948 7.55011 14.948 7.22652C14.948 6.90292 14.6856 6.64058 14.3621 6.64058H10.1991C9.87553 6.64058 9.61318 6.90292 9.61318 7.22652C9.61318 7.55011 9.87553 7.81246 10.1991 7.81246ZM10.1991 11.7187H14.3621C14.6856 11.7187 14.948 11.4564 14.948 11.1328C14.948 10.8092 14.6856 10.5468 14.3621 10.5468H10.1991C9.87553 10.5468 9.61318 10.8092 9.61318 11.1328C9.61318 11.4564 9.87553 11.7187 10.1991 11.7187ZM14.3788 14.4531H10.1991C9.87553 14.4531 9.61318 14.7154 9.61318 15.039C9.61318 15.3626 9.87553 15.625 10.1991 15.625H14.3788C14.7024 15.625 14.9647 15.3626 14.9647 15.039C14.9647 14.7154 14.7024 14.4531 14.3788 14.4531ZM7.70525 5.63109L6.354 6.98234L6.03541 6.66371C5.80658 6.43488 5.43561 6.43488 5.20678 6.66371C4.97795 6.89249 4.97795 7.26351 5.20678 7.49234L5.93971 8.22531C6.04959 8.33519 6.19863 8.39692 6.35402 8.39692C6.50942 8.39692 6.65846 8.33519 6.76834 8.22531L8.53393 6.45976C8.76275 6.23097 8.76275 5.85996 8.53393 5.63113C8.3051 5.40226 7.93412 5.40226 7.70525 5.63109ZM7.70525 9.83566L6.354 11.1869L6.03541 10.8683C5.80658 10.6395 5.43561 10.6395 5.20678 10.8683C4.97795 11.0971 4.97795 11.4681 5.20678 11.6969L5.93971 12.4299C6.04959 12.5398 6.19863 12.6015 6.35402 12.6015C6.50942 12.6015 6.65846 12.5398 6.76834 12.4299L8.53393 10.6643C8.76275 10.4355 8.76275 10.0645 8.53393 9.8357C8.3051 9.60687 7.93408 9.60687 7.70525 9.83566ZM7.70525 13.7419L6.354 15.0932L6.03541 14.7746C5.80658 14.5457 5.43561 14.5457 5.20678 14.7746C4.97795 15.0034 4.97795 15.3743 5.20678 15.6032L5.93971 16.3362C6.04959 16.446 6.19863 16.5078 6.35402 16.5078C6.50942 16.5078 6.65846 16.446 6.76834 16.3362L8.53393 14.5706C8.76275 14.3418 8.76275 13.9708 8.53393 13.7419C8.3051 13.5131 7.93408 13.5131 7.70525 13.7419Z" fill="currentColor" />
         </svg>
      case 'ListChannel':
         return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.9894 1.80199C16.5839 1.39566 16.0447 1.17188 15.471 1.17188H14.502V0.976562C14.502 0.438086 14.0639 0 13.5254 0H6.49414C5.95567 0 5.51758 0.438086 5.51758 0.976562V1.17188H4.54504C3.36297 1.17188 2.4002 2.13461 2.39887 3.31793L2.38281 17.8492C2.38219 18.4235 2.60512 18.9636 3.01055 19.3699C3.41602 19.7762 3.95527 20 4.52899 20H15.4549C16.637 20 17.5998 19.0373 17.6011 17.8539L17.6172 3.3227C17.6179 2.74836 17.3949 2.20828 16.9894 1.80199ZM6.68945 1.17188H13.3301V2.34375H6.68945V1.17188ZM16.4305 17.8526C16.4298 18.3905 15.9922 18.8281 15.4549 18.8281H4.52899C4.2682 18.8281 4.02309 18.7264 3.83879 18.5417C3.65449 18.357 3.55317 18.1115 3.55344 17.8505L3.56949 3.31926C3.57008 2.78133 4.0077 2.34375 4.54504 2.34375H5.51758V2.53906C5.51758 3.07754 5.95567 3.51562 6.49414 3.51562H13.5254C14.0639 3.51562 14.502 3.07754 14.502 2.53906V2.34375H15.471C15.7318 2.34375 15.9769 2.44547 16.1612 2.63016C16.3455 2.81484 16.4469 3.06035 16.4466 3.32137L16.4305 17.8526Z" fill="currentColor" />
            <path d="M10.1991 7.81249H14.3621C14.6856 7.81249 14.948 7.55014 14.948 7.22655C14.948 6.90296 14.6856 6.64061 14.3621 6.64061H10.1991C9.87553 6.64061 9.61318 6.90296 9.61318 7.22655C9.61318 7.55014 9.87553 7.81249 10.1991 7.81249ZM10.1991 11.7187H14.3621C14.6856 11.7187 14.948 11.4564 14.948 11.1328C14.948 10.8092 14.6856 10.5469 14.3621 10.5469H10.1991C9.87553 10.5469 9.61318 10.8092 9.61318 11.1328C9.61318 11.4564 9.87553 11.7187 10.1991 11.7187ZM14.3788 14.4531H10.1991C9.87553 14.4531 9.61318 14.7155 9.61318 15.039C9.61318 15.3626 9.87553 15.625 10.1991 15.625H14.3788C14.7024 15.625 14.9647 15.3626 14.9647 15.039C14.9647 14.7155 14.7024 14.4531 14.3788 14.4531ZM7.70525 5.63112L6.354 6.98237L6.03541 6.66374C5.80658 6.43491 5.43561 6.43491 5.20678 6.66374C4.97795 6.89253 4.97795 7.26354 5.20678 7.49237L5.93971 8.22534C6.04959 8.33522 6.19863 8.39695 6.35402 8.39695C6.50942 8.39695 6.65846 8.33522 6.76834 8.22534L8.53393 6.45979C8.76275 6.231 8.76275 5.85999 8.53393 5.63116C8.3051 5.40229 7.93412 5.40229 7.70525 5.63112ZM7.70525 9.83569L6.354 11.1869L6.03541 10.8683C5.80658 10.6395 5.43561 10.6395 5.20678 10.8683C4.97795 11.0971 4.97795 11.4681 5.20678 11.697L5.93971 12.4299C6.04959 12.5398 6.19863 12.6016 6.35402 12.6016C6.50942 12.6016 6.65846 12.5398 6.76834 12.4299L8.53393 10.6644C8.76275 10.4356 8.76275 10.0646 8.53393 9.83573C8.3051 9.6069 7.93408 9.6069 7.70525 9.83569ZM7.70525 13.7419L6.354 15.0932L6.03541 14.7746C5.80658 14.5458 5.43561 14.5458 5.20678 14.7746C4.97795 15.0034 4.97795 15.3744 5.20678 15.6032L5.93971 16.3362C6.04959 16.4461 6.19863 16.5078 6.35402 16.5078C6.50942 16.5078 6.65846 16.4461 6.76834 16.3362L8.53393 14.5706C8.76275 14.3418 8.76275 13.9708 8.53393 13.742C8.3051 13.5132 7.93408 13.5132 7.70525 13.7419Z" fill="currentColor" />
         </svg>
      case 'Mapped':
         return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.6005 6.00581C10.6005 5.34349 11.1394 4.80465 11.8017 4.80465V3.60349C11.0847 3.60349 10.4405 3.91963 9.99996 4.41935C9.55942 3.91963 8.91519 3.60349 8.19822 3.60349V4.80465C8.86054 4.80465 9.39938 5.34349 9.39938 6.00581H5.19531V7.20697H6.39648V12.0116H13.6035V7.20697H14.8046V6.00581H10.6005ZM9.39938 7.20697V8.40814H7.59764V7.20697H9.39938ZM7.59764 9.6093H9.39938V10.8105H7.59764V9.6093ZM10.6005 10.8105V9.6093H12.4023V10.8105H10.6005ZM12.4023 8.40814H10.6005V7.20697H12.4023V8.40814Z" fill="currentColor" />
            <path d="M9.99994 0C5.36369 0 1.5918 3.77189 1.5918 8.40814C1.5918 12.1624 6.97673 17.4829 9.61572 19.6802L9.99994 20C12.9628 17.5262 18.4081 12.2533 18.4081 8.4081C18.4081 3.77189 14.6362 0 9.99994 0ZM9.99994 18.4261C7.61483 16.3349 2.79296 11.5606 2.79296 8.40814C2.79296 4.43421 6.02601 1.20116 9.99994 1.20116C13.9739 1.20116 17.2069 4.43421 17.2069 8.40814C17.2069 11.563 12.3855 16.3345 9.99994 18.4261Z" fill="currentColor" />
         </svg>
      case 'import':
         return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.7144 17.8571H4.28585C2.71443 17.8571 1.42871 16.5714 1.42871 15V10C1.42871 9.57142 1.71443 9.28571 2.143 9.28571C2.57157 9.28571 2.85728 9.57142 2.85728 10V15C2.85728 15.7857 3.50014 16.4286 4.28585 16.4286H15.7144C16.5001 16.4286 17.143 15.7857 17.143 15V10C17.143 9.57142 17.4287 9.28571 17.8573 9.28571C18.2859 9.28571 18.5716 9.57142 18.5716 10V15C18.5716 16.5714 17.2859 17.8571 15.7144 17.8571ZM10.5001 12.6429L12.643 10.5C12.9287 10.2143 12.9287 9.78571 12.643 9.5C12.3573 9.21428 11.9287 9.21428 11.643 9.5L10.7144 10.4286V2.85714C10.7144 2.42857 10.4287 2.14285 10.0001 2.14285C9.57157 2.14285 9.28585 2.42857 9.28585 2.85714V10.4286L8.35728 9.5C8.07157 9.21428 7.643 9.21428 7.35728 9.5C7.07157 9.78571 7.07157 10.2143 7.35728 10.5L9.50014 12.6429C9.643 12.7857 9.85728 12.8571 10.0001 12.8571C10.143 12.8571 10.3573 12.7857 10.5001 12.6429Z" fill="currentColor" />
         </svg>

      case 'MasterMapping':
         return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_5716_4020)">
               <mask id="mask0_5716_4020" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                  <path d="M19.4999 19.5V0.500059H0.5V19.5H19.4999Z" fill="white" stroke="white" />
               </mask>
               <g mask="url(#mask0_5716_4020)">
                  <path d="M14.1015 4.10161H5.89843C4.92761 4.10161 4.14062 3.31462 4.14062 2.3438C4.14062 1.37298 4.92761 0.585994 5.89843 0.585994H14.1015C15.0724 0.585994 15.8593 1.37298 15.8593 2.3438C15.8593 3.31462 15.0724 4.10161 14.1015 4.10161Z" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
                  <path d="M4.10156 8.86722V6.52347H15.8984V8.86722" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
                  <path d="M6.4453 12.3828H1.75781V8.86721H6.4453V12.3828Z" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
                  <path d="M4.10156 12.3828V14.7266" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
                  <path d="M1.75781 17.0703V14.7266H6.4453V17.0703" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
                  <path d="M1.75781 19.4141C1.11062 19.4141 0.585938 18.8894 0.585938 18.2422C0.585938 17.595 1.11062 17.0703 1.75781 17.0703C2.40499 17.0703 2.92968 17.595 2.92968 18.2422C2.92968 18.8894 2.40499 19.4141 1.75781 19.4141Z" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
                  <path d="M6.44531 19.4141C5.79812 19.4141 5.27344 18.8894 5.27344 18.2422C5.27344 17.595 5.79812 17.0703 6.44531 17.0703C7.09249 17.0703 7.61718 17.595 7.61718 18.2422C7.61718 18.8894 7.09249 19.4141 6.44531 19.4141Z" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
                  <path d="M18.2422 12.3828H13.5547V8.86721H18.2422V12.3828Z" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
                  <path d="M15.8984 12.3828V14.7266" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
                  <path d="M13.5547 17.0703V14.7266H18.2422V17.0703" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
                  <path d="M13.5547 19.4141C12.9075 19.4141 12.3828 18.8894 12.3828 18.2422C12.3828 17.595 12.9075 17.0703 13.5547 17.0703C14.2019 17.0703 14.7266 17.595 14.7266 18.2422C14.7266 18.8894 14.2019 19.4141 13.5547 19.4141Z" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
                  <path d="M18.2422 19.4141C17.595 19.4141 17.0703 18.8894 17.0703 18.2422C17.0703 17.595 17.595 17.0703 18.2422 17.0703C18.8894 17.0703 19.4141 17.595 19.4141 18.2422C19.4141 18.8894 18.8894 19.4141 18.2422 19.4141Z" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
                  <path d="M10 4.1016V6.52347" stroke="currentColor" strokeWidth="1.17" strokeLinejoin="10" />
               </g>
            </g>
            <defs>
               <clipPath id="clip0_5716_4020">
                  <rect width="20" height="20" fill="white" />
               </clipPath>
            </defs>
         </svg>

      case 'item':
         return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0001 19.3234L1.92578 14.6617V5.33828L10.0001 0.676605L18.0744 5.33828V14.6617L10.0001 19.3234Z" stroke="currentColor" strokeWidth="1.17188" strokeLinejoin="10" />
            <path d="M1.92578 5.33829L10.0001 10M10.0001 10L18.0744 5.33829M10.0001 10V19.3234" stroke="currentColor" strokeWidth="1.17188" strokeLinejoin="10" />
            <path d="M12.8654 2.33087L4.79102 6.99259V11.6543L7.13477 13.0075V8.34575L15.2091 3.68404" stroke="currentColor" strokeWidth="1.17188" strokeLinejoin="10" />
         </svg>
      case 'Channel':
         return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_4749_17384)">
               <mask id="mask0_4749_17384" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                  <path d="M0 5.91278e-05H19.9999V20H0V5.91278e-05Z" fill="white" />
               </mask>
               <g mask="url(#mask0_4749_17384)">
                  <path d="M19.1776 2.77645C19.1776 3.9441 18.2311 4.89062 17.0634 4.89062C15.8957 4.89062 14.9492 3.9441 14.9492 2.77645C14.9492 1.6088 15.8957 0.662239 17.0634 0.662239C18.2311 0.662239 19.1776 1.6088 19.1776 2.77645Z" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19.4139 12.846C19.4139 14.0137 18.4674 14.9602 17.2997 14.9602C16.1321 14.9602 15.1855 14.0137 15.1855 12.846C15.1855 11.6784 16.1321 10.7318 17.2997 10.7318C18.4674 10.7318 19.4139 11.6784 19.4139 12.846Z" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.81436 3.11381C4.81436 4.28147 3.8678 5.22803 2.70015 5.22803C1.5325 5.22803 0.585938 4.28147 0.585938 3.11381C0.585938 1.94616 1.5325 0.999602 2.70015 0.999602C3.8678 0.999602 4.81436 1.94616 4.81436 3.11381Z" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.1701 17.8429C15.1701 18.6686 14.5008 19.3379 13.6752 19.3379C12.8495 19.3379 12.1802 18.6686 12.1802 17.8429C12.1802 17.0173 12.8495 16.348 13.6752 16.348C14.5008 16.348 15.1701 17.0173 15.1701 17.8429Z" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12.53 2.89359C12.53 3.71925 11.8606 4.38855 11.035 4.38855C10.2094 4.38855 9.54004 3.71925 9.54004 2.89359C9.54004 2.06793 10.2094 1.39864 11.035 1.39864C11.8606 1.39864 12.53 2.06793 12.53 2.89359Z" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.57585 15.7287C3.57585 16.5543 2.90652 17.2236 2.08089 17.2236C1.25523 17.2236 0.585938 16.5543 0.585938 15.7287C0.585938 14.903 1.25523 14.2337 2.08089 14.2337C2.90652 14.2337 3.57585 14.903 3.57585 15.7287Z" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12.931 11.2525C12.931 13.5256 11.0879 15.3689 8.81458 15.3689C6.53884 15.3689 4.69775 13.5234 4.69775 11.2525C4.69775 8.97931 6.54091 7.13568 8.81458 7.13568C11.0863 7.13568 12.931 8.97841 12.931 11.2525Z" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.34159 7.96106L3.96973 4.80443" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.6513 4.33913L9.87158 7.27307" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12.7879 16.6399L11.2578 14.5653" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.38583 13.5313L3.32568 14.9009" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.2216 12.4559L12.8604 12.0122" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.589 4.29154L11.6851 8.30286" strokeLinejoin="10" strokeLinecap="round" strokeLinejoin="round" />
               </g>
            </g>
            <defs>
               <clipPath id="clip0_4749_17384">
                  <rect width="20" height="20" fill="white" />
               </clipPath>
            </defs>
         </svg>
      case 'ImportData':
         return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-database"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
      case 'Item-Import':
         return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0001 19.3235L1.92578 14.6618V5.33832L10.0001 0.676636L18.0744 5.33832V14.6618L10.0001 19.3235Z" strokeWidth="1.17188" strokeLinejoin="10" />
            <path d="M1.92578 5.33826L10.0001 9.99998M10.0001 9.99998L18.0744 5.33826M10.0001 9.99998V19.3234" strokeWidth="1.17188" strokeLinejoin="10" />
            <path d="M12.8654 2.33093L4.79102 6.99265V11.6544L7.13477 13.0075V8.34582L15.2091 3.6841" strokeWidth="1.17188" strokeLinejoin="10" />
         </svg>

      case 'StockClipboard':
      case 'EmptyImage':
         return <svg width="20" height="20" viewBox="0 0 100 84" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M78.3978 12.9807L78.3925 0.337438C78.3925 0.247945 78.4282 0.162115 78.4916 0.0988335C78.5551 0.0355523 78.6411 0 78.7309 0L86.3227 0.0158206C86.4125 0.0158206 86.4985 0.0513689 86.562 0.11465C86.6254 0.177931 86.6611 0.263761 86.6611 0.353254V12.9912C86.6611 13.0807 86.6967 13.1665 86.7602 13.2298C86.8236 13.2931 86.9097 13.3286 86.9994 13.3286L99.6613 13.3076C99.751 13.3076 99.8371 13.3431 99.9006 13.4064C99.964 13.4697 99.9997 13.5555 99.9997 13.645L99.9679 21.2214C99.9679 21.3109 99.9323 21.3968 99.8688 21.46C99.8054 21.5233 99.7193 21.5589 99.6296 21.5589L87.01 21.5272C86.9203 21.5272 86.8342 21.5628 86.7708 21.6261C86.7073 21.6893 86.6717 21.7752 86.6717 21.8647L86.6505 34.5026C86.6505 34.5921 86.6149 34.678 86.5514 34.7412C86.4879 34.8045 86.4019 34.8401 86.3121 34.8401L78.7309 34.8664C78.6411 34.8664 78.5551 34.8309 78.4916 34.7676C78.4282 34.7043 78.3925 34.6185 78.3925 34.529V21.8647C78.3925 21.7752 78.3569 21.6893 78.2934 21.6261C78.23 21.5628 78.1439 21.5272 78.0542 21.5272L65.3923 21.5694C65.3026 21.5694 65.2165 21.5339 65.153 21.4706C65.0896 21.4073 65.0539 21.3215 65.0539 21.232L65.0381 13.645C65.0381 13.5555 65.0737 13.4697 65.1372 13.4064C65.2006 13.3431 65.2867 13.3076 65.3764 13.3076L78.0595 13.3181C78.1492 13.3181 78.2353 13.2825 78.2987 13.2193C78.3622 13.156 78.3978 13.0702 78.3978 12.9807Z" fill="#BFBFBF" />
            <path d="M86.1853 75.5112C86.4744 75.2792 86.6189 74.9787 86.6189 74.6096L86.6242 47.8469C86.6242 47.6114 86.7405 47.4936 86.9731 47.4936L94.5173 47.4778C94.6113 47.4778 94.7014 47.515 94.7678 47.5813C94.8342 47.6475 94.8716 47.7374 94.8716 47.8311C94.7975 56.7379 94.8081 65.9172 94.9033 75.3689C94.9279 77.7344 94.6883 79.4796 94.1843 80.6044C93.1657 82.868 91.0298 83.9998 87.7767 83.9998C60.1796 83.9857 33.4126 83.9805 7.47553 83.984C5.54409 83.9875 4.17834 83.7748 3.37827 83.346C1.18425 82.1755 0.00529148 80.0718 0.0105783 77.6465C0.0282009 58.2933 0.0246782 38.8785 6.45941e-06 19.4023C-0.00528034 15.6009 3.23552 13.281 6.77239 13.2915C21.8503 13.3232 36.9653 13.3267 52.1172 13.3021C52.1859 13.3021 52.2518 13.3287 52.3004 13.3762C52.349 13.4237 52.3763 13.488 52.3763 13.5552L52.3657 21.4743C52.3657 21.5692 52.3181 21.6167 52.223 21.6167L9.38407 21.5798C9.08822 21.5798 8.80448 21.697 8.59528 21.9056C8.38608 22.1142 8.26855 22.3972 8.26855 22.6922C8.26151 40.9031 8.26327 57.9418 8.27384 73.8082C8.27384 74.2054 8.30909 74.6026 8.37958 74.9998C8.41707 75.2211 8.53112 75.422 8.70148 75.5668C8.87183 75.7116 9.08746 75.7909 9.31005 75.7907C34.7501 75.7836 60.1144 75.7819 85.4029 75.7854C85.6954 75.7854 85.9563 75.694 86.1853 75.5112Z" fill="#BFBFBF" />
            <path d="M30.8649 38.3201C33.6854 38.3201 35.9719 36.0398 35.9719 33.2269C35.9719 30.4141 33.6854 28.1338 30.8649 28.1338C28.0443 28.1338 25.7578 30.4141 25.7578 33.2269C25.7578 36.0398 28.0443 38.3201 30.8649 38.3201Z" fill="#BFBFBF" />
            <path d="M38.9856 56.3673L55.0521 28.6239C55.0821 28.5736 55.1247 28.532 55.1757 28.5031C55.2266 28.4742 55.2843 28.459 55.3429 28.459C55.4015 28.459 55.4592 28.4742 55.5102 28.5031C55.5611 28.532 55.6037 28.5736 55.6337 28.6239L78.8903 68.7996C78.9137 68.84 78.9259 68.8858 78.9257 68.9324C78.9256 68.9789 78.913 69.0247 78.8894 69.0648C78.8657 69.105 78.8318 69.1382 78.7911 69.1611C78.7504 69.184 78.7044 69.1957 78.6577 69.195H16.1677C16.1274 69.1953 16.0877 69.1828 16.0538 69.1593C16.0198 69.1358 15.9932 69.1024 15.9774 69.0632C15.9351 68.9507 15.9439 68.8435 16.0039 68.7416C20.9206 60.2812 25.795 51.8629 30.6271 43.4868C30.6502 43.4462 30.6836 43.4125 30.724 43.389C30.7644 43.3655 30.8104 43.3531 30.8571 43.3531C30.9039 43.3531 30.9498 43.3655 30.9902 43.389C31.0306 43.4125 31.064 43.4462 31.0871 43.4868L38.5362 56.3673C38.5589 56.4067 38.5916 56.4395 38.631 56.4623C38.6705 56.485 38.7153 56.497 38.7609 56.497C38.8065 56.497 38.8512 56.485 38.8907 56.4623C38.9301 56.4395 38.9629 56.4067 38.9856 56.3673Z" fill="#BFBFBF" />
         </svg>
         
      default:
         break
   }
}
const detectBrowser = () => {
   const nAgt = navigator.userAgent
   let browserName = navigator.appName
   let nameOffset, verOffset
   // In Opera, the true version is after "Opera" or after "Version"
   if ((verOffset = nAgt.indexOf("OPR")) !== -1) {
      browserName = "Opera"
   } else if ((verOffset = nAgt.indexOf("MSIE")) !== -1) {
      // In MSIE, the true version is after "MSIE" in userAgent
      browserName = "Microsoft Internet Explorer"
   } else if ((verOffset = nAgt.indexOf("Edg")) !== -1) {
      browserName = "Edge"
   } else if ((verOffset = nAgt.indexOf("Chrome")) !== -1) {
      // In Chrome, the true version is after "Chrome"
      browserName = "Chrome"
   } else if ((verOffset = nAgt.indexOf("Safari")) !== -1) {
      // In Safari, the true version is after "Safari" or after "Version"
      browserName = "Safari"
   } else if ((verOffset = nAgt.indexOf("Firefox")) !== -1) {
      // In Firefox, the true version is after "Firefox"
      browserName = "Firefox"
   } else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
      // In most other browsers, "name/version" is at the end of userAgent
      browserName = nAgt.substring(nameOffset, verOffset)
   }
   return browserName
}
/**
 * IW0077
 * This function is called when user get user ip address
 */
const getUserIpAddress = async () => {
   if (localStorage.getItem('user_ip')) {
      return localStorage.getItem('user_ip')
   } else {
      const user_ip = await axios.get('https://api.bigdatacloud.net/data/client-ip').then(response => { return response.data.ipString }).catch(() => '')
      localStorage.setItem('user_ip', user_ip)
      return user_ip
   }
}
/**
 * IW0110
 * This function is called when user get state data
 */
const getStateData = async (country_id) => {
   if (country_id === 101) {
      return stateOfIndia
   } else {
      if (country_id) {
         const header = { 'access-token': localStorage.getItem('access_token') }
         const res = await GetApiCall('GET', `${CommonApiEndPoint.get_states}?id=${country_id}`, header)
         if (res.data.status === 'success' && res.data.statusCode === 200) {
            return res.data.data
         }
      }
   }
}
/**
 * IW0079
 * function is used to add manual event on any element of body 
 */
function munimAddCustomEventListener(selector, event, handler) {
   const rootElement = document.querySelector('body')
   rootElement.addEventListener(event, function (evt) {
      let targetElement = evt.target
      // eslint-disable-next-line eqeqeq
      while (targetElement != null) {
         if (targetElement.matches(selector)) {
            handler(evt)
            return
         }
         targetElement = targetElement.parentElement
      }
   },
      true
   )
}
/**
 * IW0110
 * This function is called when user get city data
 */
const getCityData = async (state_id, company_id = '') => {
   const header = { 'access-token': localStorage.getItem('access_token') }
   const res = await GetApiCall('GET', `${CommonApiEndPoint.get_cities}?id=${state_id}&company_id=${company_id}`, header)
   if (res.data.status === 'success' && res.data.statusCode === 200) {
      return res.data.data
   }
}

const isIosDevice = () => {
   const myParam = detectBrowser()
   if (myParam === 'Safari') {
      return true
   } else {
      return false
   }
}
function encrypt_decrypt_str(value, encrypt = true) {
   if (encrypt) {
      try {
         const ciphertext = CryptoJS.AES.encrypt(value, process.env.ENCRYPT_DECRYPT_KEY).toString()
         return ciphertext
      } catch (error) {
         return ''
      }
   } else {
      try {
         const bytes = CryptoJS.AES.decrypt(value, process.env.ENCRYPT_DECRYPT_KEY)
         const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
         return decryptedData
      } catch (error) {
         return ''
      }
   }
}


function generateRandomString(length) {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
   let randomString = ''

   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomString += characters.charAt(randomIndex)
   }
   return randomString
}

const channel_logo = {
   1: `${bucketUrl}assets/images/Flipkart.png`,
   2: `${bucketUrl}assets/images/Amazon.png`,
   3: `${bucketUrl}assets/images/meesho.png`,
   4: `${bucketUrl}assets/images/Ajio.png`,
   5: `${bucketUrl}assets/images/Jio.png`,
   6: `${bucketUrl}assets/images/Myntra.png`,
   7: `${bucketUrl}assets/images/eBay.png`,
   8: `${bucketUrl}assets/images/Shopclues.png`,
   9: `${bucketUrl}assets/images/Snapdeal.png`,
   10: `${bucketUrl}assets/images/Shopee.png`,
   11: `${bucketUrl}assets/images/LimeRoad.png`,
   12: `${bucketUrl}assets/images/Shopify.png`
}


export { getCookie, getJsDate, getTime, getJsTime, getDetectOs, handlePageRefresh, changeDateSeparator, debounce, getIcon, detectBrowser, getUserIpAddress, getStateData, munimAddCustomEventListener, getCityData, handleFocusTab, isIosDevice, encrypt_decrypt_str, generateRandomString, setCookie, channel_logo }