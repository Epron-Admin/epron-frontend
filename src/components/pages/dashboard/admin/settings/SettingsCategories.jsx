import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../../../../../reducers/toastSlice";
import {
  useCreateCategoriesMutation,
  useDeleteCategoryMutation,
  useGetCategoriesMutation,
  useUpdateCategoryMutation,
} from "../../../../../services/globalService";
import PageSpinner from "../../../../common/PageSpinner";

function SettingsCategories() {
  const [pageLoading, setPageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [editId, setEditId] = useState("");
  const [modalState, setModalState] = useState();
  const [modalInput, setModalInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getCategories] = useGetCategoriesMutation();
  const [categories, setCategories] = useState([]);
  const [createCategories] = useCreateCategoriesMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  useEffect(() => {
    onGetCategories();
  }, []);

  useEffect(() => {}, [categories]);

  const onGetCategories = () => {
    setPageLoading(true);
    getCategories()
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setCategories(res.categories);
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

  const addCategory = () => {
    const data = { name: modalInput };
    setPageLoading(true);
    createCategories(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Category created successfully",
            })
          );
          setShowModal(false);
          setModalInput("");
          onGetCategories();
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
    // clear modal input
  };

  const onEdit = (name, id) => {
    setModalInput(name);
    setEditId(id);
    setModalState("edit");
    setShowModal(true);
  };

  const editCategory = () => {
    const data = { name: modalInput };
    const reqData = { data: data, id: editId };
    setPageLoading(true);
    updateCategory(reqData)
      .unwrap()
      .then((res) => {
        if(!res.error) {
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
        onGetCategories();
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
  };

  const onCancel = () => {
    setDeleteModal(false);
  };

  const onDeleteCategory = (id) => {
    setPageLoading(true);
    deleteCategory(id)
      .unwrap()
      .then((res) => {
        if(!res.error) {
        setPageLoading(false);
        dispatch(
          showToast({
            status: "success",
            title: "Success",
            message: "Record deleted successfully",
          })
        );
        onGetCategories();
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
          message: `${errMsg}`,
        })
      );
    });
    setDeleteModal(false);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-semibold text-xl">Category Settings</h1>
        <button
          onClick={() => onAdd()}
          className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block"
        >
          Add Category
        </button>
      </div>
      {categories.length <= 0 ? (
        <p>No categories to display</p>
      ) : (
        <div className="bg-white">
          {categories.map((item, index) => (
            <div
              key={index}
              className="flex items-center border-b border-0 px-5 "
            >
              <div className="flex items-center justify-between w-full">
                <h1
                  onClick={() =>
                    navigate("types", {
                      state: { id: item._id, name: item.name },
                    })
                  }
                  className="text-base font-semibold cursor-pointer w-full py-5"
                >
                  {item.name}
                </h1>
                <div className="flex items-center gap-3">
                  <p
                    className={`flex items-center px-3 py-2 cursor-pointer text-base text-blue-500`}
                    onClick={() => onEdit(item.name, item._id)}
                  >
                    <i className="fa-solid fa-edit mr-1"></i> Edit
                  </p>
                  <p
                    className={`flex items-center px-3 py-2 cursor-pointer text-base text-red-500`}
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
              {modalState === "add" ? "Add" : "Edit"} Category
            </p>
            <label>Category Name</label>
            <input
              type="text"
              value={modalInput}
              onChange={(e) => {
                setModalInput(e.target.value);
              }}
              placeholder="Enter category name"
              className="w-full mb-10 h-12 px-3"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  modalState === "add" ? addCategory() : editCategory();
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
              Are you sure you want to delete this category?
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => onDeleteCategory(deleteId)}
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

export default SettingsCategories;
