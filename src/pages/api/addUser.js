
import UserData from "@/models/UserData";
import connectDB from "@/middleware/mongoose"

const handler= async (req,res)=>{
    if(req.method=='POST')
    {
        let p;
        
        try{
            p =new UserData({
                img:req.body.img,
                fname: req.body.fname,
                lname: req.body.lname,
                address: req.body.address,
                gender:req.body.gender,
                alladdress:req.body.address,
                country: req.body.country,
                state:req.body.state,
               city:req.body.city,
               postal:req.body.postal,
               email:req.body.email,
               fphone:req.body.fphone,
               password:req.body.password,
               cart:req.body.cart,
               wish:req.body.wish,
               reviews:req.body.reviews,
                orders:req.body.orders
    
            })

       

            await p.save()
        
        
        res.status(200).send("sucess");
        }

        catch(err)
        {
            console.log("from backend")
            console.log(err.message)
        }
            
       
    }
    else{
        res.status(400).json({"error":"This method is not allowed"})
    }
    // let products=await Product.find();
    // res.status(200).json({ products})
}

export default connectDB(handler)
