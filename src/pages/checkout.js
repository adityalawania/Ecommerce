import React, { useState ,useEffect} from 'react'

import styles from '../styles/Home.module.css'
import TracingNavbar from './tracingNavbar'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify';
import store from '../store';
import Loading from './loading';

function Checkout() {


const [loader,setLoader] = useState(true)
    
useEffect(()=>{
  setTimeout(() => {
    setLoader(false)
    
  }, 2000);
},[])




if(loader)
  return(
   <Loading/>
  )
 
  else
  return (
    <>
    {/* <ToastContainer/> */}
    <TracingNavbar/>
      <div className={styles.paymentSection}>

      <h1>Your Order will be delivered within 5 days </h1>
      <h2>You can track your order by mobile and email notifications..!</h2>
      </div>
    </>
  )
}

export default Checkout