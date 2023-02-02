import React, { useState } from 'react'
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import './Header.css'
import { useAuth } from './Authentication/context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {

  const {currentUser, logout} = useAuth()
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleLogout(){
    setError('')

    try {
      await logout()
      navigate('/login')
    } catch{
      setError("Failed to Log Out")
    }

  }

  return (
    <div className='header__wrapper'>
        <div className='header__logo'>
            FINVIZ   
        </div>

        <div className='header__menuItems'>
            <a href='#'>Dashboard</a>
            <a href='#'>Visualization</a>
            <a href='#'>Prediction</a>
            <a href='#'>News</a>
            <a href='#'>Account</a>
            <button onClick = {handleLogout.bind(this)} className='btn text-white bg-sky-900 text-md pt-1 pb-1 pr-2 pl-2 ml-2 rounded hover:bg-blue-700 focus:outline-none' >Log Out {currentUser.email}</button>
        </div>
        {/* {logo} */}
    </div>
  )
}

export default Header