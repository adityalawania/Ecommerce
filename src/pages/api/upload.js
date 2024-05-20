// import multer from 'multer';

import uploadCloudinary from "./cloudinary";

import connectDB from "@/middleware/mongoose";
import { NextRequest,NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
// // Define storage for the uploaded files
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../../public/uploads'); // Change the destination directory as per your requirement
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
//   },
// });

// // Initialize multer middleware
// const upload = multer({ storage: storage });

// export default upload;

const handler= async (req ,res)=>{
 
  console.log("inside handler");
 console.log(req.body.file)
  res.send("suncc")
   
}

export default connectDB(handler)