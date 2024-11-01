import Order from "@/models/Order";
import connectDB from "@/middleware/mongoose"
import upload from "@/pages/api/upload";
import multer from "multer";

console.log("hello")

const handler= async (req,res)=>{

   
    
        res.status(200).send("ok")

    // })
      
    
}

export default connectDB(handler)
