import React, { useState } from 'react'
import Login from './Login'
import Signup from './Signup'
import './Authentication.css'

/**
 * Adds left and right animation to the login and signup pages
 * @param {*} props html elements
 */
function AuthenticationPage(props) {

    const [isLogginActive, setLogginActive] = useState(true)
    const current = isLogginActive ? "SignUp" : "Login"
    const currentActive = isLogginActive ? "Login" : "Sign Up"
    const rightSide = "right"


  return (
    <div className='text-center flex justify-center align-center font-sans w-screen h-screen'>
        <div className='Login flex justify-center mt-20 relative z-50 w-1/4 h-1/2 '>
            <div className='container flex justify-center align-center  w-full rounded bg-neutral-900 pt-10'>
                {isLogginActive && <Login contianerRef ={(ref) => current = ref} />}
                {!isLogginActive && <Signup contianerRef ={(ref) => current = ref} />}
            </div>
        </div>  
    </div>
  )
}

function RightSide(props) {
    return (
        <div className='right-side' ref={props.contianerRef}>
            <div className='inner-container'>
                <div className='text'>
                    {props.current}
                </div>
            </div>
        </div>
    )
}

export default AuthenticationPage