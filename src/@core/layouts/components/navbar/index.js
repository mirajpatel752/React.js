// ** React Imports
import React, { Fragment } from 'react'
// ** Custom Components
import NavbarUser from './NavbarUser'
import NavbarBookmarks from './NavbarBookmarks'

const ThemeNavbar = props => {
  // ** Props
  const { skin, setSkin, setMenuVisibility, menuVisibility } = props

  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center mobile-view-none'>
        <NavbarBookmarks setMenuVisibility={setMenuVisibility} menuVisibility={menuVisibility} />
      </div>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

export default ThemeNavbar
