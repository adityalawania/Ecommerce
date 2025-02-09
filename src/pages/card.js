import React, { useDebugValue, useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import { FiHeart } from "react-icons/fi";
import { BiSort, BiFilterAlt } from "react-icons/bi";
import Link from 'next/link';
import Filter from './filter';
import Category from './category';
import { ToastContainer } from 'react-toastify';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../store';
import allProductData from '../datas/data';
import dynamic from 'next/dynamic';
import Product from "@/models/Product"
import connectDB from "@/middleware/mongoose"
import mongoose from 'mongoose';
import { BsFillClipboard2MinusFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { ImEqualizer } from "react-icons/im";
import { searchIn, searchOut } from '../store/slices/searchSlice';
import { useDispatch } from 'react-redux'
import { addUserWish, removeUserWish } from '../store/slices/userSlice';
import addUser from './api/addUser';
import Loading from './loading';


export let outerFunction;
const wishlistArray = [];

function Card({ response }) {


  // function utilitySearch() {
  //   searchclick();
  // }

  useEffect(() => {
    outerFunction = searchclick;
  }, [])

  const router = useRouter();
  const dispatch = useDispatch()
  const filterRef = useRef()
  const cardContRef = useRef()
  const date = new Date();


  const [state, setState] = useState(10);
  const [result, setResult] = useState(response);
  const [finalResult, setFinalResult] = useState(result);
  const [loader, setloader] = useState(false);
  const [smallloader, setSmallLoader] = useState(false);
  const [lastIdenWish, setlastIdenWish] = useState(1);




  const reRender = () => {



    setState(prev => {
      return { ...prev }
    })

  }

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


  // **************************************************


  // window.onscroll(()=>console.log('hello'))

  React.useEffect(() => {

    window.addEventListener('scroll', scrollFunction)

  }, []);

  function scrollFunction() {

    if (document.body.scrollTop > 140 || document.documentElement.scrollTop > 120) {
      try {

        // document.getElementsByClassName('filterinCard').style.position="fixed"
        // document.getElementsByClassName('filterinCard').style.top="60px"
        // document.getElementById('CardContainer').style.bottom="20px"

        filterRef.current.style.position = "fixed";
        filterRef.current.style.top = "60px";
        cardContRef.current.style.bottom = "40px"
        filterRef.current.childNodes[3].style.display = "none"

      }
      catch (err) {
        // console.log(err)
      }


    } else {
      try {

        filterRef.current.style.position = "relative";
        filterRef.current.style.top = "0px";
        cardContRef.current.style.bottom = "737px"

      }
      catch (err) {
        // console.log(err)
      }

    }
  }

  //**************************************************** */

  let canShowToast=true;
  const addToWish = async (iden, amount, name, company, picture, rate) => {

    if (store.getState().finalPersistedReducer.status[0] == 'inactive') {
      router.push('/login')
      return;
    }
  
    if(iden==lastIdenWish) {
      if(!canShowToast){
        return;
      }
      else{
        canShowToast=false;
        setTimeout(() => {
          canShowToast=true;
        }, 2600);
      }
    }


    setlastIdenWish(iden);

    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }

    const allmonth = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];



    let longDate = date.addDays(0);
    let wishDate = `${longDate.getDate() + " " + allmonth[longDate.getMonth()] + "," + longDate.getFullYear()}`


    let wishObj = {
      id: iden,
      img: picture,
      title: name,
      brand: company,
      price: amount,
      date: wishDate,
      rating: rate
    }

    let reduxWish = store.getState().finalPersistedReducer.user[0].wish;
    let bool = true;

    if (reduxWish.includes(iden)) {
      bool = false;
      toast.warn('Item already added', {

        autoClose: 1200
      })
    }

    if (bool) {
      const response = await fetch('/api/updateUser', {
        method: 'PATCH',
        body: JSON.stringify({
          'type': 'addWish',
          'email': `${store.getState().finalPersistedReducer.user[0].email}`,
          'content': wishObj
        }),

        headers: {
          'Content-Type': 'application/json',
        },
      })

      dispatch(addUserWish(iden))

      toast.success(`${name} added `, {
        autoClose: 1000
      })

    }


  }

  const applyFilter = () => {

    let a = store.getState();
    setResult(response)


    // console.log("started again ",result,response)
    if (a.allbrands.length == 0 && a.filterPrice.length == 0 && a.filterRating.length == 0) {
      // console.log("No filter")
      // router.reload()

    }
    else {
      let newResponse;

      if (a.allbrands.length > 0) {

        // console.log("enterd brand filter")
        // console.log(result," is the result")
        newResponse = response.filter(BrandfilteringFunction)
        setResult(newResponse)

        if (a.filterPrice.length > 0) {
          newResponse = newResponse.filter(PricefilteringFunction)
          setResult(newResponse)

          if (a.filterRating.length > 0) {
            newResponse = newResponse.filter(RatingfilteringFunction)
            setResult(newResponse)
          }
        }

        else if (a.filterRating.length > 0) {
          newResponse = newResponse.filter(RatingfilteringFunction)
          setResult(newResponse)
        }


      }

      else if (a.filterPrice.length > 0) {
        newResponse = response.filter(PricefilteringFunction)
        setResult(newResponse)

        if (a.filterRating.length > 0) {
          newResponse = newResponse.filter(RatingfilteringFunction)
          setResult(newResponse)
        }
      }

      else if (a.filterRating.length > 0) {
        newResponse = response.filter(RatingfilteringFunction)
        setResult(newResponse)
      }

      else {
        // console.log("clraingvb brsnd")
        setResult(result)
      }

      reRender();
    }

    setFinalResult(result);

  }

  const BrandfilteringFunction = (ele) => {

    let f = false;
    let a = store.getState();
    a.allbrands.map((inp) => {
      if (ele.brand.toLowerCase() == inp.toLowerCase()) {
        f = true;
        return
      }
    })

    if (f == true)
      return ele

  }

  const PricefilteringFunction = (ele) => {


    let a = store.getState().filterPrice;

    if (ele.price[0] >= a[0][0] && ele.price[0] <= a[0][1]) {

      return ele
    }

  }

  const RatingfilteringFunction = (ele) => {

    let a = store.getState();
    let totalRating = 0;
    ele.rating.map((r) => {
      totalRating += r;
    })

    totalRating = totalRating / ele.rating.length;

    if (a.filterRating[0] <= totalRating) {
      return ele
    }


  }

  const searchclick = () => {


    let searchState = store.getState().finalPersistedReducer.search;
    // let searchState = query
    setSmallLoader(true);
    setTimeout(() => {
      setSmallLoader(false)
    }, 1300);

    if (searchState.length > 0) {
      let newResponse = result.filter(searchFilterColor)

      setResult(newResponse)
      newResponse = newResponse.filter(searchFilterGender)

      setResult(newResponse)
      newResponse = newResponse.filter(searchFilterCategory)
      setResult(newResponse)

      if (newResponse.length == 13 && searchState[0].title) {

        setResult([])
      }


    }
    // dispatch(searchOut())
  }

  const searchFilterTitle = (ele) => {
    let searchState = store.getState().finalPersistedReducer.search[0];
    let f = false;
    if (searchState.title != "") {

      if (ele.title.toLowerCase() == searchState.title) {

        return ele;
      }
    }


    else
      return ele

  }


  const searchFilterColor = (ele) => {

    let searchState = store.getState().finalPersistedReducer.search[0];
    let flag = false;
    if (searchState.color.length > 0) {
      for (let i = 0; i < ele.color.length; i++) {
        let col = ele.color[i].toLowerCase();
        if (searchState.color.includes(col)) {
          flag = true;
          break;

        }

      }
      if (flag)
        return ele;

    }

    else {
      // alert("n")
      return ele;
    }


  }

  const searchFilterGender = (ele) => {

    let searchState = store.getState().finalPersistedReducer.search[0];

    if (searchState.gender != "") {
      if (ele.gender.toLowerCase() == searchState.gender) {
        return ele;
      }
    }


    else
      return ele

  }

  const searchFilterCategory = (ele) => {

    let searchState = store.getState().finalPersistedReducer.search[0];
    let cat = ele.category.toLowerCase();
    let moreCat = ele.moreCategory.split(" ");
    let f = false;

    if (searchState.category.length) {

      if (searchState.category.includes(cat)) {

        return ele;
      }



      for (let i = 0; i < searchState.category.length; i++) {
        let it = searchState.category[i];
        if (moreCat.includes(it)) {

          return ele
        }
      }


      for (let i = 0; i < searchState.title.length; i++) {
        let it = searchState.title[i];

        if (moreCat.includes(it)) {
          return ele
        }
      }

    }


    else
      return ele
  }


  if (loader)
    return (
      <Loading />
    )

  else
    if (result) {

      return (
        <div className={styles.cardFilterParent}>


          <ToastContainer className={styles.toastContainer}
            limit={2} />

          {/* <button className={styles.mySearchbtn} onClick={(e) => searchclick(e)}>Search</button> */}
          <section className={styles.cardWithfilter}>

            <h5>Only one filter will work at a time</h5>
            <div className={styles.filterHead}>
              <span>Filters</span>
              <ImEqualizer className={styles.filterHeadIcon} />
              <button onClick={() => applyFilter()}>Apply</button>

            </div>
            <Filter ref={filterRef} className={styles.filterinCard}></Filter>

            {smallloader ? <div style={{ position: 'fixed', left: 800, top: 290, width: 100 }}> <Loading /> </div> :
              <div id={styles.CardContainer} ref={cardContRef}>

                {Object.keys(result).map((i) => {



                  return (

                    <div className={styles.Card} key={result[i]._id}>

                      <Link passHref={true} href={{
                        pathname: '/item',
                        query: {
                          d: JSON.stringify(result[i].brand, "/", result[i].title),
                          slug: result[i]._id
                        }


                      }}>


                        <img className={styles.img} src={result[i].img[0]} height={220} width={230}></img>
                        <div className={styles.CardContent}>
                          <p id={styles.title} >{(result[i].brand).toUpperCase()}</p>
                          <p>{(result[i].title).charAt(0).toUpperCase() + (result[i].title.slice(1))}</p>

                          <span className={styles.price}>&#8377;{result[i].price[0]}</span>
                          <span className={styles.priceCut}>&#8377;{result[i].price[1]}</span>


                        </div>

                      </Link>

                      <div className={styles.CardWish} onClick={() => addToWish(result[i]._id, result[i].price[0], result[i].title, result[i].brand, result[i].img[0], result[i].rating ? result[i].rating : 4.5)}>
                        <FiHeart className={styles.wishIcon} />

                      </div>
                    </div>

                  )
                })}

              </div>

            }
          </section>
        </div>
      )

    }




}




export default Card
export { wishlistArray }
