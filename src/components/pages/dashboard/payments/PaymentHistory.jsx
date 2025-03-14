import React from 'react'
import Card from '../features/Card'
import Table from '../features/Table'
import {payment_data, payment_headers} from '../../../../data/table_data'
import Utilities from '../features/Utilities'

function PaymentHistory() {
  const editEquipment = (record) => {
    alert(`Edit record with name ${record.equipment_name}`)
  }

  const deleteEquipment = (record) => {
    alert(`Delete record with name ${record.equipment_name}`)
  }

  const test_data = null

  const columns = [
    {
      title: 'Invoice ID',
      index: 'invoice_number',
    },
    {
      title: 'Amount (₦)',
      index: 'total',
    },
    {
      title: 'Description',
      index: 'description',
    },
    {
      title: 'Date Generated',
      index: 'time',
    },
    {
      title: 'Payment Status',
      index: 'paid',
    },
  ]

  return (
    <div>
      <h1 className='font-semibold text-xl mb-10'>Payment History</h1>
      
      <Table columns={columns} data={payment_data} editRecord={editEquipment} deleteRecord={deleteEquipment}  />
    </div>
  )
}

export default PaymentHistory