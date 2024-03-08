import mongoose from "mongoose";

//connecting to local db
const connectDB = handler=> async (req,res)=>{
    if(mongoose.connections[0].readyState)
    {
        console.log("product db already connected..!")
        return handler(req,res)
        
    }

    await mongoose.connect("mongodb://localhost:27017/Ecommerce")
    console.log("product db connected..!")
    return handler(req,res)
}

export default connectDB;
