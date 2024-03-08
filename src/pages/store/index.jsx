import { configureStore } from "@reduxjs/toolkit";

// for storing redux store in local system
import storage from "redux-persist/lib/storage"
import {persistReducer} from "redux-persist"
import { combineReducers } from "@reduxjs/toolkit";


import brandSlice from "./slices/brandSlice";
import priceSlice from "./slices/priceSlice";
import ratingSlice from "./slices/ratingSlice";
import categorySlice from "./slices/categorySlice";
import loginSlice from "./slices/loginSlice";
import userSlice from "./slices/userSlice";
import searchSlice from "./slices/searchSlice";
import notifySlice from "./slices/notifySlice";
import orderSlice from "./slices/orderSlice";
import addressSlice from "./slices/addressStore";


const persistConf ={
    key:"root",
    version:1,
    storage

}

const reducer=combineReducers({

    status:loginSlice,
    user:userSlice,
    search:searchSlice,
    // notify:notifySlice,
    order:orderSlice,
    address:addressSlice
})

const finalPersistedReducer= persistReducer(persistConf,reducer)

const store= configureStore({
    reducer: {
        finalPersistedReducer,
        allbrands:brandSlice,
        filterPrice:priceSlice,
        filterRating:ratingSlice,
        category:categorySlice,
    }
});


export default store