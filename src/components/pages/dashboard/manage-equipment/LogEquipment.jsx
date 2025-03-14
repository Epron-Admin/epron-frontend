import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";

function LogEquipment() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.user.user);
  const role = user.role === "producer" ? "manufacturer" : user.role
  return (
    <div>
      <h1 className='font-semibold text-xl mb-5 md:mb-10'>Log {role === "manufacturer" ? "Equipment" : "E-waste" }</h1>
        <div className='bg-white p-3 sm:p-5 lg:p-10'>
          <p className='text-base mb-5'>Select your preferred method</p>
          <div onClick={()=>navigate("add")} className='flex items-center bg-gray-50 p-5 mb-5 log-item cursor-pointer'>
            <i className="hidden sm:block fa-solid fa-house-laptop text-4xl mr-5"></i>
            <div>
              <h1 className='text-lg sm:text-xl font-semibold'>Log Single {role === "manufacturer" ? "Equipment" : "E-waste" }</h1>
              <p>(This feature is ideal if you have less than three {role === "manufacturer" ? "equipment" : "e-wastes" } to log at a time)</p>
            </div>
          </div>
          <div onClick={()=>navigate("bulk")} className='flex items-center bg-gray-50 p-5 log-item cursor-pointer'>
            <i className="hidden sm:block fa-solid fa-laptop-file text-4xl mr-5"></i>
            <div>
              <h1 className='text-lg sm:text-xl font-semibold'>Log Bulk {role === "manufacturer" ? "Equipment" : "E-waste" }</h1>
              <p>(This feature is ideal if you have a large number of {role === "manufacturer" ? "equipment" : "e-wastes" } to log at a time)</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default LogEquipment