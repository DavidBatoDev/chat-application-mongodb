import {configureStore} from '@reduxjs/toolkit';
import themeReducer from './themeSlice/themeSlice';
import userReducer from './userSlice/userSlice';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: "root",
    storage,
}

const persistedUserReducer = persistReducer(persistConfig, userReducer)
const persistedThemeReducer = persistReducer(persistConfig, themeReducer)

export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        theme: persistedThemeReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
})

export const persistor = persistStore(store)