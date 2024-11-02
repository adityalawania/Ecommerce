import React, { useEffect, useRef,useState } from 'react'
import Navbar from './Navbar'
import Card from './card'
import Product from '@/models/Product'
import brandArray from '@/datas/brandArray'
import Loading from './loading'

function Women({j}) {

  const [loader,setLoader] = useState(true)

  useEffect(()=>{
    setTimeout(() => {
      setLoader(false)
      
    }, 2000);
  },[])

  while(brandArray.length>0)
  {
    brandArray.pop()
  }

  j.map((item)=>{
    if(!brandArray.includes(item.brand.toLowerCase()) && item.brand.length>0)
    brandArray.push(item.brand.toLowerCase())
  })

  if(loader)
    return(
     <Loading/>
    )
   
  else
  return (
    <>
    <Navbar></Navbar>
    <Card response={j}></Card>
    </>
  )
}

export async function getServerSideProps(context) {
    
  let j=await Product.find({ $or: [ { gender: "Women" }, { gender:"Womens" }, { gender:"Female" } ] })

  return {
   props: {j:JSON.parse(JSON.stringify(j))}, // will be passed to the page component as props
  }
}


export default Women