const { transporter, mailOptions } = require("./nodemailer")


const handler=async(req,res)=>{

    if(req.method=='POST')
    {

        if(req.body.type=="OTP")
        {
            try{
                    await transporter.sendMail({
                        ...mailOptions,
                         to:req.body.email,
                         subject:'OTP Verification',
                         text:`${req.body.random} is your OTP for Try-It Store`
                    })
    
                    res.status(200).send('Email Success')
            }
            catch(err)
            {
                console.log("inside nodemailer err "+err.message)
            }
        }

        if(req.body.type=="message")
        {
            try{
                await transporter.sendMail({
                    ...mailOptions,
                     to:req.body.email,
                     subject:'Alert..!',
                     text:req.body.msg
                })

                res.status(200).send('Email Success')
        }
        catch(err)
        {
            console.log(err.message)
        }
        }
    }
}

export default handler;