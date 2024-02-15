/* eslint-disable no-unused-expressions */
// ** React Imports
import { useHistory } from 'react-router-dom'
// ** Third Party Components
import Proptypes from 'prop-types'
import React, { useEffect } from 'react'
// ** Reactstrap Imports
import { Button } from 'reactstrap'
import { useDispatch } from 'react-redux'
import { setWebTitleName } from '../redux/webTitleSlice'
import ReportFilter from './custom_dropdown/ReportFilter'

const ModuleTitle = props => {
  // ** Props
  const history = useHistory()
  const dispatch = useDispatch()
  const { breadCrumbTitle, breadCrumbParent, breadCrumbParent2, breadCrumbParent3, breadCrumbActive, customFilterList, handleDeleteFilter } = props
  const links = props.links ? props.links : []
  /**
  * IW0110
  * This effect call on replace web title name as a current module title name
  */
  useEffect(() => {
    if (breadCrumbTitle) {
      dispatch(setWebTitleName(breadCrumbTitle))
    }
  }, [breadCrumbTitle])

  return (
    <>
      <div className='content-header row munim-mobile-breadcrumbs-top'>
        <div className='content-header-left '>
          <div className='breadcrumbs-top p-0'>
            <div className='d-flex-justfy-space-mobile p-0'>
              {breadCrumbTitle ? <h2 className={`content-header-title mb-0 ${breadCrumbParent || breadCrumbParent2 || breadCrumbParent3 || breadCrumbActive ? '' : 'border-0'}`}>
                {links[0]?.length || links[0]?.pathname?.length ? <Button outline className='munim-border-bottom-unset me-1 d-flex align-items-center px-0' onClick={(e) => { e.preventDefault(); history.push(links[0]) }}  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="34" height="28" viewBox="0 0 34 28" fill="none">
                    <rect opacity="0.5" x="0.5" y="0.5" width="33" height="27" rx="3.5" stroke="black" />
                    <path d="M21.8773 13.1662H14.2482L16.4166 10.4223C16.4777 10.3449 16.5262 10.2531 16.5593 10.152C16.5924 10.0509 16.6094 9.94256 16.6094 9.83315C16.6094 9.72374 16.5924 9.6154 16.5593 9.51431C16.5262 9.41323 16.4777 9.32139 16.4166 9.24402C16.3554 9.16666 16.2828 9.10529 16.203 9.06342C16.1231 9.02155 16.0375 9 15.951 9C15.8646 9 15.7789 9.02155 15.6991 9.06342C15.6192 9.10529 15.5466 9.16666 15.4855 9.24402L12.1931 13.4104C12.1319 13.4877 12.0833 13.5795 12.0502 13.6806C12.0171 13.7817 12 13.8901 12 13.9995C12 14.1089 12.0171 14.2173 12.0502 14.3184C12.0833 14.4195 12.1319 14.5113 12.1931 14.5886L15.4855 18.755C15.5465 18.8326 15.619 18.8943 15.6989 18.9363C15.7788 18.9784 15.8645 19 15.951 19C16.0375 19 16.1232 18.9784 16.2031 18.9363C16.283 18.8943 16.3555 18.8326 16.4166 18.755C16.4778 18.6777 16.5263 18.5858 16.5594 18.4848C16.5926 18.3837 16.6096 18.2753 16.6096 18.1659C16.6096 18.0564 16.5926 17.9481 16.5594 17.847C16.5263 17.7459 16.4778 17.6541 16.4166 17.5767L14.2482 14.8328H21.8773C22.052 14.8328 22.2195 14.745 22.3429 14.5887C22.4664 14.4324 22.5358 14.2205 22.5358 13.9995C22.5358 13.7785 22.4664 13.5666 22.3429 13.4103C22.2195 13.254 22.052 13.1662 21.8773 13.1662Z" fill="#5C5F62" />
                  </svg>
                </Button> : ''}
                <div className='d-flex responsive-module-badge'>
                  <div className='munim-quick-pin-link d-flex align-items-center gap-1 pe-1 sales-invoice-filter-dropdown'>
                    {customFilterList?.length > 1 ? <ReportFilter
                      name='report_filter'
                      listOption={customFilterList}
                      redirectUrl={props.url}
                      handleDeleteFilter={handleDeleteFilter}
                      breadCrumbTitle={breadCrumbTitle}
                    /> : <span>{breadCrumbTitle}</span>}
                  </div>
                </div>
              </h2> : ''}
              {props.isShowCreateButton ? <div className='create-mobil-btn-show'>
                <div className='mobil-creat-svg-border'>
                  <svg width="15" height="15" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" cursor='pointer' className='' onClick={(e) => { e.preventDefault(); history.push(props.create_button_url) }}>
                    <path d="M10.8756 6.56H6.50763V10.856H4.49163V6.56H0.123625V4.664H4.49163V0.344H6.50763V4.664H10.8756V6.56Z" fill="#fff" />
                  </svg>
                </div>
              </div> : ''}
            </div>
          </div>
        </div>
      </div >
    </>
  )
}
export default ModuleTitle

// ** PropTypes
ModuleTitle.propTypes = {
  breadCrumbTitle: Proptypes.string.isRequired,
  breadCrumbActive: Proptypes.string
}
