import { createSlice } from "@reduxjs/toolkit";
import store from "../../pages";
const priceSlice = createSlice({
    name:"prices",
    initialState:[],
    reducers:{
        addPriceFilter(state,action){
            state.push(action.payload);
          
        }, 
        removePriceFilter(state,action)
        {
            return []

        }
    }
})

export default  priceSlice.reducer;
export const {addPriceFilter,removePriceFilter} = priceSlice.actions;
