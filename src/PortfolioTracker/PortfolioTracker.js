import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../Authentication/context/AuthContext';

function convertISODate(isodate){
    const date = new Date(isodate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// async function fetchStockOverview(symbol) {
//     const response = await fetch(
//       `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=R6DXIM881UZRQGUU`
//     );

//     if(!response.ok){
//         const message = `An error has occured: ${response.status}`
//         throw new Error(message);
//     }
//     return response.json();
//   }

const fetchStockOverview = async (symbol) => {
    const URL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=R6DXIM881UZRQGUU`;
    const response = await fetch(URL);

    if(!response.ok){
        const message = `An error has occured: ${response.status}`
        throw new Error(message);
    }

    return await response.json();
}

function PortfolioTracker() {
    const [marketCap, setMarketCap] = useState(null)
    const [dbItems, setdbItems] = useState([]) 
    const [filteredList, setFilteredList] = useState([]) 
    const {currentUser} = useAuth()

                    //     let apidata = fetchStockOverview(project.portfoliostockSymbol)
                    // console.log(apidata)
                    // const updateStockOverview = async () => {
                    //     try {
                    //         const result = await fetchQuote(stockSymbol)
                    //         setQuote(result);
                    //     } catch (error) {
                    //         setQuote({})
                    //         console.log(error)
                    //     }
                    // }


   function reteriveData(){
        let dbcontents = []
        onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
            Object.values(snapshot.val()).map((project, item) => {  
                    dbcontents.push(project)

                })     
            }
            )
        // setdbItems(dbcontents)
        return dbcontents
    }


    useEffect(() => {
        const data = reteriveData()
        setTimeout(()=>{
            setdbItems(data)
        },1000)
    }, []);

    useEffect(()=>{    
        let stockArray = []
        let comparestockArray = []

        // [{item},...]
        dbItems.map((item, i)=>{
            if(item.details !== ''){
                if(comparestockArray.includes(item.portfoliostockSymbol)){
                    comparestockArray.forEach((stock, j)=>{
                        if(stock === item.portfoliostockSymbol){
                            console.log(item)
                            console.log(stock)
                            console.log(j)
                            console.log(stockArray[i])
                            console.log(stockArray[j])
                            //combination logic goes here
                            
                            stockArray[j].Total_Shares =  parseInt(stockArray[j].Total_Shares) + parseInt(item.details.Shares)
                            stockArray[j].Total_Cost =  parseInt(stockArray[j].Total_Cost) + parseInt(item.details.AverageCostPerShare * item.details.Shares)
                            stockArray[j].AverageCostPerShare =  parseInt(stockArray[j].Total_Cost) / parseInt(stockArray[j].Total_Shares)
                            
                            // filtering the dates for the object 
                            let datesList = []
                            if(item.details.Action === "sell"){
            
                                if(item.details.Last_Sell_Date === undefined){
                                    stockArray[j].Last_Sell_Date = convertISODate(item.details.date)
                                }else{
                                    const x = new Date(item.details.date) // the current date
                                    const y = new Date(stockArray[j].Last_Sell_Date) // the previous sell date
                                    console.log(x)
                                    console.log(y)
                                    //if x is more recent than y
                                    if (x>y){
                                        stockArray[j].Last_Sell_Date = convertISODate(x)
                                    }
                                }

                            }else{
                                const x = new Date(item.details.date) // 
                                const y = new Date(stockArray[j].First_Buy_Date) // 
                                const z = new Date(stockArray[j].Last_Buy_Date) // 
                                // if the array detects a buy purchase
                                if(item.details.Last_Sell_Date === ''){
                                    stockArray[j].Last_Sell_Date = convertISODate(item.details.date)
                                }else{
                                    
                                    console.log(x)
                                    console.log(y)
                                    //if current date is lesser than previous first buy date
                                    if (x<y){
                                        stockArray[j].First_Buy_Date = convertISODate(x)
                                    }if (x>z){
                                        stockArray[j].Last_Buy_Date = convertISODate(x)
                                    }
                                }

                            }

                        }
                    })
                    console.log(item.portfoliostockSymbol)
                    console.log("includes")
                    
                }else{
                    comparestockArray.push(item.portfoliostockSymbol)
                    let buyorsell = []
                    let dateType = "Last Sell"
                    if(item.details.Action === "sell"){
                        dateType = "Last Buy"
                        buyorsell.push('')
                        buyorsell.push(convertISODate(item.details.date))
                    }else{
                        buyorsell.push(convertISODate(item.details.date))
                        buyorsell.push('')
                        
                    }
                     stockArray.push({
                                        "Symbol": item.portfoliostockSymbol,
                                        "Total_Shares": item.details.Shares,
                                        "Cost": item.details.AverageCostPerShare,
                                        "Total_Cost":  item.details.Shares * item.details.AverageCostPerShare,
                                        "date": convertISODate(item.details.date),
                                        "First_Buy_Date": buyorsell[0],
                                        "Last_Buy_Date" : buyorsell[0],
                                        "Last_Sell_Date" : buyorsell[1],
                                        "AverageCostPerShare" : (item.details.Shares * item.details.AverageCostPerShare)/item.details.Shares
                                    })
                }
            }          
        })
        // console.log(stockArray)
        // console.log(comparestockArray)
        console.log(dbItems)

        setTimeout(()=>{
            setFilteredList(stockArray)
        },1000)
    }, [dbItems])


    let r = []
    useEffect(()=>{  
      console.log(filteredList)
        // const getOverviewData = async (stockSymbol) => {
        // try {
        //     const result = await fetchStockOverview(stockSymbol)
        //         r = result
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
        // getOverviewData("AAPL")
        async function fetchdata(symbol) {
            const response = await fetch(
              `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=R6DXIM881UZRQGUU`
            );
            const data = await response.json();
            console.log(data)
          }
          filteredList.map((item, index)=>{
            fetchdata(item.symbol)
          })
        

      
    },[filteredList])


  return (
    <div className='relative overflow-hidden rounded-lg  w-full'>
    <div className="overflow-hidden rounded-lg flex border border-gray-200 shadow-md w-full">
    <div className="w-full flex border-collapse  text-left text-sm text-gray-500">
                <table className="table  text-gray-400 space-y-6 text-sm w-full">
                    <thead className="bg-gray-800 text-gray-500 w-full">
                        <tr>
                            <th className="p-3 text-left">Symbol</th>
                            <th className="p-3 text-left">Allocation</th>
                            <th className="p-3 text-left">Cost Basis</th>
                            <th className="p-3 text-left">Sector</th>
                            <th className="p-3 text-left">Size</th>
                            <th className="p-3 text-left">Market Cap</th>
                            <th className="p-3 text-left">Shares</th>
                            <th className="p-3 text-left">Unit Basis ($)</th>
                            <th className="p-3 text-left">Price</th>
                            <th className="p-3 text-left">Position Value</th>
                            <th className="p-3 text-left">Dividents Recieved</th>
                            <th className="p-3 text-left">Amount Paid</th>
                            <th className="p-3 text-left">Total Return</th>
                            <th className="p-3 text-left">Portfolio Return</th>
                            <th className="p-3 text-left">First Buy Date</th>
                            <th className="p-3 text-left">Last Buy Date</th>
                            <th className="p-3 text-left">Last Sell Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
          
    </div>
    </div>
  )
}

export default PortfolioTracker