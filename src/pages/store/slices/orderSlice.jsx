import { createSlice } from "@reduxjs/toolkit";

const orderSlice= createSlice({
    name:"order",
    initialState:[],
    reducers:{
        orderIn(state,action){
            state.push(action.payload)
        },
        orderOut(state,action){
            return []
        },

    }
})

export default orderSlice.reducer;

export const {orderIn,orderOut} = orderSlice.actions;
