import React from 'react'

function PortfolioSearchResults({results}) {
  return (
    <ul className="absolute top-12 border w-full rounded-md h-64 overflow-y-scroll bg-white border-neutral-200 custom-scrollbar">
{results.map((item) => {
    return (
        <li key={item.symbol} className="cursor-pointer p-4 m-2 flex items-center justify-between rounded-md hover:bg-green-200 text-black"
        >
        <span>{item.symbol}</span>
        <span>{item.description}</span>
        </li>
        
    )

})}
    </ul>
  )
}

export default PortfolioSearchResults
// {results.map((item) => {
//     return (
//         <li key={item.symbol} className="cursor-pointer p-4 m-2 flex items-center justify-between rounded-md hover:bg-green-200 "
//          onClick={()=> {
//             setStockSymbol(item.symbol)
//          }}>
//         <span>{item.symbol}</span>
//         <span>{item.description}</span>
//         </li>
        
//     )

// })}