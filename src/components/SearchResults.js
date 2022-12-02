import { symbol } from 'd3'
import React from 'react'

function SearchResults({results}) {
  return (
    <ul className='absolute top-12 border-2 w-full rounded-md h-64 overflow-y-scroll bg-white border-neutral custom-scrollbar'>
        {results.map((item) => {
            return (
                <li key={item.symbol} className="cursor-pointer p-4 m-2 flex items-center justify-between rounded-md hover:bg-green-200 ">
                <span>{item.symbol}</span>
                <span>{item.description}</span>
                </li>
                
            )

        })}

    </ul>
  )
}

export default SearchResults