import React from 'react'
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import './Header.css'

function Header() {
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
        </div>
        {/* {logo} */}
    </div>
  )
}

export default Header