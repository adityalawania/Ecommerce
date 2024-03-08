
import User from "@/models/User";
import connectDB from "@/middleware/mongoose"
import multer from 'multer'
const path=require('path')



const handler =async(req, res)=> {

 

    let p;


    if (req.method == 'PATCH') {



        if (req.body.type == 'updatePersonalDetails')
        {
            console.log("ghuss gaye")
           
        }

    

        if (req.body.type == 'addCart') {
            
            try {
                p = await User.findOneAndUpdate(
                    {email:req.body.email},
                    { $push: { cart: req.body.content } }
                )
                
                console.log('Cart updated')

            }

            catch (err) { 
                console.log(err.message)
            }
        }
        else if (req.body.type == 'removeCart') {

            p = await User.findOneAndUpdate(
                {email: req.body.email},
                { $pull: { cart: { id: req.body.productId ,size:req.body.size,color :req.body.color } } }
            )
        }

        else if(req.body.type=='addWish')
        {
            try {
                p = await User.findOneAndUpdate(
                    {email: req.body.email},
                    { $push: { wish: req.body.content } }
                )
         
                    console.log("wishlist updated")
            }

            catch (err) { 
                console.log(err.message)
            }
        }

        else if(req.body.type=='removeWish')
        {
            try {
                p = await User.findOneAndUpdate(
                    {email: req.body.email},
                    { $pull: { wish: { id: req.body.productId}}}
                )
         

            }

            catch (err) { 
                
            }
        }

        else if(req.body.type=='changePass')
        {
            let filter = { email: req.body.email};
            let update = { password: req.body.pass};
            try {

                p = await User.findOneAndUpdate(filter,update);

                console.log("pass is set to ",req.body.pass)
        
            }

            catch (err) { 
                console.log(err.message)
            }
        }

        else if(req.body.type=='addOrder')
        {
            try {
                let i=0; 
                while(i<req.body.content.length)
            {
                p = await User.findOneAndUpdate(
                    {email:req.body.email},
                    
                    { 
                        
                            $push: { orders: req.body.content[i] } 
                        }
                        
                )

                i++;

             }  
                console.log('Cart updated')

            }

            catch (err) { 
                console.log(err.message)
            }
        }

        else if(req.body.type=='addAddress')
        {
            try {
                p = await User.findOneAndUpdate(
                    {email: req.body.email},
                    { $push: { alladdress: req.body.content } }
                )
         
                    console.log("alladdress updated")
            }

            catch (err) { 
                console.log(err.message)
            }
        }

        else if(req.body.type=='mainAddress')
        {
            try {
                p = await User.findOneAndUpdate(
                    {email: req.body.email},
                    { address: req.body.content } 
                )
         
                    console.log("main address updated")
            }

            catch (err) { 
                console.log(err.message)
            }
        }

        else if(req.body.type=='updateAddType')
        {
            try {
                p = await User.findOneAndUpdate(
                    {email: req.body.email},
                    { addtype: req.body.content, $position: req.body.id} 
                )
         
                    console.log("addtype updated")
            }

            catch (err) { 
                console.log(err.message)
            }
        }

        else if(req.body.type=='deleteAdd')
        {
            try {
                p = await User.findOneAndUpdate(
                    {email: req.body.email},
                    { $pull: { alladdress: req.body.content } }
                )
         
                    console.log("addtype updated")
            }

            catch (err) { 
                console.log(err.message)
            }
        }

        else if(req.body.type=="addReview")
        {
            try{
                p= await User.findOneAndUpdate(
                    {email: req.body.email},
                    { $push: { reviews: req.body.content } }
                )
                    
            }

            catch(err)
            {
                console.log(err.message)
            }
            
        }

        else if(req.body.type=='removeReview')
        {
            try {
                p = await User.findOneAndUpdate(
                    {email: req.body.email},
                    { $pull: { reviews: { id: req.body.reviewId}}}
                )
                console.log("no err in remove review back")

            }

            catch (err) { 
                
            }
        }

        else if(req.body.type =='changeProfilePic')
        {
            try {
                p = await User.findOneAndUpdate(
                    {email:req.body.email},
                    {img:req.body.pic}
                )
                    
         
                console.log("no err")
            }

            catch (err) { 
                console.log(err.message)
                console.log("************************* Error hai haiau ")
            }
        }

        else if(req.body.type=="changeEmail")
        {
            try{
                p= await User.findOneAndUpdate(
                    {email: req.body.email},
                    {email:req.body.newEmail}
                )

                console.log("email changed")
                    
            }

            catch(err)
            {
                console.log(err.message)
            }
            
        }



        res.status(200).send("sucess");
        console.log('success')
    }

    else {
        res.status(400).json({ "error": "This method is not allowed" })
    }
    // let products=await Product.find();
    // res.status(200).json({ products})
}

export default connectDB(handler)
