import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    show_header_action: { display: false, title: '', mainAction: '', secondaryAction: '', loader: '' }
}

export const headerActionSlice = createSlice({
    name: 'headerAction',
    initialState,
    reducers: {
        setShowHeaderAction: (state, action) => {
            state.show_header_action = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { setShowHeaderAction } = headerActionSlice.actions

export default headerActionSlice.reducer