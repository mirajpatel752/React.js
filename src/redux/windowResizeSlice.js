import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isMobile: false
}

export const windowResizeSlice = createSlice({
    name: 'isMobile',
    initialState,
    reducers: {
        setIsMobile: (state, action) => {
            state.isMobile = action.payload
        }
    }
})

export const { setIsMobile } = windowResizeSlice.actions

export default windowResizeSlice.reducer