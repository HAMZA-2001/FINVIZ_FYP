import { UsersIcon } from '@heroicons/react/solid'
import { list, Result } from 'postcss'
import React, { useContext, useRef, useState }  from 'react'
import { useEffect } from 'react'
import { fetchQuote, fetchStockDetails } from '../api/stock-api'
import UserForm from './constants/UserForm/UserForm'
import Popup from './Popup'
import PortfolioHeader from './PortfolioHeader'
import StockPortfolioContext from './StockPortfolioContext'
import * as userService from "./constants/UserForm/userService"
import EditStockContext from './EditStockContext'


function PortfolioTable() {
    const {portfoliostockSymbol, Results} = useContext(StockPortfolioContext)
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

    const [openPopup, setOpenPopup] = useState(false)
    const [records, setrecords] = useState(userService.getAllUsers())

    const [recordsforedit, setrecordsforedit] = useState(null)
    const [index, setindex] = useState(null) 

    // const {Results} = useContext(StockPortfolioContextntext)

    // function findStockDetails(listofstocks){

    //     listofstocks.forEach(element => {
    //         console.log(element)
    //         const updatePfDetails = async (ticker) => {
    //             try {
    //                 const result = await fetchStockDetails(String(ticker))
    //                 console.log(result)


        
    //             } catch (error) {
    //                 console.log(error)
    //             }
    //           }
    //           const updatePfOverview = async (ticker) => {
    //             try {
    //                 const result = await fetchQuote(ticker)
    //                 console.log(result)

        
    //             } catch (error) {
    //                 console.log(error)
    //             }
    //           }

    //           updatePfDetails(element)
    //           updatePfOverview(element)
    //     })
    //     }
    function DeleteButton(event){
        console.log(event.target.value)
    }

    function togglePopup(idx, e){
      
        
        setindex(idx)
        //setrecordsforedit(records[idx])
        setOpenPopup(true)
        setrecords(userService.getAllUsers())
        console.log(records)
        console.log("////////////////////////////////")
    }
    
    // useEffect(() => {
    //     console.log(records)
       
    //     console.log("hey")
    //     // console.log(records)
        // alldetails.map((item, idx) => {
        //     console.log(records.length)
        //     if (records!=[]){
        //         records.map((recorditems, rec_idx)=>{
        //               console.log(records[rec_idx].id) 
        //               if(idx === recorditems.id){
        //                 if(rec_idx+1<records.length){
        //                     if(records[rec_idx].id!==records[rec_idx+1].id){
        //                         alldetails[idx]["Shares"] = recorditems
        //                         setalldetails(alldetails)
        //                     }
        //                 }else{
        //                     console.log("length is qual")
        //                 }
        //               }else{
        //                     console.log(item)
        //                 }
                
                    
        //         })
              
        //     }
    //         // for(let i = 0; i < records.length; i++){
    //         //     console.log(records[i])
    //         //     if(parseInt(records[i].id) !== undefined){
    //         //         console.log(records[i].id)
    //         //         if (idx === parseInt(records[i].id)){
    //         //             if(i+1<(records.length-1)){
    //         //                 console.log("yessss")
    //         //                 if(parseInt(records[i].id)!==parseInt(records[i+1].id)){
    //         //                 setalldetails(alldetails[idx].push(records[i]))
    //         //             }
    //         //             }else{
    //         //                 console.log("noooo")
    //         //             }

                        
    //         //     }
    //         //     }
    //         // }
    //         // if(records[idx].id !== null){
    //         //     if (idx === records[idx].id){
    //         //     if(records[idx].id!==records[idx+1].id)
    //         //     setalldetails(alldetails[idx].push(records[idx]))
    //         // }
    //         // }

    //     })
    //     console.log(alldetails)
    // }, [records])
    
    useEffect(() => {
        console.log(Results)
        // alldetails.map((item, idx) => {
        //     console.log(Results.length)
        //     if (Results!=[]){
        //         Results.map((recorditems, rec_idx)=>{
        //               console.log(records[rec_idx].id) 
        //               if(idx === recorditems.id){
        //                 if(rec_idx+1<Results.length){
        //                     if(Results[rec_idx].id!==Results[rec_idx+1].id){
        //                         alldetails[idx]["Shares"] = recorditems
        //                         setalldetails(alldetails)
        //                     }
        //                 }else{
        //                     console.log("length is qual")
        //                 }
        //               }else{
        //                     console.log(item)
        //                 }
                
                    
        //         })
              
        //     }})
    }, [Results])


    useEffect(() => {
        console.log(records)
        if (shouldLog.current === true){
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
                    setalldetails([...alldetails, arr])
                }

              
              }

            const updatePfDetails = async () => {
                try {
                    const result = await fetchStockDetails(portfoliostockSymbol)
                    const result2 = await fetchQuote(portfoliostockSymbol)
                    console.log(result)
                    settest1(result)
                    setStockDetails([...stockDetails, result])
                    // pfresults = result
                    // setresultname({"tic":result.ticker, "name":result.name})
        
                } catch (error) {
                    setStockDetails([...stockDetails])
                    console.log(error)
                }
              }
        
              const updatePfOverview = async () => {
                try {
                    const result = await fetchQuote(portfoliostockSymbol)
                    console.log(result)
                    settest2(result)
                    setQuote([...quote, result])
        
                } catch (error) {
                    setQuote([...quote])
                    console.log(error)
                }
              }
              updatePfDetails() // details result
              updatePfOverview() // quote result
              updateAllDetails()
              setstockList([...stockList, portfoliostockSymbol])
            //   itemsList.push({"symbol":portfoliostockSymbol, "data":pfresults})
        
              console.log(stockList)
              console.log(resultname)
            //   findStockDetails(stockList.slice(1))

        }
        else{
            // setStockDetails({})
            shouldLog.current = true
        }
        
        console.log(stockList)
        console.log([...stockDetails])
 
       
        
      
      }, [portfoliostockSymbol])
      
  return (

    <div className='relative overflow-hidden rounded-lg border border-gray-200 shadow-md w-full'>

        <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md w-full">
            <div class="w-full border-collapse bg-white text-left text-sm text-gray-500">
                <table class="table  text-gray-400 space-y-6 text-sm w-full">
                    <thead class="bg-gray-800 text-gray-500">
                        <tr>
                    
                            <th class="p-3 text-left">Symbol</th>
                            <th class="p-3 text-left">Price</th>
                            <th class="p-3 text-left">Change %</th>
                            <th class="p-3 text-left">Shares</th>
                            <th class="p-3 text-left">Cost</th>
                            <th class="p-3 text-left">Today's Gain</th>
                            <th class="p-3 text-left">Today's % Gain</th>
                            <th class="p-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-gray-800">
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <img class="rounded-full h-12 w-12  object-cover" src="https://images.unsplash.com/photo-1613588718956-c2e80305bf61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80" alt="unsplash image"/>
                                    <div class="ml-3">
                                        <div class="">MSFT</div>
                                        <div class="text-gray-500">Microsoft Corperation</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">258.3</div>
                                        <div class="text-gray-500">Post 258.20</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">-6.25</div>
                                        <div class="text-gray-500">-0.15</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">12</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">-</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">-</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">-</span>
                            </td>
                            <td class="p-3 ">
                                <a href="#" class="text-gray-400 hover:text-gray-100  mx-2">
                                    <i class="material-icons-outlined text-base">Edit</i>
                                </a>
                                <a href="#" class="text-gray-400 hover:text-red-100  ml-2">
                                    <i class="material-icons-round text-base">Delete</i>
                                </a>
                            </td>
                        </tr>
                        
                        {console.log(alldetails)}
                       
                        { alldetails.map((item, index) => {
                            return (
                                <tr class="bg-gray-800">
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
                                        {/* {(quote[index].pc)} */}
                                        <div class="text-gray-500">Post 258.20</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <div class="flex align-items-center">
                                    <div class="ml-3">
                                        <div class="">{(item[1].d)}</div>
                                        <div class="text-gray-500">-0.15</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">{item['Shares'] && item['Shares'].Shares}</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">-</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">-</span>
                            </td>
                            <td class="p-3">
                                <span class="text-gray-50 rounded-md px-2">-</span>
                            </td>
                            <td class="p-3 ">
                                <a href="#" class="text-gray-400 hover:text-gray-100  mx-2">
                                    <i class="material-icons-outlined text-base" onClick={togglePopup.bind(this, index)}>Edit</i>
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