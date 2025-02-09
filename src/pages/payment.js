import React, { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import TracingNavbar from './tracingNavbar'
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toastify'
import store from '../store'
import { addUserOrder, clearUserCart } from '../store/slices/userSlice'
import Loading from './loading'
import Script from 'next/script'
import { useDispatch } from 'react-redux'
import { orderOut } from '@/store/slices/orderSlice'

function Payment() {
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const[netAmount,setNetAmount]=useState(0);

  const dispatch = useDispatch()

  useEffect(() => {
    setTimeout(() => setLoader(false), 2000);
    
    let len = store.getState().finalPersistedReducer.order[0].length;
    let pr =store.getState().finalPersistedReducer.order[0][len-1].total
    setNetAmount(pr);
  }, []);

  const backend = async() =>{
    confirmOrder()
    const response = await fetch('/api/updateUser', {
      method: 'PATCH',
      body: JSON.stringify({
        'type': 'clearCart',
        'email': `${store.getState().finalPersistedReducer.user[0].email}`,
      }),

      headers: {
        'Content-Type': 'application/json',
      },
    })

    dispatch(orderOut());
    dispatch(clearUserCart());
  

    setTimeout(() => {
      router.push({
        pathname:'/checkout',
        query:{
          slug:router.query.slug
        }
      })
    }, 2000);

  }

  const AMOUNT = netAmount;

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert("Razorpay SDK not loaded. Please try again.");
      router.reload()
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/createOrder", { method: "POST" , body:JSON.stringify(netAmount)});
      const data = await response.json();
      console.log("Order Data:", data);

      // Ensure order ID is correctly fetched
      if (!data.orderId) {
        throw new Error("Invalid order response");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: AMOUNT * 100,
        currency: "INR",
        name: "Try-it Store",
        description: "In Testing Mode",
        order_id: data.orderId, // Correct key
        handler: function (response) {
          console.log("Payment Successful", response);
          toast.success("Payment Successful!");
          backend();
        },
        prefill: {
          email: "adityalawania899@gmail.com",
          contact: "82******60"
        },
        theme: {
          color: "#3399cc"
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Failed", err.message);
      toast.error("Payment Failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const confirmOrder = async () => {
    let myorder = store.getState().finalPersistedReducer.order[0];
    let myaddress = store.getState().finalPersistedReducer.address[0];

    try {
      await fetch('/api/addOrder', {
        method: 'POST',
        body: JSON.stringify({
          'userId': store.getState().finalPersistedReducer.user[0]._id,
          'name': myaddress.name,
          'country': myaddress.country,
          'state': myaddress.state,
          'city': myaddress.city,
          'address': myaddress.address,
          'apartment': myaddress.apartment,
          'postal': myaddress.pin,
          'email': myaddress.email,
          'phone': myaddress.phone,
          'products': myorder.slice(0, myorder.length - 1),
          'details': myorder.slice(myorder.length - 1, myorder.length),
          'payment': 'postpaid'
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await fetch('/api/updateUser', {
        method: 'PATCH',
        body: JSON.stringify({
          'type': 'addOrder',
          'email': store.getState().finalPersistedReducer.user[0].email,
          'content': myorder.slice(0, myorder.length - 1),
          'delivery': myorder[myorder.length - 1].delivery
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      addUserOrder(myorder.slice(0, myorder.length - 1));
      toast.success('Thanks for your order!', { autoClose: 1200 });
      router.push({
        pathname:'/checkout',
        query:{
          slug:router.query.slug
        }
      });
    } catch (err) {
      toast.error("Can't place order. Please try again.", { autoClose: 1500 });
    }
  };

  if (loader) return <Loading />;

  return (
    <>
      {/* Ensure script is loaded before usage */}
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setRazorpayLoaded(true)}
      />
      
      <TracingNavbar id={3} />
      <ToastContainer className={styles.paymentToast} />
      
      <div className={styles.paymentSection}>
       
        <p>Amount to Pay: ₹{AMOUNT}</p>
        <button className={styles.payNow} onClick={handlePayment} disabled={processing}>
          {processing ? "Processing..." : "PAY NOW"}
        </button>
        <hr/>
        <button className={styles.cod} onClick={backend}>
          COD
        </button>
      </div>
      
      <br />
   
    </>
  );
}

export default Payment;
