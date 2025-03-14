import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../features/Card";
import Table from "../../features/Table";
import {
  useGetAllUsersMutation,
  useGetUsersByRoleMutation,
} from "../../../../../services/usersService";
import PageSpinner from "../../../../common/PageSpinner";
import { useDispatch } from "react-redux";
import { showToast } from "../../../../../reducers/toastSlice";
import Export from "../../features/Export";
import { roleOptions } from "../../data";
import SearchSelect from "../../../../common/SearchSelect";
import { useFilterUsersMutation } from "../../../../../services/adminService";

function UserManagement() {
  const [exportData, setExportData] = useState();
  const [exportLoading, setExportLoading] = useState(false);
  const [hasPagination, setHasPagination] = useState(false) 
  const [pageLoading, setPageLoading] = useState(false);
  let [showDisableModal, setShowDisableModal] = useState(false);
  let [userAction, setUserAction] = useState();
  let [showDeleteModal, setShowDeleteModal] = useState(false);
  const [data, setData] = useState();
  const [tableData, setTableData] = useState();
  const [totalUsers, setTotalUsers] = useState();
  const [inactiveUsers, setInactiveUsers] = useState();
  const [verifiedUsers, setVerifiedUsers] = useState();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [getAllUsers] = useGetAllUsersMutation();
  const [filterUsers] = useFilterUsersMutation();
  const [getUsersByRole] = useGetUsersByRoleMutation();
  const [role, setRole] = useState("");
  const dispatch = useDispatch();

  const getUsers = (data) => {
    setPageLoading(true);
    setHasPagination(true)
    getAllUsers(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          setData(res.users);
          setTableData(res.users);
          setTotalUsers(res.total_users);
          setInactiveUsers(res.inactive_users);
          setVerifiedUsers(res.verified_users);
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

  const getExportUsers = (page) => {
    setExportLoading(true);
    setHasPagination(true)
    getAllUsers(page)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          let data = []
          res.users.map(log => data.push({
            User: log.name,
            Email: log.email,
            Phone: log.phoneNumber,
            Role: log.role,
            Verification: log.verified,
            Blocked: log.blocked,
            Date: new Date(log.created_at).toDateString(),
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
        setExportLoading(false);
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
    getUsers({page, pagination: true});
  };

  useEffect(() => {
    setPageLoading(true);
    getUsers({pagination: true});
  }, []);

  useEffect(() => {}, [tableData]);

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
    record.status === "active"
      ? setUserAction("disable")
      : setUserAction("activate");
    setShowDisableModal(true);
  };

  const onDisableUser = () => {
    alert("User disabled");
    setShowDisableModal(false);
    // make request
  };

  const search = (value, key) => {
    if (value === "" || value === " ") {
      return getUsers({pagination: true});
    }
    if (key === "Enter") return onSearchUsers(value);
  };

  const onSearchUsers = (value, page) => {
    const data = {
      value,
      page,
    };
    setPageLoading(true);
    setHasPagination(false)
    filterUsers(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          setTableData(res.users);
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

  const onRoleChange = (selectedOption) => {
    setRole(selectedOption);
    if (!selectedOption) {
      getUsers({pagination: true});
    } else {
      searchByRole(selectedOption.value)
    }
  };

  const searchByRole = (role) => {
    setPageLoading(true)
    setHasPagination(false)
    getUsersByRole(role)
      .unwrap()
      .then((res) => {
        setPageLoading(false)
        if (!res.error) {
          setTableData(res.user);
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
      index: "role",
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
      index: "verified",
    }
  ];

  return (
    <div>
      <h1 className="font-semibold text-xl mb-10">Manage Users</h1>
      <div className="cards grid grid-cols-3">
        <Card val={totalUsers || 0} text={"Total Users"} />
        <Card val={verifiedUsers || 0} text={"Total Verified Users"} />
        <Card val={totalUsers - verifiedUsers || 0} text={"Total Unverified Users"} />
      </div>
      <div className="filter-wrap flex justify-between items-center mt-10">
        <div className="grid grid-cols-2 gap-2 items-center w-1/2 max-w-2xl">
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
              placeholder="Search"
              className="w-full h-12 block border"
            />
            <i
              onClick={() => onSearchUsers(searchValue)}
              className="fas fa-search absolute top-pos right-5 text-xs"
            ></i>
          </div>
          <div className="filter relative">
            <SearchSelect
              value={role}
              name={"Role"}
              selectData={roleOptions}
              onChange={onRoleChange}
              isDisabled={false}
              placeholder="Filter by role"
              noError={true}
            />
          </div>
        </div>

        <div className="button-wrap flex items-center">
        <Export exportData={exportData} getData={getExportUsers} loading={exportLoading}  />
        </div>
      </div>
      <Table
        columns={columns}
        data={tableData}
        hasRedirect={true}
        change={changePage}
        total={totalUsers}
        pagination={hasPagination}
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
            <p className="font-semibold mb-10 text-center">
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
            <p className="font-semibold mb-10 text-center">
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
      {pageLoading ? <PageSpinner /> : null}
    </div>
  );
}

export default UserManagement;
