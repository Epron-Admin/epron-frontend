import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../../reducers/toastSlice";
import {
  useFilterEquipmentMutation,
  useGetAllLoggedEquipmentMutation,
} from "../../../../../services/adminService";
import { useGetCategoriesMutation } from "../../../../../services/globalService";
import { formatNumber } from "../../../../../utils/helper";
import PageSpinner from "../../../../common/PageSpinner";
import SearchSelect from "../../../../common/SearchSelect";
import CardSection from "../../features/CardSection";
import Export from "../../features/Export";
import Table from "../../features/Table";

function AdminEquipment() {
  const [cardData, setCardData] = useState();
  const [exportData, setExportData] = useState();
  const [hasPagination, setHasPagination] = useState(false) 
  const [exportLoading, setExportLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const user = useSelector((state) => state.user.user.user);
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [getCategories] = useGetCategoriesMutation();
  const [getLoggedEquipment] = useGetAllLoggedEquipmentMutation();
  const [filterEquipment] = useFilterEquipmentMutation();
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const [dataTotal, setDataTotal] = useState("");

  const getCategory = (data) => {
    let arr = [];
    data.map((item) =>
      arr.push({ value: item.name, label: item.name, id: item._id })
    );
    setCategoryOptions(arr);
  };

  const getExportEquipment = (data) => {
    setExportLoading(true)
    getLoggedEquipment(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          let data = []
          res.log.map(log => data.push({
            user: log.user_id.name,
            email: log.user_id.email,
            category: log.category_id.name,
            type: log.sub_category_id.name,
            weight: log.weight,
            unit: "ton",
            price: log.price,
            amount: Math.ceil(log.total),
            paid: log.paid,
            reference: log.reference,
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

  const getAllEquipment = (data) => {
    setPageLoading(true);
    setHasPagination(data.pagination)
    getLoggedEquipment(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          setDataTotal(res.total_logged_eqiupment);
          setCardData({
            count: res.total_logged_eqiupment,
            weight: res.total_weight_logged.toFixed(2),
            amount: Math.ceil(res.total_payment_made),
            paidLog: res.total_logged_equipment_paid,
            unpaidLog: res.unpaid_log_number,
            unpaid: Math.ceil(res.unpaid_payment),
          });
          setData(res.log);
          let temp = res.log.filter(item => item.user_id)
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

  useEffect(() => {
    getCategories()
      .unwrap()
      .then((res) => {
        if (!res.error) getCategory(res.categories);
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

    getAllEquipment({pagination: true});
  }, []);

  const filter = (value) => {
    setHasPagination(false)
    setPageLoading(true);
    let data = { value };
    filterEquipment(data)
      .unwrap()
      .then((res) => {
        setPageLoading(false);
        if (!res.error) {
          // setDataTotal(res.total_logged_eqiupment);
          // setCardData({
          //   count: res.total_logged_eqiupment,
          //   weight: res.total_weight_logged.toFixed(2),
          //   amount: res.total_payment_made,
          //   paidLog: res.total_logged_equipment_paid,
          //   unpaidLog: res.unpaid_log_number,
          //   unpaid: res.unpaid_payment,
          // });
          setTableData(res.search);
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

  const search = (value, key) => {
    if (value === "" || value === " ") {
      return getAllEquipment({pagination: true});
    }
    if (key === "Enter") {
      filter(value);
      setSearchValue('')
    }
  };

  const changePage = (page) => {
    getAllEquipment({page, pagination: true});
  };

  const columns = [
    {
      title: "User",
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
      index: "unit_weight",
    },
    {
      title: "Amount (₦)",
      index: "total",
    },
    {
      title: "Payment Status",
      index: "paid",
    },
  ];

  return (
    <div>
      <div>
        <CardSection role={"epron"} data={cardData} />
        <div className="">
          <div className="filter-wrap flex justify-between items-center mt-10">
            <div className="grid grid-cols-2 gap-2 items-center w-1/2 max-w-2xl">
              {/* <div className="filter relative">
                <SearchSelect
                  value={category}
                  name={"Category"}
                  selectData={categoryOptions}
                  onChange={onCategoryChange}
                  isDisabled={false}
                  placeholder="Filter by category"
                  noError={true}
                />
              </div> */}
              <div className="search relative">
                <input
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                  onKeyUp={(e) => {
                    search(searchValue, e.key);
                  }}
                  type="text"
                  placeholder="Search by name or email"
                  className="w-full h-12 block border"
                />
                <i
                  onClick={() => search(searchValue)}
                  className="fas fa-search absolute top-pos right-5 text-xs"
                ></i>
              </div>
            </div>

            <div className="button-wrap flex items-center">
              <Export exportData={exportData} getData={getExportEquipment} loading={exportLoading}  />
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

export default AdminEquipment;
