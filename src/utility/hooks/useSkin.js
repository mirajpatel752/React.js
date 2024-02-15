// ** React Imports
import React, { useEffect } from 'react'

// ** Store Imports
import { handleSkin } from '@store/layout'
import { useDispatch, useSelector } from 'react-redux'

export const useSkin = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const skin = useSelector(state => state.layout.skin)

  const setSkin = type => {
    dispatch(handleSkin(type))
  }

  useEffect(() => {
    // ** Get Body Tag
    const element = window.document.body

    // ** Define classnames for skins
    const classNames = {
      dark: 'dark-layout',
      bordered: 'bordered-layout',
      'semi-dark': 'semi-dark-layout'
    }

    // ** Remove all classes from Body on mount
    element.classList.remove(...element.classList)

    // ** If skin is not light add skin class
    if (skin !== 'light') {
      element.classList.add(classNames[skin])
    }
  }, [skin])

  return { skin, setSkin }
}
