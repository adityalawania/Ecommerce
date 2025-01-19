import React, { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import Card from './card'
import allProductData from '../datas/data'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { BsStar } from "react-icons/bs";
import { FiHeart } from "react-icons/fi";
import Link from 'next/link'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify';
import Product from '@/models/Product'
import { set } from 'mongoose'
import store from '../store'
import User from '@/models/User'
import { addUserCart, addUserWish } from '../store/slices/userSlice'
import { useDispatch } from 'react-redux'
import { login } from '../store/slices/loginSlice'
import Loading from './loading'




function Item({ ele }) {


  const router = useRouter();
  const date = new Date();

  const dispatch = useDispatch();


  let [activeColor, setActiveColor] = useState(ele.color[0])


  const [activeSize, setActiveSize] = useState()
  const [reviewBool, setreviewBool] = useState(false)
  
  const [activeImg, setActiveImg] = useState(ele.img[0])

  const [reviewVal, setReviewVal] = useState('')
  const [reviewLength, setReviewLength] = useState(0)
  const [ItemRating, setItemRating] = useState(0)
  const [ratingBool, setRatringBool] = useState(false);

  const [loader,setLoader] = useState(true)


  useEffect(() => {

    if (ele.size.length == 0) {
      setActiveSize('')
    }

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





  const [index, setIndex] = useState(0);


  const imgRef = useRef(null);

  const sizeRef = useRef();
  const colRef = useRef();
  const reviewInpRef = useRef()




  let prodRate=0;
  let totalReview=0;

  const rateCal= async()=>{
    await ele.reviews.map((i)=>{
       prodRate+=i.rating;
       totalReview+=1;
     })

  }

  rateCal();
  let finalRating=(prodRate/totalReview).toFixed(1)

  // console.log(prodRate)



  const AddWish = async (x) => {

    if (store.getState().finalPersistedReducer.status[0] != 'active') {
      router.push('./login')
    }
    else {


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
      let rate;
      if (ele.rating) {
        rate = ele.rating
      }
      else {
        rate = 4.5
      }
      let wishObj = {
        id: ele._id,
        img: activeImg,
        title: ele.title,
        brand: ele.brand,
        price: ele.price[0],
        date: wishDate,
        rating: rate
      }

      let reduxWish = store.getState().finalPersistedReducer.user[0].wish;
      let bool = true;
      reduxWish.map((thing) => {
        if (thing == ele._id) {
          bool = false;
          toast.warn('Item already added', {
            autoClose: 1200
          })
        }
      })

      if (bool) {
        try {
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

          dispatch(addUserWish(ele._id))  

          toast.success(`${ele.title} added `, {
            autoClose: 1000
          })
        }
        catch (err) {
          router.reload()
        }
      }


    }


  }





  const imgClicked = () => {
    imgRef.current.style.border = "2px solid purple";
  }

  const selectSize = (e) => {

    for (let i = 0; i < sizeRef.current.childNodes.length; i++) {
      let k = sizeRef.current.childNodes[i];

      if (k.innerHTML == e.target.innerHTML) {
        setActiveSize(k.innerHTML)

        k.style.border = "1px solid rgb(95, 17, 183)"
        k.style.color = "rgb(95, 17, 183)"



        e.target.style.border = "2px solid rgb(95, 17, 183)"
        e.target.style.color = "rgb(95, 17, 183)"


      }
      else {
        k.style.border = "1px solid #bfc0c6"
        k.style.color = "black"




      }

    }



  }

  const selectCol = (idx) => {
    for (let i = 0; i < colRef.current.childNodes.length; i++) {
      let k = colRef.current.childNodes[i];
      if (k.style.backgroundColor == ele.color[idx]) {
        setActiveColor(k.style.backgroundColor);
        setActiveImg(ele.img[idx])
      }
    }


  }

  const AddCart = async () => {

    let flag = true;
    let cartObj;

    if (store.getState().finalPersistedReducer.status[0] != 'active') {
      router.push('./login')
    }


    else if (!activeSize && ele.size.length > 0) {
      toast.error('Please Select Size', {
        autoClose: 1000
      })
    }


    else {

      if (!activeColor) {
        // console.log("no color")
        // activeColor=''
        console.log(activeColor)
        activeColor = ''
        console.log(activeColor)

      }

      cartObj = {
        id: router.query.slug,
        title: ele.title,
        brand: ele.brand,
        price: parseInt(ele.price[0]),
        size: activeSize,
        color: activeColor,
        img: activeImg,
        qty: 1
      }


      store.getState().finalPersistedReducer.user[0].cart.map((ele) => {
        if (ele.id == cartObj.id && activeColor == ele.color && activeSize == ele.size) {
          flag = false
          return;
        }
      })

      if (flag) {
        toast.success('Added to Cart', {
          autoClose: 1200
        })



        const response = await fetch('/api/updateUser', {
          method: 'PATCH',
          body: JSON.stringify({
            'type': 'addCart',
            'email': `${store.getState().finalPersistedReducer.user[0].email}`,
            'content': cartObj
          }),

          headers: {
            'Content-Type': 'application/json',
          },
        })

        dispatch(addUserCart(cartObj))   

      }

      else {
        toast.warning('Item already added..!', {
          autoClose: 1200
        })
      }


    }
  }

  const editReview = (e) => {

    if (e.target.value.length <= 300) {
      setReviewVal(e.target.value)
      reviewInpRef.current.childNodes[2].style.color = "white"
      setReviewLength(e.target.value.length)
    }
    else {
      reviewInpRef.current.childNodes[2].style.color = "red"
    }
  }



  const ratingStar = (val) => {



    for (let i = 0; i < 5; i++) {
      if (i <= val) {
        reviewInpRef.current.childNodes[3].childNodes[i].src = 'http://localhost:3000/starFill.png'

      }
      else {
        reviewInpRef.current.childNodes[3].childNodes[i].src = 'http://localhost:3000/starBlank.png'
      }
    }

    setRatringBool(true)
    setItemRating(val + 1)
  }

 

  const addReview = async () => {

    let ifOrdered=false;
    
    let thisOrder=store.getState().finalPersistedReducer.user[0].orders;
    thisOrder.map((order)=>{
        if(order.id==router.query.slug)
        {
          
          ifOrdered=true;
        }
    })



    

    if(ifOrdered==false)
    {
      toast.error("Order the item first",{
        autoClose:1200
      })

      return;
    }

    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }

    const allmonth = ["Jan", "Feb", "March", "April", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"];



    let longDate = date.addDays(0);
    let postDate = `${longDate.getDate() + " " + allmonth[longDate.getMonth()] + "," + longDate.getFullYear()}`



    if (ratingBool) {
      const UserReviewObj = {
        "id": router.query.slug,
        "title": ele.title,
        "brand": ele.brand,
        "img": activeImg,
        "review": reviewInpRef.current.childNodes[0].value,
        "rating": ItemRating,
        "date": postDate,
        'likes': [],
        'dislikes': []
      }

      if(UserReviewObj.review.trim().length>0)
      {
        const UserResponse = await fetch('/api/updateUser', {
          method: 'PATCH',
          body: JSON.stringify({
            "type": "addReview",
            'email': `${store.getState().finalPersistedReducer.user[0].email}`,
            'content': UserReviewObj
          }),
  
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
      

      const ProductReviewObj = {
        "id": store.getState().finalPersistedReducer.user[0]._id,
        "name": store.getState().finalPersistedReducer.user[0].fname,
        "img": store.getState().finalPersistedReducer.user[0].img,
        "review": reviewInpRef.current.childNodes[0].value.trim(),
        "rating": ItemRating,
        "date": postDate,
        'likes': [],
        'dislikes': []
      }

      
      const ProductResponse = await fetch('/api/updateProduct', {
        method: 'PATCH',
        body: JSON.stringify({
          "type": "addReview",
          "productId": ele._id,
          'content': ProductReviewObj
        }),

        headers: {
          'Content-Type': 'application/json',
        },
      })



      const ProdRatingResponse = await fetch('/api/updateProduct', {
        method: 'PATCH',
        body: JSON.stringify({
          "type": "addRating",
          "productId": ele._id,
          'content':ItemRating
        }),

        headers: {
          'Content-Type': 'application/json',
        },
      })

      toast.success('Review Addded',{
        autoClose:1200
      })

      router.reload()

    }


    else {
      toast.error('Please rate the item', {
        autoClose: 1200
      })
    }



   
  }


  if(loader)
    return(
     <Loading/>
    )
   
    else
  return (
    <>
      <Navbar search={false}></Navbar>
      <ToastContainer className={styles.toastContainer} />

      <div className={styles.itemPage}>
        <div className={styles.item}>

          <img src={activeImg} alt='Image is currently Unavailable' height={640} width={540}></img>
          <div className={styles.itemContent}>
            <h2>{ele.brand.toUpperCase()}</h2>
            {ele.col ?
              <h3>{ele.title.toUpperCase()}  {activeColor.toUpperCase()}</h3>
              :
              <h3>{ele.title.toUpperCase()}</h3>
            }
            
            <p>{ele.desc}</p>

            <ul className={styles.rating}>
              { prodRate>0 ? 
              <li>{finalRating}</li>:
              <li>3.0</li>}

              <img src='star.png' className={styles.img}></img>
              { 
               prodRate>0 ? 
              <li>{totalReview} Ratings</li>
              :
              <li>1 Rating</li>
              }
            </ul>

            
            <hr />  
            {
              ele.size.length != 0 ?
              
                <div className={styles.sizeCont} >
                  <h4>Select Size</h4>
                  <div className={styles.allSizes} ref={sizeRef}>
                    {ele.size.map((sizes) => {
                      return (
                        <p onClick={(e) => selectSize(e)}>{sizes.toUpperCase()}</p>
                      )
                    })}
                  </div>
                  <hr />
                </div>
                :
                <></>
            }
            
            {ele.color.length > 0 ?
              <div className={styles.colorCont}>
                <h4>Select Color (&nbsp; {activeColor.toUpperCase()} &nbsp;)</h4>

                <div className={styles.allColors} ref={colRef}>
                  {ele.color.map((col, idx) => {
                    return (

                      <p style={{ "backgroundColor": `${col}` }} onClick={() => selectCol(idx)} ></p>
                    )
                  })}
                </div>
                <hr />
              </div>
              : <></>
            }

           

            <ul className={styles.priceContainer}>
              <li>&#8377;{ele.price[0]}</li>
              <li>&#8377;{ele.price[1]}</li>

              <li>({Math.ceil(100 - (ele.price[0] / ele.price[1] * 100))} % OFF)</li>
            </ul>



            <div className={styles.btnCont}>
              <button onClick={() => AddCart()}>Add to Cart</button>
              <button onClick={() => AddWish()}> Wishlist</button>
              {/* <button><FiHeart></FiHeart></button> */}
            </div>
          </div>
        </div>
        <hr />
      </div>
      
    

      <div className={styles.reviewCont}>
        <h1>Reviews</h1>
       

        <div className={styles.reviewInput} ref={reviewInpRef}>
          <input type="text" placeholder='Add Review' value={reviewVal} onChange={(e) => editReview(e)} />
          <p>{reviewLength}/300</p>
          <p>Cant add more characters</p>
          <div className={styles.starContainer}>

            <img src="starBlank.png" alt="" height={14} width={14} onClick={() => ratingStar(0)} />
            <img src="starBlank.png" alt="" height={14} width={14} onClick={() => ratingStar(1)} />
            <img src="starBlank.png" alt="" height={14} width={14} onClick={() => ratingStar(2)} />
            <img src="starBlank.png" alt="" height={14} width={14} onClick={() => ratingStar(3)} />
            <img src="starBlank.png" alt="" height={14} width={14} onClick={() => ratingStar(4)} />
          </div>
          <button onClick={() => addReview()}>Add</button>
        </div>

   
        <section className={styles.reviewSection}>
          {ele.reviews.map((rev) => {
            
           
            let arr=[1,2,3,4,5];
            let ratePoint=rev.rating;

       if(rev.review)
       return(
            
            <aside className={styles.Onereview}>

              <div className={styles.reviewer}>
                <img src={rev.img} alt="" />
                <h4>{rev.name}</h4>
                <li>Posted on {rev.date}</li>
              </div>

              <div className={styles.starContainer}>

                {arr.map(()=>{
                  ratePoint--;
                  if(ratePoint>-1)
                  {
                    return(
                      <img src="starFill.png" alt="" height={16} width={16} />
                      
                    )
                    
                  }
                  else{
                    return(
                      <img src="starBlank.png" alt="" height={14.6} width={14.6} />

                    )
                  }

                
                })}

              </div>

              <p>{rev.review}</p>

              <div className={styles.reviewEmoji}>
                <img src="smile.png" alt="" />
                <img src="sad.png" alt="" />
              </div>

              <div className={styles.reviewEmojiTag}>
                <p>Helpful</p>
                <p>Not Helpful</p>
              </div>
            </aside>
          )
          })}


          {/* ****************************************** */}

        </section>

      </div>

      <Card ></Card>
    </>
  )
}


export async function getServerSideProps(context) {

  let ele = await Product.findById(context.query.slug)

  return {
    props: { ele: JSON.parse(JSON.stringify(ele)) }, // will be passed to the page component as props
  }
}




export default Item