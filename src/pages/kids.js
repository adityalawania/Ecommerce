import React, { useEffect, useRef,useState } from 'react'
import Navbar from './Navbar'
import Card from './card'
import Product from '@/models/Product'
import allProductData from '../datas/data'
import brandArray from '@/datas/brandArray'
import Loading from './loading'


function Kids({j}) {

  const activeRef=useRef();
  const [loader,setLoader] = useState(true);
  // const fref = React.forwardRef();

  while(brandArray.length>0)
  {
    brandArray.pop()
  }

  j.map((item)=>{
    if(!brandArray.includes(item.brand.toLowerCase()) && item.brand.length>0)
    brandArray.push(item.brand.toLowerCase())
  })


  useEffect(()=>{
    setTimeout(() => {
      setLoader(false)
      
    }, 2000);
  },[])

  if(loader)
    return(
     <Loading/>
    )
   
    else
  return (
    <> 
    {/*  i removed refs from men , kids , homeliving !! */}
    <Navbar></Navbar>
   
    <Card response={j}></Card>
    </>
  )
}

export async function getServerSideProps(context) {
    
  let j=await Product.find({gender:"Kids"})

  return {
   props: {j:JSON.parse(JSON.stringify(j))}, // will be passed to the page component as props
  }
}


export default Kids