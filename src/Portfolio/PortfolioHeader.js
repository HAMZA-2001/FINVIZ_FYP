import { onValue } from 'firebase/database'
import React, { useState } from 'react'
import StockPortfolioContext from './StockPortfolioContext'
import StockSearch from './StockSearch'

/**
 * React component for displaying the header in portoflio page
 * @component
 */
function PortfolioHeader({symbol, price, name}) {
    
    const [todaysGain, settodaysGain] = useState(0)
    const [percentChange, setPercentChange] = useState(0)
    const [todaysValue, settodaysValue] = useState(0)
    
  return (
    <div className='header_container flex flex-col justify-center'>
    <div>
        <div className='flex-col text-xl items-center justify-center'>
            <h1 class="text-5xl text-white font-quicksand pt-5 pb-5">
                Portfolio Management System
            </h1>
        </div>

        
        <div className='flex flex-row justify-center mb-4'>

            <div className='flex flex-col pr-10'>   
                <StockSearch/>
            </div>

        </div>   
    </div>
    </div>

  )
}

export default PortfolioHeader

