import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './reduxStore/container/container';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
