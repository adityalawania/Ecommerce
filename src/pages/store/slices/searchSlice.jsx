import { createSlice } from "@reduxjs/toolkit";

const searchSlice= createSlice({
    name:"search",
    initialState:[],
    reducers:{
        searchIn(state,action){
            state.push(action.payload)
        },
        searchOut(state,action){
            return []
        },

    }
})

export default searchSlice.reducer;

export const {searchIn,searchOut} = searchSlice.actions;
