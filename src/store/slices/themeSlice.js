import {createSlice} from "@reduxjs/toolkit";
const themeSlice = createSlice({
    name: "theme",
    initialState: "dark",
    reducers: {
        setTheme: (state, action) => {
            console.log(action);
            state = action.payload;

            let theme = action.payload;
            const media = window.matchMedia("(prefers-color-scheme: dark)")
            if (theme === "auto" && media.matches) {
                theme = "dark";
            }
            if (theme === "auto" && !media.matches) {
                theme = "light";
            }
            document && (document.documentElement.className = theme)
            return state;
        }
    }
})

export const {setTheme} = themeSlice.actions;

export default themeSlice.reducer;
