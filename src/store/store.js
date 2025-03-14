import { combineReducers, configureStore } from "@reduxjs/toolkit";
import toastReducer from "../reducers/toastSlice";
import dashboardReducer from "../reducers/dashboardSlice";
import authReducer from "../reducers/authSlice"
import userReducer from "../reducers/userSlice";
import globalReducer from "../reducers/globalSlice";
import { authApi } from "../services/authService";
import { adminApi } from "../services/adminService";
import { globalApi } from "../services/globalService";
import { logApi } from "../services/logService";
import { ewasteApi } from "../services/ewasteService";
import { locationApi } from "../services/location";
import { pickupApi } from "../services/pickupService";
import { usersApi } from "../services/usersService";
import { bulkApi } from "../services/bulkService";
import { paymentApi } from "../services/paymentService";
import storage from 'reduxjs-toolkit-persist/lib/storage'
// import sessionStorage from 'reduxjs-toolkit-persist/lib/storage/session'
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
    key: 'root',
    storage,
    // storage: sessionStorage,
    stateReconciler: autoMergeLevel2
  }

const reducers = combineReducers({
    toast: toastReducer,
    auth: authReducer,
    user: userReducer,
    global: globalReducer,
    dashboard: dashboardReducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [globalApi.reducerPath]: globalApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [logApi.reducerPath]: logApi.reducer,
    [ewasteApi.reducerPath]: ewasteApi.reducer,
    [pickupApi.reducerPath]: pickupApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [bulkApi.reducerPath]: bulkApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
});

export const persistor = persistStore(store)

// middleware: getDefaultMiddleware => 
// getDefaultMiddleware().concat(authApi.middleware)

