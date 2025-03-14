import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../../reducers/toastSlice";
import {
  useGetAllCollectionCentresMutation,
  useGetAllLoggedEwasteMutation,
} from "../../../../../services/adminService";
import { useGetLoggedEwasteMutation } from "../../../../../services/ewasteService";
import { useGetCategoriesMutation } from "../../../../../services/globalService";
import { formatNumber } from "../../../../../utils/helper";
import PageSpinner from "../../../../common/PageSpinner";
import SearchSelect from "../../../../common/SearchSelect";
import CardSection from "../../features/CardSection";
import Export from "../../features/Export";
import Table from "../../features/Table";

function AdminEwaste() {
  const [cardData, setCardData] = useState();
  const [exportData, setExportData] = useState();
  const [exportLoading, setExportLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const user = useSelector((state) => state.user.user.user);
  const [center, setCenter] = useState("");
  const [centerOptions, setCentersOptions] = useState([]);
  const [getCategories] = useGetCategoriesMutation();
  const [getCentres] = useGetAllCollectionCentresMutation();
  const [getLoggedEwaste] = useGetAllLoggedEwasteMutation();
  const [getUserEwaste] = useGetLoggedEwasteMutation();
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataTotal, setDataTotal] = useState("");
  const [hasPagination, setHasPagination] = useState(false);

  const getCenters = (data) => {
    let arr = [];
    data.map((item) =>
      arr.push({ value: item.name, label: item.name, id: item._id })
    );
    setCentersOptions(arr);
  };

  const onCenterChange = (selectedOption) => {
    setCenter(selectedOption);
    if (!selectedOption) {
      getAllEwaste({pagination: true});
    } else {
      getSingleEwaste({ id: selectedOption.id });
    }
  };

  const getAllEwaste = (data) => {
    setPageLoading(true);
    setHasPagination(data.pagination);
    getLoggedEwaste(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          setCardData({
            count: res.total_ewaste,
            weight: res.total_ewaste_weight.toFixed(2),
            recycled: res.total_pickedup,
            ready: res.total_ready_for_pickup,
            notready: res.total_not_ready_for_pickup,
            not_recycled: res.total_unpickedup,
          });
          setDataTotal(res.total_ewaste);
          setData(res.ewaste);
          let temp = res.ewaste.filter(item => item.user_id)
          setTableData(temp);
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

  const getExportEwaste = (data) => {
    setExportLoading(true)
    getLoggedEwaste(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          let data = []
          res.ewaste.map(log => data.push({
            center: log.user_id.name,
            email: log.user_id.email,
            category: log.category_id.name,
            type: log.sub_category_id.name,
            weight: log.weight,
            unit: "ton",
            ready_for_pickup: log.ready_pickup,
            recycled: log.pickedup,
            date: new Date(log.created_at).toDateString(),
          }))
          setExportData(data);
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

  const changePage = (page) => {
    getAllEwaste({ page, pagination: true });
  };

  const getSingleEwaste = (data) => {
    setPageLoading(true);
    setHasPagination(false);
    getUserEwaste(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          setTableData(res.ewaste);
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
    getCentres()
      .unwrap()
      .then((res) => {
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
    getAllEwaste({ pagination: true });
  }, []);

  // const search = (value) => {
  //   if (value === "" || value === " ") {
  //     return setTableData(data);
  //   }
  //   let filteredData = data.filter((item) =>
  //     item.sub_category_id.name.toLowerCase().match(value.toLowerCase())
  //   );
  //   setTableData(filteredData);
  //   setCenter("");
  // };
  const columns = [
    {
      title: "Collection Centre",
      index: "user_id",
      subIndex: "name",
    },
    {
      title: "Equipment Category",
      index: "category_id",
      subIndex: "name",
    },
    {
      title: "Equipment Type",
      index: "sub_category_id",
      subIndex: "name",
    },
    {
      title: "Weight (kg)",
      index: "weight",
    },
    {
      title: "Ready for Pickup",
      index: "ready_pickup",
    },
    {
      title: "Recycled",
      index: "pickedup",
    },
  ];

  return (
    <div>
      <div>
        <CardSection role={"epron_collector"} data={cardData} />
        <div className="">
          <div className="filter-wrap flex justify-between items-center mt-10">
            <div className="grid grid-cols-2 gap-2 items-center w-1/2 max-w-2xl">
              <div className="filter relative">
                <SearchSelect
                  value={center}
                  name={"Center"}
                  selectData={centerOptions}
                  onChange={onCenterChange}
                  isDisabled={false}
                  placeholder="Filter by centre"
                  noError={true}
                />
              </div>
              {/* <div className="search relative">
                <input
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                  onKeyUp={() => {
                    // search(searchValue);
                  }}
                  type="text"
                  placeholder="Search by type"
                  className="w-full h-12 block border"
                />
                <i
                  // onClick={() => search(searchValue)}
                  className="fas fa-search absolute top-pos right-5 text-xs"
                ></i>
              </div> */}
            </div>
            <div className="button-wrap flex items-center">
              <Export exportData={exportData} getData={getExportEwaste} loading={exportLoading} />
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
  );
}

export default AdminEwaste;
