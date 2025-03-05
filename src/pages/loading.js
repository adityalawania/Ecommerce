import React from 'react'
import styles from '../styles/Home.module.css'

function Loading() {
  return (
    <div className={styles.loaderParent}>
    {/* <div className={styles.loader}/> */}
    <img className={styles.loader} src='/logo.png'/>
    </div>
  )
}

export default Loading