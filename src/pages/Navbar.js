import React, { use, useState ,useRef } from 'react'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingCart, FiHeart, FiUser } from "react-icons/fi";

import { useRouter } from 'next/router'
import Wish from './wish'

import { login, logout } from '../store/slices/loginSlice'
import { removeUser } from '../store/slices/userSlice'
import { useDispatch } from 'react-redux'
import store from '../store'
import { searchIn,searchOut } from '../store/slices/searchSlice'
import {  useSession ,signIn,signOut} from 'next-auth/react'
import { outerFunction, searchclick } from './card'
import addUser from './api/addUser'

//***************  DB  **************** */
require('../models/User')
import User from '@/models/User';

require('../middleware/mongoose')
import mongoose from 'mongoose'
import Loading from './loading'
import { toast, ToastContainer } from 'react-toastify'
//***************  DB  **************** */




export default function Navbar(props) {


  const[state,setState]=useState(10);
  const [plural,setPlural]=useState(null);
  const [loading,setloading]=useState(false);

  let isSearch = props.search

  

  const dispatch=useDispatch()
 
const session=useSession()

 const myRef=useRef(null);
 let wishSwitch=useRef(null);
 const active=useRef(null);
 const navIconControl=useRef(null);

 const router=useRouter();



  if(session.data!=null)
  {
    dispatch(login())

  }

  useEffect(() => {
              const handleRouteError = (err, url) => {
                console.error("Route change failed:", err);
                toast.error("Failed to load the page. Please try again.",{
                  autoClose:1200
                })
             
              };
          
              router.events.on("routeChangeError", handleRouteError);
          
              // Cleanup the event listener when the component unmounts
              return () => {
                router.events.off("routeChangeError", handleRouteError);
              };
            }, [router.events]);

  // ************************************* ERROR **************************

  useEffect(()=>{
     const reRender=()=>{
   
    setState(prev=>{
       return {...prev}
  })
   
   }

   reRender()
  },[store.getState().finalPersistedReducer.search])
 

 const navIcon=(icon)=>{

  if(icon=='kids'){
    router.push({pathname:'/kids'})
  }

  else if(icon=='men'){
    router.push({pathname:'/men'})

  }

  else if(icon=='women'){
    router.push({pathname:'/women'})

  }

  else if(icon=='beauty'){
    router.push({pathname:'/beauty'})

  }


  else if(icon=='homeliving'){
    router.push({pathname:'/homeliving'})

  }

else if(store.getState().finalPersistedReducer.status[0]=='active')
{
 
  setloading(true);
  setTimeout(() => {
    setloading(false);
  }, 2000);


 console.log("navIcon")

  if(icon=='user')
{

  router.push({ 
    pathname:'/profile',
    query:{
      
      slug:store.getState().finalPersistedReducer.user[0]._id
    }
   })

  }

  if(icon=='cart')
  {
    router.push({
      pathname:'/cart',
      query:{
        slug:store.getState().finalPersistedReducer.user[0]._id   } })
  }
  if(icon=='heart')
  {

   router.push({
    pathname:'/wish',
    query:{
      slug:store.getState().finalPersistedReducer.user[0]._id
    }
   })
  }

  for(let i=0;i<3;i++)
  {
  if(navIconControl.current.childNodes[i].id==icon)
  {
    if(navIconControl.current.childNodes[i].style.color=="rgb(96, 33, 242)")
    navIconControl.current.childNodes[i].style.color="black";

    else
    navIconControl.current.childNodes[i].style.color="rgb(96, 33, 242)";
  }
    else
    navIconControl.current.childNodes[i].style.color="black"
  }

  return <Loading/>
}



else{
router.push('/login')
}
 
} 

 const filterItem=(type)=>{

  for(let i=0;i<5;i++)
  {
    if(active.current.childNodes[i].innerHTML==type)
    {
      active.current.childNodes[i].style.color="rgb(96, 33, 242)"
    }
    else{
      active.current.childNodes[i].style.color="black"

    }
  }

  setloading(true);
  setTimeout(() => {
    setloading(false);
  }, 2000);

 }

const searchkeyDown=(e)=>{
if(e.key=="Enter")
{
// searchclick();
}
}

const SubmitIt=(e)=>{
  e.preventDefault()
  console.log("ok")
  
}



 const searchclick =(e)=>{



  e.preventDefault();

  
  let searchObj={
    title:[],
    brand:"",
    color:[],
    gender:"",
    category:[],
  }

   let toSerach=myRef.current.childNodes[0].value
   let searchList=[];

   dispatch(searchOut())

   if(toSerach.trim()!="")
   {
    //  dispatch(searchIn(toSerach.split(" ")))
    toSerach.trim();
    searchList=toSerach.split(" ");
    for(let i=0;i<searchList.length;i++)
    {

      if(searchList[i].toLowerCase()=="for" || searchList[i].toLowerCase()=="of"){
        continue
      }

      if(isColor(searchList[i])){
        if(searchList[i].charAt(searchList[i].length-1).toLowerCase( )=="s")  // converting blacks to black (excluding last s char)
        {
          searchList[i]=searchList[i].slice(0,searchList[i].length-1);

        }
        searchObj.color.push(searchList[i].toLowerCase());
        continue;
      }
      
        let gen=isGender(searchList[i])
        if(gen.length>0)
        {
          searchObj.gender=searchList[i].toLowerCase()
          continue;
        }
       
        if(isCategory(searchList[i]))
        {
          if(searchList[i]!="jeans" && searchList[i].charAt(searchList[i].length-1).toLowerCase( )=="s" )
          {
          searchList[i]=searchList[i].slice(0,searchList[i].length-1);
            
          }

          searchObj.category.push(searchList[i].toLowerCase())
          continue;
        }
        
        let mytitle = searchList[i].toLowerCase().trim();
        searchObj.title.push(mytitle)
        // searchObj.title=searchObj.title.trim()
      
    }    
   }

   dispatch(searchIn(searchObj))     


  //  router.reload()
 outerFunction()

}

const isColor=(x)=>{
  let color=["red","blue","pink","green","white","black","yellow","purple","orange","cream","beige","brown","gray","grey","maroon","voilet","indigo","silver","gold","olive","cyan","lime","burgundy","carcoal","tan","lavender","peach"]

  let flag=false;

  for(let i=0;i<color.length;i++)
  {
    if(color[i]==x.toLowerCase())
    {
      flag=true;
      break;
    }
  }

  if(flag)
  return true;

  else
  return false;
}

const isGender=(x)=>{
  x=x.toLowerCase();
  if(x=="male" || x=="men" || x=="man" || x=="gentlemen" || x=="mens" || x=="mans" || x=="boys" || x=="boy")
  {
  
    return "male";
  }


  if(x=="girls" || x=="female" || x=="women"  || x=="lady" || x=="girl")
  {
    return "female"
  }

  if(x=="kids" || x=="kid" || x=="child")
  {
    return "kids"
  }

  return ""
}

const isCategory=(x)=>{
  let cat=["tshirt","pant","shirt","jeans","kurti","salvar","salwar","kurta","jacket","hoodie","accessory","accessories","top","kutra","kurti","pajama","pajami","traditional","shoes","sneakers","beauty","foootwear","lower","shorts","sweater","watch","watches"];

  for(let i=0;i<cat.length;i++)
  {
    if(cat[i]==x.toLowerCase())
    return true;
  }

  return false;
}

  if(loading) return <Loading/>


  return (
    <>
    <div className={styles.navContainer} >
    <ToastContainer className={styles.toastContainer} />
      <Link  href={'/'}><Image id={styles.logo} src={'/30b2d015e904407aae937a4794ae064b.png'} width={80} height={55} alt='Image unavailable'></Image></Link>
      
      <ul ref={active} className={styles.navbar}>
        <li className={router.pathname =='/kids' ? styles.active : ""} onClick={()=>navIcon('kids')}>Kids</li>
        <li className={router.pathname=='/men' ? styles.active : ""} onClick={()=>navIcon('men')}>Men</li>
        <li className={router.pathname=='/women' ? styles.active : ""} onClick={()=>navIcon('women')}>Women</li>
        <li className={router.pathname=='/beauty' ? styles.active : ""} onClick={()=>navIcon('beauty')}>Beauty</li>
        <li className={router.pathname=='/homeliving' ? styles.active : ""} onClick={()=>navIcon('homeliving')}>Home & Living</li>
        
      </ul>
      
      {
        isSearch ?
      <form ref={myRef} onSubmit={(e)=>SubmitIt(e)}>
        <input type={'search'} onChange={(e)=>searchclick(e)} placeholder='Search Here' id='searched' className={styles.searchBar} onKeyDown={(e)=>searchkeyDown(e)}/>
       
        </form>
        
         : <></>
      }

      <ul className={styles.navIcons} ref={navIconControl}>
      { router.pathname=='/cart' ? 
        <li id='cart' className={styles.cartIcon} onClick={() =>navIcon('cart')}><img src='shopping-cart.png'></img></li>
:
    
        <li id='cart' className={styles.cartIcon} onClick={() =>navIcon('cart')}><img src='shopping-cart2.png'></img></li> }
       
          <li id='heart' className={styles.heartIcon}  onClick={() => navIcon('heart')}><img src='heart.png'></img></li>
         {  store.getState().finalPersistedReducer.status[0]=='inactive' || store.getState().finalPersistedReducer.user.length==0 ?
           <Link href={'./login'}> <button className={`${styles.searchbutton} ${styles.navLogin}`}>Login</button></Link>
        
          :<li id='user' className={styles.userIcon} onClick={() => navIcon('user')} ><FiUser /></li>
  }
        
  
      </ul>
    </div>



    </>
  )
}

