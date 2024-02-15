// ** React Imports
import React, { Fragment, useEffect, useState } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import { useHistory } from 'react-router'
// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { handleContentWidth, handleMenuCollapsed, handleMenuHidden } from '@store/layout'

// ** Styles
import 'animate.css/animate.css'
import CustomButton from '../../../../common_components/custom_field/CustomButton'
import CommonRouter from '../../../../helper/commonRoute'

const LayoutWrapper = props => {
  // ** Props
  const { layout, children, appLayout, wrapperClass, transition, routeMeta } = props

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state)
  const showHeader_action = useSelector((state) => state.headerActionReducer.show_header_action)
  const [showHeaderAction, setShowHeaderAction] = useState(false)
  const history = useHistory()

  const navbarStore = store.navbar
  const contentWidth = store.layout.contentWidth

  //** Vars
  const Tag = layout === 'HorizontalLayout' && !appLayout ? 'div' : Fragment

  // ** Clean Up Function
  const cleanUp = () => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth('full'))
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(!routeMeta.menuCollapsed))
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(!routeMeta.menuHidden))
      }
    }
  }

  // ** ComponentDidMount
  useEffect(() => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth(routeMeta.contentWidth))
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(routeMeta.menuCollapsed))
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(routeMeta.menuHidden))
      }
    }
    return () => cleanUp()
  }, [])

  useEffect(() => {
    setShowHeaderAction(showHeader_action.display)
  }, [showHeader_action])

  return (
    <div
      className={classnames(`${showHeaderAction ? 'app-content-with-discard-data' : 'app-content'} content`, {
        [wrapperClass]: wrapperClass,
        'show-overlay': navbarStore.query.length
      })}
    >
      <div className='content-overlay'></div>
      <div className='header-navbar-shadow' />
      {showHeaderAction ? <div className='munim-nav-top-bar'>
        <div className='container-fluid top-bar-pd'>
          <div className='row'>
            <div className='col-6 munim-pe-0 munim-tab-center'>
              <div className='munim-unsaved-changes  d-flex align-items-center h-100'>{showHeader_action.title}</div>
            </div>
            <div className='col-6 munim-d-flex-mb munim-tab-center'>
              <div className='unsaved-changes-btn text-center munim-mb-btn d-flex justify-content-end'>
                <CustomButton className='me-1' color='dark' handleClick={showHeader_action.secondaryAction} type='button' label='Discard' tabIndex="-1" />
                <CustomButton color='success' type='button' handleClick={showHeader_action.mainAction} loader={showHeader_action.loader} disabled={showHeader_action.disabled} label='Save' />
              </div>
            </div>
          </div>
        </div>
      </div> : ''
      }
      <div
        className={classnames({
          'content-wrapper': !appLayout,
          'content-area-wrapper': appLayout,
          'container-fluid p-0': history.location.pathname.includes(CommonRouter.dashboard) || history.location.pathname.includes('/feature-request') || history.location.pathname.includes('/billing-plan') ? '' : contentWidth === 'boxed',
          [`animate__animated animate__${transition}`]: transition !== 'none' && transition.length
        })}
      >
        <Tag
          /*eslint-disable */
          {...(layout === 'HorizontalLayout' && !appLayout
            ? { className: classnames({ 'content-body': !appLayout }) }
            : {})}
        /*eslint-enable */
        >
          {children}
        </Tag>
      </div>
    </div>
  )
}

export default LayoutWrapper
