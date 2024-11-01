import React, { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import Router, { useRouter } from 'next/router'
import Link from 'next/link';

function TracingNavbar() {
    const router=useRouter();
  
    return (
        <>
        <div className={styles.tracingBox}>
      

            <div className={styles.tracePage}><span>1</span></div>
            <div className={router.pathname == '/payment' || router.pathname == '/checkout' ? styles.tracePage : ""}><span>2</span></div>
            <div  className={ router.pathname == '/checkout'  ? styles.tracePage : ""}>
                <span>3</span>  
               
              
            </div>
            <div className={router.pathname == '/checkout'  ? styles.tracePage : ""}><span>4</span></div>
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