import Order from "@/models/Order";
import connectDB from "@/middleware/mongoose"

const handler= async (req,res)=>{
    if(req.method=='POST')
    {
        let p;
        
             p =new Order({
                userId: req.body.userId,
                name: req.body.name,
                country: req.body.country,
                state:req.body.state,
                city:req.body.city,
                address: req.body.address,
                apartment:req.body.apartment,
               postal:req.body.postal,
               email:req.body.email,
               phone:req.body.phone,
                products:req.body.products,
               details:req.body.details,
               payment:req.body.payment
    

    
            })

       

            await p.save()
        
        
        res.status(200).send("sucess");
       
    }
    else{
        res.status(400).json({"error":"This method is not allowed"})
    }
    // let products=await Product.find();
    // res.status(200).json({ products})
}

export default connectDB(handler)
