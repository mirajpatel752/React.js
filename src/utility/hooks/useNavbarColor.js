// ** Store Imports
import { handleNavbarColor } from '@store/layout'
import { useDispatch, useSelector } from 'react-redux'

export const useNavbarColor = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const navbarColor = useSelector(state => state.layout.navbarColor)
  // ** Return a wrapped version of useState's setter function
  const setNavbarColor = value => {
    dispatch(handleNavbarColor(value))
  }

  return { navbarColor, setNavbarColor }
}
