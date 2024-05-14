import {configureStore} from '@reduxjs/toolkit';
import themeReducer from './themeSlice/themeSlice';
import userReducer from './userSlice/userSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        theme: themeReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
})