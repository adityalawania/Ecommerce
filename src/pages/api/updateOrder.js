import Order from "@/models/Order";
import connectDB from "@/middleware/mongoose"

const handler= async (req,res)=>{
    if(req.method=='PATCH')
    {
        if(req.type='cancelOrder')
        {
            let p;
            try{
                p= await Order.findOneAndUpdate({
                    userId:req.body.userId
                },{ $pull: { products: { id: req.body.orderId }}})
                res.status(200).send("sucess"); 
                console.log("order Canceled") 
            }
            catch(err)
            {
                console.log(err.message)
            }
        }
        
    }
    else{
        res.status(400).json({"error":"This method is not allowed"})
    }
    // let products=await Product.find();
    // res.status(200).json({ products})
}

export default connectDB(handler)
