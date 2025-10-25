import {configureStore} from "@reduxjs/toolkit";
import chatMessageReducers from "@/store/chatMessageSlice";

const reducer = {
    chatMessage: chatMessageReducers,
}
export const store = configureStore({
    reducer: reducer,
})
