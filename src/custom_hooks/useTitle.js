import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

function useTitle() {
  const history = useHistory()
  const web_title = useSelector((state) => state?.webTitleReducer?.web_title)
  const location_title = history.location.pathname.includes('dashboard') ? 'Dashboard' :  ''
  
  const setTitle = () => {
    const title = web_title
    document.title = `${location_title ? location_title : title} | The Best Accounting and E-invoicing Software | The Munim`
  }
  return setTitle
}

export default useTitle
