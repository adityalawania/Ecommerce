import React, { useRef, useState ,useEffect} from 'react'
import Navbar from './Navbar'
import styles from '../styles/Home.module.css'
import { useDispatch } from 'react-redux'
import store from '../store'

import { ToastContainer, toast } from 'react-toastify'
import { logout } from '../store/slices/loginSlice'
import { removeUser } from '../store/slices/userSlice'
import { useRouter } from 'next/router'
import {signIn,signOut} from 'next-auth/react'
import { addMsg,removeMsg } from '../store/slices/notifySlice'


function Account() {

  const dispatch=useDispatch();
  const router=useRouter();

  const[name,setName]=useState()
  const[phone,setPhone]=useState()
  const[address,setAddress]=useState()
  const[email,setEmail]=useState()
  const[postal,setPostal]=useState()
  const[city,setCity]=useState()
  const[state,setState]=useState()


  const formRef=useRef()
  let x=store.getState().finalPersistedReducer.user[0];

  // formRef.current.childNodes[0].value=x.fname+" "+x.lname
//   console.log(x.fname)
//   setPhone(x.fphone)
//  setEmail(x.email)
//   setAddress(x.address) 
//   setPostal(x.postal)
//   setCity(x.city )
//   setState(x.state) 
  

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




  const logoutFunc=()=>{



    dispatch(logout())      
    dispatch(removeUser())  

    // dispatch(addMsg('Logout'))
    signOut({callbackUrl:'http://localhost:3000'})
    
    
  }


  const FormSub=()=>{
    toast.success(`Submitted Successfully`,{
      autoClose: 1000
    })
  }

  return (
   <>
   
   <Navbar></Navbar>
    <div className={styles.accountSection} >
      
      <ul className={styles.accNav}>
        <li>Profile</li>
        <li>Account History</li>
      </ul>


   
      <form className={styles.userDetails} ref={formRef}>

   
          <input type="text" placeholder="Name" value={name} className={styles.userName} name="name" required />

          <input type="tel" placeholder="Phone Number" value={phone} className={styles.Number} name="phone" required />

          <input type="email" placeholder="Email" value={email} className={styles.userEmail} name="email" required />


          <input type="text" placeholder="Address" value={address} className={styles.userPincode} name='address'/>

          <input type="number" placeholder="Area Pin" value={postal} className={styles.userPincode} name='pincode' />

          <input type="text" placeholder="City" value={city} className={styles.userCity} name='city'/>

          <input type="text" placeholder="State" value={state} className={styles.userState} name='state' />


          <hr/>
     
          <button onClick={()=>logoutFunc()}>Logout</button>
          

      </form>


    </div>
    <ToastContainer className={styles.toastContainer}/>
    </>
  )

  

}

export default Account