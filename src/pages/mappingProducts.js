import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { FiHeart } from "react-icons/fi";
import { BiSort,BiFilterAlt } from "react-icons/bi";
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




const wishlistArray=[];

function Card({ data }) {
data.map((ele)=>{
  console.log("gello",ele.title)
})

  // const [expand,setExpand]=React.useState(true);

  // useEffect(()=>{
  //   setExpand(localStorage.getItem(EXPAND_STORAGE_KEY)==='1');
  // },[])

  const ref=useRef();

  
   
  const addToWish=(title,brand,img)=>{

      
    wishlistArray.push({title,brand,img});

    toast.success(`${title} added `,{
      autoClose: 1000
    })
      // console.log(wishlistArray)
      console.log(store.getState())
      
  }
 
  return (
    <>
    {/* <p>loremsdfgdshboajbgjoab</p> */}
    <ToastContainer className={styles.toastContainer}
    limit={2}/>
<Category></Category>
 

<section className={styles.cardWithfilter}>
<Filter></Filter> 

      <div id={styles.CardContainer}>
      
         {data.map((curEle,ind)=> {
          

          return (
          <>
            

              <div className={styles.Card} key={curEle._id} >

              <Link href={{
                           pathname: '/item',
                           query:{slug:curEle._id},
                           
               }}>


                <img className={styles.img} src={curEle.img} height={220} width={230}></img>
                <div className={styles.CardContent}>
                  <p id={styles.title} >{curEle.brand}</p>
                  <p>{curEle.title}</p>

                  <span className={styles.price}>&#8377;{curEle.price[0]}</span>
                  <span className={styles.priceCut}>&#8377;{curEle.price[1]}</span>
                 

                </div>
              </Link>

                  <div className={styles.CardWish}  onClick={()=>addToWish(curEle.title,curEle.brand,curEle.img)}>
                    <FiHeart className={styles.wishIcon} />
                  </div>  

              </div>
              

            </>
          )

        })} 
      </div>
</section>
  </>
  )
}





export default Card
export { wishlistArray }