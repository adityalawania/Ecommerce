import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Navbar from './Navbar'
import Card from './card'
import '../styles/Home.module.css'
import Filter from './filter'


import allProduct from '../models/Product'
import connectDB from "@/middleware/mongoose"

require('../middleware/mongoose')
import mongoose from 'mongoose'


require('../models/Product')
require('../models/User')

import User from '../models/User'
require('./api/getProducts')
import {getDefaultMiddleware} from "@reduxjs/toolkit"


import { useEffect, useState } from 'react'
import {  ToastContainer} from 'react-toastify'
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import Product from '../models/Product'
import store from '../store'
import { signIn, useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { removeUser, addUser, updateUserId } from '../store/slices/userSlice'
import brandArray from '@/datas/brandArray'
import { logout } from '../store/slices/loginSlice'
import UserData from '@/models/UserData'
import Loading from './loading'



export default function Home({ j, userData }) {

  let activity = store.getState().finalPersistedReducer;
  const session = useSession()
  const dispatch = useDispatch()

  console.log(session.status +" is the status")

  if(session.status=='authenticated'){

    console.log(session.data)
  }


  const router = useRouter();

  useEffect(() => {
    const handleRouteError = (err, url) => {
      console.error("Route change failed:", err);
      alert("Failed to load the page. Please try again.");
    };

    router.events.on("routeChangeError", handleRouteError);

    // Cleanup the event listener when the component unmounts
    return () => {
      router.events.off("routeChangeError", handleRouteError);
    };
  }, [router.events]);

  
    j.map((item)=>{
      if(!brandArray.includes(item.brand.toLowerCase()) && item.brand.length>0)
      brandArray.push(item.brand.toLowerCase())
    })



  const [loader,setLoader] = useState(true)

  useEffect(()=>{
    const customizedMiddleware = getDefaultMiddleware({
      serializableCheck: false
    })

    setTimeout(() => {
      setLoader(false)
      
    }, 3000);

  },[])

  setTimeout(() => {
    try{
     let currEmail=activity.user[0].email
     let newFlag=false;
        userData.map((u)=>{
        
        try{
            if(u.email==activity.user[0].email)
            {
              console.log("email match")
              dispatch(updateUserId(u._id))  
              console.log(u._id)
              newFlag=true;
            }
        }

        catch(err){
          // console.log(err)
          
        }
    



  

  })

  if(newFlag==false)
  {
    dispatch(logout())  
    dispatch(removeUser())  


    // dispatch(addMsg('Logout'))
    signOut({ callbackUrl: 'http://localhost:3000' })
  }
}
  catch(err) 
  {
    console.log(err)
  }
    
  }, 10000);
    
if(loader)
 return(
  <Loading/>
 )

 else
  return (
    <>
      <Head>
        <title>Binary Wear's</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="https://react-icons.github.io/react-icons/" />
      </Head>


      <section className={styles.main}>

        <ToastContainer

          limit={1}
          className={styles.indexToast}
        />
        <Navbar search={true}></Navbar>
        <Card response={j}> </Card>
      </section>

    </>
  )

}

export async function getServerSideProps(context) {

  let j;


  if (!mongoose.connections[0].readyState) {

    // await mongoose.connect("mongodb://localhost:27017/Ecommerce")
    // await mongoose.connect("mongodb+srv://adityalawania899:<adiEcommerce>@cluster0.gudo8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    mongoose.connect(`${process.env.MONGO_URI}`, {
 
    }).then(() => {
      console.log("Database Connected"); 
    }).catch((err) => {
      console.log("ERROR while connecting to DB ", err.message);
    })
  }


  j = await Product.find();
  let userData = await UserData.find()
  


  return {
    props: { j: JSON.parse(JSON.stringify(j)), userData: JSON.parse(JSON.stringify(userData)) } // will be passed to the page component as props
    //props: {userData:JSON.parse(JSON.stringify(userData))}, // will be passed to the page component as props

  }
}







// export {connectDB}