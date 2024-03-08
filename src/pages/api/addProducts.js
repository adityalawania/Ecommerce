
import Product from "@/models/Product"
import connectDB from "@/middleware/mongoose"

const handler= async (req,res)=>{
    if(req.method=='POST')
    {
        let p;
        for(let i=0;i<req.body.length;i++)
        {
             p =new Product({
                title:req.body[i].title,
                brand:req.body[i].brand,
                img:req.body[i].img,
                category:req.body[i].category,
                moreCategory:req.body[i].moreCategory,
               gender:req.body[i].gender,
               size:req.body[i].size,
               color:req.body[i].color,
               price:req.body[i].price,
               desc:req.body[i].desc,
               availabileQty:req.body[i].availabileQty,
    
            })

            await p.save()
        }
        
        res.status(200).send("sucess");
       
    }
    else{
        res.status(400).json({"error":"This method is not allowed"})
    }
    // let products=await Product.find();
    // res.status(200).json({ products})
}

export default connectDB(handler)
