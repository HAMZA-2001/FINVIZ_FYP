import React from 'react'
import PortfolioHeader from './PortfolioHeader'
import PortfolioTable from './PortfolioTable'

function UserPortfolio() {
  return (
    <div className=' text-white grid grid-cols-1 gap-2 sm:grid-cols-1 pt-20 grid-rows-8 auto-rows-fr'>
    <div className='m-3 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px]'>
    	<PortfolioHeader/>
    </div>
    <div className='m-3 row-span-5 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
        <PortfolioTable/>
    </div>
    <div className='m-3 text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
    	Total
    </div>
</div>
  )
}

export default UserPortfolio