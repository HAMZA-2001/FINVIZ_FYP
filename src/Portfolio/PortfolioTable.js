import React from 'react'

function PortfolioTable() {
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

                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>

  )
}

export default PortfolioTable