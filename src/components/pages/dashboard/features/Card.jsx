import React from 'react'
import { formatNumber } from '../../../../utils/helper'

function Card({val, text}) {
  return (
    <div className='bg-white rounded-md text-center p-3 shadow-md sm:h-40 flex flex-col items-center sm:justify-center'>
        <h1 className='text-2xl md:text-4xl mb-2 sm:mb-5 font-semibold text-main'>{formatNumber(val)}</h1>
        <p className='text-sm sm:text-base'>{text}</p>
    </div>
  )
}

export default Card