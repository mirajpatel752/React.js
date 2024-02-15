/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
import React, { useEffect, useMemo, useState } from 'react'
import UserDropdown from './UserDropdown'
import CompanySelect from '../../../../common_components/search_select/CompanySelect'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Logo from '../../../../common_components/Logo'
import CommonRouter from '../../../../helper/commonRoute'
import CommonApiEndPoint from '../../../../helper/commonApiEndPoint'
import { setCompanyList, setCompanyIsNext, setCompanyDataAvailable, setSelectedCompanyObject, setUserName } from '../../../../redux/commonSlice'
import { Spinner } from 'reactstrap'
import { ApiCall, GetApiCall } from '../../../../helper/axios'
import WarningModal from '../../../../common_components/pop_up_modal/WarningModal'
import CompleteProfileModel from '../../../../common_components/pop_up_modal/CompleteProfileModal'
import { munimApiEndpoint } from '../../../../helper/commonApi'

const NavbarUser = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
  const company_data_available = useSelector((state) => state.commonReducer.company_data_available)
  const is_profile_complete = useSelector((state) => state.commonReducer.is_profile_complete)
  const company_list = useSelector((state) => state.commonReducer.company_list)
  const user_created = useSelector((state) => state.commonReducer.user_created)
  const profile_status = useSelector((state) => state.commonReducer.profile_status)
  const incomplete_user_profile = useSelector((state) => state.commonReducer.incomplete_user_profile)
  const [selectedCompany, setSelectedCompany] = useState('')
  const [saveLoader, setSaveLoader] = useState(false)
  const [showInActiveCompanyPopUp, setShowInActiveCompanyPopUp] = useState(false)
  const [completeProfilePopup, setCompleteProfilePopup] = useState(false)
  const user_data = useSelector((state) => state.commonReducer)

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
          dispatch(setCompanyDataAvailable(true))
        } else {
          dispatch(setSelectedCompanyObject(data.last_selected_company_obj))
          setSaveLoader(false)
        }
      }
    } else {
      dispatch(setCompanyDataAvailable(true))
    }
  }
  /**
   * IW0110
   * This function is call on update last selected company
   */
  const updateLastSelectedCompany = async (companyObject) => {
    if (selected_company_object?.comp_id !== companyObject?.comp_id) {
      const header = {
        'access-token': localStorage.getItem('access_token')
      }
      const res = await GetApiCall('PUT', `${CommonApiEndPoint.update_last_selected_company}?id=${companyObject.id}`, header)
      if (res.data.status === 'success') {
        getCompanyList()
      }
    }
  }
  /**
   * IW0110
   * This function is call on change selected compny
   */
  const handleSelectedCompany = (companyObject) => {
    setSelectedCompany(companyObject.comp_id)
    if (selected_company_object.comp_id !== companyObject.comp_id) {
      if (companyObject.is_active) {
        setSaveLoader(true)
        updateLastSelectedCompany(companyObject)
        document.getElementById('company').focus()
      } else {
        setShowInActiveCompanyPopUp(true)
      }
    }
  }
  /**
   * IW0110
   * This function is called when confirmation box close
   */
  const closePopUp = () => {
    document.getElementById('company').focus()
    setShowInActiveCompanyPopUp(false)
  }
  useEffect(() => {
    if (selected_company_object.comp_id === selectedCompany && !window.location.pathname.includes(CommonRouter.dashboard)) {
      history.push(CommonRouter.dashboard)
    }
  }, [selected_company_object.comp_id, selectedCompany])

  const selectCompany = useMemo(() => <>
    <CompanySelect
      id='company'
      companyValue={selected_company_object.comp_id ? selected_company_object.comp_id : selectedCompany}
      handleChange={handleSelectedCompany}
      openOnFocus={true}
    />
  </>, [selectedCompany, selected_company_object.comp_id])


  /**
 * IW0214
 * This effect is called to check user profile is complete or not
 */
  useEffect(() => {
    const weekly_popup_active = new Date() - new Date(user_created)
    const popup_active = new Date(weekly_popup_active).getDate() - 1
    if (([7, 14, 21, 28].includes(popup_active) || ((company_list.length === 0 || company_list.length === 1) && is_profile_complete)) && profile_status !== 100 && !window.location.pathname.includes(CommonRouter.profile) && incomplete_user_profile === '1') {
      setCompleteProfilePopup(true)
      dispatch(setUserName({ ...user_data, is_profile_complete: true }))
    } else {
      if (popup_active < 29 && ![7, 14, 21, 28].includes(popup_active) && incomplete_user_profile === '0') {
        popupActive(1)
        dispatch(setUserName({ ...user_data, incomplete_user_profile: '1' }))
      }
      setCompleteProfilePopup(false)
      dispatch(setUserName({ ...user_data, is_profile_complete: false }))
    }
  }, [user_created, is_profile_complete])


  /**
* IW0214
* This Function is call when user profile is incomplete and check profile status
*/
  const popupActive = async (status = 0) => {
    const header = { 'access-token': localStorage.getItem('access_token') }
    const data = {
      status
    }
    const res = await ApiCall('POST', `${munimApiEndpoint}${CommonApiEndPoint.incomplete_user_profile_status}`, data, header, false, true)
    if (res.data.status === 'success') {
      dispatch(setUserName({ ...user_data, incomplete_user_profile: '0' }))
    }
  }

  return (<>
    {/** Company and Year dropdown put here */}
    <div className='w-100'>
      <div className='row align-items-center munim-desktop-menu munim-mobile-view-header-responsive'>
        {selected_company_object?.id && !history.location.pathname.includes('/my-company-list') && !history.location.pathname.includes('/master-item') && !history.location.pathname.includes('/bulk-mapping') && !history.location.pathname.includes('/master-import-data') && !history.location.pathname.includes('/master-mapped-items') ? <>
          <div className='col-6 col-xl-3 col-md-3 munim-tab-device-year mobile-view-none'>
          </div>
          <div className={`col-xl-5 col-md-5 mb-0 munim-media-q-companyName d-none d-md-block ${selected_company_object.is_active === 0 ? 'munim-company-inactive' : ''}`}>
            {saveLoader ? <div className='d-flex justify-content-center align-items-center'><Spinner  size='lg' /></div> : <h4 className='mb-0 h-100'>
              <div className='d-flex justify-content-center align-items-center h-100 munim-company-name-dropdown munim-company-name-tab-none'>
                {selectCompany}
              </div>
            </h4>}
          </div>
        </> : <>
          {company_data_available && !selected_company_object?.id ? <div className='position-absolute mobile-d-none'>
            <Logo />
          </div> : ''}
          {!history.location.pathname.includes('my-company-list') ? <>
            <div className='col-6 col-xl-2 col-md-3 munim-web-com-years'></div>
            <div className='col-xl-4 col-md-6 mb-0 mobile-disply-none'></div>
          </> : ''}
        </>}
        <div className={`${selected_company_object?.id && !history.location.pathname.includes('/my-company-list') && !history.location.pathname.includes('/bulk-mapping') && !history.location.pathname.includes('/master-import-data') && !history.location.pathname.includes('/master-mapped-items') ? `munim-company-admin ${history.location.pathname.includes('/master-item') ? "col-6 col-xl-4 col-md-1 ms-auto" : "col-6 col-xl-4 col-md-4"}` : 'col-6 col-xl-4 col-md-1 ms-auto munim-tab-device-admin'}`}>
          <ul className='nav navbar-nav justify-content-end align-items-center ms-auto gap-1 munim-all-icon-action'>
            <UserDropdown />
          </ul>
        </div>
        {showInActiveCompanyPopUp ? <WarningModal WarningPopUpActive={showInActiveCompanyPopUp} popUpTitle='Company Change Warning!' popUpContent='Your company access is restricted , please contact to owner!' handleWarningPopUp={closePopUp} primaryLabel='Ok' secondaryLabel='Cancel' /> : ''}
      </div >
    </div >
    {completeProfilePopup && is_profile_complete ? <CompleteProfileModel profilePopUpActive={completeProfilePopup} popupActive={popupActive} setCompleteProfilePopup={setCompleteProfilePopup} /> : ''}
  </>
  )
}
export default NavbarUser
