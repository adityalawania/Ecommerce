const mongoose=require('mongoose')


const UserSchema= new mongoose.Schema({
    img:{
        type:String
    },
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true,
    },

    alladdress:[{
        type:String,
    }],

    country:{
        type:String,
        required:true,
    },
    
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    postal:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    fphone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cart:[{
        type:Object
    }],
    wish:[{
        type:Object
    }],
    reviews:[{
        type:Object
    }],
    orders:[{
            type:Object
}]

},{timestamps:true})

mongoose.models = {}


export default mongoose.model("Account",UserSchema)