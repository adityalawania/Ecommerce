import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import store from '@/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Head from 'next/head';
import Loading from './loading';
import { useDispatch } from 'react-redux';
import { clearPin, setPin } from '@/store/slices/pinSlice';

function Otp() {
  const [randomCode, setRandomCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [isExisted,setIsExisted] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(300); // 5 min timer (300 sec)
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Initially disabled

  const router = useRouter();
  const OtpRef = useRef();
  const inpRef = useRef()

  const dispatch = useDispatch()

  // Set user email from router query
  useEffect(() => {
    if (router.isReady && router.query.slug) {
      setUserEmail(router.query.slug);
      setIsExisted(router.query.existed);
    }
  }, [router.isReady, router.query.slug]);

  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // Countdown Timer for Resend OTP Button
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on unmount
    } else {
      setIsResendDisabled(false); // Enable Resend OTP button after 5 min
    }
  }, [timer]);

  // Function to format timer as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const sendOTP = async () => {
    
    if(isResendDisabled) return;

    let something = Math.round(Math.random() * 1000000).toString();
    while (something.length < 6) {
      something += Math.round(Math.random() * 10).toString();
    }

    setRandomCode(something);
    dispatch(clearPin())
    dispatch(setPin(something))
    setIsResendDisabled(true); // Disable button again after resending
    setTimer(300); // Reset timer to 5 min
   
    await fetch('/api/emailSender', {
      method: 'POST',
      body: JSON.stringify({
        type: 'OTP',
        email: userEmail,
        random: something,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    toast.success('New OTP sent!', {
      autoClose: 1200,
    });
  };

  const toggleOtp = (e) => {
    if (e.target.value.length > 6) {
      value = value.slice(0, 6); // Trim extra digits
    }
    if(e.target.value.length == 6){
        inpRef.current.blur();
      
    }
    if (e.target.value.length < 7) {
      setOtp(e.target.value);
    }


   
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    let code = store.getState().finalPersistedReducer.pin[0];
    if (otp == code) {
      toast.success('OTP Verified', {
        autoClose: 1200,
      });

      router.push({
        pathname:'/password',
        
        query:{
          slug:userEmail,
          existed:isExisted
        }
      })
      
    } else {
      toast.error('Invalid OTP', {
        autoClose: 1200,
      });

      console.log(otp+" "+code)
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>OTP</title>
      </Head>
      <ToastContainer className={styles.toastContainer} limit={2} />
      <img
        src="/logo.png"
        style={{ width: '25vw', height: '25vw', position: 'absolute', top: '20vh', left: '30vh', zIndex: '10' }}
      />
      <form className={`${styles.OTPform}`} ref={OtpRef} onSubmit={verifyOtp}>
        <div className={`${styles.OTP}  `} id="myForm">
          <h2>Enter 6-digit OTP</h2>
          <p>OTP has been sent to {userEmail}</p>
          <input type="tel" placeholder="______" required value={otp ? otp : ''} ref={inpRef} onChange={toggleOtp} />
          <p className={styles.resendOtpBtn} onClick={sendOTP} disabled={isResendDisabled} style={{ cursor: isResendDisabled ? 'not-allowed' : 'pointer' }}>
            Resend OTP
          </p>
             <p className={styles.OtpTimer}>in {formatTime(timer)}</p>
          <button type="submit">Submit</button>
          
          
        </div>
      </form>
    </>
  );
}

export default Otp;
