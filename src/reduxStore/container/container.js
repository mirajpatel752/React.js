import {  createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    incrementByAmount: (state, action) => {
      console.log(initialState,"initialState")
      state.value.push(action.payload);
    }
  },

  
});

export const { incrementByAmount } = counterSlice.actions;

console.log(counterSlice.actions,"counterSlice.actions")

export const selectCount = (state) => state.counter.value;
console.log(selectCount,"selectCount")

export default counterSlice.reducer;
