import React from 'react'

/**
 * format the given list of elements into a card component
 * @component
 * @param {*} param0 the div elements to be appending into its main div body
 * @returns card styled element
 */
function Card({ children }) {
  return (
    <div className='w-full h-full rounded-md relative p-8 border-2 bg-gray-600'>{children}</div>
  )
}

export default Card