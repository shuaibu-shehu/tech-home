import {configureStore, combineReducers} from "@reduxjs/toolkit";
import userReducer from "./user/userSlicer.js";
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";


const rootReducer=combineReducers({user: userReducer})
const conifigPersist={
    key:"root",
    storage,
    version: 1,
}

export const persistedReducer = persistReducer(conifigPersist, rootReducer)

export  const store=configureStore({  
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
 })

 export const persistor = persistStore(store);