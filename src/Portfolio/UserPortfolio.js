import { transition } from 'd3'
import { getDatabase, onValue, push, ref, set } from 'firebase/database'
import React, { useContext, useState } from 'react'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { fetchQuote, fetchStockDetails } from '../api/stock-api'
import { useAuth } from '../Authentication/context/AuthContext'
import PortfolioHeader from './PortfolioHeader'
import PortfolioTable from './PortfolioTable'
import StockPortfolioContext from './StockPortfolioContext'

function UserPortfolio() {
    const {portfoliostockSymbol} = useContext(StockPortfolioContext)

    const [stockDetails, setStockDetails] = useState({})
    const [quote, setQuote] = useState({})


    
    useEffect(() => {
      const updatePfDetails = async () => {
        try {
            const result = await fetchStockDetails(portfoliostockSymbol)
            setStockDetails(result)

        } catch (error) {
            setStockDetails({})
        }
      }

      const updatePfOverview = async () => {
        try {
            const result = await fetchQuote(portfoliostockSymbol)
            setQuote(result)

        } catch (error) {
            setStockDetails({})
        }
      }
      updatePfDetails()
      updatePfOverview()
    
    }, [portfoliostockSymbol])
    
  return (
    <div className=' text-white grid grid-cols-1 gap-2 sm:grid-cols-1 pt-20 grid-rows-8 auto-rows-fr'>
    <div className='m-3 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px]'>
    	<PortfolioHeader symbol = {portfoliostockSymbol} price={quote.pc} name={stockDetails.name}/>
    </div>
    <div className='m-3 row-span-5 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
        <PortfolioTable/>
    </div>

</div>
  )
}

export default UserPortfolio