import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer ,toast} from 'react-toastify'
import Link from 'next/link';
import Loading from './loading';
import { updateUser } from '@/store/slices/userSlice';
import { login } from '@/store/slices/loginSlice';
import { useDispatch } from 'react-redux';
import store from '@/store';
function Password() {
   
    const [isLoading,setIsLoading] = useState(true)

    const dispatch = useDispatch()
    const router = useRouter()
    

     const firstPassRef = useRef();
     const SignupRef = useRef();
     const passRef = useRef();
      const showRef = useRef()
       const hideRef = useRef();  
       const passLevelRef = useRef(); 

       useEffect(()=>{
        
        setTimeout(() => {
            setIsLoading(false)
            
        }, 2000);
       },[])

       const togglePassword = (e, action) => {
        if (action == "show") {
    
          showRef.current.style.display = "none";
          hideRef.current.style.display = "block";
          firstPassRef.current.type = "text"
        }
        else {
          showRef.current.style.display = "block";
          hideRef.current.style.display = "none"
          firstPassRef.current.type = "password"
    
        }
    }

    const strongPass = (e)=>{
        if(e.target.value.length < 5){
            passLevelRef.current.classList.remove('Home_strong__NwSqk');
            passLevelRef.current.classList.remove('Home_good__1FW5p');
            passLevelRef.current.classList.add('Home_weak__XK7Nn');
        }
        else if(e.target.value.length>=5 && e.target.value.length <12 ){
         
            passLevelRef.current.classList.remove('Home_strong__NwSqk');
            passLevelRef.current.classList.add('Home_good__1FW5p');

        }
        else{
         
            passLevelRef.current.classList.add('Home_strong__NwSqk');

        }
        console.log(passLevelRef.current.classList)
    }

    const modifyPassword = async(e) =>{
        e.preventDefault()
   
        if (passRef.current.value == firstPassRef.current.value) {
          if (passRef.current.value.length < 6) {
            toast.warn('Password is too short', {
              autoClose: 1200
            })
          }
        else{
        
         const response=await fetch('/api/updateUser',{
                            method:'PATCH',
                            body:JSON.stringify({
                              'type':'changePass',
                              'email':router.query.slug,
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

                          setTimeout(() => {
                            
                              router.push({
                                pathname:'/profile',
                                query:{
                                    slug:store.getState().finalPersistedReducer.user[0]._id
                                }
                              })
                          }, 1500);
                        }
                    }
                    else {
    
                        toast.error('Password Mismatched', {
                          autoClose: 1200
                        })
                      }        
    }

    const verifyPassword = async (e) => {
        e.preventDefault();
    
       
    
        if (passRef.current.value == firstPassRef.current.value) {
          if (passRef.current.value.length < 6) {
            toast.warn('Password is too short', {
              autoClose: 1200
            })
          }
          else {
    
         
            dispatch(updateUser(passRef.current.value))
            dispatch(login('active'))
    
    
            toast.success('Account Created', {
                autoClose: 1500
              })
      
    
            let base = store.getState().finalPersistedReducer.user[0]
    
            const response = await fetch('/api/addUser', {
              method: 'POST',
              body: JSON.stringify({
                "img": base.img,
                "fname": base.fname,
                "lname": base.lname,
                "gender": base.gender,
                "address": base.address,
                "alladdress": base.address,
                "country": base.country,
                "state": base.state,
                "city": base.city,
                "postal": base.postal,
                "email": base.email,
                "fphone": base.fphone,
                "password": base.password,
                "cart": base.cart,
                "wish": base.wish,
                "reviews": base.reviews,
                "orders": base.orders,
    
              }),
    
              headers: {
                'Content-Type': 'application/json',
              },
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
        else {
    
          toast.error('Password Mismatched', {
            autoClose: 1200
          })
        }
    
    
      }

      const setPassword = (e) =>{

        if(router.query.existed=='true'){
            modifyPassword(e)
        }
        else{
            verifyPassword(e)
        }
      }

    if(isLoading) return <Loading/>
    return (
        <div>

            <Head>
                <title>Set Password</title>
            </Head>
            <ToastContainer className={styles.toastContainer} limit={2} />
            <img
                src="/logo.png"
                style={{ width: '25vw', height: '25vw', position: 'absolute', top: '20vh', left: '30vh', zIndex: '10' }}
            />


            <form className={` `}>
                <div className={`${styles.setPassForm} ${styles.finalSignup}`}ref={SignupRef} id='myForm' >
                    <h2>Set Password</h2>
                    <input type="password" placeholder='Password'  required ref={firstPassRef} onChange={(e)=>strongPass(e)} />
                    <div className={`${styles.passLevelBox} `} ref={passLevelRef} >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <input type="password" placeholder='Confirm Password' required  ref={passRef}/>
                    <section ref={showRef} ><AiOutlineEyeInvisible className={styles.passShow} onClick={(e) => togglePassword(e, "show")} /></section>
                    <section ref={hideRef}><AiOutlineEye className={styles.passHide} onClick={(e) => togglePassword(e, "hide")} /></section>
                    <button onClick={(e) => setPassword(e)}>Save</button>
                    <hr />
            
                </div>
            </form>
        </div>
    )
}

export default Password