import React, { createContext, forwardRef, useEffect, useRef,useState } from 'react'
import styles from '../styles/Home.module.css'
import { useDispatch } from 'react-redux'
import { addBrand, removeBrand } from '../store/slices/brandSlice'
import { addPriceFilter, removePriceFilter } from '../store/slices/priceSlice'
import { addRating, removeRating } from '../store/slices/ratingSlice'
import { ToastContainer, toast } from 'react-toastify'
import store from '@/store'
import { useRouter } from 'next/router'
import brandArray from '@/datas/brandArray'
import { RxCross1 } from "react-icons/rx";



function Filter(props, ref) {


  let sortedBrand = brandArray.sort();
  let index=0;

  const dispatch = useDispatch();
  const router = useRouter()

  const [minValue, setMinValue] = useState(5000)
  const [maxValue, setMaxValue] = useState(5000)

  const minRef = useRef(null)
  const maxRef = useRef(null)
  const brandRef = useRef(null);
  const allbrandRef=useRef(null)
  const allbrandContRef=useRef(null)

  const filterRef = useRef()

  const [state, setState] = useState(10);
  
  const reRender = () => {

    setState(prev => {
      return { ...prev }
    })

  }








  const priceFilter = () => {


    if (!minValue || !maxValue) {
      dispatch(removePriceFilter())  
    }

    else if (minValue < 0 || maxValue < 1) {
      console.log(minValue, maxValue)
      toast.error(`Invalid Price Filter`, {
        autoClose: 1200
      })


    }

    else {

      dispatch(removePriceFilter()) 
      dispatch(addPriceFilter([minValue, maxValue])) 

      reRender();

    }


  }

  const setrating = (x) => {

    dispatch(removeRating())       
    dispatch(addRating(x))    

    reRender();
  }

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
 





  const brandSelection = (i) => {
    i = i + 1

    if (brandRef.current.children[i - 1].childNodes[1].checked == true) {

      dispatch(addBrand(brandRef.current.children[i - 1].childNodes[1].value))  
      allbrandRef.current.children[i-2].children[0].children[0].checked=true
    }

    else{
      allbrandRef.current.children[i-2].children[0].children[0].checked=false

      dispatch(removeBrand(brandRef.current.children[i - 1].childNodes[1].value))  
    }

    reRender();
  }

  const allBrandSelection=()=>{
    console.log(allbrandRef.current.childNodes)
    let limit=allbrandRef.current.childNodes;
   
    for(let j=0;j<limit.length;j++)
    {
      if(limit[j].children[0].tagName=='LI' && limit[j].children[0].children[0].checked==true)
      {
          dispatch(addBrand(limit[j].children[0].children[0].value)) 
          if(j<6){
            brandRef.current.children[j+1].children[0].checked=true;
          }
          
      }
      else if(limit[j].children[0].tagName=='LI' ){
          dispatch(removeBrand(limit[j].children[0].children[0].value)) 
          if(j<6){
            brandRef.current.children[j+1].children[0].checked=false;
          }

      }
      else{
        console.log(limit[j].tagName)
      }

   
    }
    
    // console.log(limit)
  
    
  
  
  }

  const closeBrandCont=(type)=>{
  
      allbrandContRef.current.style.display=type

  }






  return (
    <>
      <div className={styles.filterContainer} ref={ref}>

        <div id='brandFilter' className={styles.filter}>
          <ul ref={brandRef}>
            <h3>BRAND</h3>
            {brandArray.map((brand, i) => {


              if (i < 6)
                return (
                    
                  <li key={i} > <input type='checkbox' name='check' value={brand.toUpperCase()} onClick={() => brandSelection(i + 1)} />{brand.toUpperCase()}</li>
                 
                )
            })}
           { brandArray.length>6 ? <p onClick={()=>closeBrandCont("block")}>+{brandArray.length-6} more</p> :<></>}
          </ul>
        
        </div>

        <div id='priceFilter' className={styles.filter}>
          <ul >
            <h3>PRICE</h3>
            <button onClick={priceFilter}>Save</button>
            <div className={styles.minInp}>
              <li>Min  <span></span>  </li>
              <input type='tel' ref={minRef} onChange={(e) => setMinValue(e.target.value)} />
            </div>

            <div className={styles.maxInp}>
              <li>Max <span></span></li>
              <input type='tel' ref={maxRef} onChange={(e) => setMaxValue(e.target.value)} />
            </div>
          </ul>
          
        </div>



        <div id='ratingFilter' className={styles.filter}>
          <ul>
            <h3>RATING</h3>


            <li> <input type='radio' name='rating' onChange={() => setrating(1.5)} />  &gt;1.5</li>
            <li> <input type='radio' name='rating' onChange={() => setrating(2.5)} />  &gt;2.5</li>
            <li> <input type='radio' name='rating' onChange={() => setrating(3.5)} />  &gt;3.5</li>
            <li> <input type='radio' name='rating' onChange={() => setrating(4.5)} />  &gt;4.5</li>
          </ul>
        </div>

        <div className={styles.allBrandContainer} ref={allbrandContRef}>
        <RxCross1 className={styles.allBrandClose} onClick={()=>closeBrandCont("none")}/>
        <div ref={allbrandRef}>
          {brandArray.map((brand,i) => {
            let letter=brand.charAt(0)
          
            return (
                <div>
                <li> <input type='checkbox' value={brand} onClick={() => allBrandSelection()} />{brand.toUpperCase()}</li>
                </div>
              
              )
          })}

        </div>
      </div>

      </div>

     
    </>

  )

}

export default forwardRef(Filter)


