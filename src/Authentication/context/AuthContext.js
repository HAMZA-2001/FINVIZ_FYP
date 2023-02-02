import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../../firebase'

// import {auth} from '.../firebase'

const AuthContext = React.createContext()

// to access authcontext through useAuth hook
export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    
    //Use auth module to login user
    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password){
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout(){
        console.log("loging out")
        return auth.signOut()
    }
    
    useEffect(() => {
        // allows the user to be set we want to run this when we mount our component
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
          
        })

        return unsubscribe
    }, [])
    

    const value = {
        currentUser,
        signup,
        login,
        logout
    }


  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}

