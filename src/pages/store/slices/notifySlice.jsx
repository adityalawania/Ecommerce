import { createSlice } from "@reduxjs/toolkit";

const notifySlice = createSlice({
    name:"notify",
    initialState:[],
    reducers:{
        addMsg(state,action){
            state.push(action.payload);
           
        }, 
        removeMsg(state,action)
        {
            
            return []
        }
    }
})

export default notifySlice.reducer;
export const {addMsg,removeMsg} = notifySlice.actions;
