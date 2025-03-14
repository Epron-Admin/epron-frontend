import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Table from "./features/Table";
import { useDispatch } from "react-redux";
import { showToast } from "../../../reducers/toastSlice";
import { useSelector } from "react-redux";
import PageSpinner from "../../common/PageSpinner";
import CardSection from "./features/CardSection";
import SearchSelect from "../../common/SearchSelect";
import Export from "./features/Export";
import {
  useGetAssignedCollectionCentresMutation,
  useGetloggedEwasteWeightMutation,
  useLogEwasteWeightMutation,
} from "../../../services/recycleService";
import { useGetAllCollectionCentresMutation } from "../../../services/usersService";
import Spinner from "../../common/Spinner";
import { setCategoriesData, setTypesData } from "../../../reducers/globalSlice";
import { useGetAllTypesMutation, useGetCategoriesMutation } from "../../../services/globalService";

function RecyclerHome() {
  const [exportData, setExportData] = useState();
  const [hasPagination, setHasPagination] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [weight, setWeight] = useState([]);
  const [weightUnit, setWeightUnit] = useState("kg");
  const [centre, setCentre] = useState("");
  let [centreOptions, setCentreOptions] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cardData, setCardData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [dataTotal, setDataTotal] = useState("");
  const user = useSelector((state) => state.user.user.user);
  const [dashboardData] = useOutletContext();
  const { name, role } = dashboardData;
  const [logEwasteWeight] = useLogEwasteWeightMutation();
  const [getLoggedEwasteWeight] = useGetloggedEwasteWeightMutation();
  const [getAllCollectionCentres] = useGetAssignedCollectionCentresMutation();
  const [getCategories] = useGetCategoriesMutation();
  const [getTypes] = useGetAllTypesMutation();

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
          setData(res.ewaste);
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

  const getExportLogs = (data) => {
    setExportLoading(true)
    getLoggedEwasteWeight(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          let temp = []
          res.ewaste.map(log => temp.push({
            Center: log.collection_centerid.name,
            Weight: log.weight,
            Unit: "ton",
            date: new Date(log.created_at).toDateString(),
          }))
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

  const logWeight = () => {
    const data = {
      weight,
      unit: weightUnit,
      recycler_id: user._id,
      collection_centerid: centre.id,
    };
    setLoading(true);
    logEwasteWeight(data)
      .unwrap()
      .then((res) => {
        setLoading(false);
        if (!res.error) {
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Weight was logged successfully",
            })
          );
          setShowModal(false);
          getAllLoggedWeight({ id: user._id, pagination: true });
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
        console.log(err)
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

  const changePage = (page) => {
    getAllLoggedWeight(page);
  };

  const getCollectionCentres = () => {
    getAllCollectionCentres(user._id)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          formatCentres(res.recyceler.collection_center);
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
        if (!err.data) {
          throw new Error(err);
          // errMsg = "Check your network and try againnnn";
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
  };

  // get all categories
  const getAllCategories = () => {
    getCategories()
      .unwrap()
      .then((res) => {
        if (!res.error) {
          dispatch(
            setCategoriesData({
              data: res.categories,
            })
          );
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

  // get type using selected category
  const getAllTypes = () => {
    setPageLoading(true);
    getTypes()
      .unwrap()
      .then((res) => {
        setPageLoading(false);
        if (!res.error) {
          dispatch(
            setTypesData({
              data: res.types,
            })
          );
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

  useEffect(() => {
    getAllCategories()
    getAllTypes()
    getAllLoggedWeight({ id: user._id, pagination: true });
    getCollectionCentres();
  }, []);

  const onClose = () => {
    setShowModal(false);
    // setEditId(null);
    // setModalInput("");
    // setModalPrice("");
  };

  const columns = [
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
        <h1 className="font-semibold text-xl mb-5 md:mb-10">
          Welcome back, {role === "epron" ? "Admin" : name}
        </h1>
        <div>
          <CardSection role={role} data={cardData} />
          <div className="">
            <div className="filter-wrap flex justify-between items-center mt-10">
              <div className="hidden md:grid grid-cols-2 gap-2 items-center w-1/2 max-w-2xl">
                <div className="filter relative">
                  {/* <SearchSelect
                    value={category}
                    name={"Category"}
                    selectData={categoryOptions}
                    onChange={onCategoryChange}
                    isDisabled={false}
                    placeholder="Filter by category"
                    noError={true}
                  /> */}
                </div>
              </div>

              <div className="button-wrap flex items-center">
                <Export
                  exportData={exportData}
                  getData={getExportLogs}
                  loading={exportLoading}
                  id={user._id}
                />
                <button
                  onClick={() => {
                    setShowModal(true);
                  }}
                  className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block"
                >
                  Log Weight
                </button>
              </div>
            </div>
            <Table
              columns={columns}
              data={tableData}
              hasRedirect={false}
              change={changePage}
              total={dataTotal}
              pagination={hasPagination}
            />
          </div>
        </div>
        {pageLoading ? <PageSpinner /> : null}
      </div>
      {showModal ? (
        <div className="bg-black bg-opacity-80 w-full h-screen flex items-center justify-center fixed top-0 left-0 px-5">
          <div className="bg-white relative w-full max-w-xl mx-5 py-5 px-3 md:py-10 md:px-10">
            <i
              onClick={() => onClose()}
              className="fa-regular fa-times-circle text-lg cursor-pointer absolute top-5 right-5"
            ></i>
            <p className="text-lg font-semibold mb-8">Log Weight Collected</p>
            <div className="filter relative mb-5">
              <label>Collection Centre</label>
              <SearchSelect
                value={centre}
                name={"Collection Centre"}
                selectData={centreOptions}
                onChange={onCentreChange}
                isDisabled={false}
                placeholder="Select Centre"
                noError={true}
              />
            </div>
            <div className="flex mb-5">
              <input
                type="number"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                }}
                placeholder="Enter weight collected"
                className="w-full h-10 px-3"
              />
              <select
                name="unit"
                id="unit"
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="px-3 weight-select h-10 text-sm rounded-md border"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ton">ton</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  logWeight();
                }}
                className="px-10 py-2 bg-green-600 text-white mx-2 rounded-md cursor-pointer"
              >
                {loading ? <Spinner /> : "Submit"}
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
    </div>
  );
}

export default RecyclerHome;
