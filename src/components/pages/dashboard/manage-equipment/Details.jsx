import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useDeleteSingleEquipmentMutation } from "../../../../services/logService";
import { formatNumber, generatePaymentObj, generateRandomCharacters } from "../../../../utils/helper";
import PageSpinner from "../../../common/PageSpinner";
import { showToast } from "../../../../reducers/toastSlice";
import {
  useDeleteSingleEwasteMutation,
  useReadyForPickupMutation,
} from "../../../../services/ewasteService";
import { useSelector } from "react-redux";
import {
  useUpdateTransactionMutation,
} from "../../../../services/paymentService";
import Spinner from "../../../common/Spinner";
import PaymentButton from "../features/PaymentButton";
import { usePickupWasteMutation } from "../../../../services/recycleService";

function Details() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user.user);
  const { state } = useLocation();
  console.log(state)
  const { record } = state;
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteSingleEquipment] = useDeleteSingleEquipmentMutation();
  const [deleteSingleEwaste] = useDeleteSingleEwasteMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [readyForPickup] = useReadyForPickupMutation();
  const [pickupWaste] = usePickupWasteMutation()

  const editEquipment = (record) => {
    navigate("/dashboard/log/edit", { state: { record: record } });
  };

  const onDeleteEquipment = (record) => {
    setDeleteModal(true);
    setDeleteId(record._id);
  };

  const deleteEquipment = (id) => {
    setPageLoading(true);
    deleteSingleEquipment(id)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Record deleted successfully",
            })
          );
          navigate("/dashboard");
        } else {
          dispatch(
            showToast({
              status: "error",
              title: "Error",
              message: res.message,
            })
          );
        }
      })
      .catch((err) => {
        let errMsg;
        if (!err.data) {
          errMsg = "Check your network and try again";
        } else errMsg = err.data.message;
        dispatch(
          showToast({
            status: "error",
            title: "Error",
            message: `${errMsg}`,
          })
        );
      });
    setDeleteModal(false);
  };

  const deleteEwaste = (id) => {
    setPageLoading(true);
    deleteSingleEwaste(id)
      .unwrap()
      .then((res) => {
        dispatch(
          showToast({
            status: "success",
            title: "Success",
            message: "Record deleted successfully",
          })
        );
        navigate("/dashboard");
      })
      .catch((err) => {
        let errMsg;
        if (!err.data) {
          errMsg = "Check your network and try again";
        } else errMsg = err.data.message;
        dispatch(
          showToast({
            status: "error",
            title: "Error",
            message: `${errMsg}`,
          })
        );
      });
    setDeleteModal(false);
  };

  const onCancel = () => {
    setDeleteModal(false);
  };

  const onReadyForPickup = () => {
    setLoading(true);
    let data = {
      id: record._id,
      user_id: user._id,
    };
    readyForPickup(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          console.log(res);
          dispatch(
            showToast({
              status: "success",
              title: "Status",
              message: "Ewaste is now ready to be recycled",
            })
          );
          navigate("/dashboard");
        } else {
          dispatch(
            showToast({
              status: "error",
              title: "Error",
              message: res.message,
            })
          );
        }
      })
      .catch((err) => {
        let errMsg;
        if (!err.data) {
          errMsg = "Check your network and try again";
        } else errMsg = err.data.message;
        dispatch(
          showToast({
            status: "error",
            title: "Error",
            message: `${errMsg}`,
          })
        );
      });
  };

  const onPickup = () => {
    setLoading(true);
    let data = {
      id: record._id,
      user_id: record.user_id,
    };
    pickupWaste(data)
      .unwrap()
      .then((res) => {
        setLoading(false);
        if (!res.error) {
          console.log(res);
          dispatch(
            showToast({
              status: "success",
              title: "Status",
              message: "Ewaste recycled",
            })
          );
          navigate("/dashboard");
        } else {
          dispatch(
            showToast({
              status: "error",
              title: "Error",
              message: res.message,
            })
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        let errMsg;
        if (!err.data) {
          errMsg = "Check your network and try again";
        } else errMsg = err.data.message;
        dispatch(
          showToast({
            status: "error",
            title: "Error",
            message: `${errMsg}`,
          })
        );
      });
  };

  return (
    <div className="bg-white px-5 py-10">
      {!pageLoading && (
        <div>
          <div className="flex items-center justify-between mb-5 pb-3 border-b">
            <h1 className="text-2xl">
              {user.role === "manufacturer" ? "Equipment" : "Ewaste"} Details
            </h1>
            {((user.role === "manufacturer" && !record.paid) ||
              (user.role === "collector" && !record.ready_pickup)) && (
              <div className="flex">
                <button
                  onClick={() => editEquipment(record)}
                  className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteEquipment(record)}
                  className="bg-red-500 text-white px-5 h-10 rounded-md ml-5 shadow-md block"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <div className="grid gri-cols-1 md:grid-cols-2">
            <div>
              <p className="py-3">
                <span className="font-semibold">Category:</span>{" "}
                {record.category_id.name || record.category}
              </p>
              <p className="py-3">
                <span className="font-semibold">Type:</span>{" "}
                {record.sub_category_id.name || record.type}
              </p>
              <p className="py-3">
                <span className="font-semibold">Quantity:</span>{" "}
                {formatNumber(record.quantity)}
              </p>
              <p className="py-3">
                <span className="font-semibold">Weight:</span>{" "}
                {record.unit_weight} {record.unit}
              </p>
            </div>
            <div>
              {user.role === "manufacturer" && (
                <div>
                  <p className="py-3">
                    <span className="font-semibold">Unit Price:</span> ₦
                    {formatNumber(record.price)}
                  </p>
                  <p className="py-3">
                    <span className="font-semibold">Price:</span> ₦
                    {formatNumber(record.total)}
                  </p>
                  <p className="py-3">
                    <span className="font-semibold">Paid:</span>{" "}
                    {record.paid ? "True" : "False"}
                  </p>
                  {!record.paid && (
                    <div
                      className="bg-gray-50 p-3 mt-2 border sha
                    "
                    >
                      <p className="mb-3">Are you ready to make this payment?</p>
                      <PaymentButton data={generatePaymentObj(record, user)} />
                    </div>
                  )}
                </div>
              )}
              {user.role === "recycler" && (
                <div>
                  <p className="py-3">
                    <span className="font-semibold">Ready for Pickup:</span>{" "}
                    {record.ready_pickup ? "True" : "False"}
                  </p>
                  <p className="py-3">
                    <span className="font-semibold">Recycled:</span>{" "}
                    {record.pickedup ? "True" : "False"}
                  </p>
                  <div className="mt-5">
                    {!record.pickedup && (
                      <button
                        onClick={() => {
                          onPickup();
                        }}
                        className="bg-main text-white px-5 h-10 rounded-md shadow-md block mt-5"
                      >
                        {loading ? <Spinner /> : "Recycle"}
                      </button>
                    )}
                  </div>
                </div>
              )}
              {user.role === "collector" && (
                <div>
                  <p className="py-3">
                    <span className="font-semibold">Ready for Pickup:</span>{" "}
                    {record.ready_pickup ? "True" : "False"}
                  </p>
                  <p className="py-3">
                    <span className="font-semibold">Recycled:</span>{" "}
                    {record.pickedup ? "True" : "False"}
                  </p>
                  <div className="mt-5">
                    {!record.ready_pickup && (
                      <button
                        onClick={() => {
                          onReadyForPickup();
                        }}
                        className="bg-main text-white px-5 h-10 rounded-md shadow-md block mt-5"
                      >
                        {loading ? <Spinner /> : "Click to recycle"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {deleteModal ? (
        <div className="bg-black bg-opacity-80 w-full h-screen flex items-center justify-center fixed top-0 left-0 px-5">
          <div className="bg-white relative py-16 px-24 ">
            <i
              onClick={() => onCancel()}
              className="fa-regular fa-times-circle text-lg cursor-pointer absolute top-5 right-5"
            ></i>
            <p className="text-lg font-semibold mb-8">
              Are you sure you want to delete this record?
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  user.role === "manufacturer"
                    ? deleteEquipment(deleteId)
                    : deleteEwaste(deleteId);
                }}
                className="px-10 py-2 bg-red-600  text-white mx-2 rounded-md cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => onCancel()}
                className="px-10 py-2 bg-green-600  text-white mx-2 rounded-md cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {pageLoading ? <PageSpinner /> : null}
    </div>
  );
}

export default Details;
