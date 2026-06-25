import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        name: "",
        email: "",
        token: "",
    },
    isAuthenticated: false,
};

export const astraSlice = createSlice({
    name: "astra",
    initialState,
    reducers: {}
});

export const {} = astraSlice.actions;
export default astraSlice.reducer;