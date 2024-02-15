import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { debounce } from '../helper/commonFunction'
function useNotify() {
  /** type value must be success or error or warning or info */
  const showToastMessage = (message, type, handleClick) => {
    return message ? toast(() => (message.split('@$@').map((data) => (
      <div dangerouslySetInnerHTML={{ __html: `${data}<br/>` }}>
      </div >
    ))), {
      position: 'top-center',
      autoClose: type === 'success' ? 5555 : 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      type: [type],
      onClick: handleClick
    }
    ) : false
  }

  const [toastMessage] = useState({ fn: debounce(showToastMessage, 500) })
  const showToast = (message, type, handleClick) => {
    toastMessage.fn(message, type, handleClick)
  }
  return showToast
}

export default useNotify
