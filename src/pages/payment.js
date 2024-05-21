import React from 'react'
import styles from '../styles/Home.module.css'
import TracingNavbar from './tracingNavbar'
import Link from 'next/link'
import store from '../store'
import Order from '@/models/Order'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify';
import { orderIn } from '../store/slices/orderSlice'
import { addUserOrder } from '../store/slices/userSlice'


function Payment() {

  const router=useRouter()

const confirmOrder=async()=>{
  let myorder=store.getState().finalPersistedReducer.order[0];
  
  let myaddress=store.getState().finalPersistedReducer.address[0]

  const response=await fetch('/api/addOrder',{
    method:'POST',
    body:JSON.stringify({
      'userId':`${store.getState().finalPersistedReducer.user[0]._id}`,
      'name':myaddress.name,
      'country':myaddress.country,
      'state':myaddress.state,
      'city':myaddress.city,
      'address':myaddress.address,
      'apartment':myaddress.apartment,
      'postal':myaddress.pin,
      'email':myaddress.email,
      'phone':myaddress.phone,
      'products':myorder.slice(0,myorder.length-1),
      'details':myorder.slice(myorder.length-1,myorder.length),
      'payment':'postpaid'


    }),

    headers:{
      'Content-Type':  'application/json',
     },
  })

  try{
    console.log(myorder.slice(0,myorder.length-1))
    console.log(typeof(myorder.slice(0,myorder.length-1)))
  const userOrder=await fetch('/api/updateUser',{
   
    method:'PATCH',
    body:JSON.stringify({
      'type':'addOrder',
      'email':`${store.getState().finalPersistedReducer.user[0].email}`,
      'content':myorder.slice(0,myorder.length-1)
    }),

    headers:{
      'Content-Type':  'application/json',
     },
  })

addUserOrder((myorder.slice(0,myorder.length-1)))
}
catch(err)
{
  console.log(err.message)
  toast.error(`Can't Order... Please try again`,{
    autoClose:1500
  })
}
  toast.success('Thanks of Order',{
    autoClose:1200
  })

  router.push('/checkout')
}

  return (
    <>
<TracingNavbar></TracingNavbar>
     <ToastContainer className={styles.paymentToast}></ToastContainer>
    <div className={styles.paymentSection}>
    <h2>Thanks for Ordering ...!</h2>
    <h3>We dont have payment gateways for now...
        So COD Zindabad...!
    </h3>
    </div>
    <br></br>
    <button onClick={confirmOrder}>Checkout</button>
    </>
  )
}

export default Payment