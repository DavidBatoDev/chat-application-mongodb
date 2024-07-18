import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: '',
    loading: false
}

export const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.loading = true
        },
        stopLoading: (state) => {
            state.loading = false
        },
        setError: (state, action) => {
            state.message = action.payload
        },
        clearError: (state) => {
            state.message = ''
        }
    }
})

export const {
    setError,
    clearError,
    startLoading,
    stopLoading
} = errorSlice.actions

export default errorSlice.reducer