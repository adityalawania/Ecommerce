import React, { useEffect, useReducer, useRef,useState } from 'react'
import Navbar from './Navbar'
import Card from './card'
import allProductData from './data'
import Product from '@/models/Product'
import brandArray from './brandData'

function Living({j}) {
  const [data,setdata] = useState(allProductData)
  const searchRef=useRef(null);
  
  while(brandArray.length>0)
  {
    brandArray.pop()
  }
  
  j.map((item)=>{
    if(!brandArray.includes(item.brand.toLowerCase()) && item.brand.length>0)
    brandArray.push(item.brand.toLowerCase())
  })



  return (
    <>
    <Navbar></Navbar>
    <Card  response={j}></Card>
    </>
  )
}

export async function getServerSideProps(context) {
    
  let j=await Product.find({ $or: [ { category: "Home and Living" }, { category:"Home & Living" } ] } )
  

  return {
   props: {j:JSON.parse(JSON.stringify(j))}, // will be passed to the page component as props
  }
}

export default Living