import React, { useState } from 'react'
import { mockSearchResults } from './constants/mock'
import { XIcon, SearchIcon } from '@heroicons/react/solid'
import PortfolioSearchResults from './PortfolioSearchResults'
import { searchSymbols } from '../api/stock-api'

/**
 * display search bar which shows list of all the related stocks 
 * @component
 * @returns a search bar which produces list of all the related stocks
 */
function StockSearch() {

    // for users query what company stocks are they looking for
    const [input, setInput] = useState("")
    const [bestMatches, setBestMatches] = useState([])

    //state for the best matches returned from the api
    const clear = () => {
        setInput("")
        setBestMatches([])
    }

    /**
     * update the search bar list once the input in the seach bar is changed
     */
    const updateBestMatches = async () => {
        try {
            if (input) {
                const SearchResults = await searchSymbols(input)
                const result = SearchResults.result
                setBestMatches(result)
            }
        } catch (error) {
            setBestMatches([])
            console.log(error)
        }
    }



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