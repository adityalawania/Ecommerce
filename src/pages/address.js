import React, { useDebugValue, useRef, useState ,useEffect} from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import TracingNavbar from './tracingNavbar'
import { useRouter } from 'next/router'
import countries from '../datas/country'
import User from '@/models/User'
import { addAddress,removeAddress } from '../store/slices/addressStore'
import { useDispatch } from 'react-redux'
import { InsightsUserRolesContextImpl } from 'twilio/lib/rest/flexApi/v1/insightsUserRoles'
import UserData from '@/models/UserData'
import Loading from './loading'
import Card from './card'

function Address({allUser}) {

    

    const router=useRouter();
    const formRef=useRef()
    const dispatch=useDispatch()
   
    let myUser;
    Object.keys(allUser).map((ind)=>{
        if(allUser[ind]._id==router.query.slug)
        {
            myUser=allUser[ind]
            return
            
        }
    })

    const[inpemail,setEmail]=useState(myUser.email);
    const[fname,setFname]=useState(myUser.fname);
    const[lname,setLname]=useState(myUser.lname);
    const[inpadd,setAdd]=useState(myUser.address);
    const[inpcity,setcity]=useState(myUser.city);
    const[inpstate,setstate]=useState(myUser.state);
    const[inpcountry,setcountry]=useState(myUser.country);
    const[inppostal,setpostal]=useState(myUser.postal);
    const[inpphone,setphone]=useState(myUser.fphone);

    const [loader,setLoader] = useState(true)
   let x;
    
    countries.map((c)=>{
            if(c.name.toLowerCase()==inpcountry.toLowerCase())
            {
                x=c.code
                return;
            }
        })
        

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


   const checkDetails = (e,y)=> {
    e.preventDefault();
    
   
        let allAreFilled = true;
        document.getElementById("myForm").querySelectorAll("[required]").forEach(function(i) {
          if (!allAreFilled) return;
          if (i.type === "radio") {
            let radioValueCheck = false;
      document.getElementById("myForm").querySelectorAll(`[name=${i.name}]`).forEach(function(r) {
              if (r.checked) radioValueCheck = true;
            })
            allAreFilled = radioValueCheck;
            return;
          }
          if (!i.value) { allAreFilled = false;  return; }
        })
        if (!allAreFilled) {
          alert('Fill all the fields');
        }
        else{
            let apart=formRef.current.childNodes[1].childNodes[5].value;
            let addressObj={
                name:fname+" "+lname,
                email:inpemail,
                phone:inpphone,
                country:inpcountry,
                state:inpstate,
                city:inpcity,
                address:inpadd,
                apartment:apart,
                pin:inppostal,
            };

            dispatch(removeAddress()) 
            dispatch(addAddress(addressObj))   
            router.push({
                pathname:'/payment',
                query:{
                    slug:router.query.slug
                }
            })
        }
      };

      const nation=(e)=>{
        setcountry(e.target.value)
        
        countries.map((ele)=>{
            if(ele.name==inpcountry)
            {
                x=ele.code
                return;
            }
        })
      }

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
            <TracingNavbar id={2}></TracingNavbar>

<form name='detailForm' onSubmit={(e)=>checkDetails(e)}>
            <div className={styles.CheckoutCont} id='myForm' ref={formRef}>
                <div >
                    <h3>Contact Information</h3>
                    <input type="text" name="" id="" placeholder='Email' value={inpemail} onChange={(e)=>setEmail(e.target.value)} className={styles.addressBox} required/>
                    <span>{x}</span>
                    <input type="number" name="" id="" placeholder='Phone' value={inpphone} onChange={(e)=>setphone(e.target.value)} className={`${styles.addressBox}${styles.addressBoxPhone}`} required />
                </div>

                <div>
                    <h3>Shipping Address</h3>
                    <input type="text" placeholder='Country / Region' value={inpcountry} onChange={(e)=>nation(e)} required/>
                    <div>
                        <input type="text" placeholder='First Name' value={fname} onChange={(e)=>setFname(e.target.value)} required/>
                        <input type="text" placeholder='Last Name' value={lname} onChange={(e)=>setLname(e.target.value)} required/>
                    </div>
                    <input type="text" placeholder='Address' value={inpadd} onChange={(e)=>setAdd(e.target.value)} className={styles.addressBox} required/>
                    <p>(Optional)</p>
                    <input type="text" placeholder='Apartment, suite etc' />
                    <div>
                        <input type="text" placeholder='City' value={inpcity} onChange={(e)=>setcity(e.target.value)} required/>
                        <input type="text" name="" id="" placeholder='State' value={inpstate} onChange={(e)=>setstate(e.target.value)} required/>
                        <input type="text" name="" id="" placeholder='Zip Code' value={inppostal} onChange={(e)=>setpostal(e.target.value)} required/>
                    </div>
                    <button>Proceed</button>
                    {/* <input type='submit' name='Proceed'/> */}
                </div>
            </div>

            </form>
                    
        </>
    )
}

export async function getServerSideProps(context) {

    let allUser = await UserData.find()
    
 


    return { 
        props: { allUser: JSON.parse(JSON.stringify(allUser)) }, // will be passed to the page component as props
    }
}


export default Address