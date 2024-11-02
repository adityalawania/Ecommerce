import React, { useRef, forwardRef, useEffect,useState } from 'react'
import styles from '../styles/Home.module.css'
import store from '../store';
import User from '@/models/User';
import Navbar from './Navbar';
import { useRouter } from 'next/router';
import { removeUserWish } from '../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import Head from 'next/head';
import UserData from '@/models/UserData';
import Loading from './loading';


function Wish({ userData }) {

    const router = useRouter()
    const dispatch = useDispatch()

    const [prevDate, setprevDate] = useState('');
    const [loader,setLoader] = useState(true)

    useEffect(()=>{
        setTimeout(() => {
          setLoader(false)
          
        }, 2000);
      },[])


    let myWish = [];
    userData.map((ele) => {
        if (ele._id == router.query.slug) {
            myWish = ele.wish;
            console.log(ele.fname)
        }
    })

    const visitProduct = (user) => {
        router.push({
            pathname: '/item',
            query: {
                d: JSON.stringify(user.brand, "/", user.title),
                slug: user.id
            }

        })
    }

    const removeProduct = async (iden) => {

        dispatch(removeUserWish(iden))

        const response = await fetch('/api/updateUser', {
            method: 'PATCH',
            body: JSON.stringify({
                'type': 'removeWish',
                'email': `${store.getState().finalPersistedReducer.user[0].email}`,
                'productId': iden
            }),

            headers: {
                'Content-Type': 'application/json',
            },
        })

        router.push({
            pathname: '/wish',
            query: {
                slug: store.getState().finalPersistedReducer.user[0]._id
            }
        })
    }

    if (loader)
        return (
            <Loading />
        )

    else
        return (
            <>
                <Head>
                    <title>Whishlist</title>
                </Head>
                <Navbar></Navbar>
                <div className={styles.wishContainer} >
                    <img src='heart.png'></img>
                    <h2>WishList</h2>

                    {
                        myWish.map((user, i) => {

                            return (
                                <div className={styles.wishandDate} key={i}>
                                    {
                                        (i > 0 &&
                                            myWish[i].date == myWish[i - 1].date) ?
                                            <></>
                                            :
                                            <div className={styles.date}>
                                                <hr />
                                                <p>{user.date}</p>
                                            </div>}
                                    <div className={styles.wish}>
                                        {/* <li></li> */}
                                        <img src={user.img} height={40} width={40} alt='404'></img>
                                        <div className={styles.wishContent}>
                                            <p>{user.title ? user.title.length > 19 ? user.title.substr(0, 19) + ". . . ." : user.title : "________"}</p>
                                            <p>{user.brand ? user.title.lbrand > 19 ? user.brand.substr(0, 19) + ". . . ." : user.brand : "________"}</p>
                                        </div>
                                        <p>Rs. {user.price}</p>
                                        <div className={styles.ratingDiv}>
                                            <span>{(user.rating[0] / user.rating[1]).toFixed(1)}</span>
                                            <img src='star.png'></img>
                                        </div>
                                        <button onClick={() => visitProduct(user)}>Try</button>
                                        <img src='delete.png' onClick={() => removeProduct(user.id)}></img>
                                    </div>

                                </div>

                            )


                        })



                    }

                    {myWish.length == 0 ?

                        <div className={styles.emptyWish}>

                            <img src='broken-heart.png' height={220} width={220}></img>
                            <h2>This is not fair..!</h2>
                            <h3>Hurry up , Go and add few Products</h3>
                        </div>
                        : <></>}


                    <div className={styles.wishFoot}></div>
                </div>
            </>
        )
}

export async function getServerSideProps(context) {

    let userData = await UserData.find()




    return {
        props: { userData: JSON.parse(JSON.stringify(userData)) }, // will be passed to the page component as props
    }
}

export default Wish
