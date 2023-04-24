import { UsersIcon } from '@heroicons/react/solid'
import { list, Result } from 'postcss'
import React, { useContext, useLayoutEffect, useRef, useState }  from 'react'
import { useEffect } from 'react'
import { fetchQuote, fetchStockDetails } from '../api/stock-api'
import UserForm from './constants/UserForm/UserForm'
import Popup from './Popup'
import PortfolioHeader from './PortfolioHeader'
import StockPortfolioContext from './StockPortfolioContext'
import * as userService from "./constants/UserForm/userService"
import EditStockContext from './EditStockContext'
import { useAuth } from '../Authentication/context/AuthContext'
import { writeUserData } from '../firebase'
import { getDatabase, onValue, push, ref, set, update } from 'firebase/database'


let tickinDB = 0
let mylistofStockDetail2 = []
function PortfolioTable({len}) {
    const {portfoliostockSymbol, setportfoliostockSymbol, Results} = useContext(StockPortfolioContext)

    //list of stock details
    const [stockDetails, setStockDetails] = useState([])

    //list of stock quotes
    const [quote, setQuote] = useState([])

    //value of stock quotes and details
    const [test1, settest1] = useState({})
    const [test2, settest2] = useState({})

    //list of stockdetails and quotes
    const [alldetails, setalldetails] = useState([])
    const [stockList, setstockList] = useState([])
    const [resultname, setresultname] = useState({tic:undefined, name:undefined})
    
    let pfresults = {}
    const shouldLog = useRef(false)
    const shouldLog2 = useRef(false)

    const [openPopup, setOpenPopup] = useState(false)
    const [records, setrecords] = useState(userService.getAllUsers())

    const [recordsforedit, setrecordsforedit] = useState(null)
    const [index, setindex] = useState(null) 
    const [tickerSymbols, setTickerSymbols] = useState()

    const {currentUser} = useAuth()


const [mylistofStockDetail, setmylistofStockDetail] = useState([])




const [getdatabasetickers, setdatabasetickers] = useState([])
const [refresh, setrefresh] = useState(0)
const [arrlen, setarrlen] = useState(null)
let dbtickarrlen = 0
const [idList, setidstate] = useState([])
useEffect(()=>{
     onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {

                let firebaseContents = []
                Object.values(snapshot.val()).map((project, item) => {  
                        console.log(project)
                    })     
                })


    setrefresh(refresh+1)
},[])

const [values, setValues] = useState([])
const [count, setcount] = useState(null)


useEffect(()=>{
 
    let mycount = 0
    if (refresh === 1) {
        const collectionRef = ref(getDatabase(), 'users/' + currentUser.uid + '/tickers')
       
        let outerarr = []
        onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
            console.log("inner")
            Object.values(snapshot.val()).map((project, i) => {
                mycount = mycount + 1

              
                /**
                 * update all the details for the stocks by fetching data from the apis for each stock in users portfolio so they can view each of their stocks current price and much more
                 */
                const updateAllDetails = async () => {
                    let arr = []
                    try {
                        let result1 = await fetchStockDetails(project.portfoliostockSymbol)
                        arr.push(result1)
    
                    } catch (error) {
                        let notfound = {'country':'-', "currency":"-", "estimateCurrency":"-", "exchange":"-", "finnhubIndustry":"-", "ipo":"-", "logo": "-", "marketCapitalization": 0, "name": "-",
                                        "phone":"00000", "shareOutstanding": 0, "ticker":"-", "weburl":"-"}

                        arr.push(notfound)
                    }
    
                    try {
                        let result2 = await fetchQuote(project.portfoliostockSymbol)
                        arr.push(result2)
            
                    } catch (error) {
                        let notfound2 = {"c":0, "d":0, "dp":0, "h":0, "l":0, "o":0, "pc":0, "t":0}
                        arr.push(notfound2)
                    }
    
                    if (arr.length>0) {
                        arr['Shares'] = project.details
                        outerarr.push(arr)
                     }

                  }
                   updateAllDetails()

                   

                })     
            })

            let i = 0

            setTimeout(() => {
               setcount(mycount)
                setalldetails(outerarr)
               }, 2000);
    }
        
}, [refresh])



    const [currentshares, setcurrentshares] = useState(null)
    const [current_sv, setcurrent_sv] = useState(null)

    function DeleteButton(event){
        console.log(event.target.value)
    }

    /**
     * call a pop up menu
     * @param {number} idx index chosen
     * @param {number} shares number of shares
     * @param {number} shares_value cost of shares
     * @param {object} e event  
     */
    function togglePopup(idx, shares, shares_value, e){
        setcurrentshares(shares)
        setcurrent_sv(shares_value)
        setindex(idx)
        setOpenPopup(true)
        setrecords(userService.getAllUsers())
    }

    

    let updatedDetailsFlag = true

    /**
     * store the details of the chosen stock in database
     * @param {string} tickersymbol ticker symbol which is added to the portfolio
     * @param {object} results contents to be stored in the database
     */
    function storeDetailsinDatabase(tickersymbol, results){
        console.log(currentshares, current_sv)
        onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
            const listkeys = Object.keys(snapshot.val())
            Object.values(snapshot.val()).map((project, item) => {
                    console.log(project)
                    console.log(Object.keys(snapshot.val()))
                    if ((project.portfoliostockSymbol === tickersymbol) && (project.details === '')){
                        const db = getDatabase()
                        const reference = ref(db, 'users/' + currentUser.uid + '/tickers/' + listkeys[item])
                            if(updatedDetailsFlag === true){
                                updatedDetailsFlag = false
                                console.log(reference)
                                update(reference,{
                                    details: results
                                });
                                
                            }
                    }
                    
                    if ((project.portfoliostockSymbol === tickersymbol) && (project.details.Shares === currentshares) && (project.details.AverageCostPerShare === current_sv)) {
                        const db = getDatabase()
                        const reference = ref(db, 'users/' + currentUser.uid + '/tickers/' + listkeys[item])
                        if(updatedDetailsFlag === true){
                            updatedDetailsFlag = false
                            console.log(reference)
                            update(reference,{
                                details: results    
                            });
                            
                        }
                    }
                     else {
                        console.log("not matched")
                    }
                    
                })     
            })
    }
    
const [clickedstock, setclickedstock] = useState(true)
const [clicksearch, setclicksearch] = useState(false)
    useEffect(() => {
        for(let i=0; i<alldetails.length; i++){
            for (let j=0; j< Results.length; j++){
                console.log(j)
                if(i === Results[j].id){ 
                    if(clicksearch === true){
                        setclickedstock(true)
                    }else{
                        setclickedstock(false)
                    }
                    

                    storeDetailsinDatabase(alldetails[i][0].ticker, Results[0])
                    console.log(alldetails[i][0].ticker)
                    alldetails[i]['Shares'] = Results[j]
                    console.log(alldetails)

                    console.log(alldetails.slice(0, count).concat(alldetails.slice(2*count+1)))
                    let l = alldetails.length
                    setalldetails(alldetails.slice(0,l))
                    
                }
            }

            
        }

        localStorage.clear()
    }, [Results])


 

    const [clickedsearch, setclickSearch] = useState(false)
    const [searchTimes, setsearchTimes] = useState(0)
    
    useEffect(() => {


            const db = getDatabase()
            const reference = ref(db, 'users/' + currentUser.uid + '/tickers')
            if(portfoliostockSymbol!==""){
                const newPostRef = push(reference);
                set(newPostRef, {
                    portfoliostockSymbol,
                    details: ""
                    
                });
            }

    

     
        if (shouldLog.current === true){
            setclickSearch(true)
            const updateAllDetails = async () => {
                let arr = []
                try {
                    let result1 = await fetchStockDetails(portfoliostockSymbol)
                    arr.push(result1)

                } catch (error) {
                    console.log(error)
                }

                try {
                    let result2 = await fetchQuote(portfoliostockSymbol)
                    arr.push(result2)
        
                } catch (error) {
                    console.log(error)
                }

                if (arr.length>0) {
                    setsearchTimes(searchTimes+1)
                    if(clickedstock===false){
                        setclicksearch(false)
                    }else{
                        setclicksearch(true)
                    }
                    
                    if (alldetails.length>0){
                        console.log(alldetails)
                        alldetails.map((items)=>{
                            console.log(items)
                        })   
                    }


                    setTimeout(
                        () => {
                            console.log(alldetails)
                            console.log(alldetails.length)
                            setalldetails([...alldetails, arr])         
                            console.log(alldetails)
                            console.log(alldetails.length)

        
                        },
                        2000
                    )
                    
                }

              
              }

              /**
               * fetches the stock curent price data from the api for the users stocks, each time when the stock is added or a page is refreshed
               */
            const updatePfDetails = async () => {
                try {
                    const result = await fetchStockDetails(portfoliostockSymbol)
                    const result2 = await fetchQuote(portfoliostockSymbol)
                    settest1(result)
                    
                    setStockDetails([...stockDetails, result])
 
                } catch (error) {
                    setStockDetails([...stockDetails])
                }
              }
              
              /**
                * fetches the stock curent overview data from the api for the users stocks, each time when the stock is added or a page is refreshed
               */
              const updatePfOverview = async () => {
                try {
                    const result = await fetchQuote(portfoliostockSymbol)
                    settest2(result)
                    setQuote([...quote, result])
        
                } catch (error) {
                    setQuote([...quote])
                }
              }
              updatePfDetails() // details result
              updatePfOverview() // quote result
              updateAllDetails()
            
              setstockList([...stockList, portfoliostockSymbol])
        }
        else{
            shouldLog.current = true
        }

      }, [portfoliostockSymbol])
      
        
  return (
    
    
    <div className='relative overflow-hidden rounded-lg border border-gray-200 shadow-md w-full'>
        {console.log(alldetails)}
        <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md w-full">
            <div class="w-full border-collapse bg-white text-left text-sm text-gray-500">
                <table class="table  text-gray-400 space-y-6 text-sm w-full">
                    <thead class="bg-gray-800 text-gray-500">
                        <tr>
                            <th class="p-3 text-left">Symbol</th>
                            <th class="p-3 text-left">Price</th>
                            <th class="p-3 text-left">Change %</th>
                            <th class="p-3 text-left">Shares</th>
                            <th class="p-3 text-left">Share Value ($)</th>
                            <th class="p-3 text-left">Total Cost/Transection ($)</th>
                            <th class="p-3 text-left">Today's Gain</th>
                            <th class="p-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    

                        { (count === 0) && alldetails.slice(1).map((item, index) => {
                            console.log(item)
                            return (
                                <tr class="bg-gray-800" key={index}>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <img class="rounded-full h-12 w-12  object-cover" src="https://images.unsplash.com/photo-1613588718956-c2e80305bf61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80" alt="unsplash image"/>
                                    <div class="ml-3">
                                        <div class="">{item[0].ticker}</div>
                                        <div class="text-gray-500">{item[0].name}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{(item[1].pc)}</div> 
                                        <div class="text-gray-500">Post 258.20</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{(item[1].d)}</div>
                                        <div class="text-gray-500">{((item[1].d/item[1].pc)*100).toFixed(2).toString()+"%"}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].Shares}</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].AverageCostPerShare}</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].AverageCostPerShare * item['Shares'].Shares}</span>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{item['Shares'] && (item[1].pc* item['Shares'].Shares - item['Shares'].AverageCostPerShare * item['Shares'].Shares).toFixed(2)}</div>
                                        <div class="text-gray-500">{((item['Shares'] && (item[1].pc* item['Shares'].Shares - item['Shares'].AverageCostPerShare * item['Shares'].Shares)/ (item['Shares'].AverageCostPerShare * item['Shares'].Shares)) * 100).toFixed(2).toString() + "%"}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3 ">
                                <a href="#" class="text-gray-400 hover:text-gray-100  mx-2">
                                    <i class="material-icons-outlined text-base" onClick={togglePopup.bind(this, index+1, item['Shares'] && item['Shares'].Shares, item['Shares'] && item['Shares'].AverageCostPerShare)}>Edit</i>
                                </a>
                                <button href="#" class="text-gray-400 hover:text-red-100  ml-2">
                                    <i class="material-icons-round text-base" value="yo" onClick={(DeleteButton.bind(this))}>Delete</i>
                                </button>
                            </td>
                        </tr>

                            )
                        }
                        ) 
                        }
                       
                        { (clickedstock===true & count>0)&&alldetails.slice(0,count).map((item, index) => {
                            return (
                                <tr class="bg-gray-800" key={index}>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <img class="rounded-full h-12 w-12  object-cover" src="https://images.unsplash.com/photo-1613588718956-c2e80305bf61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80" alt="unsplash image"/>
                                    <div class="ml-3">
                                        <div class="">{item[0].ticker}</div>
                                        <div class="text-gray-500">{item[0].name}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{(item[1].pc === undefined) ? 0 : item[1].pc}</div> 
                                        <div class="text-gray-500">Post 258.20</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{(item[1].d)}</div>
                                        <div class="text-gray-500">{((item[1].d/item[1].pc)*100).toFixed(2).toString()+"%"}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].Shares}</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].AverageCostPerShare}</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].AverageCostPerShare * item['Shares'].Shares}</span>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{item['Shares'] && (item[1].pc* item['Shares'].Shares - item['Shares'].AverageCostPerShare * item['Shares'].Shares).toFixed(2)}</div>
                                        <div class="text-gray-500">{((item['Shares'] && (item[1].pc* item['Shares'].Shares - item['Shares'].AverageCostPerShare * item['Shares'].Shares)/ (item['Shares'].AverageCostPerShare * item['Shares'].Shares)) * 100).toFixed(2).toString() + "%"}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3 ">
                                <a href="#" class="text-gray-400 hover:text-gray-100  mx-2">
                                    <i class="material-icons-outlined text-base" onClick={togglePopup.bind(this, index, item['Shares'] && item['Shares'].Shares, item['Shares'] && item['Shares'].AverageCostPerShare)}>Edit</i>
                                </a>
                                <button href="#" class="text-gray-400 hover:text-red-100  ml-2">
                                    <i class="material-icons-round text-base" value="yo" onClick={(DeleteButton.bind(this))}>Delete</i>
                                </button>
                            </td>
                        </tr>

                            )
                        }
                        ) 
                        }

                        {(clickedstock===true & count>0) && alldetails.slice(2*count+1).map((item, index) => {
                            return (
                                <tr class="bg-gray-800" key={index}>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <img class="rounded-full h-12 w-12  object-cover" src="https://images.unsplash.com/photo-1613588718956-c2e80305bf61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80" alt="unsplash image"/>
                                    <div class="ml-3">
                                        <div class="">{item[0].ticker}</div>
                                        <div class="text-gray-500">{item[0].name}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{(item[1].pc === undefined) ? 0 : item[1].pc}</div> 
                                        <div class="text-gray-500">Post 258.20</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{(item[1].d)}</div>
                                        <div class="text-gray-500">{((item[1].d/item[1].pc)*100).toFixed(2).toString()+"%"}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].Shares}</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].AverageCostPerShare}</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].AverageCostPerShare * item['Shares'].Shares}</span>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{item['Shares'] && (item[1].pc* item['Shares'].Shares - item['Shares'].AverageCostPerShare * item['Shares'].Shares).toFixed(2)}</div>
                                        <div class="text-gray-500">{((item['Shares'] && (item[1].pc* item['Shares'].Shares - item['Shares'].AverageCostPerShare * item['Shares'].Shares)/ (item['Shares'].AverageCostPerShare * item['Shares'].Shares)) * 100).toFixed(2).toString() + "%"}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3 ">
                                <a href="#" class="text-gray-400 hover:text-gray-100  mx-2">
                                    <i class="material-icons-outlined text-base" onClick={togglePopup.bind(this, ((index+1) + 2*count), item['Shares'] && item['Shares'].Shares, item['Shares'] && item['Shares'].AverageCostPerShare)}>Edit</i>
                                </a>
                                <button href="#" class="text-gray-400 hover:text-red-100  ml-2">
                                    <i class="material-icons-round text-base" value="yo" onClick={(DeleteButton.bind(this))}>Delete</i>
                                </button>
                            </td>
                        </tr>

                            )
                        }
                        ) 
                        }
                        
                        { (clickedstock===false & count>0)&&alldetails.map((item, index) => {
                            return (
                                <tr class="bg-gray-800" key={index}>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <img class="rounded-full h-12 w-12  object-cover" src={"https://images.unsplash.com/photo-1613588718956-c2e80305bf61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80"} alt="unsplash image"/>
                                    <div class="ml-3">
                                        <div class="">{item[0].ticker}</div>
                                        <div class="text-gray-500">{item[0].name}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{(item[1].pc === undefined) ? 0 : item[1].pc}</div> 
                                        <div class="text-gray-500">Post 258.20</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{(item[1].d)}</div>
                                        <div class="text-gray-500">{((item[1].d/item[1].pc)*100).toFixed(2).toString()+"%"}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].Shares}</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].AverageCostPerShare}</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].AverageCostPerShare * item['Shares'].Shares}</span>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{item['Shares'] && (item[1].pc* item['Shares'].Shares - item['Shares'].AverageCostPerShare * item['Shares'].Shares).toFixed(2)}</div>
                                        <div class="text-gray-500">{((item['Shares'] && (item[1].pc* item['Shares'].Shares - item['Shares'].AverageCostPerShare * item['Shares'].Shares)/ (item['Shares'].AverageCostPerShare * item['Shares'].Shares)) * 100).toFixed(2).toString() + "%"}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3 ">
                                <a href="#" class="text-gray-400 hover:text-gray-100  mx-2">
                                    <i class="material-icons-outlined text-base" onClick={togglePopup.bind(this, index, item['Shares'] && item['Shares'].Shares, item['Shares'] && item['Shares'].AverageCostPerShare)}>Edit</i>
                                </a>
                                <button href="#" class="text-gray-400 hover:text-red-100  ml-2">
                                    <i class="material-icons-round text-base" value="yo" onClick={(DeleteButton.bind(this))}>Delete</i>
                                </button>
                            </td>
                        </tr>

                            )
                        }
                        ) 
                        }

                        
                    </tbody>
                </table>
            </div>
        </div>



        
        <Popup openPopup = {openPopup} setOpenPopup={setOpenPopup}>
           
            <UserForm idx = {index} setOpenPopup={setOpenPopup}/>
            
        </Popup>

    </div>

  )
}

export default PortfolioTable