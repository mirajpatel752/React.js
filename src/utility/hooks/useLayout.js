//** React Imports
import  React from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { handleLayout, handleLastLayout } from '@store/layout'

export const useLayout = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const lastLayout = useSelector(state => state.layout.lastLayout)
  const layout = useSelector(state => state.layout.layout)
  const setLayout = value => {
    dispatch(handleLayout(value))
  }

  const setLastLayout = value => {
    dispatch(handleLastLayout(value))
  }

  // const handleLayoutUpdate = useCallback(() => {
  //   // ** If layout is horizontal & screen size is equals to or below 1200
  //   if (layout === 'horizontal' && window.innerWidth <= 1200) {
  //     setLayout('vertical')
  //     setLastLayout('horizontal')
  //   }
  //   // ** If lastLayout is horizontal & screen size is equals to or above 1200
  //   if (lastLayout === 'horizontal' && window.innerWidth >= 1200) {
  //     setLayout('horizontal')
  //   }
  // }, [])

  // // ** ComponentDidMount
  // useEffect(() => {
  //   handleLayoutUpdate()
  // }, [])

  // useEffect(() => {
  //   // ** Window Resize Event
  //   window.addEventListener('resize', handleLayoutUpdate)
  // }, [layout, lastLayout])

  if (window) {
    const breakpoint = 1200

    if (window.innerWidth < breakpoint) {
      setLayout('vertical')
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth <= breakpoint && lastLayout !== 'vertical' && layout !== 'vertical') {
        setLayout('vertical')
      }
      if (window.innerWidth >= breakpoint && lastLayout !== layout) {
        setLayout(lastLayout)
      }
    })
  }

  return { layout, setLayout, lastLayout, setLastLayout }
}
