import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { apiEndpoint } from '../helper/commonApi'

const initialState = {
  user_name: '',
  user_last_login: '',
  company_list: [],
  company_data_available: false,
  selected_company_object: {},
  user_fname_lname: ['', ''],
  user_reg_date: '',
  user_id: '',
  user_email: '',
  user_mobile: '',
  company_is_next: '',
  is_pass_available: false,
  today_date: '',
  user_fname: '',
  user_lname: '',
  is_profile_complete: false,
  profile_status: '',
  incomplete_user_profile: '',
  user_created: ''
}

export const handleLogout = createAsyncThunk('header/logout', async (user_id) => {
  const header = { 'refresh-token': localStorage.getItem('refresh_tokens') }
  const finalObj = {
    userId: user_id
  }
  const response = await axios.post(`${apiEndpoint}/log-out`, finalObj, { headers: header })
  return response
})

export const commonSlice = createSlice({
  name: 'userName',
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.user_name = action.payload.fname || action.payload.lname ? `${action.payload.fname} ${action.payload.lname}` : `${action.payload.user_fname} ${action.payload.user_lname}`
      state.user_fname = action.payload.fname ? action.payload.fname : action.payload.user_fname
      state.user_lname = action.payload.lname ? action.payload.lname : action.payload.user_lname
      state.is_pass_available = action.payload.is_pass_available
      state.user_id = action.payload.user_id
      state.user_email = action.payload.email ? action.payload.email : action.payload.user_email
      state.user_created = action.payload.user_created
      state.incomplete_user_profile = action.payload.incomplete_user_profile
      state.profile_status = action.payload.profile_status
    },
    setUserLastLogin: (state, action) => {
      state.user_last_login = action.payload
    },
    setCompanyList: (state, action) => {
      state.company_list = action.payload
    },
    setCompanyDataAvailable: (state, action) => {
      state.company_data_available = action.payload
    },
    setSelectedCompanyObject: (state, action) => {
      state.selected_company_object = action.payload
    },
    resetUserDetail: (state) => {
      state.user_name = ''
    },
    setUserFirstLastName: (state, action) => {
      state.user_fname_lname = action.payload
    },
    setUserRegistrationDate: (state, action) => {
      state.user_reg_date = action.payload
    },
    setUserId: (state, action) => {
      state.user_id = action.payload
    },
    setUserEmail: (state, action) => {
      state.user_email = action.payload
    },
    setUserMobile: (state, action) => {
      state.user_mobile = action.payload
    },
    setCompanyIsNext: (state, action) => {
      state.company_is_next = action.payload
    },
    setIsPasswordAvailable: (state, action) => {
      state.is_pass_available = action.payload
    },
    setTodayDate: (state, action) => {
      state.today_date = action.payload
    },
    setCompleteProfile: (state, action) => {
      state.is_profile_complete = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setUserName, setUserLastLogin, setCompanyList, setSelectedCompanyObject, resetUserDetail, setCompanyDataAvailable, setUserFirstLastName, setUserRegistrationDate, setUserId, setUserMobile, setUserEmail, setCompanyIsNext, setIsPasswordAvailable, setTodayDate, setCompleteProfile } = commonSlice.actions

export default commonSlice.reducer