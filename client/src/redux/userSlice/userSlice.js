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
        registerSuccess: (state, action) => {
            state.user = action.payload
            state.loading = false
            state.error = null
        },
        registerFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        logout: (state) => {
            state.user = null
        },
        clearError: (state) => {
            state.error = null
        },
        updateUserStart: (state) => {
            state.loading = true
            state.error = null
        },
        updateUserSuccess: (state, action) => {
            state.user = action.payload
            state.loading = false
            state.error = null
        },
        updateUserFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        }
    }
})

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    registerStart,
    registerSuccess,
    registerFailure,
    clearError,
    logout,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure
} = userSlice.actions

export default  userSlice.reducer