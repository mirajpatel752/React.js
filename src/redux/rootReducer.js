// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import commonReducer from './commonSlice'
import headerActionReducer from './headerActionSlice'
import windowResizeReducer from './windowResizeSlice'
import listViewReducer from './listViewSlice'
import webTitleReducer from './webTitleSlice'


const rootReducer = {
  auth,
  navbar,
  layout,
  commonReducer,
  headerActionReducer,
  windowResizeReducer,
  listViewReducer,
  webTitleReducer
}

export default rootReducer
