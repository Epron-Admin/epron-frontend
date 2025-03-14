import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { showToast } from "../../../../../reducers/toastSlice";
import {
  useAssignCenterMutation,
  useGetAllCollectionCentresMutation,
  useRemoveCenterMutation,
} from "../../../../../services/adminService";
import { useGetUsersByRoleMutation } from "../../../../../services/usersService";
import PageSpinner from "../../../../common/PageSpinner";
import SearchSelect from "../../../../common/SearchSelect";
import Spinner from "../../../../common/Spinner";

function AssignRecyclerDetails() {
  const [pageLoading, setPageLoading] = useState(false);
  const [assignloading, setAssignLoading] = useState(false);
  const [unassignloading, setUnassignLoading] = useState(false);
  const { state } = useLocation();
  const { record } = state;
  const [assignedCenters, setAssignedCenters] = useState([]);
  const [removeId, setRemoveId] = useState("");
  const [center, setCenter] = useState("");
  const [centerOptions, setCentersOptions] = useState([]);
  const [getCentres] = useGetAllCollectionCentresMutation();
  const [assignCenter] = useAssignCenterMutation();
  const [removeCenter] = useRemoveCenterMutation();
  const [showModal, setShowModal] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const dispatch = useDispatch();
  const [recycler, setRecycler] = useState([]);
  const [getUsersByRole] = useGetUsersByRoleMutation();

  const getCenters = (data) => {
    let arr = [];
    data.map((item) =>
      arr.push({ value: item.name, label: item.name, id: item._id })
    );
    setCentersOptions(arr);
  };

  const mapAssignedCenters = (centers, data) => {
    let assignedArr = [];
    centers.forEach((centre) => {
      let arr = data.filter((item) => item._id === centre);
      assignedArr.push(arr[0]);
    });
    setAssignedCenters(assignedArr);
  };

  const onAssignCenter = () => {
    setAssignLoading(true);
    if (!center) {
      setAssignLoading(false);
      return dispatch(
        showToast({
          status: "error",
          title: "Error",
          message: "Pick a center and try again",
        })
      );
    }
    let data = {
      collection_center: center.id,
      role: "recycler",
      recycler_id: record._id,
    };
    assignCenter(data)
      .unwrap()
      .then((res) => {
        setAssignLoading(false);
        if (!res.error) {
          getRecyclerData();
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Collection center assigned successfully",
            })
          );
          onClose();
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
        setAssignLoading(false);
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

  const onRemoveCenter = (id) => {
    setUnassignLoading(true);
    let data = {
      collection_center: id,
      role: "recycler",
      recycler_id: record._id,
    };
    removeCenter(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setUnassignLoading(false);
          getRecyclerData();
          setRemoveId("");
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Collection center unassigned successfully",
            })
          );
          onClose();
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
        setUnassignLoading(false);
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

  const getRecyclerData = () => {
    getUsersByRole("recycler")
      .unwrap()
      .then((res) => {
        if (!res.error) {
          let arr = res.user.filter((item) => item._id === record._id);
          setRecycler(arr[0]);
          onGetCentres(arr[0].collection_center);
        } else {
          dispatch(
            showToast({
              status: "error",
              title: "Error",
              message: res.message,
            })
          );
        }
        setPageLoading(false);
      })
      .catch((err) => {
        setPageLoading(false);
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

  useEffect(() => {console.log(state)}, [recycler]);

  const onGetCentres = (collection_center) => {
    getCentres()
      .unwrap()
      .then((res) => {
        if (!res.error) {
          getCenters(res.user);
          mapAssignedCenters(collection_center, res.user);
        } else {
          dispatch(
            showToast({
              status: "error",
              title: "Error",
              message: res.message,
            })
          );
        }
        setPageLoading(false);
      })
      .catch((err) => {
        setPageLoading(false);
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

  useEffect(() => {
    setPageLoading(true);
    getRecyclerData();
  }, []);

  const onCenterChange = (selectedOption) => {
    setCenter(selectedOption);
  };

  const onClose = () => {
    setShowModal(false);
    setShowUnassignModal(false);
    setCenter("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl">{record.name}</h1>
        <div className="flex">
          <button
            onClick={() => {
              setShowModal(true);
            }}
            className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block"
          >
            Assign Center
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 text-sm mt-3">
        {assignedCenters.length ? (
          assignedCenters.map((center, index) => (
            <div key={index} className="bg-white p-3 rounded shadow-md">
              <p className="mb-2 text-base">{center.name || "nil"}</p>
              <p className="mb-2">
                <i className="fa-solid fa-building mr-3"></i>
                {center.address || "nil"}
              </p>
              <p className="mb-2">
                <i className="fa-solid fa-phone mr-3"></i>
                {center.phoneNumber || "nil"}
              </p>
              <button
                onClick={() => {
                  setShowUnassignModal(true);
                  setRemoveId(center._id);
                }}
                className="bg-main text-white px-5 h-10 rounded-md mt-3 block"
              >
                Unassign
              </button>
            </div>
          ))
        ) : (
          <p>No centers attached</p>
        )}
      </div>
      {showModal ? (
        <div className="bg-black bg-opacity-80 w-full h-screen flex items-center justify-center fixed top-0 left-0 px-5">
          <div className="bg-white relative w-full max-w-xl py-10 px-10">
            <i
              onClick={() => onClose()}
              className="fa-regular fa-times-circle text-lg cursor-pointer absolute top-5 right-5"
            ></i>
            <p className="text-lg font-semibold mb-8">
              Assign Collection Center
            </p>
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
                  onAssignCenter();
                }}
                className="px-10 py-2 bg-green-600 text-white mx-2 rounded-md cursor-pointer"
              >
                {assignloading ? <Spinner /> : "Assign"}
              </button>
              <button
                onClick={() => onClose()}
                className="px-10 py-2 bg-red-600 text-white mx-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {showUnassignModal ? (
        <div className="bg-black bg-opacity-80 w-full h-screen flex items-center justify-center fixed top-0 left-0 px-5">
          <div className="bg-white relative w-full max-w-xl py-10 px-10">
            <i
              onClick={() => onClose()}
              className="fa-regular fa-times-circle text-lg cursor-pointer absolute top-5 right-5"
            ></i>
            <p className="text-lg mb-8 text-center mt-5">
              Are you sure to remove this center?
            </p>
            <div className="flex justify-center mt-5">
              <button
                onClick={() => {
                  onRemoveCenter(removeId);
                }}
                className="px-10 py-2 bg-green-600 text-white mx-2 rounded-md cursor-pointer"
              >
                {unassignloading ? <Spinner /> : "Remove"}
              </button>
              <button
                onClick={() => onClose()}
                className="px-10 py-2 bg-red-600 text-white mx-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {pageLoading ? <PageSpinner /> : null}
    </div>
  );
}

export default AssignRecyclerDetails;
