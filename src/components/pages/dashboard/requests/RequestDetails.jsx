import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../../../reducers/toastSlice";
import {
  useAcceptPickupMutation,
  useCompletePickupMutation,
} from "../../../../services/pickupService";
import { formatNumber, getTime } from "../../../../utils/helper";
import PageSpinner from "../../../common/PageSpinner";
import Spinner from "../../../common/Spinner";

function RequestDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user.user);
  const { state } = useLocation();
  const record = state.record;
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [pickupModal, setPickupModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [acceptPickup] = useAcceptPickupMutation();
  const [completePickup] = useCompletePickupMutation();
  const onCancel = () => {
    setPickupModal(false);
    setCompleteModal(false);
  };

  const openPickupModal = () => {
    setPickupModal(true);
  };

  const openCompleteModal = () => {
    setCompleteModal(true);
  };

  const onAcceptPickup = () => {
    const data = {
      user_id: user._id,
      id: record._id,
    };
    acceptPickup(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Pickup accepted successfully",
            })
          );
          navigate("/dashboard/requests");
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
        if (err.data) {
          errMsg = err.data;
        } else if (err.status === "FETCH_ERROR")
          errMsg = "Check your network and try again";
        else errMsg = "An error occured";
        dispatch(
          showToast({
            status: "error",
            title: "Error",
            message: `${errMsg}`,
          })
        );
      });
  };

  const onCompletePickup = () => {
    const data = {
      user_id: user._id,
      id: record._id,
    };
    completePickup(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Pickup completed successfully",
            })
          );
          navigate("/dashboard/requests");
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
        if (err.data) {
          errMsg = err.data;
        } else if (err.status === "FETCH_ERROR")
          errMsg = "Check your network and try again";
        else errMsg = "An error occured";
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
    <div>
      <div>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl">Pickup Details</h1>
          {!record.accept_request && (
            <button
              onClick={() => openPickupModal()}
              className="bg-main text-white px-5 h-10 rounded-md shadow-md block mt-5"
            >
              Accept Pickup
            </button>
          )}
          {record.accept_request && !record.completed && (
            <button
              onClick={() => openCompleteModal()}
              className="bg-main text-white px-5 h-10 rounded-md shadow-md block mt-5"
            >
              Mark as Completed
            </button>
          )}
        </div>
        <p className="py-3 border-t">
          <span className="font-semibold mr-2">Name:</span> {record.name}
        </p>
        <p className="py-3">
          <span className="font-semibold mr-2">Address:</span> {record.address}
        </p>
        <p className="py-3">
          <span className="font-semibold mr-2">Location:</span> {record.lga},{" "}
          {record.state}
        </p>
        <p className="py-3">
          <span className="font-semibold mr-2">Phone:</span>{" "}
          {record.phoneNumber}
        </p>
        <p className="py-3">
          <span className="font-semibold mr-2">Description:</span>{" "}
          {record.description}
        </p>
        <p className="py-3">
          <span className="font-semibold mr-2">Pickup Date:</span>
          {new Date(record.pickup_date).toDateString()}
        </p>
        <p className="py-3">
          <span className="font-semibold mr-2">Pickup Time:</span>
          {getTime(record.pickup_date)}
        </p>
      </div>

      {pickupModal ? (
        <div className="bg-black bg-opacity-80 w-full h-screen flex items-center justify-center fixed top-0 left-0 px-5">
          <div className="bg-white relative py-16 px-24 ">
            <i
              onClick={() => onCancel()}
              className="fa-regular fa-times-circle text-lg cursor-pointer absolute top-5 right-5"
            ></i>
            <p className="text-lg font-semibold mb-8">
              Are you sure you want to accept this pickup?
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => onAcceptPickup()}
                className="px-10 py-2 bg-green-600 text-white mx-2 rounded-md cursor-pointer"
              >
                {loading ? <Spinner /> : "Yes"}
              </button>
              <button
                onClick={() => onCancel()}
                className="px-10 py-2 bg-red-600 text-white mx-2 rounded-md cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {completeModal ? (
        <div className="bg-black bg-opacity-80 w-full h-screen flex items-center justify-center fixed top-0 left-0 px-5">
          <div className="bg-white relative py-16 px-24 ">
            <i
              onClick={() => onCancel()}
              className="fa-regular fa-times-circle text-lg cursor-pointer absolute top-5 right-5"
            ></i>
            <p className="text-lg font-semibold mb-8">
              Have you completed this pickup?
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => onCompletePickup()}
                className="px-10 py-2 bg-green-600 text-white mx-2 rounded-md cursor-pointer"
              >
                {loading ? <Spinner /> : "Yes"}
              </button>
              <button
                onClick={() => onCancel()}
                className="px-10 py-2 bg-red-600 text-white mx-2 rounded-md cursor-pointer"
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

export default RequestDetails;
