// ** Icons Import
import React, { useEffect, useState } from 'react'
const Footer = () => {
  const navigatorOnlineStatus = typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true
  const [onlineStatus, setOnlineStatus] = useState(navigatorOnlineStatus)
  const [isShowStatus, setIsShowStatus] = useState(false)
  /**
   * IW0110
   * This function used when network interrupt
   */
  const goOnline = () => setOnlineStatus(true)
  const goOffline = () => setOnlineStatus(false)
  useEffect(() => {
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])
  /**
   * IW0110
   * This effect call on hide & show toast message for network interrupt
   */
  useEffect(() => {
    if (!onlineStatus) {
      setIsShowStatus(true)
    } else if (onlineStatus && isShowStatus) {
      setTimeout(() => {
        setIsShowStatus(false)
        window.location.reload()
      }, 1000)
    }
  }, [onlineStatus])

  return (
    <div>
      <p className='clearfix mb-0'>
        <span className='float-md-start d-block d-md-inline-block mt-25 footer-text'>
          COPYRIGHT © {new Date().getFullYear()}{' '}
          <a href='https://themunim.com/' target='_blank' rel='noopener noreferrer'>
            Munim ERP Pvt Ltd
          </a>
          <span className='d-none d-sm-inline-block'>, All Rights Reserved.</span>
        </span>
        {/* <span className='float-md-end d-none d-md-block'>
        Hand-crafted & Made with
        <Heart size={14} />
      </span> */}
      </p>
      <span className={`internet-status ${isShowStatus ? onlineStatus ? 'internet-back-online' : 'internet-connection' : ''}`}>{isShowStatus ? onlineStatus ? 'Back online' : 'No internet connection' : ''}</span>
    </div>
  )
}
export default Footer