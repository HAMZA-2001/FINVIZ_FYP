import React, { useState } from 'react'
import { mockSearchResults } from './constants/mock'
import { XIcon, SearchIcon } from '@heroicons/react/solid'
import PortfolioSearchResults from './PortfolioSearchResults'

function StockSearch() {

    // for users query what company stocks are they looking for
    const [input, setInput] = useState("")

    //state for the best matches returned from the api
    const clear = () => {
        setInput("")
        setBestMatches([])
    }

    const updateBestMatches = () => {
        setBestMatches(mockSearchResults.result)
    }

    const [bestMatches, setBestMatches] = useState(mockSearchResults)

  return (
    <div className='flex items-center my-4 border-2 rounded-md relative z-50 w-96 bg-white border-neutral-200'>
        <input 
         type="text"
         value={input}
         className="w-full px-4 py-2 focus:outline-none rounded-md text-black" 
         placeholder='Add Stock...' 
         onChange={(event) => {
            setInput(event.target.value)
        }}
        onKeyPress={(event) => {
            if(event.key === "Enter"){
                updateBestMatches()
            }
        }}
        />
        {
            input && <button onClick={clear}>
            <XIcon className='h-4 w-4 fill-gray-500'/>
            </button>
        }

        <button onClick={updateBestMatches} className="h-8 w-8 bg-indigo-600 rounded-md flex justifu-center items-center m-1 p-2">
            <SearchIcon className='h-4 w-4 fill-gray-100'/>
        </button>

        {input && bestMatches.length > 0 ? <PortfolioSearchResults results = {bestMatches}/> : null}
    </div>
  )
}

export default StockSearch