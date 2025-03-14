import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  useGetAllCollectionCentresMutation,
  useGetAllRecycleLogsByRecyclerMutation,
  useGetAllRecycleLogsMutation,
} from "../../../../../services/adminService";
import { useGetUsersByRoleMutation } from "../../../../../services/usersService";
import { showToast } from "../../../../../reducers/toastSlice";
import CardSection from "../../features/CardSection";
import Export from "../../features/Export";
import PageSpinner from "../../../../common/PageSpinner";
import Table from "../../features/Table";
import SearchSelect from "../../../../common/SearchSelect";

function AdminRecycle() {
  const [exportData, setExportData] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [hasPagination, setHasPagination] = useState(false) 
  const [tableData, setTableData] = useState([]);
  const [weight, setWeight] = useState([]);
  const [weightUnit, setWeightUnit] = useState("kg");
  const [centre, setCentre] = useState("");
  let [centreOptions, setCentreOptions] = useState([]);
  const dispatch = useDispatch();
  const [cardData, setCardData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [dataTotal, setDataTotal] = useState("");
  const user = useSelector((state) => state.user.user.user);
  const [getLoggedEwasteWeight] = useGetAllRecycleLogsMutation();
  const [getLoggedWeightByRecycler] = useGetAllRecycleLogsByRecyclerMutation();
  const [getUsersByRole] = useGetUsersByRoleMutation();

  const getAllLoggedWeight = (data) => {
    setPageLoading(true);
    setHasPagination(true)
    getLoggedEwasteWeight(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          setCardData({
            count: res.total_weight_logged_ton.toFixed(2),
            weight: res.total_logged_ewaste.toFixed(2),
            amount: 0,
          });
          setDataTotal(res.total_logged_ewaste);
          let temp = res.ewaste.filter(item => item.user_id)
          setTableData(temp);
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

  const getExportLogs = (data) => {
    setExportLoading(true)
    getLoggedEwasteWeight(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          let temp = []
          res.ewaste.map(log => temp.push({
            Recycler: log.recycler_id.name,
            Email: log.recycler_id.email,
            Center: log.collection_centerid.name,
            Weight: log.weight,
            Unit: "ton",
            date: new Date(log.created_at).toDateString(),
          }))
          console.log(temp)
          setExportData(temp);
        } else {
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
        setExportLoading(false)
        let errMsg;
        if (err.data) {
          errMsg = err.data;
        } else if (err.status === "FETCH_ERROR")
          errMsg = "Check your network and try again";
        else errMsg = "An error occured";
        return dispatch(
          showToast({
            status: "error",
            title: "Error",
            message: `${errMsg}`,
          })
        );
      });
  };

  const getAllLoggedWeightByRecycler = (id, page) => {
    setPageLoading(true);
    getLoggedWeightByRecycler({ id, page })
      .unwrap()
      .then((res) => {
        setPageLoading(false);
        if (!res.error) {
          setCardData({
            count: res.total_weight_logged_ton.toFixed(2),
            weight: res.total_logged_ewaste.toFixed(2),
            amount: 0,
          });
          setDataTotal(res.total_logged_ewaste);
          setTableData(res.ewaste);
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

  const changePage = (page) => {
    getAllLoggedWeight({page, pagination: true});
  };

  const getRecyclers = () => {
    getUsersByRole("recycler")
      .unwrap()
      .then((res) => {
        if (!res.error) {
          formatCentres(res.user);
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
  };

  // const getCollectionCentres = () => {
  //   getAllCollectionCentres()
  //     .unwrap()
  //     .then((res) => {
  //       if (!res.error) {
  //         formatCentres(res.user);
  //       } else {
  //         dispatch(
  //           showToast({
  //             status: "error",
  //             title: "Error",
  //             message: res.message,
  //           })
  //         );
  //       }
  //     })
  //     .catch((err) => {
  //       setPageLoading(false);
  //       let errMsg;
  //       if (!err.data) {
  //         throw new Error(err);
  //         // errMsg = "Check your network and try againnnn";
  //       } else errMsg = err.data.message;
  //       dispatch(
  //         showToast({
  //           status: "error",
  //           title: "Error",
  //           message: `${errMsg}`,
  //         })
  //       );
  //     });
  // };

  const formatCentres = (data) => {
    let arr = [];
    data.map((item) =>
      arr.push({
        value: item.name,
        label: item.name,
        id: item._id,
      })
    );
    setCentreOptions(arr);
  };

  const onCentreChange = (selectedOption) => {
    setCentre(selectedOption);
    if(!selectedOption) getAllLoggedWeight({pagination: true})
    else getAllLoggedWeightByRecycler(selectedOption.id);
  };

  useEffect(() => {
    getAllLoggedWeight({pagination: true});
    // getCollectionCentres();
    getRecyclers();
  }, []);

  const onClose = () => {
    setShowModal(false);
    // setEditId(null);
    // setModalInput("");
    // setModalPrice("");
  };

  const columns = [
    {
      title: "Recycler",
      index: "recycler_id",
      subIndex: "name",
    },
    {
      title: "Collection Centre",
      index: "collection_centerid",
      subIndex: "name",
    },
    {
      title: "Weight Logged",
      index: "weight",
    },
    {
      title: "Unit",
      index: "unit",
    },
    {
      title: "Date Logged",
      index: "created_at",
    },
  ];

  return (
    <div>
      <div>
        {/* <h1 className="font-semibold text-xl mb-5 md:mb-10">
          Welcome back, {role === "epron" ? "Admin" : name}
        </h1> */}
        <div>
          <CardSection role={"recycler"} data={cardData} />
          <div className="">
            <div className="filter-wrap flex justify-between items-center mt-10">
              <div className="grid grid-cols-2 gap-2 items-center w-1/2 max-w-2xl">
                <div className="filter relative">
                  <SearchSelect
                    value={centre}
                    name={"Collection Centre"}
                    selectData={centreOptions}
                    onChange={onCentreChange}
                    isDisabled={false}
                    placeholder="Select Recycler"
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
            />
          </div>
        </div>
        {pageLoading ? <PageSpinner /> : null}
      </div>
    </div>
  );
}

export default AdminRecycle;
