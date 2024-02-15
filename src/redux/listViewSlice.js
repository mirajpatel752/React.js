import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isFullScreen: false
}

export const listViewSlice = createSlice({
    name: 'ListView',
    initialState,
    reducers: {
        setFullScreenView: (state, action) => {
            state.isFullScreen = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { setFullScreenView } = listViewSlice.actions

export default listViewSlice.reducer