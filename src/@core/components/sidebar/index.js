// ** Third Party Components
import { X } from 'react-feather'
import Proptypes from 'prop-types'
import classnames from 'classnames'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import React, { useEffect } from 'react'

const Sidebar = props => {
  // ** Props
  const {
    open,
    size,
    title,
    width,
    children,
    closeBtn,
    className,
    toggleSidebar,
    bodyClassName,
    viewItem,
    contentClassName,
    wrapperClassName,
    active,
    // headerClassName,
    ...rest
  } = props
  // ** If user passes custom close btn render that else default close btn
  const renderCloseBtn = closeBtn ? closeBtn : <X className='cursor-pointer' size={15} onClick={toggleSidebar} />

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const parent = document.getElementsByClassName('munim-sidebar')
        if (parent.length) {
          parent[parent.length - 1]?.querySelector('input')?.focus()
          document.getElementsByClassName('munim-sidebar')[parent.length - 1].parentElement.style = 'position: relative; z-index: 2000000000; display: block;'
        }
      }, 100)
    }
  }, [open])

  return (
    <Modal
      isOpen={open}
      toggle={toggleSidebar}
      contentClassName={classnames('overflow-hidden', {
        [contentClassName]: contentClassName
      })}
      modalClassName={classnames('modal-slide-in', {
        [wrapperClassName]: wrapperClassName
      })}
      className={classnames({
        [className]: className,
        'sidebar-lg munim-sidebar-scroll': size === 'lg',
        'sidebar-sm munim-sidebar-scroll': size === 'sm',
        'sidebar-half munim-sidebar-scroll': size === 'half'
      })}
      /*eslint-disable */
      {...(width !== undefined
        ? {
          style: { width: String(width) + 'px' }
        }
        : {})}
      /*eslint-enable */
      {...rest}
    >
      <div className={viewItem ? 'munim-view-sidebar' : ''}>
        <ModalHeader
          // className={classnames({
          //   [headerClassName]: headerClassName
          // })}
          // toggle={toggleSidebar}
          close={renderCloseBtn}
          className={active ? 'munim-sidebar-pin' : ''}
        // tag='div'
        >
          {/* <div className='modal-title w-100 pe-1'> */}
          <div className='align-middle d-flex w-100 align-items-center justify-content-between cursor-pointer'>{title}
          </div>
        </ModalHeader>
      </div>
      {/* <PerfectScrollbar options={{ wheelPropagation: true }}> */}
      <ModalBody
        className={classnames('flex-grow-1 pt-1', {
          [bodyClassName]: bodyClassName
        })}
      >
        {children}
      </ModalBody>
      {/* </PerfectScrollbar> */}
    </Modal>
  )
}

export default Sidebar

// ** PropTypes
Sidebar.propTypes = {
  className: Proptypes.string,
  bodyClassName: Proptypes.string,
  open: Proptypes.bool.isRequired,
  viewItem: Proptypes.bool,
  title: Proptypes.string.isRequired,
  contentClassName: Proptypes.string,
  wrapperClassName: Proptypes.string,
  children: Proptypes.any.isRequired,
  size: Proptypes.oneOf(['sm', 'lg', 'half']),
  toggleSidebar: Proptypes.func.isRequired,
  onClick: Proptypes.func,
  active: Proptypes.string,
  module: Proptypes.string,
  url: Proptypes.string,
  section: Proptypes.string,
  action: Proptypes.string,
  width: Proptypes.oneOfType([Proptypes.number, Proptypes.string])
}
