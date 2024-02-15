import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    web_title: 'Dashboard'
}

export const webTitleSlice = createSlice({
    name: 'webTitle',
    initialState,
    reducers: {
        setWebTitleName: (state, action) => {
            state.web_title = action.payload
        }
    }
})

export const { setWebTitleName } = webTitleSlice.actions

export default webTitleSlice.reducer