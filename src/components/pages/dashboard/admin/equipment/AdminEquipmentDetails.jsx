import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { formatNumber } from "../../../../../utils/helper";

function AdminEquipmentDetails() {
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
              {formatNumber(record.quantity)} units
            </p>
            <p className="py-3">
              <span className="font-semibold">Weight: </span>
              {record.weight.toFixed(2)} tons
            </p>
          </div>
          <div>
            <p className="py-3 font-semibold uppercase">User Details</p>
            <p className="py-3">
              <span className="font-semibold">User: </span>
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
          </div>
          <div>
            <p className="py-3 mt-3 font-semibold uppercase">Payment Details</p>
            <p className="py-3">
              <span className="font-semibold">Unit Price: </span> ₦
              {formatNumber(record.price)}
            </p>
            <p className="py-3">
              <span className="font-semibold">Price: </span> ₦
              {formatNumber(record.total)}
            </p>
            <p className="py-3">
              <span className="font-semibold">Paid: </span>
              {record.paid ? "True" : "False"}
            </p>
            {record.paid && (
              <div>
                <p className="py-3">
                  <span className="font-semibold">Reference: </span>
                  {record.reference}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>}
    </div>
  );
}

export default AdminEquipmentDetails;
