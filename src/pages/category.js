import React, { useEffect,useState } from 'react'
import categoryArray from './categoryArray'
import styles from '../styles/Home.module.css'
import { useDispatch } from 'react-redux'
import { addCategory,removeCategory } from './store/slices/categorySlice'

function Category() {

  const dispatch=useDispatch();

  const[state,setState]=useState(10);

  const reRender=()=>{
   
    setState(prev=>{
      return {...prev}
    })
   
  }

const chooseCategory=(name)=>{
dispatch(removeCategory())
dispatch(addCategory(name))
reRender();
}

useEffect(()=>{
  console.log("re renderd")
})

    
    return (
        <>
    
 
    
          <div className={styles.categoryContainer}>
            {categoryArray.map((ele,ind) => {
              return (
                <>
                        <div onClick={()=>chooseCategory(ele.name)}>
                            <img src={ele.img} alt="" />
                        <p>{ele.name}</p>

                        </div>
                </>
              )
    
            })}
          </div>
    
     
        </>
      )
}

export default Category