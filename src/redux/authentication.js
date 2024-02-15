// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
const initialUser = () => {
  const item = window.localStorage.getItem('userData')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser()
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload
      localStorage.setItem('userData', JSON.stringify(action.payload))
    },
    handleLogout: state => {
      state.userData = {}
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem('userData')
    }
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer
