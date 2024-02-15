import React from 'react'
import { Alert } from 'reactstrap'
import { AlertCircle } from 'react-feather'
import { Link } from 'react-router-dom'

const BasicAlert = ({ type, message, alertStyle, alertCircleSize, hideAlertIcon, link_url_path, linkMessage, withLink, className, actionMessage, mainAction }) => {
  return (
    <div>
      <Alert color={type} className={`${alertStyle ? alertStyle : 'my-0 mb-2 mt-1'}`}>
        <div className={className ? className : 'alert-body d-flex align-items-center gap-1'}>
          {!hideAlertIcon ? <div>
            {
              type === "success" ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0C4.486 0 0 4.486 0 10ZM15.2071 8.20711C15.5976 7.81658 15.5976 7.18342 15.2071 6.79289C14.8166 6.40237 14.1834 6.40237 13.7929 6.79289L9 11.5858L6.70711 9.29289C6.31658 8.90237 5.68342 8.90237 5.29289 9.29289C4.90237 9.68342 4.90237 10.3166 5.29289 10.7071L8.29289 13.7071C8.68342 14.0976 9.31658 14.0976 9.70711 13.7071L15.2071 8.20711Z" fill="#007F5F" />
              </svg> : <AlertCircle size={alertCircleSize ? alertCircleSize : 30} />
            }
          </div> : ''}
          {withLink ? <span>
            {message}
            <Link to={link_url_path} >{linkMessage}</Link>.
          </span> : mainAction ? <>
            <span>
              {message}
              <span className='fw-bolder text-primary' role='button' onClick={mainAction}>
                {actionMessage}
              </span></span> </> : <span dangerouslySetInnerHTML={{ __html: message }}></span>}
        </div>
      </Alert>
    </div>
  )
}

export default BasicAlert