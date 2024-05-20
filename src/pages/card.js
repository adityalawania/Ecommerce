import React, { useDebugValue, useEffect, useRef, useState} from 'react'
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
import store from './store';
import allProductData from './data';
import dynamic from 'next/dynamic';
import Product from "@/models/Product"
import connectDB from "@/middleware/mongoose"
import mongoose from 'mongoose';
import { BsFillClipboard2MinusFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { ImEqualizer} from "react-icons/im";
import { searchIn, searchOut } from './store/slices/searchSlice';
import { useDispatch } from 'react-redux'
import { addUserWish,removeUserWish } from './store/slices/userSlice';
import addUser from './api/addUser';





const wishlistArray = [];

function Card({ response }) {

  
  const router = useRouter();
  const dispatch=useDispatch()
  const filterRef=useRef()
  const cardContRef=useRef()
const date=new Date();


  const[state,setState]=useState(10);
  const[result,setResult]=useState(response);
  const[finalResult,setFinalResult]=useState(result)


  const reRender=()=>{
   
    

    setState(prev=>{
      return {...prev}
    })
   
  }


  // **************************************************

 
// window.onscroll(()=>console.log('hello'))

React.useEffect(() => {
 
window.addEventListener('scroll',scrollFunction)

}, []);

function scrollFunction() {
  
  if (document.body.scrollTop > 140 || document.documentElement.scrollTop > 120) {
    try
    {

      // document.getElementsByClassName('filterinCard').style.position="fixed"
      // document.getElementsByClassName('filterinCard').style.top="60px"
      // document.getElementById('CardContainer').style.bottom="20px"

      filterRef.current.style.position="fixed";
      filterRef.current.style.top="60px";
      cardContRef.current.style.bottom="20px"
      filterRef.current.childNodes[3].style.display="none"
      
    }
    catch(err)
    {
      // console.log(err)
    }


  } else {
    try{

      filterRef.current.style.position="relative";
      filterRef.current.style.top="0px";
      cardContRef.current.style.bottom="737px"
     
    }
    catch(err)
    {
      // console.log(err)
    }

  }
}

  //**************************************************** */


  const addToWish = async(iden,amount,name, company, picture,rate) => {

    if(store.getState().finalPersistedReducer.status[0]=='inactive')
    {
      router.push('/login')
      return;
    }
    
    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
  }
  
  const allmonth = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


  
  let longDate=date.addDays(0);
  let wishDate=`${longDate.getDate()+" "+allmonth[longDate.getMonth()]+","+longDate.getFullYear()}`


    let wishObj={
      id:iden,
      img:picture,
      title:name,
      brand:company,
      price:amount,
      date:wishDate,
      rating:rate
    }

    let reduxWish=store.getState().finalPersistedReducer.user[0].wish;
    let bool=true;
    reduxWish.map((thing)=>{
      if(thing==iden)
      {
        bool=false;
        toast.warn('Item already added',{
          autoClose:1200
        })
      }
    })

    if(bool)
    {
      const response=await fetch('/api/updateUser',{
        method:'PATCH',
        body:JSON.stringify({
          'type':'addWish',
          'email':`${store.getState().finalPersistedReducer.user[0].email}`,
          'content':wishObj
        }),
  
        headers:{
          'Content-Type':  'application/json',
         },
      })
  
      dispatch(addUserWish(iden)) 
  
      toast.success(`${name} added `, {
        autoClose: 1000
      })
  
    }
    

  }

  const applyFilter=()=>{
    
    let a=store.getState();
    setResult(response)
 
    // console.log("started again ",result,response)
    if(a.allbrands.length==0 && a.filterPrice.length==0 && a.filterRating.length==0)
    {
      // console.log("No filter")
    }
    else{
      let newResponse;
      
      if(a.allbrands.length>0){

        // console.log("enterd brand filter")
        // console.log(result," is the result")
        newResponse= response.filter(BrandfilteringFunction)
        setResult(newResponse)
  
        if(a.filterPrice.length>0)
        {
          newResponse=response.filter(PricefilteringFunction)
          setResult(newResponse)
  
        }
        
      }
      
      else if(a.filterPrice.length>0)
      {
        newResponse=response.filter(PricefilteringFunction)
        setResult(newResponse)
        
      }
      else{
        // console.log("clraingvb brsnd")
        setResult(response)
      }

     reRender();
    }

    setFinalResult(result);

  }

  const BrandfilteringFunction =(ele)=>{

    let f=false;
    let a=store.getState();
   a.allbrands.map((inp)=>{
      if(ele.brand.toLowerCase()==inp.toLowerCase())
     {
      f=true;
      return
     }
    })

    if(f==true)
    return ele

  }

  const PricefilteringFunction =(ele)=>{
    
 
    let a=store.getState().filterPrice;
   
      if(ele.price[0]>=a[0][0] && ele.price[0]<=a[0][1])
     {
   
      return ele
     }
    
  }

  const searchclick=()=>{
  

    let searchState=store.getState().finalPersistedReducer.search;
    // console.log(searchState)
    if(searchState.length>0)
    {
      let newResponse=response.filter(searchFilterColor)

      setResult(newResponse)
      newResponse=newResponse.filter(searchFilterGender)
      setResult(newResponse)
      newResponse=newResponse.filter(searchFilterCategory)
      setResult(newResponse)
      if(newResponse.length==13 && searchState[0].title)
     {
      toast.warning(`No Such results`,{
        autoClose:1200
      })
     }
      

    }
    // dispatch(searchOut())
  }



  const searchFilterColor=(ele)=>{
    
    let searchState=store.getState().finalPersistedReducer.search[0];
    let flag=false;
    if(searchState.color!="")
    {
      for(let i=0;i<ele.color.length;i++)
      {
        if(ele.color[i].toLowerCase()==searchState.color)
        {
          flag =true;
          break;
        }
      }
       if(flag)
        return ele;

    }

    else
      return ele;
    
   
  }

  const searchFilterGender=(ele)=>{

    let searchState=store.getState().finalPersistedReducer.search[0];
    let f=false;
    if(searchState.gender!="")
    {
      // console.log(ele.gender.toLowerCase())
       if(ele.gender.toLowerCase()==searchState.gender)
       {
        // console.log(ele.gender.toLowerCase())
        return ele;
       } 
    }


    else
    return ele

  }

  const searchFilterCategory=(ele)=>{
    let searchState=store.getState().finalPersistedReducer.search[0];
    let f=false;
    //*************** MAP ______________________________________________ */
    if(searchState.category!="")
    {
      // console.log(ele.gender.toLowerCase())
       if(ele.category.toLowerCase()==searchState.category)
       {
        // console.log(ele.category.toLowerCase())
        return ele;
       } 
    }


    else
    return ele
  }


 
  if (result) {

    return (
      <>


        <ToastContainer className={styles.toastContainer}
          limit={2} />
        {/* <Category></Category> */}

      <button className={styles.mySearchbtn} onClick={(e) => searchclick(e)}>Search</button>
        <section className={styles.cardWithfilter}>
          
            <h5>Only one filter will work at a time</h5>
          <div className={styles.filterHead}>
            <span>Filters</span>
            <ImEqualizer className={styles.filterHeadIcon}/>
            <button onClick={()=>applyFilter()}>Apply</button>
          
          </div>
          <Filter ref={filterRef} className={styles.filterinCard}></Filter>

  
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

                  <div className={styles.CardWish} onClick={() => addToWish(result[i]._id,result[i].price[0],result[i].title, result[i].brand, result[i].img[0],result[i].rating ? result[i].rating : 4.5)}>
                    <FiHeart className={styles.wishIcon} />
                  
                  </div>
                </div>

              )
            })}

          </div>
        </section>
      </>
    )

  }




}




export default Card
export { wishlistArray }
