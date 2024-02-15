import React, { Fragment, useState, useRef, useEffect, useMemo } from 'react'
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import VerticalMenuHeader from './VerticalMenuHeader'
import VerticalNavMenuItems from './VerticalNavMenuItems'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from 'reactstrap'
import CommonApiEndPoint from '../../../../../helper/commonApiEndPoint'
import { GetApiCall } from '../../../../../helper/axios'
import { debounce } from '../../../../../helper/commonFunction'
import { setCompanyDataAvailable, setCompanyIsNext, setCompanyList, setSelectedCompanyObject } from '../../../../../redux/commonSlice'
import CommonRouter from '../../../../../helper/commonRoute'
import { useHistory } from 'react-router-dom'
import WarningModal from '../../../../../common_components/pop_up_modal/WarningModal'
import CompanySelect from '../../../../../common_components/search_select/CompanySelect'

const Sidebar = props => {
  const { menuCollapsed, routerProps, menu, currentActiveItem, skin, menuData } = props
  const companyList = useSelector((state) => state.commonReducer.company_list)
  const isMobile = useSelector((state) => state.windowResizeReducer.isMobile)
  const selected_company_object = useSelector((state) => state.commonReducer.selected_company_object)
  const shadowRef = useRef(null)
  const history = useHistory()
  const dispatch = useDispatch()
  const [groupOpen, setGroupOpen] = useState([])
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])
  const [activeItem, setActiveItem] = useState(null)
  const [menuHover, setMenuHover] = useState(false)
  const [companyListOpen, setCompanyListOpen] = useState(false)
  const [counter, setCounter] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [companyData, setCompanyData] = useState([])
  const [isNext, setIsNext] = useState(0)
  const [showInActiveCompanyPopUp, setShowInActiveCompanyPopUp] = useState(false)
  const onMouseEnter = () => {
    setMenuHover(true)
  }
  // ** Scroll Menu
  const scrollMenu = container => {
    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains('d-block')) {
        shadowRef.current.classList.add('d-block')
      }
    } else {
      if (shadowRef.current.classList.contains('d-block')) {
        shadowRef.current.classList.remove('d-block')
      }
    }
  }
  /**
  * IW0110
  * This function is call on get company list
  */
  const getCompanyList = async (arg = 0, filterData, change_company) => {
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    const res = await GetApiCall('GET', `${CommonApiEndPoint.company_list}?filter=${filterData ? filterData : ''}&limit=${arg}&per_page=10`, header)
    if (res.data.status === 'success' && res.data.data?.company_data?.length > 0) {
      const data = res.data.data
      setIsNext(data.is_next)
      if (arg) {
        setCompanyData([...companyData, ...data.company_data])
        dispatch(setCompanyList([...companyData, ...data.company_data]))
      } else {
        setCompanyData(data.company_data)
        dispatch(setCompanyList(data.company_data))
      }
      dispatch(setCompanyIsNext(data.is_next))
      if ((data.last_selected_company !== null || data.last_selected_company !== '') && change_company) {
        if (data.last_selected_company === '0') {
          dispatch(setCompanyDataAvailable(true))
        } else {
          dispatch(setSelectedCompanyObject(data.last_selected_company_obj))
          if (!window.location.pathname.includes(CommonRouter.dashboard)) history.push(CommonRouter.dashboard)
        }
      }
    } else {
      setCompanyData([])
      dispatch(setCompanyDataAvailable(true))
    }
  }
  useEffect(() => {
    if (companyListOpen) {
      setCounter(0)
      getCompanyList(0)
    }
  }, [companyListOpen])
  const updateLastSelectedCompany = async (companyObject, company_id) => {
    const header = {
      'access-token': localStorage.getItem('access_token')
    }
    const res = await GetApiCall('PUT', `${CommonApiEndPoint.update_last_selected_company}?id=${company_id ? company_id : companyObject?.id}`, header)
    if (res.data.status === 'success') {
      setSearchTerm('')
      history.push(CommonRouter.dashboard)
      getCompanyList(0, '', true)
    }
  }
  const handleSelectedCompany = (companyObject) => {
    if (selected_company_object.comp_id !== companyObject.comp_id) {
      if (companyObject.is_active) {
        updateLastSelectedCompany(companyObject)
        document.getElementById('company').focus()
      } else {
        setShowInActiveCompanyPopUp(true)
      }
    }
  }
  const closePopUp = () => {
    document.getElementById('company').focus()
    setShowInActiveCompanyPopUp(false)
  }
  /**
   * IW0110
   * This function is called when user try to search company from company list
   * if input field length is more then 2 char we call getCompanyData for api call to get searchable companyList
   */
  const handleSearch = (e) => {
    if (e.length) {
      getCompanyList(0, e)
    } else {
      getCompanyList(0, '')
    }
  }
  const [searchState] = useState({ fn: debounce(handleSearch, 500) })
  const handleFilter = (e) => {
    setCounter(0)
    setSearchTerm(e)
    searchState.fn(e)
  }
  /**
   * IW0110
   * This function is called when user click on view more button.
   */
  const handlePagination = () => {
    if (Number(isNext)) {
      const var_counter = Number(counter) + 1
      setCounter(var_counter)
      getCompanyList(var_counter, searchTerm)
    }
  }
  const calculation = useMemo(() => <>
    <CompanySelect
      id='select_company'
      companyValue={selected_company_object && selected_company_object.comp_id}
      handleChange={handleSelectedCompany}
      dynamicClassName="munim-company-list-name"
      openOnFocus={true}
    />
  </>, [selected_company_object.comp_id])
  return (
    <Fragment>
      <div
        className={classnames(`main-menu menu-fixed menu-accordion menu-shadow mobile-menu-sidebar munim-side-menu-nothover ${companyList.length === 0 ? 'display-nav-none' : ''}`, {
          expanded: menuHover || menuCollapsed === false,
          'menu-light': skin !== 'semi-dark' && skin !== 'dark',
          'menu-dark': skin === 'semi-dark' || skin === 'dark'
        }, menuHover ? 'munim-side-menu-onhover' : '')}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => { setMenuHover(false); setCompanyListOpen(false) }}
      >
        {menu ? (
          menu
        ) : (
          <Fragment>
            {/* Vertical Menu Header */}
            <VerticalMenuHeader setGroupOpen={setGroupOpen} menuHover={menuHover} setCompanyListOpen={setCompanyListOpen} companyListOpen={companyListOpen} {...props} />
            {/* Vertical Menu Header Shadow */}
            <div className='shadow-bottom' ref={shadowRef}></div>
            {/* Perfect Scrollbar */}
            <div className='col-xl-12 col-md-12  px-1 d-none d-sm-block'>
              <div className='mb-0 munim-media-q-companyName d-block d-xl-none d-sm-none d-md-block mobile-company-list gap-0 munim-navbar-company-name'>
                <h4 className='mb-0 h-100'>
                  <div className='d-flex justify-content-start align-items-center h-100 munim-company-name-dropdown'>
                    <span className='munim-company-name-top'>Company:</span>
                    {calculation}
                  </div>
                </h4>
              </div>
            </div>
            <PerfectScrollbar
              className='main-menu-content'
              options={{ wheelPropagation: false }}
              onScrollY={container => scrollMenu(container)}
              style={{ display: companyListOpen ? 'none' : 'block' }}
            >
              <ul className='navigation navigation-main'>
                <VerticalNavMenuItems
                  items={menuData}
                  menuData={menuData}
                  menuHover={menuHover}
                  groupOpen={groupOpen}
                  activeItem={activeItem}
                  groupActive={groupActive}
                  currentActiveGroup={currentActiveGroup}
                  routerProps={routerProps}
                  setGroupOpen={setGroupOpen}
                  menuCollapsed={menuCollapsed}
                  setActiveItem={setActiveItem}
                  setGroupActive={setGroupActive}
                  setCurrentActiveGroup={setCurrentActiveGroup}
                  currentActiveItem={currentActiveItem}
                />
              </ul>
            </PerfectScrollbar>
            {isMobile ? <div className='munim-search-input-bar'>
              <div className='position-relative munim-search-input-pd'>
                <Input
                  placeholder='Search company name'
                  name="companylist"
                  id="companylist"
                  autoComplete="off"
                  type="search"
                  value={searchTerm}
                  onChange={e => handleFilter(e.target.value)}
                />
              </div>
            </div> : ''}
            <PerfectScrollbar
              className='main-menu-content munim-change-company-list'
              style={{ display: companyListOpen ? 'block' : 'none' }}
            >
              <div className='mumim-company-list-box'>
                <ul className='navigation navigation-main'>
                  {companyData.map((item) => {
                    return (
                      <li className={`nav-item single ${selected_company_object.comp_id === item.comp_id ? 'munim-current-company' : ''}`} onClick={() => handleSelectedCompany(item)}>
                        <a className='d-flex align-items-center justify-content-between gap-1'>
                          <div className='d-flex align-items-center gap-1 munim-elipsis-text'>
                            <div className="d-flex align-items-center justify-content-between munim-elipsis-text">
                              <span className="menu-item text-truncate lh-sm munim-menu-fnt">{item.alias_name ? `${item.company_name} - ${item.alias_name}` : item.company_name}<br />
                                <div className='munim-font-size-x-small'>
                                  {item.registration_type === '1' ? 'Regular.' : item.registration_type === '2' ? 'Composition.' : item.registration_type === '3' ? 'Consumer.' : item.registration_type === '4' ? 'Unregistered.' : 'Unknown.'}{item.gst_in ? ` GSTIN: ${item.gst_in}` : ''}
                                </div>
                              </span>
                            </div>
                          </div>
                          {selected_company_object.comp_id === item.comp_id ? <div className="munim-icon-link-svg">
                            <div className='munim-select-company-icon d-flex align-items-center'>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1773ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          </div> : ''}
                        </a>
                      </li>)
                  })}
                  {!companyData?.length ? <div className='munim-save d-flex justify-content-center align-items-center'>There are no records to display.</div> : ''}
                  {companyData.length > 9 && Number(isNext) ? <div className='munim-company-view-more-btn '>
                    <div className='munim-save d-flex justify-content-center align-items-center'>
                      <CustomButton type='button' color='primary' label='View More' handleClick={() => handlePagination()} />
                    </div>
                  </div> : ''}
                </ul>
              </div>
            </PerfectScrollbar>
          </Fragment>
        )}
      </div>
      {showInActiveCompanyPopUp ? <WarningModal WarningPopUpActive={showInActiveCompanyPopUp} popUpTitle='Company Change Warning!' popUpContent='Your company access is restricted , please contact to owner!' handleWarningPopUp={closePopUp} primaryLabel='Ok' secondaryLabel='Cancel' /> : ''}
    </Fragment >
  )
}

export default Sidebar
