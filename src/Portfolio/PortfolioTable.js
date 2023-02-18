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
import { getDatabase, onValue, push, ref, set } from 'firebase/database'

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
useEffect(()=>{
   
    setrefresh(refresh+1)
},[])

const [values, setValues] = useState([])
const [count, setcount] = useState(null)




// onValue(reference, (snapshot) => {
        //     const data = snapshot.val()
        //     Object.values(data).map((project) => {
                
        //         //   updateAllDetails(pro)
        //         console.log(project.portfoliostockSymbol)
        //         // setProjects((projects) => [...projects, project]);
        //         mylistofStocks.push(project.portfoliostockSymbol)
        //         // setportfoliostockSymbol(project.portfoliostockSymbol)
        //         // setTickerSymbols([...tickerSymbols, portfoliostockSymbol])
                
        //       });
        //     //   setTickerSymbols(item)
        //     console.log(mylistofStocks)  
        //     mylistofStocks.map((item)=>{
        //         // const updateAllDetails2 = async () => {
        //         //     let arr = []
        //         //     try {
        //         //         let result1 = await fetchStockDetails(item)
        //         //         arr.push(result1)
            
        //         //     } catch (error) {
        //         //         console.log(error)
        //         //     }
            
        //         //     try {
        //         //         let result2 = await fetchQuote(item)
        //         //         arr.push(result2)
            
        //         //     } catch (error) {
        //         //         console.log(error)
        //         //     }
            
        //         //     if (arr.length>0) {
        //         //         setalldetails([...alldetails, arr])
        //         //     }
            
        //         //     console.log()
        //         //   }
               
                    
        //     })
    
           
        // })

useEffect(()=>{
 
    console.log(len) 
    let mycount = 0
    if (refresh === 1) {
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
            Object.values(snapshot.val()).map((project) => {
                mycount = mycount + 1
                console.log("outer")
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
            // while(outerarr.length!==2){
            //     console.log("waiting")
            // }
            console.log(outerarr.length)
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
                setalldetails(outerarr)
               }, 800);
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

// const mydbtickerlist = []  
// onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {    
//     Object.values(snapshot.val()).map((project) => {
//             mydbtickerlist.push(project.portfoliostockSymbol)    
//         })   
//         console.log(snapshot)
//     })
// setdatabasetickers(mydbtickerlist)

// useEffect(()=>{
//     console.log("use effect is here")
//     const mydbtickerlist = []  
//     onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {    
//         Object.values(snapshot.val()).map((project) => {
//                 mydbtickerlist.push(project.portfoliostockSymbol)   
//             })   
//             console.log(snapshot)
//         })
//         // setdatabasetickers(mydbtickerlist)
// }, [getdatabasetickers])



// useEffect(()=>{
//     console.log("useeffect is ran")
//         if(shouldLog2.current === false){
//             console.log(mylistofStockDetail2)
//         let mylistofStockDetails = []
//         let tickarray = []
        
        
//         onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
            
//             Object.values(snapshot.val()).map((project) => {
               
//                 // const updateAllDetails = async () => {
//                 //     let arr = []
//                 //     try {
//                 //         let result1 = await fetchStockDetails(project.portfoliostockSymbol)
//                 //         arr.push(result1)
    
//                 //     } catch (error) {
//                 //         console.log(error)
//                 //     }
    
//                 //     try {
//                 //         let result2 = await fetchQuote(project.portfoliostockSymbol)
//                 //         arr.push(result2)
            
//                 //     } catch (error) {
//                 //         console.log(error)
//                 //     }
    
//                 //     if (arr.length>0) {
//                 //         console.log(arr)
//                 //         console.log(alldetails)
                        
//                 //         mylistofStockDetail2.push(arr)
//                 //         // console.log(mylistofStockDetail2)
//                 //         setmylistofStockDetail([...mylistofStockDetail, mylistofStockDetail2])
//                 //     }
//                 //   }
//                 //   updateAllDetails()
//                 //   console.log(project.portfoliostockSymbol)
//                 // //   console.log(mylistofStockDetail2)
//                 // tickarray.push(project.portfoliostockSymbol)

//                 })
                
//             })

//             console.log(mylistofStockDetail2)
//         }else{
//             shouldLog2.current = true
//         }
        

// },[])

// console.log(mylistofStockDetail2)
// if(mylistofStockDetail2.length>0){
//     console.log(mylistofStockDetail2)
//     if(mylistofStockDetail2.length === 12){
//         console.log(mylistofStockDetail2)
//         setalldetails(mylistofStockDetail2)
//     }
// }

// console.log(tickinDB)





////////////////////////////////////////////////////////////////////////////////////////////////////////////


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


    // const mylistofStocks = []
    //     const db = getDatabase()
    //     const reference = ref(db, 'users/' + currentUser.uid + '/tickers')
    //     onValue(reference, (snapshot) => {
    //         const data = snapshot.val()
    //         Object.values(data).map((project) => {
                
    //             //   updateAllDetails(pro)
    //             console.log(project.portfoliostockSymbol)
    //             // setProjects((projects) => [...projects, project]);
    //             mylistofStocks.push(project.portfoliostockSymbol)
    //             // setportfoliostockSymbol(project.portfoliostockSymbol)
    //             // setTickerSymbols([...tickerSymbols, portfoliostockSymbol])
                
    //           });
    //         //   setTickerSymbols(item)
    //         console.log(mylistofStocks)  
    //         mylistofStocks.map((item)=>{
    //             // const updateAllDetails2 = async () => {
    //             //     let arr = []
    //             //     try {
    //             //         let result1 = await fetchStockDetails(item)
    //             //         arr.push(result1)
            
    //             //     } catch (error) {
    //             //         console.log(error)
    //             //     }
            
    //             //     try {
    //             //         let result2 = await fetchQuote(item)
    //             //         arr.push(result2)
            
    //             //     } catch (error) {
    //             //         console.log(error)
    //             //     }
            
    //             //     if (arr.length>0) {
    //             //         setalldetails([...alldetails, arr])
    //             //     }
            
    //             //     console.log()
    //             //   }
               
                    
    //         })
    
           
    //     })

        // useEffect(()=>{
        //     console.log("changed")
        // }, [tickerSymbols])
    
    useEffect(() => {
        console.log(Results)
        // alldetails.map((item, idx) => {
        //     console.log(Results.length)
        //     if (Results!=[]){
        //         Results.map((recorditems, rec_idx)=>{
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
              
        //     }
        //     else{
        //         console.log("resutl is []")
        //     }
        
        // })
        for(let i=0; i<alldetails.length; i++){
            for (let j=0; j< Results.length; j++){
                console.log(j)
                if(i === Results[j].id){
                    alldetails[i]['Shares'] = Results[j]
                    setalldetails(alldetails)
                }
            }
        }
        
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

    // useEffect(()=>{

    //     async function pastData(item){
    //         let arr = []
    //         // let tic = (tic).toString()
    //         try {
    //             let result1 = await fetchStockDetails(item)
    //             arr.push(result1)
        
    //         } catch (error) {
    //             console.log(error)
    //         }
        
    //         try {
    //             let result2 = await fetchQuote(item)
    //             arr.push(result2)
        
    //         } catch (error) {
    //             console.log(error)
    //         }
        
    //         if (arr.length>0) {
    //             console.log("hey man")
    //             console.log(arr)
    //             setusersdata([...usersdata, arr])
    //         }
    //     }
            
        
    //     const mylistofStocks = []
    //     const db = getDatabase()
    //     const reference = ref(db, 'users/' + currentUser.uid + '/tickers')
    //     onValue(reference, (snapshot) => {
    //         const data = snapshot.val()
    //         Object.values(data).map((project) => {
                
    //             //   updateAllDetails(pro)
    //             console.log(project.portfoliostockSymbol)
    //             setProjects((projects) => [...projects, project]);
    //             mylistofStocks.push(project.portfoliostockSymbol)
    //             // setportfoliostockSymbol(project.portfoliostockSymbol)
    //             // setTickerSymbols([...tickerSymbols, portfoliostockSymbol])
                
    //           });
    //         console.log(mylistofStocks)  
    //         mylistofStocks.map((item)=>{
    //                 pastData(item)
    //         })
    
           
    //     })
    //     console.log(projects)

    // },[])

    // useEffect(()=>{
    //     console.log("////////////////////////////////")
    //     console.log(projects)
    //     async function pastData(item){
    //         let arr = []
    //         // let tic = (tic).toString()
    //         try {
    //             let result1 = await fetchStockDetails(item)
    //             arr.push(result1)
        
    //         } catch (error) {
    //             console.log(error)
    //         }
        
    //         try {
    //             let result2 = await fetchQuote(item)
    //             arr.push(result2)
        
    //         } catch (error) {
    //             console.log(error)
    //         }
        
    //         if (arr.length>0) {
    //             console.log("hey man")
    //             setalldetails([...alldetails, arr])
    //         }
    //     }

    //     projects.forEach((item) => {
    //         pastData(item.portfoliostockSymbol)
    //     })
    // },[projects])
    // mylistofStocks.map((item)=>{
    //     console.log(item)
    //     const updateAllDetails1 = async (tic) => {
    //         let arr = []
    //         // let tic = (tic).toString()
    //         try {
    //             let result1 = await fetchStockDetails(tic)
    //             arr.push(result1)

    //         } catch (error) {
    //             console.log(error)
    //         }

    //         try {
    //             let result2 = await fetchQuote(tic)
    //             arr.push(result2)
    
    //         } catch (error) {
    //             console.log(error)
    //         }

    //         if (arr.length>0) {
    //             console.log("hey man")
    //             setProjects([...projects, arr])
    //         }
    //         console.log(arr)
    //         console.log(projects)
    //       }
    //     //   setInterval(updateAllDetails1(item),1000)
    //     updateAllDetails1(item)
    // })

    const [clickedsearch, setclickSearch] = useState(false)
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
                    portfoliostockSymbol
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
                        () => setalldetails([...alldetails, arr]),
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
                        
                        {console.log(alldetails)}
                        {console.log(count)}
                        {console.log(clickedsearch)}
                        {clickedsearch && console.log(count)}
                       
                        { alldetails.slice(0, count).map((item, index) => {
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

                        { alldetails.slice(2*count+1).map((item, index) => {
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
                                    <i class="material-icons-outlined text-base" onClick={togglePopup.bind(this, ((index+1) + 2*count))}>Edit</i>
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