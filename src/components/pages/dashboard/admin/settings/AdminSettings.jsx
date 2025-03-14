import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../features/Card";
import Utilities from "../../features/Utilities";
import Table from "../../features/Table";
import { user_data } from "../../../../../data/table_data";
import PageSpinner from "../../../../common/PageSpinner";
import {
  useGetAdminUsersMutation,
  useAddAdminUserMutation,
} from "../../../../../services/usersService";
import Export from "../../features/Export";
import SearchSelect from "../../../../common/SearchSelect";
import { epronRoleOptions } from "../../data";
import { useDispatch } from "react-redux";
import { showToast } from "../../../../../reducers/toastSlice";
import { Formik } from "formik";
import Spinner from "../../../../common/Spinner";

function AdminSettings() {
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  let [showDisableModal, setShowDisableModal] = useState(false);
  let [userAction, setUserAction] = useState();
  const [showModal, setShowModal] = useState(false);
  let [showDeleteModal, setShowDeleteModal] = useState(false);
  const [data, setData] = useState();
  const [tableData, setTableData] = useState();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [getAdminUsers] = useGetAdminUsersMutation();
  const [addAdminUser] = useAddAdminUserMutation();
  const dispatch = useDispatch();

  const getUsers = () => {
    setPageLoading(true);
    getAdminUsers()
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          setData(res.users);
          setTableData(res.users);
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
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {}, [tableData]);

  const addUser = () => {
    setShowModal(true);
  };

  const onAddUser = () => {
    const data = {
      name: userName,
      email: userEmail,
      phoneNumber: phoneNumber,
      password: "Password@2",
      epron_admin: role ? role.value : null,
    };
    // console.log(data)
    if (!data.name || !data.email || !data.phoneNumber || !data.epron_admin) {
      return dispatch(
        showToast({
          status: "error",
          title: "Error",
          message: "Fill all fields",
        })
      );
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
      return dispatch(
        showToast({
          status: "error",
          title: "Error",
          message: "Enter a valid email",
        })
      );
    } else {
      setLoading(true);
      addAdminUser(data)
        .unwrap()
        .then((res) => {
          if (!res.error) {
            setLoading(false);
            dispatch(
              showToast({
                status: "success",
                title: "Success",
                message: "User created successfuly. Verification is pending",
              })
            );
            onClose();
            getUsers();
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
            errMsg = err.data.message || err.data;
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
    }
  };

  const editUser = (record) => {
    navigate("edit", { state: { record: record } });
  };

  const deleteUser = (record) => {
    setShowDeleteModal(true);
  };

  const onDeleteUser = () => {
    alert("User deleted");
    setShowDeleteModal(false);
  };

  const disableUser = (record) => {
    !record.blocked ? setUserAction("disable") : setUserAction("activate");
    setShowDisableModal(true);
  };

  const onDisableUser = () => {
    alert("User disabled");
    setShowDisableModal(false);
    // make request
  };

  const onClose = () => {
    setShowModal(false);
    setUserName("");
    setUserEmail("");
    setPhoneNumber("");
    setRole("");
  };

  const onRoleChange = (selectedOption) => {
    setRole(selectedOption);
  };

  const search = (value) => {
    if (value === "" || value === " ") {
      return setTableData(data);
    }
    let filteredData = data.filter(
      (item) =>
        item.name.toLowerCase().match(value.toLowerCase()) ||
        item.email.toLowerCase().match(value.toLowerCase())
    );
    setTableData(filteredData);
  };

  const columns = [
    {
      title: "Full Name",
      index: "name",
    },
    {
      title: "Email",
      index: "email",
    },
    {
      title: "Role",
      index: "epron_admin",
    },
    {
      title: "Phone Number",
      index: "phoneNumber",
    },
    {
      title: "Created At",
      index: "created_at",
    },
    {
      title: "Status",
      index: "blocked",
    },
  ];
  return (
    <div>
      <h1 className="font-semibold text-xl mb-10">Admin Settings</h1>
      <div className="filter-wrap flex justify-between items-center mt-14">
        <div className="grid grid-cols-2 gap-2 items-center w-1/2 max-w-2xl">
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
              placeholder="Search"
              className="w-full h-10 block border"
            />
            <i
              // onClick={() => search(searchValue)}
              className="fas fa-search absolute top-pos right-5 text-xs"
            ></i>
          </div>
        </div>

        <div className="button-wrap flex items-center">
          {/* <Export tableData={tableData} /> */}
          <button
            onClick={() => addUser()}
            className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block"
          >
            Create User
          </button>
        </div>
      </div>
      <Table
        columns={columns}
        data={tableData}
        editRecord={editUser}
        deleteRecord={deleteUser}
        disableUser={disableUser}
        hasRedirect={true}
      />
      {showDeleteModal && (
        <div className="modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl py-16 px-10 rounded-md relative">
            <i
              className="fas fa-times absolute top-5 right-5 cursor-pointer text-red-500"
              onClick={() => {
                setShowDeleteModal(false);
              }}
            ></i>
            <p className="mb-10 text-center">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-center mt-5">
              <button
                onClick={() => onDeleteUser()}
                className="px-10 py-2 bg-green-600  text-white mx-2 rounded-md cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-10 py-2 bg-red-600  text-white mx-2 rounded-md cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {showDisableModal && (
        <div className="modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl py-16 px-10 rounded-md relative">
            <i
              className="fas fa-times absolute top-5 right-5 cursor-pointer text-red-500"
              onClick={() => {
                setShowDisableModal(false);
              }}
            ></i>
            <p className="mb-10 text-center">
              Are you sure you want to {userAction} this user?
            </p>
            <div className="flex justify-center mt-5">
              <button
                onClick={() => onDisableUser()}
                className="px-10 py-2 bg-green-600  text-white mx-2 rounded-md cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDisableModal(false)}
                className="px-10 py-2 bg-red-600  text-white mx-2 rounded-md cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal ? (
        <div className="bg-black bg-opacity-80 w-full h-screen flex items-center justify-center fixed top-0 left-0 px-5">
          <form className="bg-white relative w-full max-w-xl py-10 px-10">
            <i
              onClick={() => onClose()}
              className="fa-regular fa-times-circle text-lg cursor-pointer absolute top-5 right-5"
            ></i>
            <p className="text-lg font-semibold mb-5">Add New Admin User</p>
            <label>User Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              placeholder="Full Name"
              className="w-full mb-5 h-10 px-3"
              required
            />
            <label>Email</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
              placeholder="Email"
              className="w-full mb-5 h-12 px-3"
              required
            />
            <label>Phone</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
              placeholder="Phone Number"
              className="w-full mb-5 h-10 px-3"
              required
            />
            <label>Role</label>
            <SearchSelect
              value={role}
              name={"Role"}
              selectData={epronRoleOptions}
              onChange={onRoleChange}
              isDisabled={false}
              placeholder="Select a role"
              noError={true}
            />
            <div className="flex justify-end mt-5">
              <button
                type="button"
                onClick={() => onAddUser()}
                className="px-10 py-2  bg-green-600 text-white mx-2 rounded-md cursor-pointer"
              >
                {loading ? <Spinner /> : "Add"}
              </button>
              <button
                onClick={() => onClose()}
                className="px-10 py-2 bg-red-600 text-white ml-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
      {pageLoading ? <PageSpinner /> : null}
    </div>
  );
}

export default AdminSettings;
