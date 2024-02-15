// ** Store Imports
import { handleRouterTransition } from '@store/layout'
import { useDispatch, useSelector } from 'react-redux'

export const useRouterTransition = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const routerTransition = useSelector(state => state.layout.routerTransition)
  const setTransition = type => {
    dispatch(handleRouterTransition(type))
  }

  return { transition: routerTransition, setTransition }
}
