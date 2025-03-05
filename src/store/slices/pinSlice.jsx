import { createSlice } from "@reduxjs/toolkit";

const pinSlice = createSlice({
    name:'pin',
    initialState:[],
    reducers:{
        setPin(state,action){
            state.push(action.payload)
        },
        clearPin(state,action){
             return []
        }
        
    }

})

export default pinSlice.reducer;
export const {setPin,clearPin} = pinSlice.actions