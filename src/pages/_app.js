import '@/styles/globals.css'
import { Provider } from 'react-redux'
import {SessionProvider} from 'next-auth/react'
import store from '../store'
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from 'redux-persist'
// import {PersistGate} from 'redux-persist/es/integration/react'

export default function App({ Component, pageProps }) {

  let persistor = persistStore(store)

  return (
    <SessionProvider session={pageProps.session}>
    <Provider store={store}>

      <Component {...pageProps} />
      
    </Provider>
    </SessionProvider>)
}
