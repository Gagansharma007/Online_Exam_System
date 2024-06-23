import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './Slices/reducers';
import { apiSlice } from './Slices/apiSlice';
const store = configureStore({
    reducer: {
        [apiSlice.reducerPath] : apiSlice.reducer,
        root : rootReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools : true,
});
export default store;