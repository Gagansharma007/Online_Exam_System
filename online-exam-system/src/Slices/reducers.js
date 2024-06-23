import { combineReducers } from "@reduxjs/toolkit";
import { authSliceReducer } from "./authSlice";
import { testSliceReducer } from "./testSlice";
export const rootReducer = combineReducers({
    auth : authSliceReducer,
    test : testSliceReducer,
});