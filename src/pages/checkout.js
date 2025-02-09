import React, { useState ,useEffect} from 'react'

import styles from '../styles/Home.module.css'
import TracingNavbar from './tracingNavbar'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify';
import store from '../store';
import Loading from './loading';
import { useRouter } from 'next/router';

function Checkout() {


const [loader,setLoader] = useState(true)
const router = useRouter()
    
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




if(loader)
  return(
   <Loading/>
  )
 
  else
  return (
    <>
    {/* <ToastContainer/> */}
    <TracingNavbar id={4}/>
      <img src={'/logo.png'} className={styles.checkoutImg}/>
      <div className={styles.CheckoutSection}>

      <h1>Thankyou for Shopping !</h1>
      <h2>Your Order will be delivered within 6 days </h2>
      <p>We hope you like the experience ! For feedback please contact our team at adityalawania899@gmail.com</p>
      <button onClick={()=>router.push('/')}>Contiue Shopping</button>
      </div>
    </>
  )
}

export default Checkout