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
    <TracingNavbar/>
      <div className={styles.paymentSection}>

      <h1>Your Order will be delivered within 5 days </h1>
      <h2>You can track your order by mobile and email notifications..!</h2>
      </div>
    </>
  )
}

export default Checkout