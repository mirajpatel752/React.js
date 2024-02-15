/* eslint-disable no-unused-expressions */
/* eslint-disable no-duplicate-imports */
// ** React Imports
import React from 'react'
import Avatar from '@components/avatar'
// ** Third Party Components
import { Settings, Briefcase, User, Copy, ArrowRightCircle } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import * as Icon from 'react-feather'
// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import CommonRouter from '../../../../helper/commonRoute'
import { isLocal } from '../../../../helper/commonApi'
import { useSelector } from 'react-redux'
import useNotify from '../../../../custom_hooks/useNotify'
const createGuest = require('cross-domain-storage/guest')

// ** Default Avatar Image
//import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'

const UserDropdown = () => {
  const history = useHistory()
  const notify = useNotify()
  const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
  const company_data_available = useSelector((state) => state.commonReducer.company_data_available)
  const user_mobile = useSelector((state) => state.commonReducer.user_mobile)
  const user_fname_lname = useSelector((state) => state.commonReducer.user_fname_lname)
  const logoutCheck = () => {
    const accountLocalStorage = createGuest(`${process.env.LOGIN_DOMAIN}/log-in?is_logout&product=ecom`)
    accountLocalStorage.get('is_log', function (error, value) {
      if (value) {
        localStorage.clear()
        accountLocalStorage.remove('is_log')
        window.open(CommonRouter.redirect_to_account, '_parent')
        accountLocalStorage?.remove('logged_app', function () { })
        accountLocalStorage?.remove('common_data', function () { })
      }
    })
  }

  const Logout = async () => {
    if (isLocal) {
      await logoutCheck()
    } else {
      localStorage.clear()
    }
  }
  const onCopy = () => {
    notify('Support token is copied to clipboard.', 'success')
  }
  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link m-0 p-0' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold m-0'>{user_fname_lname[0] && user_fname_lname[1] ? `${user_fname_lname[0]} ${user_fname_lname[1]}` : user_fname_lname[0] ? user_fname_lname[0] : user_fname_lname[1] ? user_fname_lname[1] : user_mobile}</span>
          <span className='user-status'>{selected_company_object?.roles === 0 ? 'Owner' : selected_company_object?.roles === 1 ? 'Manager' : selected_company_object?.roles === 2 ? 'Staff' : ''} </span>
        </div>
        <Avatar icon={'MU'} imgHeight='40' imgWidth='40' />
      </DropdownToggle>
      <DropdownMenu end>

        {company_data_available && selected_company_object?.id ? <>
          <DropdownItem text className='support-token-hover m-0 px-1'>
            <Icon.Users size={14} className='me-75' />
            <span className='align-middle'>Support Token</span>
          </DropdownItem>

          <CopyToClipboard onCopy={onCopy} text={selected_company_object.support_token}>
            <DropdownItem>
              <span className='align-middle'>ID: {selected_company_object.support_token}</span>
              <Copy className='ms-75' />
            </DropdownItem>
          </CopyToClipboard>
          <DropdownItem divider />
        </> : null}

        <DropdownItem onClick={(e) => { e.preventDefault(); history.push(CommonRouter.profile) }}>
          <User size={14} className='me-75' />
          <span className='align-middle'>User Account</span>
        </DropdownItem>
        <DropdownItem onClick={(e) => { e.preventDefault(); history.push(CommonRouter.company) }}>
          <Briefcase size={14} className='me-75' />
          <span className='align-middle'>My Company</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={(e) => { e.preventDefault(); history.push(CommonRouter.setting) }}>
          <Settings size={14} className='me-75' />
          <span className='align-middle'>Setting</span>
        </DropdownItem>
        <DropdownItem onClick={(e) => { e.preventDefault(); Logout() }}>
          <ArrowRightCircle size={14} className='me-75' />
          <span className='align-middle'>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
