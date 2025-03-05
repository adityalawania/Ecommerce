import React, { useRef, useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { addUser, updateUser, removeUser, updateUserId } from '../store/slices/userSlice';
import { login, logout } from '../store/slices/loginSlice'
import store from '../store';
import { useDispatch } from 'react-redux';
import User from '@/models/User';
import Head from 'next/head';
import UserData from '@/models/UserData';
import Loading from './loading';
import { clearPin, setPin } from '@/store/slices/pinSlice';



function Signup({ userData }) {



  const [randomCode, setRandomCode] = useState()
  const [userEmail, setuserEmail] = useState('')
  const [userId, setUserId] = useState();

  let infoObj;


  const router = useRouter()
  const dispatch = useDispatch()
  dispatch(logout())

  const SignupRef = useRef()
  const showRef = useRef()
  const hideRef = useRef()
  const passRef = useRef()
  const firstPassRef = useRef()
  const OtpRef = useRef()
  const detailRef = useRef()


  const [password, setPassword] = useState('');
  const [fphone, setfPhone] = useState('');

  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false)

    }, 2000);
  }, [])

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

  const SignupAction = async (e) => {


    e.preventDefault();


    if (detailRef.current.childNodes[3].value == "Gender") {
      detailRef.current.childNodes[3].style.border = "2px solid red";
      toast.error('Please select Gender', {
        autoClose: 1200
      })


      setTimeout(() => {
        detailRef.current.childNodes[3].style.border = "none";
      }, 2000);


      return;
    }


    dispatch(removeUser())
    let base = e.target.childNodes[0]
    console.log(e.target.childNodes[0].childNodes[9].value)


    infoObj = {
      "_id": '',
      "img": "",
      "fname": `${base.childNodes[1].value.charAt(0).toUpperCase() + base.childNodes[1].value.slice(1)}`,
      "lname": `${base.childNodes[2].value.charAt(0).toUpperCase() + base.childNodes[2].value.slice(1)}`,
      "gender": `${base.childNodes[3].value.charAt(0).toUpperCase() + base.childNodes[3].value.slice(1)}`,
      "address": `${base.childNodes[4].value.charAt(0).toUpperCase() + base.childNodes[4].value.slice(1)}`,
      "alladdress": `${[base.childNodes[4].value.charAt(0).toUpperCase() + base.childNodes[4].value.slice(1)]}`,
      "country": `${base.childNodes[5].value.charAt(0).toUpperCase() + base.childNodes[5].value.slice(1)}`,
      "state": `${base.childNodes[6].value.charAt(0).toUpperCase() + base.childNodes[6].value.slice(1)}`,
      "city": `${base.childNodes[7].value.charAt(0).toUpperCase() + base.childNodes[7].value.slice(1)}`,
      "postal": `${base.childNodes[8].value.charAt(0).toUpperCase() + base.childNodes[8].value.slice(1)}`,
      "email": `${base.childNodes[9].value}`,
      "fphone": `${base.childNodes[10].value.charAt(0).toUpperCase() + base.childNodes[10].value.slice(1)}`,
      "password": `${password}`,
      "cart": [],
      "wish": [],
      "reviews": [],
      "orders": []
    }

 
    
    



    let bool = true;

    let Eval = detailRef.current.childNodes[9].value;
    let Pval = detailRef.current.childNodes[10].value;
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var phoneFormat = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/




    if (Eval.match(mailFormat) && Pval.match(phoneFormat)) {

      userData.map((currUser) => {
        if (currUser.email == infoObj.email) {
          bool = false;
          toast.error('Email is already in use', {
            autoClose: 1500
          })

          detailRef.current.childNodes[9].style.border = "2px solid red";

          setTimeout(() => {
            detailRef.current.childNodes[9].style.border = "none";
          }, 3000);

        }

        else if (currUser.fphone == infoObj.fphone) {
          bool = false;
          toast.error('Phone Number is already taken', {
            autoClose: 1500
          })
        }

      })

      if (bool) {

        sendOTP();
        dispatch(addUser(infoObj))

        // e.target.style.display = "none"
        // OtpRef.current.style.display="block"
        router.push({
          pathname:'/otp',
          
          query:{
            slug:userEmail,
            existed:false
          }
        })


      }

    }

    else if (Pval.match(phoneFormat) == null) {

      toast.error('Invalid Phone Number', {
        autoClose: 1200
      })
      detailRef.current.childNodes[10].style.border = "2px solid red";


      setTimeout(() => {
        detailRef.current.childNodes[10].style.border = "none";
      }, 3000);

    }
    else {
      toast.error('Invalid Email Address', {
        autoClose: 1200
      })
      detailRef.current.childNodes[9].style.border = "2px solid red";


      setTimeout(() => {
        detailRef.current.childNodes[9].style.border = "none";
      }, 3000);
    }








  }


  const phone = (e, type) => {
    let x = e.target.value;
    {
      if (x >= 0 && x <= 9999999999) {

        if (x.length <= 10) {
          if (type == "f") {
            setfPhone(x)
          }


        }


      }

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

  const sendOTP = async () => {
    let something = Math.round(Math.random() * 1000000)
    something = something.toString();
    if (something.length < 6) {
      while (something.length < 6) {
        something = something + (Math.round(Math.random() * 10)).toString()
      }
    }

    setRandomCode(something)
    console.log("This is email "+ userEmail)
    const response = await fetch('/api/emailSender', {
      method: 'POST',
      body: JSON.stringify({
        "type": "OTP",
        "email": userEmail,
        "random": something
      }),

      headers: {
        'Content-Type': 'application/json',
      },
    })

    dispatch(clearPin())
    dispatch(setPin(something))

    return;
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

  if (loader)
    return (
      <Loading />
    )

  else
    return (
      <>

        <img src='/logo.png' style={{ width: '25vw', height: '25vw', position: 'absolute', top: '20vh', left: '30vh', zIndex: '10' }} />
        <section className={styles.LoginSignupCont}>
          <Head>
            <title>Signup</title>
          </Head>
          <ToastContainer className={styles.toastContainer}
            limit={2} />

          <form className={styles.SignupMain} onSubmit={(e) => SignupAction(e)}>

            <div className={styles.SignupContainer} id='myForm' ref={detailRef}>
              <h2>Create Account</h2>
              <input type="text" placeholder='First Name' required />
              <input type="text" placeholder='Last Name' required />
              <select required defaultValue={null}>
                <option value={null}>Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>


              <input type="text" placeholder='Address' required />
              <input type='text' placeholder='Country' required />
              <input type="text" placeholder='State' required />
              <input type="text" placeholder='City' required />
              <input type="text" placeholder='Postal Code' required />
              <input type="text" placeholder='Email' value={userEmail} onChange={(e)=>setuserEmail(e.target.value)} required />
              <input type="text" placeholder='Phone Number' required value={fphone ? fphone : ""} onChange={(e) => phone(e, "f")} />




              <button>Save</button>


              <p>Already a member ? <Link href={'/login'}><span> Login</span></Link></p>
            </div>
          </form>




          <form className={styles.loginContainera} >

            <div className={`${styles.loginContainer} ${styles.finalSignup}`} ref={SignupRef} id='myForm' >

              <h2>Create Password</h2>
              <input type="password" placeholder='Password' required ref={firstPassRef} />
              <input type="password" placeholder='Confirm Password' required ref={passRef} />
              <section ref={showRef} ><AiOutlineEyeInvisible className={styles.passShow} onClick={(e) => togglePassword(e, "show")} /></section>
              <section ref={hideRef}><AiOutlineEye className={styles.passHide} onClick={(e) => togglePassword(e, "hide")} /></section>
              <button onClick={(e) => verifyPassword(e)}>Signup</button>
              <hr />
              <p>Already a member? <Link href={'/login'}><span> Login now</span></Link></p>
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

export default Signup