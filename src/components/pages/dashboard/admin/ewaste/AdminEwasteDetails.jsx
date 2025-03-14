import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { formatNumber } from "../../../../../utils/helper";
function AdminEwasteDetails() {
  const { state } = useLocation();
  const [record, setRecord] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    if(!state || Object.keys(state).length === 0) {
      navigate('/admin/equipment')
    }else {
    setRecord(state.record)
    }
  }, [])
  return (
    <div>
      {record &&
      <div>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl">Equipment Details</h1>
        </div>
        <div className="grid grid-cols-2">
          <div>
            <p className="py-3">
              <span className="font-semibold">Category: </span>
              {record.category_id.name}
            </p>
            <p className="py-3">
              <span className="font-semibold">Type: </span>
              {record.sub_category_id.name}
            </p>
            <p className="py-3">
              <span className="font-semibold">Quantity: </span>
              {formatNumber(record.quantity)}
            </p>
            <p className="py-3">
              <span className="font-semibold">Weight: </span>
              {record.weight.toFixed(2)} tons
            </p>
            <p className="py-3">
              <span className="font-semibold">Ready for pickup: </span>
              {record.ready_pickup ? "True" : "False"}
            </p>
            <p className="py-3">
              <span className="font-semibold">Recycled: </span>
              {record.pickedup ? "True" : "False"}
            </p>
          </div>
          <div>
            <p className="py-3 font-semibold uppercase">Collection Centre</p>
            <p className="py-3">
              <span className="font-semibold">Name: </span>
              {record.user_id.name}
            </p>
            <p className="py-3">
              <span className="font-semibold">Email: </span>{" "}
              {record.user_id.email}
            </p>
            <p className="py-3">
              <span className="font-semibold">Phone Number: </span>
              {record.user_id.phoneNumber}
            </p>
            <p className="py-3">
              <span className="font-semibold">Address: </span>
              {record.user_id.address}
            </p>
            <p className="py-3">
              <span className="font-semibold">State: </span>
              {record.user_id.state}
            </p>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default AdminEwasteDetails