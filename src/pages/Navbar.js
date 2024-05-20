import React, { use, useState ,useRef } from 'react'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingCart, FiHeart, FiUser } from "react-icons/fi";

import { useRouter } from 'next/router'
import Wish from './wish'

import { login, logout } from './store/slices/loginSlice'
import { removeUser } from './store/slices/userSlice'
import { useDispatch } from 'react-redux'
import store from './store'
import { searchIn,searchOut } from './store/slices/searchSlice'
import {  useSession ,signIn,signOut} from 'next-auth/react'
import { searchclick } from './card'
import addUser from './api/addUser'

//***************  DB  **************** */
require('../models/User')
import User from '@/models/User';

require('../middleware/mongoose')
import mongoose from 'mongoose'
//***************  DB  **************** */





export default function Navbar(response) {


  const[state,setState]=useState(10);
  const [plural,setPlural]=useState(null)


  

  const dispatch=useDispatch()
 
const session=useSession()

 const myRef=useRef(null);
 let wishSwitch=useRef(null);
 const active=useRef(null);
 const navIconControl=useRef(null);

 const router=useRouter();


//   // const reRender=()=>{
   
//   //   setState(prev=>{
//   //     return {...prev}
//   //   })
   
//   }

  // reRender()

  if(session.data!=null)
  {
    dispatch(login())

  }
  // else{
  //   dispatch(logout())
  // }

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
if(store.getState().finalPersistedReducer.status[0]=='active')
{
 
  


 

  if(icon=='user')
{

    // dispatch(logout())
    // dispatch(removeUser())

    // signOut({ callbackUrl: 'http://localhost:3000' })

 
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
    if(navIconControl.current.childNodes[i].style.color=="purple")
    navIconControl.current.childNodes[i].style.color="black";

    else
    navIconControl.current.childNodes[i].style.color="purple";
  }
    else
    navIconControl.current.childNodes[i].style.color="black"
  }
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
      active.current.childNodes[i].style.color="purple"
    }
    else{
      active.current.childNodes[i].style.color="black"

    }
  }

 }

const searchkeyDown=(e)=>{
if(e.key=="Enter")
{
// searchclick();
}
}

const SubmitIt=(e)=>{
  e.preventDefault()

}



 const searchclick =(e)=>{

  e.preventDefault();
  
  let searchObj={
    title:"",
    brand:"",
    color:"",
    gender:"",
    category:"",
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
        if(searchList[i].charAt(searchList[i].length-1).toLowerCase( )=="s")
        {
          searchList[i]=searchList[i].slice(0,searchList[i].length-1);

        }
        searchObj.color=searchList[i].toLowerCase()
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

          searchObj.category=searchList[i].toLowerCase()
          continue;
        }

        searchObj.title=searchList[i].toLowerCase();
      
    }    
   }

   dispatch(searchIn(searchObj))     


  //  router.reload()
 

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
  let cat=["tshirt","pant","shirt","jeans","jacket","hoodie","accessory","accessories","top","kutra","kurti","pajama","pajami","traditional","shoes","sneakers","beauty","foootwear","lower","shorts","sweater","watch","watches"];

  for(let i=0;i<cat.length;i++)
  {
    if(cat[i]==x.toLowerCase())
    return true;
  }

  return false;
}


  
  return (
    <>
    <div className={styles.navContainer} >
      <Link  href={'/'}><Image id={styles.logo} src={'/30b2d015e904407aae937a4794ae064b.png'} width={80} height={55} alt='Image unavailable'></Image></Link>
      
      <ul ref={active} className={styles.navbar}>
        <li className={router.pathname =='/kids' ? styles.active : ""}><Link href={'/kids'}>Kids</Link></li>
        <li className={router.pathname=='/men' ? styles.active : ""}><Link href={'/men'}>Men</Link></li>
        <li className={router.pathname=='/women' ? styles.active : ""} onClick={()=>filterItem('Women')}><Link href={'/women'}>Women</Link></li>
        <li className={router.pathname=='/beauty' ? styles.active : ""} onClick={()=>filterItem('Beauty')}><Link href={'/beauty'}>Beauty</Link></li>
        <li className={router.pathname=='/homeliving' ? styles.active : ""} onClick={()=>filterItem('Home & Living')}><Link href={'/homeliving'}>Home & Living</Link></li>
        
      </ul>
      <form ref={myRef} onSubmit={(e)=>SubmitIt(e)}>
        <input type={'search'} onChange={(e)=>searchclick(e)} placeholder='Search Here' id='searched' className={styles.searchBar} onKeyDown={(e)=>searchkeyDown(e)}/>
        {/* <button  className={styles.searchbutton}  onClick={(e) => searchclick(e)}>Search</button> */}
        </form>

      <ul className={styles.navIcons} ref={navIconControl}>
      { router.pathname=='/cart' ? 
        <li id='cart' className={styles.cartIcon} onClick={() =>navIcon('cart')}><img src='shopping-cart.png'></img></li>
:
    
        <li id='cart' className={styles.cartIcon} onClick={() =>navIcon('cart')}><img src='shopping-cart2.png'></img></li> }
       
          <li id='heart' className={styles.heartIcon}  onClick={() => navIcon('heart')}><img src='heart.png'></img></li>
         {  store.getState().finalPersistedReducer.status[0]=='inactive' ?
           <Link href={'./login'}> <button className={`${styles.searchbutton} ${styles.navLogin}`}>Login</button></Link>
        
          :<li id='user' className={styles.userIcon} onClick={() => navIcon('user')} ><FiUser /></li>
  }
        
  
      </ul>
    </div>



    </>
  )
}

