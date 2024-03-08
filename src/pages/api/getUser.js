
import User from "@/models/User";
import connectDB from "@/middleware/mongoose"
let users=[];
const handler= async (req,res)=>{
     users=await User.find()
    res.status(200).send(users)
}

export default connectDB(handler)
// export {products}
