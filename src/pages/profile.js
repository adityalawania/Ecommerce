import React from 'react'
import styles from '../styles/Home.module.css'
import Navbar from './Navbar'
import countries from '../datas/country'
import { useState, useRef,useEffect } from 'react'
import User from '@/models/User'
import { useRouter } from 'next/router'
import userSlice from '../store/slices/userSlice'
import { removeUser } from '../store/slices/userSlice'
import { logout } from '../store/slices/loginSlice'
import { signOut } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify';
import store from '../store'
import { MD5 } from 'crypto-js'
import Link from 'next/link'
import Head from 'next/head'
import navigator from 'navigator'
import axios from 'axios'
import { headers } from '../../next.config'
import UserData from '@/models/UserData'
import Loading from './loading'

function Profile({ userData }) {

  const [loader,setLoader] = useState(true)

  const pictureRef = useRef()
  const countryRef = useRef()
  const sectionRef = useRef()
  const profileNavRef = useRef()
  const addressRef = useRef();
  const passRef = useRef()
  const newAddRef = useRef()
  const OtpRef = useRef()
  const emailRef = useRef()
  const reviewRef = useRef()
  const coupenRef = useRef();


  const router = useRouter()
  const dispatch = useDispatch();

  useEffect(()=>{
    setTimeout(() => {
      setLoader(false)
      
    }, 2000);
  },[])

  let myUser = []

  userData.map((user) => {
    if (user._id == router.query.slug) {
      myUser = user;

      return
    }

  })



  let cc = "+91"
  countries.map((cont) => {
    if (myUser.country == cont.name){
      cc = cont.code;
   

    }
  })

  const [pic, setPic] = useState('');

  let defCountry = 'Select Country'

  const [countryCode, setCountryCode] = useState(cc);
  const [country, setCountry] = useState(myUser.country)
  const [mainAddress, setmainAdd] = useState(myUser.address)
  const [fname, setFname] = useState(myUser.fname)
  const [lname, setLname] = useState(myUser.lname)
  const [gender, setGender] = useState(myUser.gender)
  const [phone, setphone] = useState(myUser.fphone)

  const [userEmail, setUserEmail] = useState(myUser.email)

  const [randomCode, setRandomCode] = useState()
  const [otp, setOtp] = useState()
  const [newEmail, setNewEMail] = useState(userEmail)

  const [imgSrc, setImgSrc] = useState('');


  const logoutFunc = () => {
    dispatch(logout())
    dispatch(removeUser())
    // dispatch(addMsg('Logout'))
    signOut({ callbackUrl: 'http://localhost:3000' })


  }



  const profileNav = (id) => {


    let navItems = profileNavRef.current.children;
    for (let j = 0; j < navItems.length - 1; j++) {
      if (j == id) {
        try {
          profileNavRef.current.children[j].style.backgroundColor = "rgb(234, 234, 234)";
          profileNavRef.current.children[j].style.color = "rgb(33, 33, 33)";
          sectionRef.current.children[j].style.display = "block"
        }

        catch (err) {

        }
      }
      else {
        try {
          profileNavRef.current.children[j].style.backgroundColor = "white"
          profileNavRef.current.children[j].style.color = "rgb(124, 124, 124)";
          sectionRef.current.children[j].style.display = "none"
        }
        catch (err) {

        }


      }
    }

  }

  const profileDetailFunc = async (e, field) => {

    if (field == "pic") {
      let srcOfImg = URL.createObjectURL(e.target.files[0]);
      setImgSrc(srcOfImg)
      console.log(e.target.value)
      console.log("src in frontend", srcOfImg)




      // try {
      //   let backendResponse = await fetch('/api/updateUser', {
      //     method: 'PATCH',
      //     body: JSON.stringify({
      //       'type': 'changeProfilePic',
      //       'email': store.getState().finalPersistedReducer.user[0].email,
      //       'pic': srcOfImg
      //     }),

      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   })


      // }

      // catch (err) {
      //   console.log("frontend mein error")
      // }
    }

    if (field == "fname") {
      setFname(e.target.value)
    }

    if (field == "lname") {
      setLname(e.target.value)
    }

    if (field == "phone") {
      if ((e.target.value >= 0 && e.target.value <= 9999999999) || e.target.value == '') {
        setphone(e.target.value)

      }
    }

    // sectionRef.current.childNodes[0].childNodes[1].childNodes[1].style.display="none"
  }

  const changeGender = (e) => {
    console.log(e.target.value);
    setGender(e.target.value)
  }

  const changeEmailPhone = async (e, type) => {
    OtpRef.current.style.display = "block"
    sectionRef.current.childNodes[0].childNodes[1].style.display = "none"
    sectionRef.current.childNodes[0].childNodes[0].style.display = "none"

    sendOTP(myUser.email);
  }


  const toggleOtp = (e) => {
    if (e.target.value.length >= 7) {

    }
    else {
      if (e.target.value >= 0 & e.target.value < 999999)
        setOtp(e.target.value)
    }
  }

  const sendOTP = async (reqEmail) => {

    let something = Math.round(Math.random() * 1000000)
    something = something.toString();
    if (something.length < 6) {
      while (something.length < 6) {
        something = something + (Math.round(Math.random() * 10)).toString()
      }
    }

    setRandomCode(something)

    const response = await fetch('/api/emailSender', {
      method: 'POST',
      body: JSON.stringify({
        "type": "OTP",
        "email": reqEmail,
        "random": something
      }),

      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log("done")

    return;
  }

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (otp == randomCode) {
      toast.success('OTP Verified', {
        autoClose: 1200
      })

      if (userEmail == newEmail) {
        OtpRef.current.style.display = "none"
        emailRef.current.style.display = "block"
      }

      
      else {
        try {
          const response = await fetch('/api/updateUser', {
            method: 'PATCH',
            body: JSON.stringify({
              'type': 'changeEmail',
              'email': userEmail,
              'newEmail': newEmail
            }),

            headers: {
              'Content-Type': 'application/json',
            },
          })

          router.reload()
        }
        catch (err) {
          console.log(err.message)
        }


      }

    }
    else {
      toast.error('Invalid OTP', {
        autoClose: 1200
      })
    }

  }

  const verifyEmail = async (e) => {
    e.preventDefault()
    let val = emailRef.current.childNodes[1].childNodes[1].value;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (val.match(mailformat)) {

      let flag = false
      userData.map((user) => {
        if (user.email == val) {
          flag = true;
          return
        }
      })

      if (flag) {

        toast.error('Email already exist', {
          autoClose: 1200
        })

        emailRef.current.childNodes[1].childNodes[2].style.display = "block"
      }

      else {

        setNewEMail(emailRef.current.childNodes[1].childNodes[1].value)
        console.log(emailRef.current.childNodes[1].childNodes[1].value)

        sendOTP(emailRef.current.childNodes[1].childNodes[1].value);

        toast.success('OTP sent', {
          autoClose: 1200
        })

        emailRef.current.style.display = "none"
        OtpRef.current.style.display = "block"
        setOtp('');


      }



    }
    else {
      toast.error('Invalid Email Address', {
        autoClose: 1200
      })
      emailRef.current.childNodes[1].childNodes[1].style.border = "2px solid red";


      setTimeout(() => {
        emailRef.current.childNodes[1].childNodes[1].style.border = "none";
      }, 3000);
    }
  }

  const changecountry = (e) => {
    countries.map((c) => {
      if (c.name == e.target.value) {
        setCountryCode(c.code)
        setCountry(c.name)
      }
    })
  }



  const savePersonalInfo = async (e) => {
    e.preventDefault();
    let basic = sectionRef.current.childNodes[0].childNodes[1].childNodes[2].childNodes[0].childNodes[1]


    console.log(basic.files[0])

    const formData = new FormData();
    formData.append('file', sectionRef.current.childNodes[0].childNodes[1].childNodes[2].childNodes[0].childNodes[1].files[0]);

    console.log(formData)


    try {
      console.log("ghusa")
      const response = await fetch('/api/updateUserPersonal', {
        method: 'POST',
        body: JSON.stringify(basic.files[0]),
        headers: {
          'Content-Type': 'application/json',
        },
      })


      console.log("hogya")

    } catch (error) {
      console.log('Frontend Failed to upload file:', error);
    }



    // try {
    //   const response = await fetch('/api/updateUser', {
    //     method: 'PATCH',
    //     body: JSON.stringify({
    //       'type': 'updatePersonalDetails',
    //       'email': userEmail,
    //       'fname':fname,
    //       'lname':lname,
    //       'fphone':phone,
    //       'country':country,


    //     }),

    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   })


    // }
    // catch (err) {
    //   console.log(err.message)
    // }
  }

  const exploreCoupen = () => {

    if (coupenRef.current.style.display == "none") {
      toast.success('New Coupen unlocked', {
        autoClose: 1500
      })
      coupenRef.current.style.display = "block"

    }

  }

  const cancelOrder = async (id) => {
    try {
      const response = await fetch('/api/updateUser', {
        method: 'PATCH',
        body: JSON.stringify({
          'type': 'cancelOrder',
          'userId': router.query.slug,
          'orderId': id
        }),

        headers: {
          'Content-Type': 'application/json',
        },
      })


    }
    catch (err) {
      console.log(err.message)
    }

  }

  const selectAddress = async (e, i) => {

    if (e.target.tagName == 'ASIDE' || e.target.tagName == 'P') {


      const response = await fetch('/api/updateUser', {
        method: 'PATCH',
        body: JSON.stringify({
          'type': 'mainAddress',
          'email': `${store.getState().finalPersistedReducer.user[0].email}`,
          // 'content': e.target.children[2].innerHTML
          'content': addressRef.current.childNodes[i + 1].children[2].innerHTML
        }),

        headers: {
          'Content-Type': 'application/json',
        },
      })



      toast.success('Current Address Updated', {
        autoClose: 1300
      })


      let j = 0;

      while (j < myUser.alladdress.length) {

        if (i == j) {
          addressRef.current.childNodes[i + 1].style.border = "3px solid rgb(148, 33, 242)"
          addressRef.current.childNodes[i + 1].style.height = "110px"
          addressRef.current.childNodes[i + 1].children[2].style.color = "rgb(148, 33, 242)"
          addressRef.current.childNodes[i + 1].children[2].style.fontWeight = "600"
          //  addressRef.current.childNodes[i+1].children[3].style.display="none"
          setmainAdd(addressRef.current.childNodes[i + 1].children[2].innerHTML);

        }
        else {
          addressRef.current.childNodes[j + 1].style.border = "1px solid rgb(197, 197, 197)"
          addressRef.current.childNodes[j + 1].children[2].style.color = "black"
          addressRef.current.childNodes[j + 1].children[2].style.fontWeight = "normal"
          //  addressRef.current.childNodes[j+1].children[3].style.display="block"





        }

        j++;
      }





      // catch (err) {
      //   console.log(err.message)
      //   toast.error(`too quick..!`, {
      //     autoClose: 1300
      //   })


      // }

    }

  }


  const addAddress = async () => {



    let newAddress = newAddRef.current.value
    if (newAddress.length > 10) {
      try {
        const response = await fetch('/api/updateUser', {
          method: 'PATCH',
          body: JSON.stringify({
            'type': 'addAddress',
            'email': `${store.getState().finalPersistedReducer.user[0].email}`,
            'content': newAddress
          }),

          headers: {
            'Content-Type': 'application/json',
          },
        })

        toast.success('New Address added', {
          autoClose: 1200
        })

        router.reload()
      }

      catch (err) {
        toast.error(`${err.message}`, {
          autoClose: 10000
        })
      }
    }
    else {
      toast.error('Address is too short', {
        autoClose: 1200
      })
    }



  }




  const setaddType = async (e, i) => {
    console.log(i)
    console.log(e.target.value)
    const response = await fetch('/api/updateUser', {
      method: 'PATCH',
      body: JSON.stringify({
        'type': 'updateAddType',
        'email': `${store.getState().finalPersistedReducer.user[0].email}`,
        'content': e.target.value,
        'id': i
      }),

      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const deleteAdd = async (i, reqAdd) => {

    const response = await fetch('/api/updateUser', {
      method: 'PATCH',
      body: JSON.stringify({
        'type': 'deleteAdd',
        'email': `${store.getState().finalPersistedReducer.user[0].email}`,
        'content': myUser.alladdress[i],

      }),

      headers: {
        'Content-Type': 'application/json',
      },
    })

    addressRef.current.childNodes[i + 1].style.display = "none"

    if (mainAddress == reqAdd) {
      toast.warn('Deleted main address..!, choose/add any main address', {
        autoClose: 2200
      })
      const response = await fetch('/api/updateUser', {
        method: 'PATCH',
        body: JSON.stringify({
          'type': 'mainAddress',
          'email': `${store.getState().finalPersistedReducer.user[0].email}`,
          'content': ''
        }),

        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log("main deleted")
    }

  }

  const removeReview = async (e, i) => {
    console.log("enter fubc")
    console.log(myUser.reviews[i].id)
    try {
      const response = await fetch('/api/updateUser', {
        method: 'PATCH',
        body: JSON.stringify({
          'type': 'removeReview',
          'email': `${store.getState().finalPersistedReducer.user[0].email}`,
          'reviewId': myUser.reviews[i].id
        }),

        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log("done remove review")
      reviewRef.current.childNodes[1].childNodes[i].style.display = "none"
      toast.success('Review Deleted', {
        autoClose: 1200
      })
    }
    catch (err) {
      console.log(err.message)
      toast.error('Some Error Occur', {
        autoClose: 1200
      })
    }



  }

  const passEye = (type, i) => {

    if (type == 'show') {
      passRef.current.childNodes[i].childNodes[0].type = "text"
      passRef.current.childNodes[i].childNodes[1].style.display = "block"
      passRef.current.childNodes[i].childNodes[2].style.display = "none"

      console.log("inshow")
    }
    else {
      passRef.current.childNodes[i].childNodes[0].type = "password"
      passRef.current.childNodes[i].childNodes[1].style.display = "none"
      passRef.current.childNodes[i].childNodes[2].style.display = "block"
      console.log("in hide")
    }
  }

  const verifyPassword = async (e) => {
    e.preventDefault();

    console.log()
    if (passRef.current.childNodes[0].childNodes[0].value == myUser.password) {
      if (passRef.current.childNodes[1].childNodes[0].value != passRef.current.childNodes[2].childNodes[0].value) {
        toast.error('Password mismatched', {
          autoClose: 1200
        })
      }

      else if (passRef.current.childNodes[1].childNodes[0].value.length < 3) {
        toast.warn('Password is too short', {
          autoClose: 1200
        })
      }

      else {

        try {
          const response = await fetch('/api/updateUser', {
            method: 'PATCH',
            body: JSON.stringify({
              'type': 'changePass',
              'email': store.getState().finalPersistedReducer.user[0].email,
              'pass': passRef.current.childNodes[1].childNodes[0].value
            }),

            headers: {
              'Content-Type': 'application/json',
            },
          })


          toast.success("Password Changed", {
            autoClose: 1200
          })

          dispatch(logout())
          dispatch(removeUser())


          // dispatch(addMsg('Logout'))
          //  signOut({callbackUrl:'http://localhost:3000'})
          router.push('/login')
          console.log("changed")
        }

        catch (err) {
  
        }



      }


    }
    else {
      toast.error('Incorrect Password', {
        autoClose: 1200
      })
    }
  }



  const newImg = async (e) => {
    e.preventDefault();
 

    const file = e.target.files[0];



    try {

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({
          'file': `${file}`,
          'daad': 'okok'
        }),

        headers: {
          'Content-Type': 'application/json',

        },
      }).then((res))
        .catch((err))



      // if(!res.ok) throw new Error(await res.text())
    }

    catch (err) {
 
    }







  }

  const updateDetails = async (e) => {
  
    e.preventDefault();
    var phoneFormat = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
    
    if(phone.match(phoneFormat)){

    }
    else{

      if(phone.length==0)
        toast.error('Please enter Phone Number', {
          autoClose: 1200
        })

      else
        toast.error('Invalid Phone Number', {
          autoClose: 1200
        })

        return;
    }

    if(fname.length==0 || lname.length==0){
      toast.error(`Names Field can't be empty `,{
        autoClose:1200
      })
      return;
    }

    if(country==''){
      toast.error(`Please choose one country `,{
        autoClose:1200
      })
      return;
    }
    
    try {
  
      const response = await fetch('/api/updateUser', {
        method: 'PATCH',
        body: JSON.stringify({
          'type': 'updatePersonalDetails',
          'country':country,
          'email': userEmail,
          'fname':fname,
          'lname':lname,
          'gender':gender,
          'fphone':phone
        }),

        headers: {
          'Content-Type': 'application/json',
        },
      })

      router.reload();

      toast.success('Profile Updated',{
        autoClose:1200
      })

    }
    catch (err) {
   
    }
  }


  if(loader)
    return(
     <Loading/>
    )
   
  else
  return (

    <div className={styles.accountContainer}>
      <Head>
        <title>Account</title>
      </Head>
      <Navbar></Navbar>
      <ToastContainer className={styles.toastContainer} limit={2} />
      <h2>My Account</h2>


      <section className={styles.accountSideBar}>
        <h3>Welcome {myUser.fname}</h3>
        <ul ref={profileNavRef}>
          <li onClick={() => profileNav('0')}><img src='user.png' className={styles.ProfileNavIcons} />  Profile         <img src='next.png' className={styles.profileNext} height={20} width={20} /></li>
          <li onClick={() => profileNav('1')}><img src='shopping-bag.png' className={styles.ProfileNavIcons} />  Orders          <img src='next.png' className={styles.profileNext} height={20} width={20} /></li>
          <li onClick={() => profileNav('2')}><img src='location.png' className={styles.ProfileNavIcons} />  Address         <img src='next.png' className={styles.profileNext} height={20} width={20} /></li>
          <li onClick={() => profileNav('3')}><img src='review.png' className={styles.ProfileNavIcons} />  Reviews         <img src='next.png' className={styles.profileNext} height={20} width={20} /></li>
          <li onClick={() => profileNav('4')}><img src='unlock.png' className={styles.ProfileNavIcons} />  Change Password <img src='next.png' className={styles.profileNext} height={20} width={20} /></li>
          <button onClick={() => logoutFunc()}>Logout</button>
        </ul>
      </section>
      <section ref={sectionRef}>
        <div className={styles.mainProfileCont}>
          <h3>Profile</h3>
          <aside>

            <div>
              <img src='male.png' className={styles.noProfileImg} />

            </div>



            <form onSubmit={(e) => updateDetails(e)} method='post' >

              <input type="text" placeholder='First Name' name='fname' value={fname} onChange={(e) => profileDetailFunc(e, "fname")} />
              <input type="text" placeholder='Last Name' name='lname' value={lname} onChange={(e) => profileDetailFunc(e, "lname")} />
              <select id="gender" value={gender} name='gender' onChange={(e)=>setGender(e.target.value)}>
                <option defaultValue={myUser.gender}>Select Gender</option>

                <option value="Male" ref={countryRef}>Male</option>
                <option value="Female" ref={countryRef}>Female</option>
                <option value="Others" ref={countryRef}>Others</option>


              </select>
              <input type="text" placeholder='Email' name='email' value={userEmail} />
              <li onClick={(e) => changeEmailPhone(e, "email")}>CHANGE</li>
              <span>{countryCode}</span> <input type="text" placeholder='Phone' name='phone' value={phone} onChange={(e) => profileDetailFunc(e, "phone")} />


              <select id="nations" defaultValue={myUser.country} name='country' onChange={(e) => changecountry(e)}>
                
                <option value=''>{country.length>0 ? country : defCountry}</option>
                {countries.map((c, i) => {
                  return (
                    <option value={c.name} ref={countryRef} key={i}>{c.name}</option>
                  )
                })}
              </select>

              <button>Save</button>
              <hr />
            </form>




            <div>
              <button className={styles.glow} onClick={exploreCoupen}>Coupons</button>
              <article ref={coupenRef}>
                <span>HelloTry-it</span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur labore illum laboriosam blanditiis obcaecati cum officiis repellendus. Omnis, corrupti atque quia quas possimus ut </p>
              </article>


            </div>
          </aside>
          <form className={`${styles.loginContainer} ${styles.OTPform} ${styles.profileOTPCont}`} ref={OtpRef} onSubmit={(e) => verifyOtp(e)} >
            <h2> Change Email Address</h2>
            <div className={` ${styles.OTP}`} id='myForm' >

              <h2>Enter 6-digit OTP</h2>
              <p>OTP has been send to {newEmail}</p>
              <input type="tel" placeholder='______' required value={otp ? otp : ""} onChange={(e) => toggleOtp(e)} />
              <button>Submit</button>
              <p onClick={() => sendOTP()}>Resend OTP</p>
            </div>
          </form>

          <form ref={emailRef}>
            <h2> Change Email Address</h2>
            <div className={styles.forgotContainer} id='myForm'>
              <h2>Enter your new Email</h2>
              <input type="text" placeholder='Email' required onChange={(e) => emailRef.current.childNodes[1].childNodes[2].style.display = "none"} />
              <p>This email is already in use, try another</p>
              <button onClick={(e) => verifyEmail(e)}>Send OTP</button>


            </div>
          </form>


        </div>










        <div className={styles.profileOrderCont}>
          <h3>Orders</h3>
          {/* ****************     MAP 2   ************************ */}
          {myUser.orders.map((order, i) => {
            let status = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            return (
              <aside className={styles.profileOrder} key={i}>
                <div className={styles.OrderDetail}>
                  <img src={order.img} />
                  <ul>
                    <li>{order.title}</li>
                    <li>{order.brand}</li>
                  </ul>
                  <ul>
                    <li>{order.size}</li>
                    <p style={{ "backgroundColor": `${order.color}` }} ></p>
                  </ul>
                  <ul>
                    <li>Rs. {order.price}</li>
                    {status == 'Pending' ?

                      <li style={{ "color": `orange` }}>{status}</li> : <></>
                    }
                    {
                      status == 'Canceled' ?
                        <li style={{ "color": `red` }}>{status}</li> : <></>
                    }
                    {status == 'Delivered' ?

                      <li style={{ "color": `rgb(96, 33, 242)` }}>{status}</li> : <></>
                    }
                  </ul>
                  <ul>
                    <li>Shipping Date:</li>
                    <li></li>
                  </ul>
                  <ul>
                    <li>Order Id:</li>
                    <li>{order.id}</li>
                  </ul>
                </div>
                {
                  status == 'Pending' ?
                    <button style={{ "backgroundColor": 'red' }} onClick={() => cancelOrder(order.id)}>Cancel Order</button> : <></>
                }
                {
                  status == 'Delivered' ?
                    <button style={{ "backgroundColor": 'purple' }} >Rate Product</button> : <></>
                }

              </aside>

            )
          })}


        </div>

        <div className={styles.profileAddCont} ref={addressRef}>
          <h3>Address</h3>

          {myUser.alladdress.map((curr, i) => {
            if (curr == myUser.address) {
              return (
                <aside className={styles.profileAdd} style={{ "border": "3px solid rgb(148, 33, 242)", "height": "110px" }} onClick={(e) => selectAddress(e, i)}>


                  <img src='home.png' height={20} width={20} />
                  <select onChange={(e) => setaddType(e, i)}>
                    <option selected value="Home">Home</option>
                    <option value="Work">Work</option>
                  </select>

                  <p style={{ "color": 'rgb(148, 33, 242)', "fontWeight": "600" }}>{curr}</p>
                  <div>
                    <img src='delete.png' height={20} width={20} onClick={() => deleteAdd(i, curr)} />
                  </div>
                </aside>
              )
            }
            else {
              return (
                <aside className={styles.profileAdd} onClick={(e) => selectAddress(e, i)}>

                  <img src='home.png' height={20} width={20} />
                  <select onChange={(e) => setaddType(e, i)}>
                    <option selected value="Home">Home</option>
                    <option value="Work">Work</option>
                  </select>
                  <p>{curr}</p>
                  <div>
                    <img src='delete.png' height={20} width={20} onClick={() => deleteAdd(i, curr)} />
                  </div>
                </aside>
              )
            }

          })}


          <div className={styles.addAddress} >
            <img src='plus.png' height={15} width={15} />
            <input type='text' placeholder='Add Address' ref={newAddRef} />
            <button onClick={(e) => addAddress(e)}>Add</button>
          </div>
        </div>


        {/* ******************************* Reviews ********************************* */}
        <div className={styles.profileReviewCont} ref={reviewRef}>
          <h3>Reviews</h3>
          {/* ****************     MAP 2   ************************ */}
          <div>
            {myUser.reviews.map((item, i) => {

              let arr = [1, 2, 3, 4, 5];
              let ratePoints = item.rating;

              if (item.review)
                return (
                  <aside className={styles.profileReview}>

                    <img src='delete.png' onClick={(e) => removeReview(e, i)} />
                    <div>
                      <img src={item.img} />
                      <h5>{item.title}</h5>
                      <h5>|</h5>
                      <h5>{item.brand}</h5>
                    </div>


                    <p>Posted on {item.date}</p>
                    <div className={styles.starContainer}>

                      {arr.map(() => {
                        ratePoints--;
                        if (ratePoints > -1)
                          return (
                            <img src="starFill.png" alt="" height={16} width={16} />
                          )

                        else
                          return (
                            <img src="starBlank.png" alt="" height={14.6} width={14.6} />
                          )


                      })}
                      {/*           
              <img src="starFill.png" alt="" height={16} width={16} />
              <img src="starFill.png" alt="" height={16} width={16} />
              <img src="starBlank.png" alt="" height={14.6} width={14.6} /> */}
                    </div>

                    <div>
                      <p>{item.review}</p>
                    </div>

                  </aside>

                )
            })}

          </div>
        </div>



        <div className={styles.profilePassCont} >
          <h3>Change Password</h3>
          <form ref={passRef}>
            <div>
              <input type="password" placeholder='Old Password' />
              <img src='view.png' onClick={() => passEye('hide', 0)} />
              <img src='hide.png' onClick={() => passEye('show', 0)} />
            </div>

            <div>
              <input type="password" placeholder='New Password' />
              <img src='view.png' onClick={() => passEye('hide', 1)} />
              <img src='hide.png' onClick={() => passEye('show', 1)} />
            </div>

            <div>
              <input type="password" placeholder='Confirm New Password' />
              <img src='view.png' onClick={() => passEye('hide', 2)} />
              <img src='hide.png' onClick={() => passEye('show', 2)} />
            </div>
            <p>By saving you will be redirected to login page and login with new password</p>
            <button onClick={(e) => verifyPassword(e)}>Save</button>
          </form>
          <p onClick={() => router.push('/forgetpass')}>Forgot Password? Try using Email</p>
        </div>
      </section>
    </div>

  )
}
export async function getServerSideProps(context) {

  let userData = await UserData.find()

  return {
    props: { userData: JSON.parse(JSON.stringify(userData)) }, // will be passed to the page component as props
  }
}


export default Profile