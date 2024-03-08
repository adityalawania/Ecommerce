
import Product from "@/models/Product"
import connectDB from "@/middleware/mongoose"

const handler= async (req,res)=>{
    if(req.method=='PATCH')
    {
        let p;

        if(req.body.type="addReview" && (typeof(req.body.content)=='object'))
        {
            try{
                p= await Product.findByIdAndUpdate(
                    req.body.productId,
                    { $push: { reviews: req.body.content } }
                )
                    res.status(200).send("sucess");  
                    console.log('huogya')
            }

            catch(err)
            {
                console.log(err.message)
                
            }
            
        }

        else if(req.body.type="addRating")
        {
            try{
                p= await Product.findById(req.body.productId)

                p.rating[0]=p.rating[0]+req.body.content
                p.rating[1]=p.rating[1]+1;

                await p.save()

                    res.status(200).send("sucess");  
                    console.log('huogya')
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
