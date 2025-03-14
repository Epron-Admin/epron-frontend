import React, { useEffect, useState } from "react";
import {
  useGetAllPickupsMutation,
  useGetAllPickupsByLocationMutation,
  useGetAllUnacceptedPickupsByLocationMutation,
  useGetAllUserAcceptedPickupsMutation,
} from "../../../../services/pickupService";
import BasicDatePicker from "../../../common/DatePicker";
import PageSpinner from "../../../common/PageSpinner";
import SearchSelect from "../../../common/SearchSelect";
import Table from "../features/Table";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../../reducers/toastSlice";

function Requests() {
  const [getAllPickups] = useGetAllPickupsMutation();
  const [getAllPickupsByLocation] = useGetAllPickupsByLocationMutation();
  const [getAllUnacceptedPickupsByLocation] =
    useGetAllUnacceptedPickupsByLocationMutation();
  const [getAllUserAcceptedPickups] = useGetAllUserAcceptedPickupsMutation();
  const [tableData, setTableData] = useState();
  const [pageLoading, setPageLoading] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sort, setSort] = useState();
  const [showPendingPickups, setShowPendingPickups] = useState(false);
  const [pendingPickupsData, setPendingPickupsData] = useState([]);
  const [showUserPickups, setShowUserPickups] = useState(false);
  const [userPickupsData, setUserPickupsData] = useState([]);
  const user = useSelector((state) => state.user.user.user);
  const dispatch = useDispatch();
  const [dataTotal, setDataTotal] = useState("")

  const sortOptions = [
    { value: "0", label: "Oldest to Newest" },
    { value: "1", label: "Newest to oldest" },
  ];

  // const onStartDateChange = (newValue) => {
  //   setStartDate(newValue);
  // };

  // const onEndDateChange = (newValue) => {
  //   setEndDate(newValue);
  // };

  // const onSortChange = (selectedOption) => {
  //   setSort(selectedOption)
  // }

  const columns = [
    {
      title: "Name",
      index: "name",
    },
    {
      title: "Address",
      index: "address",
    },
    {
      title: "Phone Number",
      index: "phoneNumber",
    },
    {
      title: "Description",
      index: "description",
    },
    {
      title: "Pickup Date",
      index: "pickup_date",
    },
    {
      title: "Time",
      index: "pickup_time",
    },
    {
      title: "Completed",
      index: "completed",
    },
  ];

  const changePage = (page) => {
    showPendingPickups ? getPendingPickups(page) : getUserPickups(page)
  }

  const getPendingPickups = (page) => {
    setPageLoading(true);
    const location = user.lga;
    getAllUnacceptedPickupsByLocation({location, page})
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          setPendingPickupsData(res.requests);
          setDataTotal(res.total)
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
        setPageLoading(false);
        let errMsg;
        if (err.data) {
          errMsg = err.data;
        } else if (err.status === 'FETCH_ERROR') errMsg = "Check your network and try again";
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

  const getUserPickups = (page) => {
    setPageLoading(true);
    const data = {
      location: user.lga,
      id: user._id,
      page
    };
    getAllUserAcceptedPickups(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          setUserPickupsData(res.requests);
          setDataTotal(res.total)
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
        setPageLoading(false);
        let errMsg;
        if (err.data) {
          errMsg = err.data;
        } else if (err.status === 'FETCH_ERROR') errMsg = "Check your network and try again";
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

  useEffect(() => {
    showPendingPickups ? getPendingPickups() : getUserPickups();
  }, [showPendingPickups]);

  useEffect(() => {
    setShowPendingPickups(true);
  }, []);
  return (
    <div>
      <h1 className="font-semibold text-lg md:text-xl mt-5 mb-5">
        {showPendingPickups ? "Pending" : "My"}{" "}
        {user.role === "recycler" ? "Recycle" : "Pickup"} Requests{" "}
        {showPendingPickups ? `in ${user.lga}` : ""}
      </h1>
      <div className="flex border-b">
        <div
          className={`py-3 w-40 text-center cursor-pointer border-r ${
            showPendingPickups ? "" : "border-green-500 border-b-2"
          }`}
          onClick={() => setShowPendingPickups(false)}
        >
          My Pickups
        </div>
        <div
          className={`py-3 w-40 text-center cursor-pointer border-r ${
            showPendingPickups ? "border-green-500 border-b-2" : ""
          }`}
          onClick={() => setShowPendingPickups(true)}
        >
          Pending Pickups
        </div>
      </div>
      {/* <div className="filter-wrap flex justify-between items-center mt-10">
        <div className="grid grid-cols-3 gap-2 items-center max-w-4xl">
          <BasicDatePicker
            label={"Start Date"}
            value={startDate}
            onChange={onStartDateChange}
          />
          <BasicDatePicker
            label={"End Date"}
            value={endDate}
            onChange={onEndDateChange}
          />
          <div className="filter relative">
            <SearchSelect
              value={sort}
              name={"Sort By"}
              selectData={sortOptions}
              onChange={onSortChange}
              isDisabled={false}
              placeholder="Sort By"
              noError={true}
            />
          </div>
        </div>
      </div> */}
      <Table
        columns={columns}
        data={showPendingPickups ? pendingPickupsData : userPickupsData}
        hasRedirect={true}
        change={changePage}
        total={dataTotal}
        pagination={true}
      />
      {pageLoading ? <PageSpinner /> : null}
    </div>
  );
}

export default Requests;
