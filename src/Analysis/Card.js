import React from 'react'

function Card({ children }) {
  return (
    <div className='w-full h-full rounded-md relative p-8 border-2 bg-gray-600'>{children}</div>
  )
}

export default Card