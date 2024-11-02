import React, { StrictMode, useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import Router, { useRouter } from 'next/router'
import { GrAdd, GrSubtract } from "react-icons/gr";
import { RxCross1 } from "react-icons/rx";
import Navbar from './Navbar';
import { toast, Slide } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import Link from 'next/link';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import User from '@/models/User';
import store from '../store';
import ReactPlayer from 'react-player';
import { useDispatch } from 'react-redux';
import { removeUserCart } from '../store/slices/userSlice';
import { orderIn,orderOut } from '../store/slices/orderSlice';
import { current } from '@reduxjs/toolkit';
import Head from 'next/head';
import UserData from '@/models/UserData';
import Loading from './loading';



// ***************************************    HOLAAAAAAAAA          ********************************************
function Cart({allUser}) {
    
    const[state,setState]=useState(10);
        const router = useRouter();
        const data = router.query;
        const [loader,setLoader] = useState(true);

        useEffect(()=>{
            setTimeout(() => {
              setLoader(false)
              
            }, 2000);
          },[])
        

    
    const allItems = useRef();
    const dispatch=useDispatch()
    const date=new Date();

    let myCart=[]
    Object.keys(allUser).map((ind)=>{
            if(allUser[ind]._id==router.query.slug)
            {
                myCart=allUser[ind].cart
                return;
            }
            
        
    })

   

    const reRender=()=>{
      
      setState(prev=>{
        return {...prev}
      })
     
    }

    const [qty, setQty] = useState(1)

    let val=0;
    myCart.map((j)=>{
        val+=j.price;
    })
    const [subTotal, setSubTotal] = useState(val)
   
    

    const handleDec = (x,item) => {

        var z = document.getElementById('main')
        let initial;
        for (let i = 0; i < z.children.length; i++) {
            if (x == z.children[i].id) {
                var qty = parseInt(z.children[i].children[2].children[1].children[1].innerHTML) - 1;


                if(item.qty>0)
                item.qty=item.qty-1;

                let gg=z.children[i].children[2].children[0].innerHTML;

                if(gg.charAt(1)=='<')
                initial=z.children[i].children[2].children[0].innerHTML.slice(9)

               else{

                   initial = parseInt(z.children[i].children[2].children[0].innerHTML.slice(1))
               }
               initial=parseInt(initial)
                
                if (qty >= 1) {
                    let total=0; ;

                    if(z.children[i].children[2].children[2].innerHTML.charAt(1)=='<')
                    {
                       
                        total=parseInt(z.children[i].children[2].children[2].innerHTML.slice(9)) - initial
                    }

                    else
                    {
                        
                    total= parseInt(z.children[i].children[2].children[2].innerHTML.slice(1)) - initial
                    }
              

                    var rupee = z.children[i].children[2].children[2].innerHTML.slice(0, 1)
                    z.children[i].children[2].children[2].innerHTML = rupee + total

                    z.children[i].children[2].children[1].children[1].innerHTML = qty

                }

            }

        }

        if (qty >= 1)
            SubtotalCount('subtract', initial);


    }

    const handleInc = (x,item) => {

        var z = document.getElementById('main')
        for (let i = 0; i < z.children.length; i++) {
            if (x == z.children[i].id) {
                var qty = parseInt(z.children[i].children[2].children[1].children[1].innerHTML) + 1
                let initial;
                if(item.qty<9)
                item.qty=item.qty+1;
               
                let gg=z.children[i].children[2].children[0].innerHTML;

                if(gg.charAt(1)=='<')
                initial=z.children[i].children[2].children[0].innerHTML.slice(9)

               else{

                   initial = parseInt(z.children[i].children[2].children[0].innerHTML.slice(1))
               }
               initial=parseInt(initial)
              
                if (qty <= 9) {
                    let total=0; ;

                    if(z.children[i].children[2].children[2].innerHTML.charAt(1)=='<')
                    {
                        total=parseInt(z.children[i].children[2].children[2].innerHTML.slice(9)) + initial
                  

                    }

                    else
                    {
                    total= parseInt(z.children[i].children[2].children[2].innerHTML.slice(1)) + initial
                    }

                    
                    var rupee = z.children[i].children[2].children[2].innerHTML.slice(0, 1)
                    
                    z.children[i].children[2].children[2].innerHTML = rupee + total

                    z.children[i].children[2].children[1].children[1].innerHTML = qty


                }
                else {
                    toast.warning(`Can't add more items`, {
                        autoClose: 1000
                    })
                }

            }

        }

        SubtotalCount('add', 0);
     
    }

    const SubtotalCount = (op, val) => {



        if (op == 'add') {
            let k = allItems.current.children.length;
            let sum = 0;
            let x;
            for (let i = 0; i < k; i++) {
           
                if(allItems.current.children[i].children[2].children[2].innerHTML.charAt(1)=='<')
                {
                    x=parseInt(allItems.current.childNodes[i].childNodes[2].childNodes[2].innerHTML.slice(9))
                }
                else{

                    x = parseInt(allItems.current.childNodes[i].childNodes[2].childNodes[2].innerHTML.slice(1));
                }
               
                sum = sum + x;
            }
            
          
            setSubTotal(sum);
            // console.log(sum)
            // console.log(subTotal)
        }
        else {

            let subtracting = subTotal - val;
            if (subtracting > 0)
                setSubTotal(subtracting);
        }


    }

    const removeItem=async(item,i)=>
    {
        try{
        if(!item.color)
        {
            item.color='';
        }
        if(!item.size)
        {
            item.size='';
        }
        let z=document.getElementById('main')
        let newtotal=subTotal-(item.price * parseInt(z.children[i].children[2].children[1].children[1].innerHTML) )
        setSubTotal(newtotal)
      
        const response=await fetch('/api/updateUser',{
            method:'PATCH',
            body:JSON.stringify({
              'type':'removeCart',
              'email':`${store.getState().finalPersistedReducer.user[0].email}`,
              'color':item.color,
              'size':item.size,
              'productId':item.id
            }),
    
            headers:{
              'Content-Type':  'application/json',
            
             },
          })

         router.push({
            pathname:'/cart',
            query:{
                slug:store.getState().finalPersistedReducer.user[0]._id
            }
         })
          
         dispatch(removeUserCart({   
            id:item.id,
            color:item.color,
            size:item.size

         }))

        }

        catch(err)
        {
            router.reload()
        }
    }


    let quan=0;

    const finalCheckout=()=>{
        
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
        
        const allmonth = ["Jan", "Feb", "March", "April", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

      const alldays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
        
        let longDate=date.addDays(6);
        let deliveryDate=`${alldays[longDate.getDay()]+" "+longDate.getDate()+" "+allmonth[longDate.getMonth()]+","+longDate.getFullYear()}`

        
 

        myCart.map((item)=>{
            if(!item.status)
            {
                quan=quan+item.qty;
                item.status="pending"

            }
        })
        let a = Math.round(Math.random() * 1000000)
        let b = Math.round(Math.random() * 1000000)
        let iden = Date.now() + a + b;
       

      const  overall={
            orderid:iden,
            status:"pending",
            qty:quan,
            total:subTotal,
            delivery:deliveryDate
        }

        try{

            myCart.push(overall)
        }
        catch(err)
        {
        
        }

        dispatch(orderOut())  
        dispatch(orderIn(myCart)) 


      if(myCart.length>1)
      {
        

          router.push({
              pathname:'/address',
              query:{
                  slug:router.query.slug
              }
              
          })
      }


        
    }


    if(loader)
        return(
         <Loading/>
        )
       
        else
    return (
        <>
              <Head>
        <title>Cart</title>
      </Head>
            <div>

                <ToastContainer className={styles.toastContainer}
                    limit={5} />

                <Navbar></Navbar>

                <h4 style={{ "font-family": `Poppins`, fontSize: "40px", marginBottom: "3vh", marginTop: "8vh" }}>Cart</h4>

                <div className={styles.cartNav}>
                    <ul>
                        <li>Product</li>
                        <li>Price</li>
                        <li>Quantity</li>
                        <li>Total</li>
                    </ul>
                </div>

     { myCart.length==0 ? 
     <div className={styles.emptyCart}>
<a href="https://www.flaticon.com/free-icons/shopper" title="shopper icons"></a>
<img src='empty-cart.png' height={220} width={220}></img>
<h2>Ahh.. Your cart is Empty</h2>
<h3>Go and add few Products</h3>
     </div>
     :
                <div className={styles.cartItemContainer} id='main' ref={allItems}>
                     {myCart.map((item,i) =>
                      {  
                        if(!item.orderid)
                     {
                        return (
                            <div className={styles.itemSummary} id={item.id+i} key={i}>
                               <Link passHref={true} href={{
                    pathname: '/item',
                    query: {
                            d: JSON.stringify(item.brand, "/", item.title),
                            slug: item.id
                        }

                  }} ><img src={item.img} alt='' height={110} width={100} /></Link> 
                                <div className={styles.itemSummary_Specs}>
                                    <p>{item.title}</p>
                                    <p>{item.brand} </p>
                                   { item.size ? <p>{item.size}</p> :<></>}
                                   { item.color ? <p style={{ "backgroundColor": `${item.color}` }} ></p> :<></>}
                                </div>
                                <div>
                                    <p className={styles.itemValue}>&#8377;{item.price}</p>

                                    <div className={styles.Itemqty} >
                                        <GrSubtract className={styles.icon} onClick={() => handleDec(item.id+i,item)}></GrSubtract>
                                        <p>{qty}</p>
                                        <GrAdd className={styles.icon} onClick={() => handleInc(item.id+i,item)}></GrAdd>
                                    </div>

                                    <p className={styles.itemTotal}>&#8377;{item.price}</p>

                                </div>
                                <RxCross1 className={styles.cartRemove} onClick={() => removeItem(item,i)} />
                            </div>



                        )
            }
                     }
                 
                     )}  
                </div>

                    }
             
            </div>

            <div className={styles.cartRight}>
                <h4 >Order Summary</h4>
                <hr />
                <div >
                    <p>Subtotal</p>

                    <span>&#8377;{subTotal}</span>
                </div>

                <div>
                    <p>Coupon Code</p>
                    <input type="text" name="" placeholder='Enter Coupon Code' />
                    <h5>Coupon will be applied at Checkout Page</h5>
                </div>

                <button onClick={()=>finalCheckout()}>Proceed</button>


            </div>
        </>
    )
}

export async function getServerSideProps(context) {

    let allUser = await UserData.find()


    return { 
        props: { allUser: JSON.parse(JSON.stringify(allUser)) }, // will be passed to the page component as props
    }
}

export default Cart