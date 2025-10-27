import {configureStore} from "@reduxjs/toolkit";
import chatMessageReducers from "@/store/chatMessageSlice";
import themeReducers from "@/store/themeSlice"

const reducer = {
    chatMessage: chatMessageReducers,
    theme: themeReducers,
}
export const store = configureStore({
    reducer: reducer,
})
