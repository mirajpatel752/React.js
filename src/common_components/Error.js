// ** React Imports
import { useHistory } from 'react-router-dom'
import React, { useEffect } from 'react'
// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import Logo from './Logo'
// ** Styles
import '@styles/base/pages/page-misc.scss'
const Error = () => {
  // ** Hooks
  const { skin } = useSkin()
  const history = useHistory()
  useEffect(() => {
    if (document.querySelector('.main-menu')) {
      document.querySelector('.main-menu').style.display = 'none'
      document.querySelector('.header-navbar').style.display = 'none'
    }
  }, [])

  const illustration = skin === 'dark' ? 'error-dark.svg' : 'error.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <Logo />
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Page Not Found 🕵🏻‍♀️</h2>
          <p className='mb-2'>Oops! 😖 The requested URL was not found on this server.</p>
          <Button onClick={() => history.push('/')} color='primary' className='btn-sm-block mb-2'>
            Back to home
          </Button>
          <img className='img-fluid' src={source} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default Error
