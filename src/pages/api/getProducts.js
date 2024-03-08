
import Product from "@/models/Product"
import connectDB from "@/middleware/mongoose"
let products=[];
const handler= async (req,res)=>{
     products=await Product.find()
    res.status(200).send(products)
}

export default connectDB(handler)
// export {products}
