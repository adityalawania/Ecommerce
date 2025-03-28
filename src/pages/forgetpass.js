import React, { useEffect, useReducer, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import User from '@/models/User'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { AiOutlineEye,AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from 'next/router';
import Head from 'next/head';
import UserData from '@/models/UserData';
import Loading from './loading';
import { useDispatch } from 'react-redux';
import { clearPin, setPin } from '@/store/slices/pinSlice';


export default function Login({ userData }) {


    const router=useRouter()

    const emailRef = useRef()


    const dispatch = useDispatch()

    const [loader,setLoader] = useState(true)

    useEffect(()=>{
      setTimeout(() => {
        setLoader(false)
        
      }, 2000);
    },[])

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


   const verifyEmail = async (e) => {
        e.preventDefault()
        let val = emailRef.current.childNodes[1].value;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (val.match(mailformat)) {

            let flag=false
            userData.map((user)=>{
                if(user.email==val)
                {
                    flag=true;
                    return
                }
            })

            if(flag==false)
            {

                toast.error('Email is not Registered',{
                    autoClose:1200
                })

                emailRef.current.childNodes[3].style.display="block"
            }

            else{

             console.log(emailRef.current.childNodes[1].value)
            
            sendOTP();
            

            setuserEmail(emailRef.current.childNodes[1].value)


            toast.success('OTP sent',{
                autoClose:1200
            })

            router.push({
              pathname:'/otp',
              
              query:{
                slug:emailRef.current.childNodes[1].value,
                existed:true
              }
            })

      
     

            }
            

            
        }
        else {
            toast.error('Invalid Email Address', {
                autoClose: 1200
            })
            emailRef.current.childNodes[1].style.border = "2px solid red";


            setTimeout(() => {
                emailRef.current.childNodes[1].style.border = "none";
            }, 3000);
        }
    }

    const sendOTP = async()=>
    {
   
      let something=Math.round(Math.random()*1000000) 
      something=something.toString();
      if(something.length<6)
      {
       while(something.length<6)
       {
         something=something+(Math.round(Math.random()*10)).toString()
       }
      }
      
       setRandomCode(something)
       dispatch(clearPin())
       dispatch(setPin(something))
   
         const response=await fetch('/api/emailSender',{
           method:'POST',
           body:JSON.stringify({
            "type":"OTP",
           "email":emailRef.current.childNodes[1].value,
           "random":something
           }),
   
           headers:{
             'Content-Type':  'application/json',
            },
         })

         console.log("done")
  
         return;
    }

  

   
    if(loader)
        return(
         <Loading/>
        )
       
      else
    return (
      <div className={styles.MainforgotContainer}>
       <img src='/logo.png' style={{width:'25vw',height:'25vw',position:'absolute',top:'20vh',left:'30vh',zIndex:'10'}}/>
            <Head>
        <title>Forget Password</title>
      </Head>
        
            <ToastContainer className={styles.toastContainer}
                limit={2} id="1" />
            <form >
                <div className={styles.forgotContainer} id='myForm' ref={emailRef}>
                    <h2>Enter your email address</h2>
                    <input type="text" placeholder='Email' required />

                    <button onClick={(e) => verifyEmail(e)}>Send OTP</button>
                    <p>Not a member?<Link href={'/signup'}><span>Sign up now</span></Link></p>

                </div>
            </form>

        </div>
    )

}

export async function getServerSideProps(context) {

    let userData = await UserData.find();


    return {
        props: { userData: JSON.parse(JSON.stringify(userData)) }, // will be passed to the page component as props
    }
}
