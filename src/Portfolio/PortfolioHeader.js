import { onValue } from 'firebase/database'
import React, { useState } from 'react'
import StockPortfolioContext from './StockPortfolioContext'
import StockSearch from './StockSearch'


function PortfolioHeader({symbol, price, name}) {
    
    const [todaysGain, settodaysGain] = useState(0)
    const [percentChange, setPercentChange] = useState(0)
    const [todaysValue, settodaysValue] = useState(0)

    // useEffect(() => {
    //     let tg = 0
    //     let tp = 0
    //     let tv = 0
    //     onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
         
    //         Object.values(snapshot.val()).map((project, item) => {  
    //                 console.log(project)
    //             })     
    //         })
    
    // }, [])
    
  return (
    <div className='header_container flex flex-col'>
        <div className='flex-col text-xl items-center'>
            <h1 className='header_contents flex justify-start text-xl ml-3 mt-3 content-center pb-6'>Portfolio Management System</h1>
        </div>
        

        <div className='flex flex-row justify-center mb-4'>
            <div className='flex flex-col pr-10'>
                <div className='text-3xl'>Todays Gain</div>
                <div className='text-3xl'>{name}</div>
                <h3>{price}(+3.00%)</h3>
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

