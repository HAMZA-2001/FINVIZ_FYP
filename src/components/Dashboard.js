import React from 'react'
import Card from './Card'
import {mockCompanyDetails} from "../constants/mock";
import Search from './Search';
import Details from './Details';
import Overview from './Overview';
import {useContext, useEffect, useState} from 'react';
import DashboardChart from './DashboardChart';
import { fetchQuote, fetchStockDetails } from '../api/stock-api';
import StockContext from './StockContext';
// import './Dashboard'

function Dashboard() {
    const [StockDetails, setStockDetails] = useState({})
    const {stockSymbol} = useContext(StockContext)
    const [quote, setQuote] = useState({})

    useEffect(()=>{
        const updateStockDetails = async () => {
            try {
                const result = await fetchStockDetails(stockSymbol)
                setStockDetails(result);
            } catch (error) {
                setStockDetails({})
                console.log(error)
            }
        }
        const updateStockOverview = async () => {
            try {
                const result = await fetchQuote(stockSymbol)
                setQuote(result);
            } catch (error) {
                setQuote({})
                console.log(error)
            }
        }

        updateStockDetails()
        updateStockOverview()
    }, [stockSymbol])

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10 font-quicksand">

            <div className="flex flex-col justify center items-center col-span-1 md:col-span-2 xl:col-span-3 row-span-1 items-center ">
                <h1 className='text-5xl text-white'>{StockDetails.name}</h1>
                <Search/>
            </div>
            <div className="md:col-span-2 row-span-4">
                <DashboardChart/>
            </div>
            <div>
                <Overview
                    symbol={stockSymbol}
                    price={quote.pc}
                    change={quote.d}
                    changePercent={quote.dp}
                    currency = {StockDetails.currency}
                />
            </div>
            <div className="row-span-2 xl:row-span-3">
                <Details details={StockDetails}/>
            </div>
            
            
            
        
    </div>
  )
}

export default Dashboard