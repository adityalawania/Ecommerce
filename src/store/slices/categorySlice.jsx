import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name:"category",
    initialState:[],
    reducers:{
        addCategory(state,action){
            state.push(action.payload);
           
        }, 
        removeCategory(state,action)
        {
            return []
        }
    }
})

export default  categorySlice.reducer;
export const {addCategory,removeCategory} = categorySlice.actions;