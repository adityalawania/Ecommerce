import mongoose from "mongoose";

//connecting to local db
const connectDB = handler=> async (req,res)=>{
    if(mongoose.connections[0].readyState)
    {
        console.log("product db already connected..!")
        return handler(req,res)
        
    }

    await mongoose.connect(`${process.env.MONGO_URI}`,{
        keepAlive: true,    
    })
    console.log("product db connected..!") 
    return handler(req,res)
}

export default connectDB;
