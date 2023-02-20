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
// import {onSnapshot} from 'firebase/firestore'

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
    console.log(currentUser.uid)

const [mylistofStockDetail, setmylistofStockDetail] = useState([])



// Database stuff
const [getdatabasetickers, setdatabasetickers] = useState([])
const [refresh, setrefresh] = useState(0)
const [arrlen, setarrlen] = useState(null)
let dbtickarrlen = 0
const [idList, setidstate] = useState([])
useEffect(()=>{
     onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
                // setidstate(Object.keys(snapshot.val()))
                let firebaseContents = []
                Object.values(snapshot.val()).map((project, item) => {  
                    //  fireba
                        console.log(project)
                    })     
                })


    setrefresh(refresh+1)
},[])

const [values, setValues] = useState([])
const [count, setcount] = useState(null)


useEffect(()=>{
 
    console.log(len) 
    let mycount = 0
    if (refresh === 1) {
        console.log(idList)
        const collectionRef = ref(getDatabase(), 'users/' + currentUser.uid + '/tickers')
        console.log(collectionRef)
        console.log(collectionRef)
        // const query = collectionRef.where('state', '==', 'CA');
        // const snapshot = await query.count().get();
        // console.log(snapshot.data().count);

        console.log(refresh)
        console.log("hi")
       
        let outerarr = []
        onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
            console.log("inner")
            Object.values(snapshot.val()).map((project, i) => {
                mycount = mycount + 1
                console.log("outer")
                console.log(project.details)
              
                // setValues((values) => [...values, project])
                const updateAllDetails = async () => {
                  console.log(alldetails)
                    let arr = []
                    try {
                        let result1 = await fetchStockDetails(project.portfoliostockSymbol)
                        arr.push(result1)
    
                    } catch (error) {
                        console.log(error)
                    }
    
                    try {
                        let result2 = await fetchQuote(project.portfoliostockSymbol)
                        arr.push(result2)
            
                    } catch (error) {
                        console.log(error)
                    }
    
                    if (arr.length>0) {
                        console.log(arr)
                        // arr[i]['Shares'] = {Shares: project.details.Shares, AverageCostPerShare:project.details.AverageCostPerShare}
                        outerarr.push(arr)
                        // setalldetails([...alldetails, arr])
                                    // setTimeout(() => {
                                    //     setalldetails([...alldetails, arr])
                                    // }, 1000);
                     }

                  }
                  console.log(outerarr)
                   updateAllDetails()

                   

                })     
            })

            console.log(outerarr.length)
            // outerarr[i]['Shares'] = {Shares: project.details.Shares, AverageCostPerShare:project.details.AverageCostPerShare}
            let i = 0
            // while (i < 1001){
            //     console.log(i)
            //     i++
            //     if (i === 1000){
            //         console.log(outerarr)
                   
            //     }
            // }
            setTimeout(() => {
                console.log(outerarr)
                console.log(outerarr.length)
               console.log(alldetails)
               setcount(mycount)
               //alldetails.slice(0, count).concat(alldetails.slice(2*count+1))
                setalldetails(outerarr)
                // setalldetails(outerarr.slice(0, count).concat(alldetails.slice(2*count+1)))
               }, 1000);
    }
    // console.log("use effect is here")
    // const mydbtickerlist = []  
    // onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {    
    //     Object.values(snapshot.val()).map((project) => {
    //             mydbtickerlist.push(project.portfoliostockSymbol)   
    //         })   
    //         console.log(snapshot)
    //     })
        // setdatabasetickers(mydbtickerlist)
        
}, [refresh])



////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // let currentshares = 0
    // let current_sv = 0
    const [currentshares, setcurrentshares] = useState(null)
    const [current_sv, setcurrent_sv] = useState(null)

    function DeleteButton(event){
        console.log(event.target.value)
    }

    function togglePopup(idx, shares, shares_value, e){
        // currentshares = shares
        // current_sv = shares_value
        setcurrentshares(shares)
        setcurrent_sv(shares_value)
        setindex(idx)
        //setrecordsforedit(records[idx])
        setOpenPopup(true)
        setrecords(userService.getAllUsers())
        console.log(records)
        console.log("////////////////////////////////")
    }

    

    let updatedDetailsFlag = true
    // async function updatefirestore(tickersymbol, results){
    //     // const updatedDetails = {
    //     //     details : results
    //     // }

    //     try{
    //         // const userRef = ref(getDatabase(), 'users/' + currentUser.uid + '/tickers')
    //         onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
    //             const listkeys = Object.keys(snapshot.val())
    //             Object.values(snapshot.val()).map((project, item) => {
    //                     // console.log(Object.keys(snapshot.val()))
    //                     if ((project.portfoliostockSymbol === tickersymbol) && (project.details === '')){
    //                         console.log(project.details)
    //                         console.log(project.portfoliostockSymbol)
    //                         const db = getDatabase()
    //                         const reference = ref(db, 'users/' + currentUser.uid + '/tickers/' + listkeys[item])
    //                             console.log(updatedDetailsFlag)
    //                             if(updatedDetailsFlag === true){
    //                                 updatedDetailsFlag = false
    //                                 console.log(reference)
    //                                 update(reference,{
    //                                     details: results
    //                                 });
                                    
    //                             }
    //                     }
                        
    //                     // if ((project.portfoliostockSymbol === tickersymbol) && (project.details.Shares === currentshares) && (project.details.AverageCostPerShare === current_sv)) {
    //                     //     console.log('dfsfsfasfdsf')
    //                     //     const db = getDatabase()
    //                     //     const reference = ref(db, 'users/' + currentUser.uid + '/tickers/' + listkeys[item])
    //                     //     if(updatedDetailsFlag === true){
    //                     //         updatedDetailsFlag = false
    //                     //         console.log(reference)
    //                     //         update(reference,{
    //                     //             details: results    
    //                     //         });
                                
    //                     //     }
    //                     // }
    //                      else {
    //                         console.log("not matched")
    //                     }
                        
    //                 })     
    //             })
    //     }catch(error){
    //         console.log(error)
    //     }
    // }
    function storeDetailsinDatabase(tickersymbol, results){
        console.log(currentshares, current_sv)
        onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
            console.log(snapshot)
            console.log(snapshot.val())
            const listkeys = Object.keys(snapshot.val())
            Object.values(snapshot.val()).map((project, item) => {
                    console.log(project)
                    console.log(Object.keys(snapshot.val()))
                    if ((project.portfoliostockSymbol === tickersymbol) && (project.details === '')){
                        console.log(project.details)
                        console.log(project.portfoliostockSymbol)
                        const db = getDatabase()
                        const reference = ref(db, 'users/' + currentUser.uid + '/tickers/' + listkeys[item])
                            // const newPostRef = push(reference);
                            console.log(updatedDetailsFlag)
                            if(updatedDetailsFlag === true){
                                updatedDetailsFlag = false
                                console.log(reference)
                                update(reference,{
                                    details: results
                                });
                                
                            }
                    }
                    
                    if ((project.portfoliostockSymbol === tickersymbol) && (project.details.Shares === currentshares) && (project.details.AverageCostPerShare === current_sv)) {
                        console.log('dfsfsfasfdsf')
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
        // const db = getDatabase()
        // const reference = ref(db, 'users/' + currentUser.uid + '/tickers')
        // if(portfoliostockSymbol!==""){
        //     const newPostRef = push(reference);
        //     set(newPostRef, {
        //         portfoliostockSymbol,
                
        //     });
        // }
    }
    
const [clickedstock, setclickedstock] = useState(true)
    useEffect(() => {
        console.log(Results)
        console.log(alldetails)
        for(let i=0; i<alldetails.length; i++){
            for (let j=0; j< Results.length; j++){
                console.log(j)
                if(i === Results[j].id){ 
                    setclickedstock(false)

                    storeDetailsinDatabase(alldetails[i][0].ticker, Results[0])
                    // updatefirestore(alldetails[i][0].ticker, Results[0])
                    console.log(alldetails[i][0].ticker)
                    alldetails[i]['Shares'] = Results[j]
                    console.log(alldetails)

                    console.log(alldetails.slice(0, count).concat(alldetails.slice(2*count+1)))
                    let l = alldetails.length
                    setalldetails(alldetails.slice(0,l))
                    // setTimeout(()=>{setalldetails(alldetails.slice(0,l))},1000)
                    // setalldetails(alldetails.slice(0, count).concat(alldetails.slice(2*count+1)))
                    // console.log(alldetails.length)
                //    setalldetails(alldetails)
                    //setTimeout(()=>{storeDetailsinDatabase(alldetails[i][0].ticker, Results[0])},2000)
                    
                }
            }

            
        }

        // for(let i=0; i<alldetails.length; i++){
        //     for (let j=0; j< Results.length; j++){
        //         console.log(j)
        //         if(i === Results[j].id){
        //             console.log(alldetails[i][0].ticker)
        //            storeDetailsinDatabase(alldetails[i][0].ticker, Results[0])
                    
        //         }
        //     }

            
        // }
        console.log(Results)

        
        console.log(alldetails)
        localStorage.clear()
    }, [Results])

    const [projects, setProjects] = useState([]);

    const [usersdata, setusersdata] = useState([])

    async function pastData(item){
        let arr = []
        // let tic = (tic).toString()
        try {
            let result1 = await fetchStockDetails(item)
            arr.push(result1)
    
        } catch (error) {
            console.log(error)
        }
    
        try {
            let result2 = await fetchQuote(item)
            arr.push(result2)
    
        } catch (error) {
            console.log(error)
        }
    
        if (arr.length>0) {
            return arr

        }
    }

 

    const [clickedsearch, setclickSearch] = useState(false)
    const [searchTimes, setsearchTimes] = useState(0)
    
    useEffect(() => {

        // projects.map((item  )=>{
        //     console.log(item.portfoliostockSymbol)
        // })

            // const db = getDatabase()
            // const reference = ref(db, 'users/' + currentUser.uid)
            // set(reference, {
            //     tickerList : tickerSymbols,
            //     details : alldetails
            //  })

            const db = getDatabase()
            const reference = ref(db, 'users/' + currentUser.uid + '/tickers')
            if(portfoliostockSymbol!==""){
                const newPostRef = push(reference);
                set(newPostRef, {
                    portfoliostockSymbol,
                    details: ""
                    
                });
            }

        
            // const db = getDatabase()
            // const query = ref(db, 'users/' + currentUser.uid)
            // return onValue(query, (snapshot) => {
            //     const data = snapshot.val();
            //     console.log(data)
            //     if (snapshot.exists()) {
            //       Object.values(data).map((project) => {
            //         setProjects((projects) => [...projects, project]);
            //       });
            //     }
            //   });
      
        console.log(alldetails)
     
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
                    console.log(arr)
                    console.log(alldetails)
                    // if(alldetails.length >= 1) {
                    //     // alldetails.push()
                    //     co
                    //     setalldetails(current => [...current, arr])
                    // }
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
                            // if (alldetails.length===1){
                            //     console.log("here")
                            //     setalldetails([...alldetails, arr])
                            // }else{
                            //     setalldetails(alldetails.slice(0, count).concat(alldetails.slice(2*count+1)))
                            //     setalldetails([...alldetails, arr])
                            // }
                 
                            console.log(alldetails)
                            console.log(alldetails.length)
                        //    console.log(alldetails.slice(0, count).concat(alldetails.slice(2*count+1)))
        
                        },
                        2000
                    )
                    
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
 
       
      
    //    writeUserData(currentUser.uid, tickerSymbols, alldetails)
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
                    
                        {/* <tr class="bg-gray-800">
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
                        </tr> */}
                        {/* {console.log(searchTimes)} */}
                        {console.log(alldetails)}
                        {console.log(count)}
                        {console.log(clickedsearch)}
                        {console.log(clickedstock)}
                        {clickedsearch && console.log(count)}
{/* {.slice(0,searchTimes)} */}
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
                                        {/* {(quote[index].pc)} */}
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
                       
                        { (clickedstock===true & count>0)&&alldetails.slice(0,count).map((item, index) => {
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
                                        {/* {(quote[index].pc)} */}
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
                                        {/* {(quote[index].pc)} */}
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
                                        {/* {(quote[index].pc)} */}
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

        {/*  */}

        
        <Popup openPopup = {openPopup} setOpenPopup={setOpenPopup}>
           
            <UserForm idx = {index} setOpenPopup={setOpenPopup}/>
            
        </Popup>

    </div>

  )
}

export default PortfolioTable