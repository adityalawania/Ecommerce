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


export default function Login({ userData }) {


    const router=useRouter()

    const emailRef = useRef()
    const OtpRef = useRef()
    const SignupRef=useRef();
    const firstPassRef=useRef()
    const passRef=useRef()
    const showRef=useRef()
    const hideRef=useRef()

    const[userEmail,setuserEmail]=useState()
    const [randomCode, setRandomCode] = useState()
    const[otp,setOtp]=useState()


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

            emailRef.current.style.display="none"
            OtpRef.current.style.display="block"

     

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

    const toggleOtp=(e)=>{
        if(e.target.value.length>=7)
        {
            
        }
        else{
            setOtp(e.target.value)
        }
      }

    const verifyOtp=(e)=>{
        e.preventDefault();
   
        console.log(randomCode)
        if(otp==randomCode)
        {
          toast.success('OTP Verified', {
            autoClose: 1200
          })
    
        
            OtpRef.current.style.display="none"
            SignupRef.current.style.display="block"
    
        }
        else{
          toast.error('Invalid OTP', {
            autoClose: 1200
          })
        }
    
    }

    const togglePassword = (e, action) => {

        if (action == "show") {
    
          showRef.current.style.display = "none";
          hideRef.current.style.display = "block";
          passRef.current.type = "text"
        }
        else {
          showRef.current.style.display = "block";
          hideRef.current.style.display = "none"
          passRef.current.type = "password"
    
        }
    
      }

    const verifyPassword=async(e)=>{
        e.preventDefault();
    
         if(passRef.current.value==firstPassRef.current.value)
        {
            if(passRef.current.value.length<6)
            {
                toast.warn('Password is too short',{
                    autoClose:1200
                })
            }
            else{

                console.log(userEmail)
                console.log(firstPassRef.current.value)

                const response=await fetch('/api/updateUser',{
                    method:'PATCH',
                    body:JSON.stringify({
                      'type':'changePass',
                      'email':userEmail,
                      'pass':firstPassRef.current.value
                    }),
            
                    headers:{
                      'Content-Type':  'application/json',
                     },
                  })

                  toast.success('Password changed',{
                    autoClose:1200
                  })
    

                  function sleep(milliseconds) {
                    const date = Date.now();
                    let currentDate = null;
                    do {
                      currentDate = Date.now();
                    } while (currentDate - date < milliseconds);
                  }
                  
                  
                  sleep(2000);
                  router.push('/')
            }
            
        }
        else{
    
            toast.error('Password Mismatched', {
                autoClose: 1200
              })
        }
            
        
      }



    return (
      <>
            <Head>
        <title>Forget Password</title>
      </Head>
        <section className={styles.LoginSignupCont}>

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

            <form className={`${styles.loginContainer} ${styles.OTPform}`} ref={OtpRef} onSubmit={(e)=>verifyOtp(e)} >
    <div className={`${styles.loginContainer} ${styles.OTP}`}  id='myForm' >
        
        <h2>Enter 6-digit OTP</h2>
        <p>OTP has been send to {userEmail}</p>
        <input type="tel" placeholder='______' required value={otp? otp:""} onChange={(e)=>toggleOtp(e)}/>
        <button>Submit</button>
        <p onClick={(e)=>verifyOtp(e)}>Resend OTP</p>
        </div>
    </form>

    <form className={styles.loginContainer} >
    <div className={`${styles.loginContainer} ${styles.finalSignup}`} ref={SignupRef} id='myForm' >
        
        <h2>Change Password</h2>
        <input type="password" placeholder='New Password' required ref={firstPassRef}/>
        <input type="password" placeholder='Confirm New Password' required ref={passRef}/>
        <section  ref={showRef} ><AiOutlineEyeInvisible className={styles.passShow} onClick={(e)=>togglePassword(e,"show")}/></section>
        <section  ref={hideRef}><AiOutlineEye  className={styles.passHide}  onClick={(e)=>togglePassword(e,"hide")}/></section>
        <button onClick={(e)=>verifyPassword(e)}>Save Changes</button>
       {/* <hr/> */}
        {/* <p>Already a member?<Link href={'/login'}><span>Login now</span></Link></p> */}
    </div>
    </form>


        </section>
        </>
    )

}

export async function getServerSideProps(context) {

    let userData = await User.find();


    return {
        props: { userData: JSON.parse(JSON.stringify(userData)) }, // will be passed to the page component as props
    }
}
