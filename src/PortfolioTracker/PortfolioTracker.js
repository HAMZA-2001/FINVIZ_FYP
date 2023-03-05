import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../Authentication/context/AuthContext';
import BarChartVis from './BarChartVis';
import ComparingStocksVis from './ComparingStocksVis';
import PieChartVis from './PieChartVis';
import StackedBarChart from './StackedBarChart';

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
    const [stockOverview, setstockOverview] = useState([])
    let results = []
    let URLList = []
    let dlist = []
    useEffect(()=>{  
      console.log(filteredList)

        const fetchdata = async (symbol) => {
            const URL = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0`;
            const response = await fetch(URL);
            if(!response.ok){
                const message = `An error has occured: ${response.status}`
                throw new Error(message);
            }
        
            return await response.json();
        }
        
        const updatePfOverview = async (symbol) => {
            try {
                const result = await fetchdata(symbol)
                results.push(result)
              
            } catch (error) {
                console.log(error)
            }
          }

          filteredList.forEach((item, index)=>{
                // URLList.push(`https://finnhub.io/api/v1/stock/profile2?symbol=${item.Symbol}&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0`)
                // updatePfOverview(item.Symbol)
                let datafile = fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${item.Symbol}&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0`)
                URLList.push(datafile)
          })

            // setTimeout(()=>{
            //     console.log("hi")
            //     console.log(results)
            // },3000)
            
        
            
            if(URLList.length === filteredList.length){
                console.log(URLList)
                Promise.all(URLList).then(function (responses){
                    console.log(responses)
                    responses.forEach((url)=>{
                        process(url.json())
                    })
                }).catch(function (error) {
                    // if there's an error, log it
                    console.log(error);
                });
            }

            let process = (prom) => {
                
                prom.then(data=>{
                    dlist.push(data)
                    console.log(data)
                })
             
            }

            setTimeout(()=>{setstockOverview(dlist)},1000)
    },[filteredList])

//https://finnhub.io/api/v1/quote?symbol=MSFT&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0
    const [stockQuote, setstockQuote] = useState([])
    let QuoteURLList = []
    let qlist = [] 
    useEffect(()=>{
        console.log(stockOverview)

        filteredList.forEach((item, index)=>{
            // URLList.push(`https://finnhub.io/api/v1/stock/profile2?symbol=${item.Symbol}&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0`)
            // updatePfOverview(item.Symbol)
            let datafile = fetch(`https://finnhub.io/api/v1/quote?symbol=${item.Symbol}&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0`)
            // QuoteURLList.push({
            //     "ticker": item.Symbol,
            //     "data": datafile
            // })
            QuoteURLList.push(datafile)
      })

        if(QuoteURLList.length === filteredList.length){
            console.log(QuoteURLList)
            Promise.all(QuoteURLList).then(function (responses){
                console.log(responses)
                responses.forEach((item, i)=>{
                    process2(item.json(), filteredList[i].Symbol)
                })
            }).catch(function (error) {
                // if there's an error, log it
                console.log(error);
            });
        }

        let process2 = (prom, ticker) => {
            
            prom.then(data=>{
                qlist.push({"ticker": ticker, "quote_data": data})
                console.log(data)
            })
         
        }
        setTimeout(()=>{
            setstockQuote(qlist)
        },1000)
    },[stockOverview])

    //capture everything into one list
    const [summary, setSummary] = useState([])
    useEffect(()=>{
        console.log(filteredList)
        console.log(stockOverview)
        console.log(stockQuote)
        const StocksSummary = filteredList
        console.log(StocksSummary)
        StocksSummary.forEach((summary, i)=>{
            stockOverview.forEach((overview, j)=>{
                if(summary.Symbol === overview.ticker){
                    // console.log(summary.Symbol, overview.ticker)
                    StocksSummary[i]["Sector"] = overview.finnhubIndustry
                    StocksSummary[i]["name"] = overview.name
                    StocksSummary[i]["marketcap"] = overview.marketCapitalization
                    StocksSummary[i]["Sector"] = overview.finnhubIndustry
                    StocksSummary[i]["logo"] = overview.logo
                }
            })

            stockQuote.forEach((quote, j)=>{
                if(summary.Symbol === quote.ticker){
                    console.log(summary.Symbol, quote.ticker)
                    StocksSummary[i]["Current_Price"] = quote.quote_data.c
                    StocksSummary[i]["Change"] = quote.quote_data.d
                    StocksSummary[i]["Percent_Change"] = quote.quote_data.d
                    StocksSummary[i]["Previous_Close_price"] = quote.quote_data.d
                    StocksSummary[i]["Highest_price"] = quote.quote_data.h
                    StocksSummary[i]["Open_price"] = quote.quote_data.o
                    StocksSummary[i]["Position_Value"] = quote.quote_data.c * StocksSummary[i].Total_Shares
                    StocksSummary[i]["Amount_Paid"] = StocksSummary[i].Total_Shares * StocksSummary[i].AverageCostPerShare
                    StocksSummary[i]["Total_Return"] = ((quote.quote_data.c*StocksSummary[i].Total_Shares) - (StocksSummary[i].Total_Shares*StocksSummary[i].AverageCostPerShare))
                }
            })
        })

        // StocksSummary.forEach((item, index)=>{
            
        // })
       

        setTimeout(()=>{
            console.log(StocksSummary)
            setSummary(StocksSummary)
        },1000)
    },[stockQuote])

    const[allocationSum, setallocationSum] = useState(0)
    const[paidamoutSum, setpaidamountSum] = useState(0)
    const[totalreturnSum, settotalreturnSum] = useState(0)
    useEffect(()=>{
        let t = 0
        let t2 = 0
        let t3 = 0
        summary.forEach((item, i)=>{
            t = t + item.Position_Value
            t2 = t2 + item.Amount_Paid
            t3 = t3 + item.Total_Return            
        })
        setpaidamountSum(t2)
        setallocationSum(t)
        settotalreturnSum(t3)
    },[summary])


  return (
    <div>
    <div className=' text-white grid grid-cols-1 gap-2 sm:grid-cols-1 grid-rows auto-rows-fr'>
     <div className=' text-white grid grid-cols-1 gap-2 sm:grid-cols-1 pt-20 grid-rows auto-rows-fr'>
        <div className='m-3 row-span-5 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
                <div className='relative overflow-hidden rounded-lg  w-full'>
                    <div className="overflow-hidden rounded-lg flex border border-gray-200 shadow-md w-full">
                        <div className="w-full flex border-collapse  text-left text-sm text-gray-500">
                                    <table className="table  text-gray-400 space-y-6 text-sm w-full">
                                            <thead className="bg-gray-800 text-gray-500 w-full">
                                                    <tr>
                                                        <th className="p-3 text-left">Symbol</th>
                                                        <th className="p-3 text-left">Allocation (%)</th>
                                                        <th className="p-3 text-left">Cost Basis ($)</th>
                                                        <th className="p-3 text-left">Sector</th>
                                                        <th className="p-3 text-left">Size</th>
                                                        <th className="p-3 text-left">Market Cap (B)</th>
                                                        <th className="p-3 text-left">Shares</th>
                                                        <th className="p-3 text-left">Unit Basis ($)</th>
                                                        <th className="p-3 text-left">Price ($)</th>
                                                        <th className="p-3 text-left">Position Value ($)</th>
                                                        <th className="p-3 text-left">Dividents Recieved ($)</th>
                                                        <th className="p-3 text-left">Amount Paid ($)</th>
                                                        <th className="p-3 text-left">Total Return ($)</th>
                                                        <th className="p-3 text-left">Portfolio Return ($)</th>
                                                        <th className="p-3 text-left">First Buy Date</th>
                                                        <th className="p-3 text-left">Last Buy Date</th>
                                                        <th className="p-3 text-left">Last Sell Date</th>
                                                    </tr>
                                            </thead>
                                            <tbody>
                                                {summary.map((item, index)=>{
                                                    return (
                                                        <tr class="bg-gray-800" key={index}>
                                                            <td class="p-3">
                                                                <div class="flex align-items-center">
                                                                <img class="rounded-full h-12 w-12  object-cover" src={item.logo} alt="unsplash image"/>
                                                                    <div class="ml-3">
                                                                        <div class="">{item.Symbol}</div>
                                                                        <div class="text-gray-500">{item.name}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-50 rounded-md px-2">{((item.Position_Value/allocationSum)*100).toFixed(2)}</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-50 rounded-md px-2">{((item.Amount_Paid/paidamoutSum)*100).toFixed(2)}</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <div class="flex align-items-center">
                                                                    <span class="text-gray-20 rounded-md px-2 text-center">{item.Sector}</span>
                                                                </div>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-50 rounded-md px-2">-</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-20 rounded-md px-2">{(item.marketcap/100).toFixed(2)}</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-50 rounded-md px-2">{item.Total_Shares}</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-50 rounded-md px-2">{item.AverageCostPerShare.toFixed(2)}</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-50 rounded-md px-2">{item.Current_Price}</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-50 rounded-md px-2">{(item.Current_Price*item.Total_Shares).toFixed(2)}</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-50 rounded-md px-2">-</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-50 rounded-md px-2">{(item.Total_Shares*item.AverageCostPerShare).toFixed(0)}</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <div class="flex align-items-center">
                                                                    <div class="ml-3">
                                                                        <div class="">{((item.Current_Price*item.Total_Shares) - (item.Total_Shares*item.AverageCostPerShare)).toFixed(2)}</div> 
                                                                        <div class="text-gray-500">{(((item.Current_Price*item.Total_Shares) - (item.Total_Shares*item.AverageCostPerShare))/(item.Total_Shares*item.AverageCostPerShare)*100).toFixed(2) + "%"}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-50 rounded-md px-2">{(-item.Total_Return/totalreturnSum * 100).toFixed(2)}</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-20 rounded-md px-2">{item.First_Buy_Date}</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-20 rounded-md px-2">{item.Last_Buy_Date}</span>
                                                            </td>
                                                            <td class="p-3">
                                                                <span class="text-gray-20 rounded-md px-2">{item.Last_Sell_Date}</span>
                                                            </td>
                                                        </tr>

                                                )
                                                })}
                                            </tbody>
                                    </table>
                                </div>
                            
                        </div>
                    </div> 
                </div>
            </div>
        </div>

        <div className=' text-white grid grid-cols-1 gap-2 sm:grid-cols-2 pt-20 grid-rows-1 auto-rows-fr'>
            <div className='m-3 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[600px] flex justify-center align-center'>
                <PieChartVis Summary = {summary} PMS = {paidamoutSum}/>
            </div>
            <div className='m-3 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
                  <BarChartVis Summary = {summary} PMS = {paidamoutSum}/>                              	
            </div>
            
        </div>     

        <div className=' text-white grid grid-cols-1 gap-2 sm:grid-cols-1 grid-rows-1 auto-rows-fr'>
        <div className='m-3 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
                <ComparingStocksVis Summary = {summary}/>
            </div>
        </div>

        <div className=' text-white grid grid-cols-1 gap-2 sm:grid-cols-1 grid-rows-6 auto-rows-fr'>
        <div className='m-3 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
               <StackedBarChart Summary = {summary}/>
            </div>
        </div>
    
    </div>
  )
 
}

export default PortfolioTracker