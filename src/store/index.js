import {combineReducers, configureStore} from "@reduxjs/toolkit";
import chatMessageReducers from "@/store/slices/chatMessageSlice";
import themeReducers from "@/store/slices/themeSlice"
import { persistStore, persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER, } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const reducer = {
    chatMessage: chatMessageReducers,
    theme: themeReducers,
}
const rootReducer = combineReducers(reducer);
console.log(rootReducer, 'rootReducer');
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["theme"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})
export const persistor = persistStore(store);
