import { createSlice } from "@reduxjs/toolkit";

const ratingSlice = createSlice({
    name:"rating",
    initialState:[],
    reducers:{
        addRating(state,action){
            state.push(action.payload);
           
        }, 
        removeRating(state,action)
        {
            
            return []
        }
    }
})

export default ratingSlice.reducer;
export const {addRating,removeRating} = ratingSlice.actions;
