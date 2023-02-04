import React from 'react'
import StockSearch from './StockSearch'


function PortfolioHeader() {
  return (
    <div className='header_container flex flex-col'>
        <h1 div className='header_contents flex justify-start text-xl ml-3 mt-3'>Portfolio</h1>
        <div className='flex flex-row justify-center mb-4'>
            <div className='flex flex-col pr-10'>
                <div className='text-3xl'>Todays Gain</div>
                <h3>+123.40(+3.00%)</h3>
            </div>
            <div className='flex flex-col pr-10'>   
                <StockSearch/>
            </div>
            <div className='flex flex-col pr-10'>
                <div className='text-3xl '>Todays Value</div>
                <h3>$5,344</h3>
            </div>
        </div>
            
            
    </div>

        
       

  )
}

export default PortfolioHeader

