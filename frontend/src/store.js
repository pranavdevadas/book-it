import { configureStore } from '@reduxjs/toolkit'
import userAuthReducer from './slice/userSlice/userAuthSlice.js'
import adminAuthReducer from './slice/adminSlice/adminAuthSlice.js'
import { apiSlice } from './slice/apiSlice.js'

const store = configureStore({
    reducer : {
        auth : userAuthReducer,
        adminAuth: adminAuthReducer,
        [apiSlice.reducerPath] : apiSlice.reducer,
    },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools : true
})

export default store