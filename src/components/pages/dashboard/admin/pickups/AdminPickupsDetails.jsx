import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../../../../reducers/toastSlice";
import { useGetAllCollectionCentresMutation } from "../../../../../services/adminService";
import { useAcceptPickupMutation } from "../../../../../services/pickupService";
import { getTime } from "../../../../../utils/helper";
import SearchSelect from "../../../../common/SearchSelect";
import Spinner from "../../../../common/Spinner";

function AdminPickupsDetails() {
  const { state } = useLocation();
  const record = state.record;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [centerLoading, setCenterLoading] = useState(false);
  const [center, setCenter] = useState("");
  const [centerOptions, setCentersOptions] = useState([]);
  const [getCentres] = useGetAllCollectionCentresMutation();
  const [acceptPickup] = useAcceptPickupMutation();

  const fetchCenters = () => {
    setCenterLoading(true);
    getCentres()
      .unwrap()
      .then((res) => {
        setCenterLoading(false);
        if (!res.error) getCenters(res.user);
        else {
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
        setCenterLoading(false);
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

  const getCenters = (data) => {
    let arr = [];
    data.map((item) =>
      arr.push({
        label: `${item.name}, ${item.city || item.lga}`,
        value: item.name,
        id: item._id,
      })
    );
    setCentersOptions(arr);
  };

  const onCenterChange = (selectedOption) => {
    setCenter(selectedOption);
  };

  const onAssignPickup = () => {
    const data = {
      user_id: center.id,
      id: record._id,
    };
    setLoading(true)
    acceptPickup(data)
      .unwrap()
      .then((res) => {
        setLoading(false);
        if (!res.error) {
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Pickup assigned successfully",
            })
          );
          navigate(-1);
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

  const assignPickup = () => {};

  const onClose = () => {
    setShowModal(false);
    setCenter("");
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-5 border-b pb-3">
        <h1 className="text-2xl">Pickup Details</h1>
        {!record.accepted_by ? (
          <button
            onClick={() => {
              setShowModal(true);
              fetchCenters();
            }}
            className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block"
          >
            Assign Pickup
          </button>
        ) : (
          <button className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block">
            Pickup Accepted
          </button>
        )}
      </div>
      <div className="grid grid-cols-2">
        <div>
          <p className="py-3">
            <span className="font-semibold mr-2">Name:</span> {record.name}
          </p>
          <p className="py-3">
            <span className="font-semibold mr-2">Address:</span>{" "}
            {record.address}
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
        {record.accepted_by && (
          <div>
            <p className="py-3 font-semibold uppercase">Collection Center</p>
            <p className="py-3 border-t">
              <span className="font-semibold mr-2">Name:</span>{" "}
              {record.accepted_by.name}
            </p>
            <p className="py-3">
              <span className="font-semibold mr-2">Email:</span>{" "}
              {record.accepted_by.email}
            </p>
            <p className="py-3">
              <span className="font-semibold mr-2">Phone:</span>{" "}
              {record.accepted_by.phoneNumber}
            </p>
            <p className="py-3">
              <span className="font-semibold mr-2">Address:</span>{" "}
              {record.accepted_by.address}
            </p>
            <p className="py-3">
              <span className="font-semibold mr-2">Location:</span>{" "}
              {record.accepted_by.city}, {record.accepted_by.state}
            </p>
          </div>
        )}
      </div>
      {showModal ? (
        <div className="bg-black bg-opacity-80 w-full h-screen flex items-center justify-center fixed top-0 left-0 px-5">
          <div className="bg-white relative w-full max-w-xl py-10 px-10">
            <i
              onClick={() => onClose()}
              className="fa-regular fa-times-circle text-lg cursor-pointer absolute top-5 right-5"
            ></i>
            {!centerLoading ? (
              <div>
                <p className="text-lg font-semibold mb-8">Assign Pickup</p>
                <label>Pick a collection center</label>
                <SearchSelect
                  value={center}
                  name={"Center"}
                  selectData={centerOptions}
                  onChange={onCenterChange}
                  isDisabled={false}
                  placeholder="Pick centre"
                  noError={true}
                />
                <div className="flex justify-end mt-10">
                  <button
                    onClick={() => {
                      onAssignPickup();
                    }}
                    className="px-10 py-2 bg-green-600 text-white mx-2 rounded-md cursor-pointer"
                  >
                    {loading ? <Spinner /> : "Assign"}
                  </button>
                  <button
                    onClick={() => onClose()}
                    className="px-10 py-2 bg-red-600 text-white mx-2 rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminPickupsDetails;
