import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    loading: false,
    error: null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true
            state.error = null
        },
        loginSuccess: (state, action) => {
            state.user = action.payload
            state.loading = false
            state.error = null
        },
        loginFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        registerStart: (state) => {
            state.loading = true
            state.error = null
        },
        registerSuccess: (state) => {
            state.loading = false
            state.error = null
        },
        registerFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
    }
})

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    registerStart,
    registerSuccess,
    registerFailure
} = userSlice.actions

export default  userSlice.reducer