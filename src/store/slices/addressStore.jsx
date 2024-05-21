import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
    name:"address",
    initialState:[],
    reducers:{
        addAddress(state,action){
            state.push(action.payload);
           
        }, 
        removeAddress(state,action)
        {
            
            return []
        }
    }
})

export default addressSlice.reducer;
export const {addAddress,removeAddress} = addressSlice.actions;
