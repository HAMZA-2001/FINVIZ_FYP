import React, { useEffect, useState } from 'react'
import PortfolioChart from './PortfolioChart'
import StockChart from './StockChart'
import { useAuth } from '../Authentication/context/AuthContext'
import { getDatabase, onValue, ref } from 'firebase/database'
import AnalysisChart from './AnalysisChart'
import Card from './Card'

function AnalysisPage() {
      const {currentUser} = useAuth()
        const [data, setData] = useState([]);
        const [sg, setsg] = useState({});
        const [sh, setsh] = useState({});
        const [totaldetails, settotaldetails] = useState({})
        const [hp, sethp] = useState({})
          useEffect(() => {
        let extractData = []
        onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
            console.log(snapshot)
            Object.values(snapshot.val()).map((project, i) => {
                console.log(project)
                if (project.details.date !== undefined){
                    const d = new Date(project.details.date)
                    const day = d.getDate().toString().padStart(2, "0");
                    const month = (d.getMonth() + 1).toString().padStart(2, "0");
                    const year = d.getFullYear().toString();

                    const formattedDate = `${year}-${month}-${day}`;
                    extractData.push({"ticker": project.portfoliostockSymbol, "date":formattedDate, "action": project.details.Action, "amount": Number(project.details.AverageCostPerShare), "shares": Number(project.details.Shares)})
                }
                
                })
             })
        setTimeout(()=>{
            setData(extractData)
            console.log(data)
        },2000)
      }, []);

      useEffect(()=>{
        console.log(data)
        let detailsfortable2 = {}
        const totalInvestment = data.reduce((acc, cur) => {
            if (cur.action === 'buy') {
              return acc + cur.amount;
            }
            return acc;
          }, 0);

          const totalSale = data.reduce((acc, cur) => {
            if (cur.action === 'sell') {
              return acc + cur.amount;
            }
            return acc;
          }, 0);

          const stockProfitLoss = data.reduce((acc, cur) => {
            if (cur.action === 'buy') {
              if (!acc[cur.ticker]) {
                acc[cur.ticker] = cur.amount;
              } else {
                acc[cur.ticker] += cur.amount;
              }
            } else if (cur.action === 'sell') {
              if (!acc[cur.ticker]) {
                acc[cur.ticker] = -cur.amount;
              } else {
                acc[cur.ticker] -= cur.amount;
              }
            }
            return acc;
          }, {});
          
          const sortedStocks = Object.keys(stockProfitLoss).sort((a, b) => stockProfitLoss[b] - stockProfitLoss[a]);
          
          console.log(`Most profitable stock: ${sortedStocks[0]}, profit/loss: ${stockProfitLoss[sortedStocks[0]]}`);
          console.log(`Least profitable stock: ${sortedStocks[sortedStocks.length - 1]}, profit/loss: ${stockProfitLoss[sortedStocks[sortedStocks.length - 1]]}`);
          detailsfortable2["Most profitable stock"] = sortedStocks[0]
          detailsfortable2["Least profitable stock"] = sortedStocks[sortedStocks.length - 1]
          detailsfortable2["Total Sales"] = totalSale
          detailsfortable2["Total Bought"] = totalInvestment


          
          // Calculate the total amount gained or lost for each stock
const stockGains = {};
    for (let i = 0; i < data.length; i++) {
    const stock = data[i].ticker;
    const amount = data[i].amount;
    const action = data[i].action;
    if (action === 'buy') {
        if (stockGains[stock]) {
        stockGains[stock] -= amount;
        } else {
        stockGains[stock] = -amount;
        }
    } else if (action === 'sell') {
        if (stockGains[stock]) {
        stockGains[stock] += amount;
        } else {
        stockGains[stock] = amount;
        }
    }
    }
console.log('Total amount gained or lost for each stock:', stockGains);
setsg(stockGains)

// Calculate the total amount gained or lost for the entire portfolio
const portfolioGains = data.reduce((total, data) => {
    const { amount, action } = data;
    const gainAmount = action === 'sell' ? amount : -amount;
    return total + gainAmount;
  }, 0);
  console.log('Total amount gained or lost for the entire portfolio:', portfolioGains);
  detailsfortable2["Amount gained or lost for the entire portfolio"] = portfolioGains

  // Total investment
const totalInvestments = data.reduce((total, transaction) => total + transaction.amount, 0);
console.log('Total investments:', totalInvestments);
detailsfortable2["Total investments"] = totalInvestments

settotaldetails(detailsfortable2)


// Stock holdings
const stockHoldings = data.reduce((holdings, transaction) => {
  if (!holdings[transaction.ticker]) {
    holdings[transaction.ticker] = 0;
  }
  holdings[transaction.ticker] += transaction.shares;
  return holdings;
}, {});
console.log('Stock holdings:', stockHoldings);
setsh(stockHoldings)

// Calculate total profit or loss
let totalProfitLoss = 0;
data.forEach((transaction) => {
  if (transaction.action === "buy") {
    totalProfitLoss -= transaction.amount;
  } else {
    totalProfitLoss += transaction.amount;
  }
});
console.log("Total Profit/Loss: ", totalProfitLoss);

const holdingPeriods = {};
const soldPeriods = {};

data.sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    } else if (a.date < b.date) {
      return -1;
    } else {
      return 0;
    }
  });
  console.log(data)

  const idx = data.findIndex(item => item.action === "buy"); 
const newArr = data.slice(idx);
console.log(newArr)

  // Initialize an object to track the holdings for each stock
const holdings = {}

// Loop through the data and populate the holdings object
data.forEach(transaction => {
  const { ticker, date, action, shares } = transaction

  // Ignore transactions where shares = 0
  if (shares === 0) {
    return
  }

  // Initialize an array for the stock if it doesn't already exist
  if (!holdings[ticker]) {
    holdings[ticker] = []
  }

  // Add the transaction to the holdings array
  holdings[ticker].push({ date, action, shares })
})

// Calculate the average holding days for each stock
const averageHoldingDays = {}
for (const [ticker, transactions] of Object.entries(holdings)) {
  // Filter out sell transactions
  const buyTransactions = transactions.filter(t => t.action === 'buy')

  // Calculate the holding days for each buy transaction
  const holdingDays = buyTransactions.map((buyTransaction, i) => {
    const sellTransaction = transactions.find(t => t.action === 'sell' && t.date > buyTransaction.date)

    if (!sellTransaction) {
      // If there is no sell transaction, assume the holding period is until the end of the data
      return (new Date() - new Date(buyTransaction.date)) / (1000 * 60 * 60 * 24)
    }

    return (new Date(sellTransaction.date) - new Date(buyTransaction.date)) / (1000 * 60 * 60 * 24)
  })

  // Calculate the average holding days and add it to the result object
  const averageHoldingDaysForTicker = holdingDays.reduce((acc, d) => acc + d, 0) / holdingDays.length
  averageHoldingDays[ticker] = averageHoldingDaysForTicker
}

console.log(averageHoldingDays)
sethp(averageHoldingDays)
  
    
         
      },[data])
  return (
    <div>
            <h1 className='text-5xl text-white font-quicksand pt-5 pb-5'>Analysis</h1>
            <div className=' text-white grid grid-cols-1 gap-2 sm:grid-cols-1 grid-rows-1 auto-rows-fr'>
                <div className='m-3 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
                    <AnalysisChart d = {data}/>
                </div>
            </div>
            <div className=' text-white grid grid-cols-1 gap-2 sm:grid-cols-4 pt-5 grid-rows-1 auto-rows-fr'>
                    <div className='m-3 text-white bg-neutral-600 rounded-lg shadow-xl min-h-[600px] flex justify-center align-center'>
                        <Card>
                            <ul className='w-full h-full flex flex-col justify-between divide-y-1'>
                                <li  className="flex-1 flex justify-between items-center">
                                            <span>Ticker</span>
                                            <span>
                                            Gained/Loss
                                            </span>
                                </li>
                                {Object.keys(sg).map((item) => {
                                
                                    return (
                                        <li key={item} className="flex-1 flex justify-between items-center">
                                        <span>{item}</span>
                                        <span className={ sg[item] < 0 ? 'text-red-300' : 'text-green-300' }>
                                           {sg[item]}
                                        </span>
                                        </li>
                                    )
                                })}

                                </ul>
                         </Card>
                    </div>
                    <div className='m-3 text-white bg-neutral-600 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
                    <Card>
                            <ul className='w-full h-full flex flex-col justify-between divide-y-1'>
                                {Object.keys(totaldetails).map((item) => {
                                
                                    return (
                                        <li key={item} className="flex-1 flex justify-between items-center">
                                        <span>{item}</span>
                                        <span >
                                           {totaldetails[item]}
                                        </span>
                                        </li>
                                    )
                                })}

                                </ul>
                         </Card>
                    </div>
                    <div className='m-3 text-white bg-neutral-600 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
                    <Card>
                            <ul className='w-full h-full flex flex-col justify-between divide-y-1'>
                                <li  className="flex-1 flex justify-between items-center">
                                            <span>Ticker</span>
                                            <span>
                                             Average Holding Period
                                            </span>
                                </li>
                                {Object.keys(hp).map((item) => {
                                
                                    return (
                                        <li key={item} className="flex-1 flex justify-between items-center">
                                        <span>{item}</span>
                                        <span className='text-green-300'>
                                           {hp[item]}
                                        </span>
                                        </li>
                                    )
                                })}

                                </ul>
                         </Card>
                    </div>
                    <div className='m-3 text-white bg-neutral-600 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
                    <Card>
                            <ul className='w-full h-full flex flex-col justify-between divide-y-1'>
                                <li  className="flex-1 flex justify-between items-center">
                                            <span>Ticker</span>
                                            <span>
                                            Stock Holdings
                                            </span>
                                </li>
                                {Object.keys(sh).map((item) => {
                                
                                    return (
                                        <li key={item} className="flex-1 flex justify-between items-center">
                                        <span>{item}</span>
                                        <span className>
                                           {sh[item]}
                                        </span>
                                        </li>
                                    )
                                })}

                                </ul>
                         </Card>
                    </div>
            
        </div>   
    </div>
    
  )
}

export default AnalysisPage