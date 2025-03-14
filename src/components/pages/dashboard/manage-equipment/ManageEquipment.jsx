import React from 'react'
import { Outlet } from 'react-router-dom'

function ManageEquipment() {
  return (
    <div>
      <h1 className='font-semibold text-xl mt-5 mb-10'>Manage Equipment</h1>
      <Outlet />
    </div>
  )
}

export default ManageEquipment