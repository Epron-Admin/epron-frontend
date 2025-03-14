import React from 'react'
import { useLocation } from 'react-router-dom';
import { formatNumber } from '../../../../utils/helper';
// import PageSpinner from '../../../common/PageSpinner';

function PaymentDetails() {
    const { state } = useLocation();
  const record = state.record
  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl">Payment Details</h1>
        </div>
        <p className="py-3 border-b border-t">
          <span className="font-semibold">Invoice Number:</span>{" "}
          {record.invoice_number}
        </p>
        <p className="py-3 border-b border-t">
          <span className="font-semibold">Price:</span> ₦
          {formatNumber(record.total)}
        </p>
        <p className="py-3 border-b border-t">
          <span className="font-semibold">Description:</span>{" "}
          {record.description}
        </p>
        <p className="py-3 border-b border-t">
          <span className="font-semibold">Payment Status:</span>{" "}
          {record.paid ? "True" : "False"}
        </p>
        {!record.paid && (
          <button className="bg-main text-white px-5 h-10 rounded-md shadow-md block mt-5">Request Payment</button>
        )}
      </div>
      {/* {pageLoading ? <PageSpinner /> : null} */}
    </div>
  )
}

export default PaymentDetails