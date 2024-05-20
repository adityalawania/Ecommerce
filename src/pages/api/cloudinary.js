import {v2 as cloudinary} from "cloudinary"


          
cloudinary.config({ 
  cloud_name: 'df0skrsmm', 
  api_key: '851723757877461', 
  api_secret: 'e5zeio4dTYUqIjCJxfdWXDQS0NM' 
});


const uploadCloudinary = async (local_file)=>{
    try{
        console.log(local_file);
        const response =await cloudinary.uploader.upload
        (local_file,
        {
            resource_type:"auto"
        })

        console.log("file uploaded on cloudinary ",response.url)
        // fs.unlinkSync(local_file.path);
        return response;

        
    }

    catch(err){
        // fs.unlinkSync(local_file);
        console.log("er in cloudings js ",err)
        return null;
    }
}

export default uploadCloudinary