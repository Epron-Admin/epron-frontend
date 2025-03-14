import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo.png'

function PageNotFound() {
  const navigate = useNavigate()
  return (
    <div className=''>
      <div className='h-screen flex flex-col items-center justify-center'>
        <img src={logo} alt="" />
        <h1 className='text-3xl text-center text-gray-700'>Oops! Page Not Found</h1>
        <div>
          <button onClick={() => navigate(-1)} className="home-btn green-btn mt-5">Go Back</button>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound