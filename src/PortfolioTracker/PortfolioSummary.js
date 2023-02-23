import { transition } from 'd3'
import { getDatabase, onValue, push, ref, set } from 'firebase/database'
import React, { useContext, useState } from 'react'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { fetchQuote, fetchStockDetails } from '../api/stock-api'
import { useAuth } from '../Authentication/context/AuthContext'
import PortfolioTracker from './PortfolioTracker'


function PortfolioSummary() {

    const [stockDetails, setStockDetails] = useState({})
    const [quote, setQuote] = useState({})

    const [number, setNumber] = useState(0)
    const {currentUser} = useAuth()

    // Variables for going to prev and next pages in tables
    const [next, setNext] = useState(false)

    function TransectionsInput(e){
      setNext(false)
    }

    function handleStockTrackerInput(e){
      setNext(true)
      console.log(e.target)
    }
    

    
  return (
    <div className=' text-white grid grid-cols-1 gap-2 sm:grid-cols-1 pt-20 grid-rows-8 auto-rows-fr'>
    <div className='m-3 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px]'>
    
      <div class="inline-flex">
        <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l" onClick={TransectionsInput.bind(this)}>
          Prev
        </button>
        <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r" onClick={handleStockTrackerInput.bind(this)}>
          Next
        </button>
        </div>
            </div>
            <div className='m-3 row-span-5 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
                <PortfolioTracker/>
            </div>
            <div className='m-3 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
                Visualization
            </div>
        </div>
  )
}

export default PortfolioSummary