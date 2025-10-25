import {createSlice} from "@reduxjs/toolkit";

const chatMessageSlice = createSlice({
    name: "chatMessage",
    initialState: [{
        role: "assistant",
        content: "你好，我是个AI智能问答应用，请告诉我你的需要！"
    }],
    reducers: {
        addChatMessage: (state, action) => {
            // console.log(state, state[0], action, "chatMessage");
            const data = action.payload;
            if (Array.isArray(data)) {
                state.push(...data)
            } else {
                state.push(data);
            }
        },
        updateChatMessage: (state, action) => {
            const index = state.length - 1;
            state[index].content = action.payload;
        },
        deleteByIndex(state, action){
            const index = action.payload;
            state.splice(index, 1);
        }
    }
})

export const {addChatMessage, updateChatMessage,deleteByIndex} = chatMessageSlice.actions;
export default chatMessageSlice.reducer;
