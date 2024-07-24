import { configureStore } from '@reduxjs/toolkit';
import { authSliceReducer } from './Slices/authSlice'; 
import { apiSlice } from './Slices/apiSlice';
const store = configureStore({
    reducer: {
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth : authSliceReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools : true,
});
export default store;