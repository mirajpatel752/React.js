// ** Redux Imports
import rootReducer from './rootReducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false
    })
  },
  devTools: process.env.NODE_ENV !== 'production'
})

export { store }
