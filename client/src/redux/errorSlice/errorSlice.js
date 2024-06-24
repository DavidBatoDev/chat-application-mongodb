import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: '',
}

export const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
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
    clearError
} = errorSlice.actions

export default errorSlice.reducer