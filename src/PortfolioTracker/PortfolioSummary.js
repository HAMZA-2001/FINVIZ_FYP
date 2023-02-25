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
      <PortfolioTracker/>
  )
}

export default PortfolioSummary