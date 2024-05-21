import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:[],
    reducers:{
        addUser(state,action){
            if(state.length==0)
            state.push(action.payload);
            
        }, 
        updateUser(state,action)
        {
           state[0].password=action.payload
        },
        updateUserId(state,action)
        {
            state[0]._id=action.payload
        },
        addUserOrder(state,action)
        {
            state[0].orders.push(action.payload)
        },
        removeUser(state,action)
        {
            return []
        },
        addUserCart(state,action)
        {
            
            state[0].cart.push(action.payload)
        },
        removeUserCart(state,action)
        {
            state[0].cart.forEach((ele,i)=>{
                // console.log(ele," id is ",i)
                if(ele.id==action.payload.id && ele.color==action.payload.color && ele.size==action.payload.size){
                    state[0].cart.splice(i,1);
                }
            })
        },
        addUserWish(state,action)
        {
            state[0].wish.push(action.payload)
        },

        removeUserWish(state,action)
        {
            state[0].wish.forEach((ele,i)=>{
                
                if(ele==action.payload ){
                    state[0].wish.splice(i,1);
                }
            })
        }
    }
})

export default  userSlice.reducer;
export const {addUser,updateUser, removeUser,addUserCart,removeUserCart,addUserWish,removeUserWish,updateUserId,addUserOrder} = userSlice.actions;