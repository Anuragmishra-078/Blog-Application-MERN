import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import blogSlice from "./blogSlice";
import themeSlice from "./themeSlice";
import commentSlice from "./commentSlice";

import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";

// Custom storage adapter for Vite + browser
const storage = {
    getItem: (key) => {
        return Promise.resolve(window.localStorage.getItem(key));
    },

    setItem: (key, value) => {
        window.localStorage.setItem(key, value);
        return Promise.resolve();
    },

    removeItem: (key) => {
        window.localStorage.removeItem(key);
        return Promise.resolve();
    },
};

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const rootReducer = combineReducers({
    auth: authSlice,
    blog: blogSlice,
    comment: commentSlice,
    theme: themeSlice,
});

const persistedReducer = persistReducer(
    persistConfig,
    rootReducer
);

const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);

export default store;