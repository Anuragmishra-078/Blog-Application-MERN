import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: "light",
    colorTheme: "default",
};

const themeSlice = createSlice({
    name: "theme",

    initialState,

    reducers: {
        toggleTheme: (state) => {
            state.theme =
                state.theme === "light"
                    ? "dark"
                    : "light";
        },

        setColorTheme: (state, action) => {
            state.colorTheme = action.payload;
        },
    },
});

export const {
    toggleTheme,
    setColorTheme,
} = themeSlice.actions;

export default themeSlice.reducer;