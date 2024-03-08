const mongoose=require('mongoose')


const OrderSchema= new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    products:[{
            type:Object,
            required:true
        }],
    address:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    phone:{
        type:Number,
        required:true
    },

    country:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    apartment:{
        type:String,

    },
    postal:{
        type:Number,
        required:true
    },
    payment:{
        type:String,
        required:true
    },
 details:{
    type:Object,
    required:true
 }
},{timestamps:true})

mongoose.models={}

 
export default mongoose.model("Order", OrderSchema)  