import { createSlice } from "@reduxjs/toolkit";
import store from "..";
const brandSlice = createSlice({
    name:"brands",
    initialState:[],
    reducers:{
        addBrand(state,action){
            if(!state.includes(action.payload))
            state.push(action.payload);
           
        }, 
        removeBrand(state,action)
        {
            state.forEach((ele,i)=>{
                if(ele==action.payload){
                    state.splice(i,1);
                }
            })

        }
    }
})

export default brandSlice.reducer;
export const {addBrand,removeBrand} = brandSlice.actions;
