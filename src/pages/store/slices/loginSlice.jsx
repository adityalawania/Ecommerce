import { createSlice } from "@reduxjs/toolkit";

const loginSlice= createSlice({
    name:"login",
    initialState:[],
    reducers:{
        login(state,action){

            for(let i=0;i<state.length;i++)
            state.pop()
            
            state.push('active')
        },
        logout(state,action){
        
            for(let i=0;i<state.length;i++)
            state.pop()
           
           state.push('inactive')
        },

    }
})

export default loginSlice.reducer;

export const {login,logout} = loginSlice.actions;
