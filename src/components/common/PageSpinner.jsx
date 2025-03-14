import React from 'react'
import Spinner from './Spinner'

function PageSpinner() {
  return (
    <div className='page-spinner w-full h-full fixed top-0 left-0 flex items-center justify-center bg-gray-50'>
        <Spinner />
    </div>
  )
}

export default PageSpinner