import React, { useRef, useState } from 'react'
import loginImg from "./login.svg"
import { useAuth } from './context/AuthContext'
import { Link } from 'react-router-dom'

/**
 * displays the signup page and and create the users account upon valid credentials provided
 * @component
 * @returns a signup page with email and password inputs
 */
function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()  
  const {signup, currentUser} = useAuth()
  const [error, setError] = useState('')
  const [sucess, setSucess] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * checks whether the account have been successfully created 
   * @param {object} e event type
   */
  async function handleSubmit(e){

    if (passwordRef.current.value !== passwordConfirmRef.current.value){
      return setError('Password do not match')
    }

    try {
      //async event
      setError('')
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
    } catch {
      setError('Failed to create an account')
      setSucess("Account created sucessfully")
    }
    setLoading(false)
  }



  return (
    <div className='text-center flex justify-center align-center font-sans w-screen  pt-25'>
    <div className='Login flex justify-center mt-20 relative z-50 w-1/2 h-1/2 bg-neutral-900 pt-10 rounded'>
    <div className='base-container w-full flex flex-col items-center' >
        <div className='header text-white text-3xl font-sans'>Sign Up</div>
        <div className='content flex flex-col'>
            <div className='image w-80'>
                <img src={loginImg} className="w-full h-full"></img>
            </div>
            {error ? <h1 className='text-white'>{sucess}</h1> : <h1 className='text-white'>{sucess}</h1>}
            <div className='form mt-2 flex flex-col items-center w-full'>
                <div className='form-group flex flex-col items-start w-fit'>
                    <label htmlFor='email' className='text-white text-lg'>Email</label>
                    <input type='email' name='email' placeholder='email' className='mt-1 w-72 h-9 font-sans text-sm bg-slate-100 rounded ease-in duration-300 focus:outline-none focus:shadow-cyan-800 mb-8' ref = {emailRef}/>
                </div>
                <div className='form-group flex flex-col items-start w-fit'>
                    <label htmlFor='password' className='text-white text-lg'>Password</label>
                    <input type='password' name='password' placeholder='password' className='mt-1 w-72 h-9 font-sans text-sm bg-slate-100 rounded ease-in duration-300 focus:outline-none focus:shadow-cyan-800 mb-8' ref = {passwordRef}/>
                </div>
                <div className='form-group flex flex-col items-start  w-fit'>
                    <label htmlFor='password' className='text-white text-lg'>Password Confirmation</label>
                    <input type='password' name='password confirmation' placeholder='password confirmation' className='mt-1 w-72 h-9 font-sans text-sm bg-slate-100 rounded ease-in duration-300 focus:outline-none focus:shadow-xl mb-8' ref = {passwordConfirmRef}/>
                </div>
            </div>
            <div className='footer mt-3'>
                <button type="submit" className='btn text-white bg-sky-900 text-lg pt-1 pb-1 pr-2 pl-2 rounded hover:bg-blue-700 focus:outline-none' onClick={handleSubmit.bind(this)} disabled={loading}>
                    Sign Up
                </button>
            </div>
            <div className='w-100 text-center mt-2 text-white'>
              Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    </div>
  </div>  

  </div>
  )
}

export default Signup
