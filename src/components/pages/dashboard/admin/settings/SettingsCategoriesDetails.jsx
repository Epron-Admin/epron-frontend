import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../../../../../reducers/toastSlice";
import {
  useCreateTypesMutation,
  useDeleteTypeMutation,
  useGetTypesMutation,
  useUpdateTypeMutation,
} from "../../../../../services/globalService";
import PageSpinner from "../../../../common/PageSpinner";
import { formatNumber } from "../../../../../utils/helper";

function SettingsCategoriesDetails() {
  const [pageLoading, setPageLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [editId, setEditId] = useState("");
  const [modalState, setModalState] = useState();
  const [modalInput, setModalInput] = useState("");
  const [modalPrice, setModalPrice] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [categories, setCategories] = useState({});
  const [types, setTypes] = useState([]);
  const [getTypes] = useGetTypesMutation();
  const [createTypes] = useCreateTypesMutation();
  const [updateType] = useUpdateTypeMutation();
  const [deleteType] = useDeleteTypeMutation();

  useEffect(() => {
    onGetCategory();
  }, []);

  useEffect(() => {}, [categories]);

  const onGetCategory = () => {
    setPageLoading(true);
    getTypes(state.id)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setTypes(res.types);
          setPageLoading(false);
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

  const onAdd = () => {
    setModalState("add");
    setShowModal(true);
  };

  const addType = () => {
    const data = { name: modalInput, price: modalPrice, category_id: state.id };
    setPageLoading(true);
    createTypes(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Type created successfully",
            })
          );
          setShowModal(false);
          setModalInput("");
          setModalPrice("");
          onGetCategory();
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
        if (!err.data) {
          errMsg = "Check your network and try again";
        } else errMsg = err.data.message;
        dispatch(
          showToast({
            status: "error",
            title: "Error",
            message: errMsg,
          })
        );
      });
    // clear modal input
  };

  const onEdit = (name, price, id) => {
    setModalInput(name);
    setModalPrice(price);
    setEditId(id);
    setModalState("edit");
    setShowModal(true);
  };

  const editType = () => {
    const data = { name: modalInput, price: modalPrice, category_id: state.id };
    const reqData = { data: data, id: editId };
    setPageLoading(true);
    updateType(reqData)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Category updated successfully",
            })
          );
          setShowModal(false);
          setEditId(null);
          setModalInput("");
          setModalPrice("");
          onGetCategory();
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

  const onDelete = (id) => {
    setDeleteModal(true);
    setDeleteId(id);
  };

  const onClose = () => {
    setShowModal(false);
    setEditId(null);
    setModalInput("");
    setModalPrice("");
  };

  const onCancel = () => {
    setDeleteModal(false);
  };

  const onDeleteType = (id) => {
    setPageLoading(true);
    deleteType(id)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Record deleted successfully",
            })
          );
          onGetCategory();
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
    setDeleteModal(false);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-semibold text-xl">Types Settings</h1>
        <button
          onClick={() => onAdd()}
          className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block"
        >
          Add Type
        </button>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <p className="">Category Name:</p>
        <h1 className="font-semibold">{state.name}</h1>
      </div>
      {types.length <= 0 ? (
        <p>No types found</p>
      ) : (
        <div className="bg-white">
          {types.map((item, index) => (
            <div
              key={index}
              className="flex items-center border-b border-0 px-5 py-3"
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <h1 className="text-base font-semibold mb-2">{item.name}</h1>
                  <p>Price: ₦{formatNumber(item.price)}/ton</p>
                </div>
                <div className="flex items-center gap-3">
                  <p
                    className={`px-3 py-2 cursor-pointer text-base`}
                    onClick={() => onEdit(item.name, item.price, item._id)}
                  >
                    <i className="fa-solid fa-edit mr-1 text-blue-500"></i> Edit
                  </p>
                  <p
                    className={`px-3 py-2 cursor-pointer text-base text-red-500`}
                    onClick={() => onDelete(item._id)}
                  >
                    <i className="fa-solid fa-trash mr-1"></i> Delete
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal ? (
        <div className="bg-black bg-opacity-80 w-full h-screen flex items-center justify-center fixed top-0 left-0 px-5">
          <div className="bg-white relative w-full max-w-xl py-10 px-10">
            <i
              onClick={() => onClose()}
              className="fa-regular fa-times-circle text-lg cursor-pointer absolute top-5 right-5"
            ></i>
            <p className="text-lg font-semibold mb-8">
              {modalState === "add" ? "Add" : "Edit"} Type
            </p>
            <label>Name</label>
            <input
              type="text"
              value={modalInput}
              onChange={(e) => {
                setModalInput(e.target.value);
              }}
              placeholder="Enter type name"
              className="w-full mb-5 h-12 px-3"
            />
            <label>Price (per ton)</label>
            <input
              type="number"
              value={modalPrice}
              onChange={(e) => {
                setModalPrice(e.target.value);
              }}
              placeholder="Enter type Price"
              className="w-full mb-10 h-12 px-3"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  modalState === "add" ? addType() : editType();
                }}
                className="px-10 py-2 bg-green-600 text-white mx-2 rounded-md cursor-pointer"
              >
                {modalState === "add" ? "Add" : "Edit"}
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
      {deleteModal ? (
        <div className="bg-black bg-opacity-80 w-full h-screen flex items-center justify-center fixed top-0 left-0 px-5">
          <div className="bg-white relative py-16 px-24 ">
            <i
              onClick={() => onCancel()}
              className="fa-regular fa-times-circle text-lg cursor-pointer absolute top-5 right-5"
            ></i>
            <p className="text-lg font-semibold mb-8">
              Are you sure you want to delete this type?
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => onDeleteType(deleteId)}
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

export default SettingsCategoriesDetails;
