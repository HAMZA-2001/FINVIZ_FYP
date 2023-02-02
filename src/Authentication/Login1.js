import React from 'react'
import loginImg from "./login.svg"

function Login(props) {
  return (

    <div className='text-center flex justify-center align-center font-sans w-screen  pt-25'>
    <div className='Login flex justify-center mt-20 relative z-50 w-1/2 h-1/2 bg-neutral-900 pt-10 rounded'>
        <div className='base-container w-full flex flex-col items-center' ref={props.containerRef}>
            <div className='header text-white text-3xl font-sans'>Login</div>
            <div className='content flex flex-col'>
                <div className='image w-80'>
                    <img src={loginImg} className="w-full h-full"></img>
                </div>
                <div className='form mt-2 flex flex-col items-center w-full'>
                    <div className='form-group flex flex-col items-start w-fit'>
                        <label htmlFor='username' className='text-white text-lg'>Username</label>
                        <input type='text' name='username' placeholder='username' className='mt-1 w-72 h-9 font-sans text-sm bg-slate-100 rounded ease-in duration-300 focus:outline-none focus:shadow-cyan-800 mb-8'/>
                    </div>
                    <div className='form-group flex flex-col items-start  w-fit'>
                        <label htmlFor='password' className='text-white text-lg'>Password</label>
                        <input type='password' name='password' placeholder='password' className='mt-1 w-72 h-9 font-sans text-sm bg-slate-100 rounded ease-in duration-300 focus:outline-none focus:shadow-xl mb-8'/>
                    </div>
                </div>
                <div className='footer mt-3'>
                    <button type="button" className='btn text-white bg-sky-900 text-lg pt-1 pb-1 pr-2 pl-2 rounded hover:bg-blue-700 focus:outline-none'>
                        Login
                    </button>
                </div>
            </div>
    </div>
    </div>
    </div>
  )
}

export default Login