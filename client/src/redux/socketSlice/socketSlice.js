import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const initialState = {
    socket: null,
}

export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        initializeSocket: (state, action) => {
            // Clean up the previous socket connection if exists
            if (state.socket) {
                state.socket.disconnect();
            }
            // Initialize a new socket connection
            state.socket = io(action.payload);
        },
        disconnectSocket: (state) => {
            if (state.socket) {
                state.socket.disconnect();
            }
            state.socket = null;
        },
    }
})

export const {
    initializeSocket,
    disconnectSocket
} = socketSlice.actions

export default socketSlice.reducer