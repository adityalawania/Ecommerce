
import connectDB from "@/middleware/mongoose"
import UserData from "@/models/UserData";
let users=[];
const handler= async (req,res)=>{
     users=await UserData.find()
    res.status(200).send(users)
}

export default connectDB(handler)
// export {products}
