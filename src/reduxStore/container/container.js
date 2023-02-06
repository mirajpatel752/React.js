import {  createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  status: "idle"
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    incrementByAmount: (state, action) => {
      state.value = action.payload
    }
  },
 
});

export const { incrementByAmount } = counterSlice.actions;

export const selectCount = (state) => state.counter.value;

export default counterSlice.reducer;
