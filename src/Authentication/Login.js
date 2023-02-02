import React, { useRef, useState } from 'react'
import loginImg from "./login.svg"
import { useAuth } from './context/AuthContext'
import { Link, Navigate, useNavigate } from 'react-router-dom'

function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const {login, currentUser} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
  
    async function handleSubmit(e){
      // e.preventDefault()
      console.log(emailRef.current.value)
      console.log(passwordRef.current.value)

      try {
        //async event
        setError('')
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)
        navigate("/")
      } catch {
        setError('Failed to log in')
      }
  
      setLoading(false)
  
    }
  
  
  
    return (
      <div className='text-center flex justify-center align-center font-sans w-screen  pt-25'>
      <div className='Login flex justify-center mt-20 relative z-50 w-1/2 h-1/2 bg-neutral-900 pt-10 rounded'>
      <div className='base-container w-full flex flex-col items-center' >
          <div className='header text-white text-3xl font-sans'>Login</div>
          <div className='content flex flex-col'>
              <div className='image w-80'>
                  <img src={loginImg} className="w-full h-full"></img>
              </div>
              {/* <h2 className='text-white text-center mb-4'>{currentUser.email}</h2> */}
              {error && <h1 className='text-white'>{error}</h1>}
              <div className='form mt-2 flex flex-col items-center w-full'>
                  <div className='form-group flex flex-col items-start w-fit'>
                      <label htmlFor='email' className='text-white text-lg'>Email</label>
                      <input type='email' name='email' placeholder='email' className='mt-1 w-72 h-9 font-sans text-sm bg-slate-100 rounded ease-in duration-300 focus:outline-none focus:shadow-cyan-800 mb-8' ref = {emailRef}/>
                  </div>
                  <div className='form-group flex flex-col items-start w-fit'>
                      <label htmlFor='password' className='text-white text-lg'>Password</label>
                      <input type='password' name='password' placeholder='password' className='mt-1 w-72 h-9 font-sans text-sm bg-slate-100 rounded ease-in duration-300 focus:outline-none focus:shadow-cyan-800 mb-8' ref = {passwordRef}/>
                  </div>
              </div>
              <div className='footer mt-3'>
                  <button type="submit" className='btn text-white bg-sky-900 text-lg pt-1 pb-1 pr-2 pl-2 rounded hover:bg-blue-700 focus:outline-none' onClick={handleSubmit.bind(this)} disabled={loading}>
                      Login
                  </button>
              </div>
              <div className='w-100 text-center mt-2 text-white'>
                Need an account? <Link to="/signup">Sign Up</Link>
              </div>
          </div>
      </div>
    </div>  
  
    </div>
    )
  }
export default Login