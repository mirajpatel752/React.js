// ** Store Imports
import { handleFooterType } from '@store/layout'
import { useDispatch, useSelector } from 'react-redux'

export const useFooterType = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const footerType = useSelector(state => state.layout.footerType)

  const setFooterType = type => {
    dispatch(handleFooterType(type))
  }

  return { setFooterType, footerType }
}
