import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { login, logout } from '../store/slices/loginSlice'
import { addUser, updateUser, removeUser } from '../store/slices/userSlice';
require('../models/User')
import User from '@/models/User';
import Card from './card';
import { useDispatch } from 'react-redux';
import { useSession, signIn, signOut } from 'next-auth/react';
import {addMsg,removeMsg} from '../store/slices/notifySlice'
import Head from 'next/head';
import { Sedgwick_Ave_Display } from 'next/font/google';
import UserData from '@/models/UserData';
import Loading from './loading';





function Login({ userData }) {

  const [loader,setLoader] = useState(true)

  const loginContRef = useRef()
  const showRef = useRef()
  const hideRef = useRef()
  const passRef = useRef()

  
  
  const dispatch = useDispatch()
  const router = useRouter()
  const session = useSession();

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

  const SessionloginFunc=async()=>{
    if(session.data!=null)
    {
      const sessionEmail=session.data.user.email;
      
     
      let sessionflag=false;
      userData.map((one)=>{
        if(one.email==sessionEmail)
        {
            sessionflag=true;
        
          dispatch(login('active'))      
  
          dispatch(removeUser())            
          dispatch(addUser(one))             
  
  
          router.push('/')
         
        }
      })
  
      if(sessionflag==false)
      {
      
      dispatch(login('inactive'))              

             const response=await fetch('/api/emailSender',{
               method:'POST',
               body:JSON.stringify({
                "type":"message",
               "email":session.data.user.email,
                 "msg":`Some random device has Login to "Try it Store" by your gmail`
               }),
       
               headers:{
                 'Content-Type':  'application/json',
                },
             })
   
        
        let sessionName=session.data.user.name.split(' ')

        try{
          const response=await fetch('/api/addUser',{
            method:'POST',
            body:JSON.stringify({
            "img":session.data.user.image,
            "fname":sessionName[0],
           "lname":sessionName[1],
           "gender":"Male",
           "address":" ",
           "alladdress":[],
           "country":" ",
           "state":" ",
           "city":" ",
           "postal":" ",
           "email":session.data.user.email,
           "fphone":"",
           "password":"1",
           "cart":[],
           "wish":[],
           "reviews":[],
           "orders":[],
    
            }),
    
            headers:{
              'Content-Type':  'application/json',
             },
          })

        
        }

        catch(err)
        {
          
        }
        

        let infoObj={
          "_id":'',
          "img":session.data.user.image,
          "fname":sessionName[0],
         "lname":sessionName[1],
         "address":"",
         "alladdress":[],
         "country":"",
         "state":"",
         "city":"",
         "postal":"",
         "email":session.data.user.email,
         "fphone":"",
         "password":"1",
         "cart":[],
         "wish":[],
         "reviews":[],
         "orders":[],
      }

      dispatch(removeUser())                
      dispatch(addUser(infoObj))             
      dispatch(login('active')) 
 
    
      }

      router.push('/')
      
    }

    
  }
 
  SessionloginFunc();



  const loginAction = (e, y) => {
    e.preventDefault();
    let enteredEmail = loginContRef.current.childNodes[1].value;
    let enteredPassword = loginContRef.current.childNodes[2].value;
    let bool = true;


    userData.map((ele) => {
      
      if (ele.email == enteredEmail) {
        bool = false;
        if (ele.password == enteredPassword) {
          toast.success('SuccessFully Logged-in..!', {
            autoClose: 1200
          })
          dispatch(login('active'))

          dispatch(removeUser())  
          dispatch(addUser(ele))   

          function sleep(milliseconds) {
            const date = Date.now();
            let currentDate = null;

            do {
              currentDate = Date.now();
            } while (currentDate - date < milliseconds);
          }

          sleep(3000);




          router.push('/')


        }
        else {


          toast.error('Invalid Credentials', {
            autoClose: 1200
          })

          // router.reload()

        }
      }

      if (bool == false)
        return true;
    })

    if (bool == true) {
      toast.error('Invalid Credentials', {
        autoClose: 1500
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

 const signUP=async(provider)=>{
signIn(provider,{callbackUrl:'https://ecommerce-bd8kqkvk6-adityalawanias-projects.vercel.app/'})
signIn(provider)


}

const fogetPass=()=>{
  router.push('/forgetpass')
}
 

if(loader)
  return(
   <Loading/>
  )
 
  else
  return (
    <>
    <img src='/logo.png' style={{width:'25vw',height:'25vw',position:'absolute',top:'20vh',left:'30vh',zIndex:'10'}}/>
    <section className={styles.LoginSignupCont}>
      <Head>
        <title>Login</title>
      </Head>
      <ToastContainer className={styles.toastContainer}
        limit={2} id="1" />
      <form >
        <div className={`${styles.loginContainer} ${styles.MainLoginCont} ${styles.mainLogin}`} id='myForm' ref={loginContRef}>
          <h2>Login</h2>
          <input type="text" placeholder='Email' required />
          <input type="password" placeholder='Password' required ref={passRef} />
          <section ref={showRef} ><AiOutlineEyeInvisible className={styles.passShowLogin} onClick={(e) => togglePassword(e, "show")} /></section>
          <section ref={hideRef}> <AiOutlineEye className={styles.passHideLogin} onClick={(e) => togglePassword(e, "hide")} /></section>

          <button onClick={(e) => loginAction(e)}>Login</button>
          <p className={styles.forgotPassBtn} onClick={fogetPass}>Forgot Password ?</p>
        
          <div className={styles.oauthCont}>
            <div onClick={()=>signUP('google')}>
              <span>Login with Google</span>
              <img src='icons8-google-logo-96.png'
                height={26} width={26} />
            </div>
            <div onClick={()=>signUP('github')}>
              <span>Login with Github</span>
              <img src='icons8-github-96.png'
                height={27} width={27}/>
            </div>
      
          </div>
          <p>Not a member? <Link href={'/signup'}><span> Sign up now</span></Link></p>
        </div>
      </form>


    </section>
    </>
  )
}


export async function getServerSideProps(context) {

  let userData = await UserData.find();



  return {
    props: { userData: JSON.parse(JSON.stringify(userData)) }, // will be passed to the page component as props
  }
}


export default Login
