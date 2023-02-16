// import firebase from "firebase/app"
// import "firebase/auth"

import firebase from  'firebase/compat/app'
import 'firebase/compat/auth' 
import {getDatabase, ref, refFromURL, set} from 'firebase/database'
import App from "./App"

const app = firebase.initializeApp({
    apiKey: "AIzaSyDAsA_kYjTk82M8PpcG4HAKcDXhOG_xYIU",
    authDomain: "finviz-c0695.firebaseapp.com",
    projectId: "finviz-c0695",
    storageBucket: "finviz-c0695.appspot.com",
    messagingSenderId: "759380636393",
    appId: "1:759380636393:web:9a28f2c69d8f373be2f678",
    measurementId: "G-ZQ25DHL02W"
})

export function writeUserData(userId, tickerList, Details){
    const db = getDatabase()
    const reference = ref(db, 'users/' + userId)
    set(reference, {
        tickerList : tickerList,
        details : Details
     })

}

export const auth = app.auth()
export default app


