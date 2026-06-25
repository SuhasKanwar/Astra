import { configureStore } from "@reduxjs/toolkit";
import astraReducer from "./slices/astraSlice";

export const store = configureStore({
    reducer: {
        astra: astraReducer
    }
});