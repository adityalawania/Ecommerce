import React, { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import Router, { useRouter } from 'next/router'
import Link from 'next/link';

function TracingNavbar({id}) {
    const router=useRouter();
    
    const navigate =(path,currId)=>{
        console.log(router.query.slug)
    
        if(id>currId){

            router.push({
                pathname: `/${path}`,
                query:{
                    slug:router.query.slug
                }
    
            })
        }

    }
  
    return (
        <>
        <div className={styles.tracingBox}>
      

            <div onClick={()=>navigate('cart',1)} className={styles.tracePage}><span>1</span></div>
            <div onClick={()=>navigate('address',2)} className={router.pathname == '/payment' || router.pathname == '/checkout' ? styles.tracePage : ""}><span>2</span></div>
            <div onClick={()=>navigate('payment',3)}  className={ router.pathname == '/checkout'  ? styles.tracePage : ""}>
                <span>3</span>  
               
              
            </div>
            <div onClick={()=>navigate('checkout',4)} className={router.pathname == '/checkout'  ? styles.tracePage : ""}><span>4</span></div>
        </div>

        <div className={styles.tracingNavbar}>
            <span>Shop</span>
            <span>Detail</span>
            <span>Payment</span>
            <span>Checkout</span>
        </div>
        </>
    )
}

export default TracingNavbar