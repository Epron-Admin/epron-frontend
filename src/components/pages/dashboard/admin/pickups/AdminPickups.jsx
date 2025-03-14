import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../../../../../reducers/toastSlice";
import { useFetchLgasMutation } from "../../../../../services/location";
import { useGetAllPickupsByAcceptanceMutation, useGetAllPickupsByLocationMutation, useGetAllPickupsMutation } from "../../../../../services/pickupService";
import { getTime } from "../../../../../utils/helper";
import BasicDatePicker from "../../../../common/DatePicker";
import PageSpinner from "../../../../common/PageSpinner";
import SearchSelect from "../../../../common/SearchSelect";
import Card from "../../features/Card";
import Export from "../../features/Export";
import Table from "../../features/Table";

function AdminPickups() {
  const [exportData, setExportData] = useState();
  const [exportLoading, setExportLoading] = useState(false);
  const [getAllPickups] = useGetAllPickupsMutation();
  const [data, setData] = useState();
  const [dataLength, setDataLength] = useState();
  const [tableData, setTableData] = useState();
  const [pageLoading, setPageLoading] = useState();
  const [cardData, setCardData] = useState('')
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sort, setSort] = useState();
  const [status, setStatus] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [fetchLgas] = useFetchLgasMutation();
  const [getAllPickupsByLocation] = useGetAllPickupsByLocationMutation()
  const [getPickupsByAcceptance] = useGetAllPickupsByAcceptanceMutation()
  const dispatch = useDispatch();
  const [dataTotal, setDataTotal] = useState("");
  const locationData = { country: "NG", state: "Lagos" };
  const [hasPagination, setHasPagination] = useState(false)

  const onLocationChange = (selectedOption) => {
    setLocation(selectedOption);
    setStatus(null)
    if (!selectedOption) {
      getPickups({pagination: true});
    } else {
      searchByLocation(selectedOption.value)
    }
  };

  const statusOptions = [{ value: true, label: "Accepted" }, { value: false, label: "Unaccepted" }]

  const onStatusChange = (selectedOption) => {
    setStatus(selectedOption);
    setLocation(null)
    if (!selectedOption) {
      getPickups({pagination: true});
    } else {
      onGetPickupsByAcceptance({pagination: true, status:selectedOption.value})
    }
  };

  const onGetPickupsByAcceptance = (data) => {
    setHasPagination(data.pagination)
    setPageLoading(true);
    getPickupsByAcceptance(data)
    .unwrap()
    .then(res => {
      if (!res.error) {
        setPageLoading(false);
        setTableData(res.requests);
        setDataLength(res.requests.length);
      } else {
        setPageLoading(false);
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
  }
  const searchByLocation = (location) => {
    setHasPagination(false)
    let data = {location}
    setPageLoading(true);
    getAllPickupsByLocation(data)
    .unwrap()
    .then(res => {
      if (!res.error) {
        setPageLoading(false);
        setTableData(res.requests);
        setDataLength(res.requests.length);
      } else {
        setPageLoading(false);
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
  }

  const getCities = (data) => {
    let cityArr = [];
    data.map((item) => cityArr.push({ value: item, label: item }));
    setLocationOptions(cityArr);
  };

  // const onStartDateChange = (newValue) => {
  //   setStartDate(newValue);
  // };

  // const onEndDateChange = (newValue) => {
  //   setEndDate(newValue);
  // };

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
      title: "City",
      index: "lga",
    },
    {
      title: "Phone Number",
      index: "phoneNumber",
    },
    {
      title: "Date",
      index: "pickup_date",
    },
    {
      title: "Time",
      index: "pickup_time",
    },
    {
      title: "Accepted",
      index: "accept_request",
    },
    {
      title: "Completed",
      index: "completed",
    },
  ];

  useEffect(() => {
    setPageLoading(true);
    fetchLgas(locationData)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          getCities(res.data.lgas);
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
    getPickups({pagination: true});
  }, []);

  const getPickups = (data) => {
    setHasPagination(data.pagination)
    getAllPickups(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setDataTotal(res.total)
          setPageLoading(false);
          setData(res.requests);
          setTableData(res.requests);
          setDataLength(res.requests.length);
          setCardData({
            total: res.total,
            accepted: res.total_pickups_accepted,
            unaccepted: res.total_pickups_not_accepted,
            completed: res.total_pickups_completed,
            uncompleted: res.total_pickups_uncompleted,
          })
        } else {
          setPageLoading(false);
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

  const getExportLogs = (data) => {
    setExportLoading(true)
    getAllPickups(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          let data = []
          res.requests.map(log => data.push({
            User: log.name,
            Address: log.address,
            Pickups: log.phoneNumber,
            City: log.lga || log.city,
            Date: new Date(log.created_at).toDateString(),
            Time: getTime(log.created_at),
            Accepted: log.accept_request
          }))
          setExportData(data);
        } else {
          setPageLoading(false);
          dispatch(
            showToast({
              status: "error",
              title: "Error",
              message: res.message,
            })
          );
        }
        setExportLoading(false)
      })
      .catch((err) => {
        setExportLoading(false);
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

  const changePage = (page) => {
    getPickups({page, pagination: true});
  };

  return (
    <div>
      <h1 className="font-semibold text-xl mb-5">Pickup Requests</h1>
      <div className="cards grid grid-cols-3">
        <Card val={cardData.total || 0} text={"Total Pickup Requests"} />
        <Card val={cardData.completed ||0} text={"Completed pickups"} />
        <Card val={cardData.accepted ||0} text={"Accepted pickups"} />
        <Card val={cardData.unaccepted ||0} text={"Pending pickups"} />
        <Card val={cardData.uncompleted ||0} text={"Incomplete pickups"} />
      </div>
      <div className="filter-wrap flex justify-between items-center mt-10">
        <div className="filter-grid grid grid-cols-3 gap-2 items-center max-w-4xl">
          {/* <BasicDatePicker
            label={"Start Date"}
            value={startDate}
            onChange={onStartDateChange}
          />
          <BasicDatePicker
            label={"End Date"}
            value={endDate}
            onChange={onEndDateChange}
          /> */}
          <div className="filter relative">
            <SearchSelect
              value={location}
              name={"City"}
              selectData={locationOptions}
              onChange={onLocationChange}
              isDisabled={false}
              placeholder="Filter By City"
              noError={true}
            />
          </div>
          <div className="filter relative">
            <SearchSelect
              value={status}
              name={"Status"}
              selectData={statusOptions}
              onChange={onStatusChange}
              isDisabled={false}
              placeholder="Filter By Status"
              noError={true}
            />
          </div>
        </div>
        <div className="button-wrap flex items-center">
          <Export exportData={exportData} getData={getExportLogs} loading={exportLoading} />
        </div>
      </div>
      <Table
        columns={columns}
        data={tableData}
        hasRedirect={true}
        change={changePage}
        total={dataTotal}
        pagination={hasPagination}
        // editRecord={editEquipment}
        // deleteRecord={onDeleteEquipment}
      />
      {pageLoading ? <PageSpinner /> : null}
    </div>
  );
}

export default AdminPickups;
