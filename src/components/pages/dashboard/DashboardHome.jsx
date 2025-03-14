import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "./features/Table";
import { useOutletContext } from "react-router-dom";
import CardSection from "./features/CardSection";
import {
  useGetAllTypesMutation,
  useGetCategoriesMutation,
} from "../../../services/globalService";
import SearchSelect from "../../common/SearchSelect";
import { utils, writeFile } from "xlsx";
import { useDispatch } from "react-redux";
import { showToast } from "../../../reducers/toastSlice";
import { useSelector } from "react-redux";
import { useDeleteSingleEquipmentMutation } from "../../../services/logService";
import PageSpinner from "../../common/PageSpinner";
import { useGetLoggedEquipmentMutation } from "../../../services/logService";
import Export from "./features/Export";
import { useGetLoggedEwasteMutation } from "../../../services/ewasteService";
import { formatNumber } from "../../../utils/helper";
import { setCategoriesData, setTypesData } from "../../../reducers/globalSlice";

function DashboardHome() {
  const [exportData, setExportData] = useState();
  const [hasPagination, setHasPagination] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [cardData, setCardData] = useState();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const user = useSelector((state) => state.user.user.user);
  const categoryData = useSelector((state) => state.global.categories);
  const typeData = useSelector((state) => state.global.types);
  const [dashboardData] = useOutletContext();
  const { name, role } = dashboardData;
  const [deleteModal, setDeleteModal] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [getCategories] = useGetCategoriesMutation();
  const [getTypes] = useGetAllTypesMutation();
  const [getLoggedEquipment] = useGetLoggedEquipmentMutation();
  const [getLoggedEwaste] = useGetLoggedEwasteMutation();
  const [deleteSingleEquipment] = useDeleteSingleEquipmentMutation();
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataTotal, setDataTotal] = useState("");

  const editEquipment = (record) => {
    navigate("log/edit", { state: { record: record } });
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
          getAllEquipment();
        } else {
          setLoading(false);
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
    setDeleteModal(false);
  };

  const onCancel = () => {
    setDeleteModal(false);
  };

  const getCategory = (data) => {
    let arr = [];
    data.map((item) =>
      arr.push({ value: item.name, label: item.name, id: item._id })
    );
    setCategoryOptions(arr);
  };

  const onCategoryChange = (selectedOption) => {
    setCategory(selectedOption);
    if (!selectedOption) {
      setTableData(data);
    } else {
      let filteredData = data.filter(
        (item) =>
          item.category_id.name.toLowerCase() ===
          selectedOption.value.toLowerCase()
      );
      setTableData(filteredData);
    }
  };

  const getExportEquipment = (data) => {
    setExportLoading(true);
    getLoggedEquipment(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          let data = [];
          res.log.map((log) =>
            data.push({
              Category: log.category_id.name,
              Type: log.sub_category_id.name,
              Quantity: log.quantity,
              Weight: log.weight,
              Unit: "ton",
              Price: log.price,
              Amount: Math.ceil(log.total),
              Paid: log.paid,
              Reference: log.reference,
              Date: new Date(log.created_at).toDateString(),
            })
          );
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
        setExportLoading(false);
      })
      .catch((err) => {
        setExportLoading(false);
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

  const getExportEwaste = (data) => {
    setExportLoading(true);
    getLoggedEwaste(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          let data = [];
          res.ewaste.map((log) =>
            data.push({
              Category: log.category_id.name,
              Type: log.sub_category_id.name,
              Weight: log.weight,
              Unit: "ton",
              Ready_for_pickup: log.ready_pickup,
              Recycled: log.pickedup,
              Date: new Date(log.created_at).toDateString(),
            })
          );
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
        setExportLoading(false);
      })
      .catch((err) => {
        setExportLoading(false);
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
    setHasPagination(true);
    setPageLoading(true);
    getLoggedEquipment(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          setCardData({
            count: res.total_logged_eqiupment,
            weight: res.total_weight_logged.toFixed(2),
            amount: res.total_payment_made,
            paidLog: Math.ceil(res.total_logged_equipment_paid),
            unpaidLog: res.unpaid_log_number,
            unpaid: Math.ceil(res.unpaid_payment),
          });
          setDataTotal(res.total_logged_eqiupment);
          setData(res.log);
          setTableData(res.log);
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

  const getAllEwaste = (data) => {
    setPageLoading(true);
    setHasPagination(true);
    getLoggedEwaste(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          setCardData({
            total: res.total_logged_ewaste,
            count: res.total_weight_logged.toFixed(2),
            recycled: res.total_ewaste_pickedup,
          });
          setDataTotal(res.total_logged_ewaste);
          setData(res.ewaste);
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

  const changePage = (page) => {
    let data = {
      page,
      id: user._id,
      pagination: true,
    };
    role === "manufacturer" ? getAllEquipment(data) : getAllEwaste(data);
  };

  const getAllCategories = () => {
    if (categoryData.length > 0) return getCategory(categoryData);
    getCategories()
      .unwrap()
      .then((res) => {
        if (!res.error) {
          dispatch(
            setCategoriesData({
              data: res.categories,
            })
          );
          getCategory(res.categories);
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
    getAllCategories();
    getAllTypes();
    role === "manufacturer"
      ? getAllEquipment({ id: user._id, pagination: true })
      : getAllEwaste({ id: user._id, pagination: true });
  }, []);

  const search = (value) => {
    if (value === "" || value === " ") {
      return setTableData(data);
    }
    let filteredData = data.filter((item) =>
      item.sub_category_id.name.toLowerCase().match(value.toLowerCase())
    );
    setTableData(filteredData);
    setCategory("");
  };

  const collectorColumns = [
    {
      title: "E-waste Category",
      index: "category_id",
      subIndex: "name",
    },
    {
      title: "E-waste Type",
      index: "sub_category_id",
      subIndex: "name",
    },
    {
      title: "Quantity",
      index: "quantity",
    },
    {
      title: "Weight (tons)",
      index: "weight",
    },
    {
      title: "Date Logged",
      index: "created_at",
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
  const columns = [
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
      title: "Weight (tons)",
      index: "weight",
    },
    {
      title: "Unit Price/ton (₦)",
      index: "price",
    },
    {
      title: "Quantity",
      index: "quantity",
    },
    {
      title: "Amount (₦)",
      index: "total",
    },
    // {
    //   title: "Date Logged",
    //   index: "created_at",
    // },
    {
      title: "Payment Status",
      index: "paid",
    },
  ];
  return (
    <div>
      <h1 className="font-semibold text-lg sm:text-xl mb-5">
        Welcome, {role === "epron" ? "Admin" : name}
      </h1>
      {user.role === "manufacturer" && !user.approved_documents ? (
        <div>
          <p className="mb-3">Your documents are yet to be approved.</p>
          <p className="mb-3">
            If you have submitted your documents kindly reach out to the EPRON
            admin here: <b>09061935560</b> or send a mail to{" "}
            <b>info@epron.org.ng</b> for your activation.
          </p>
          <p className="mb-3">
            If you have not submitted your documents, kindly download the form
            below, fill it and send the completed form to{" "}
            <b>info@epron.org.ng</b> to get started.
          </p>
          <Link
            to="/docs/producer_registration_form.docx"
            target="_blank"
            download
          >
            <button className="bg-main mt-5 text-white px-5 h-12 rounded-md shadow-md block">
              Download Form
            </button>
          </Link>
          <p className="mt-5">
            * When you submit the document, kindly check back after one working
            day to confirm that they are approved, thank you.
          </p>
        </div>
      ) : (
        <div>
          <CardSection role={role} data={cardData} />
          <div className="">
            <div className="filter-wrap flex justify-between items-center mt-10">
              <div className="hidden sm:grid grid-cols-2 gap-2 items-center w-1/2 max-w-2xl">
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
                </div>
                <div className="search relative">
                  <input
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                    }}
                    onKeyUp={() => {
                      search(searchValue);
                    }}
                    type="text"
                    placeholder="Search by type"
                    className="w-full h-12 block border"
                  />
                  <i
                    onClick={() => search(searchValue)}
                    className="fas fa-search absolute top-pos right-5 text-xs"
                  ></i>
                </div> */}
              </div>

              <div className="button-wrap flex items-center">
                <Export
                  exportData={exportData}
                  getData={
                    role === "manufacturer"
                      ? getExportEquipment
                      : getExportEwaste
                  }
                  loading={exportLoading}
                  id={user._id || null}
                />
                <button
                  onClick={() => navigate("log")}
                  className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block"
                >
                  Log {role === "manufacturer" ? "Equipment" : "E-waste"}
                </button>
              </div>
            </div>
            <Table
              columns={role === "manufacturer" ? columns : collectorColumns}
              data={tableData}
              editRecord={editEquipment}
              deleteRecord={onDeleteEquipment}
              hasRedirect={true}
              change={changePage}
              total={dataTotal}
              pagination={hasPagination}
            />
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
                onClick={() => deleteEquipment(deleteId)}
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

export default DashboardHome;
