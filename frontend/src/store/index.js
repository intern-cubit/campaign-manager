import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import deviceReducer from "../features/deviceSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        device: deviceReducer,
    },
});
