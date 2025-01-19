import React, { useEffect, useReducer, useRef,useState } from 'react'
import Navbar from './Navbar'
import Card from './card'
import allProductData from '../datas/data'
import Product from '@/models/Product'
import brandArray from '@/datas/brandArray'
import Loading from './loading'
import { useRouter } from 'next/router'

function Men({j}) {
  const [data,setdata] = useState(allProductData);
  const [loader,setLoader] = useState(true)

  const searchRef=useRef(null);
  const router = useRouter()

  useEffect(()=>{
    setTimeout(() => {
      setLoader(false)
      
    }, 2000);
  },[])

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
    <Navbar search={true}></Navbar>
    <Card  response={j}></Card>
    </>
  )
}

export async function getServerSideProps(context) {
    
  let j=await Product.find({ $or: [ { gender: "Men" }, { gender:"Mens" }, { gender:"Male" } ] })
  

  return {
   props: {j:JSON.parse(JSON.stringify(j))}, // will be passed to the page component as props
  }
}

export default Men