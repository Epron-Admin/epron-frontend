import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../../../../reducers/toastSlice";
import {
  useApproveDocumentsMutation,
  useDisapproveDocumentsMutation,
  useUpdateAdminRoleMutation,
} from "../../../../../services/adminService";
import {
  useActivateUserMutation,
  useDeactivateUserMutation,
} from "../../../../../services/usersService";
import Spinner from "../../../../common/Spinner";

function UserDetails() {
  const user = useSelector((state) => state.user.user.user);
  const user_role = user.epron_admin;
  let [showDisableModal, setShowDisableModal] = useState(false);
  let [changeRole, setChangeRole] = useState(false)
  let [showApproveModal, setShowApproveModal] = useState(false);
  let [userAction, setUserAction] = useState();
  const [loading, setLoading] = useState();
  const { state } = useLocation();
  const { record } = state;
  console.log(record)
  const [activateUser] = useActivateUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {}, [record]);

  const disableUser = () => {
    !record.blocked ? setUserAction("disable") : setUserAction("activate");
    setShowDisableModal(true);
  };

  const onDisableUser = (id) => {
    if (userAction === "disable") {
      setLoading(true);
      deactivateUser(id)
        .unwrap()
        .then((res) => {
          setLoading(false);
          if (!res.error) {
            navigate("/admin/users");
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
    } else {
      setLoading(true);
      activateUser(id)
        .unwrap()
        .then((res) => {
          setLoading(false);
          if (!res.error) {
            navigate("/admin/users");
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
    }
    setShowDisableModal(false);
    // make request
  };

  const [approveDocument] = useApproveDocumentsMutation();
  const [disapproveDocument] = useDisapproveDocumentsMutation();
  const [changeUserRole] = useUpdateAdminRoleMutation()

  const approveDocs = () => {
    setLoading(true);
    approveDocument(record._id)
      .unwrap()
      .then((res) => {
        setLoading(false);
        if (!res.error) {
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Documents approved successfully",
            })
          );
          navigate("/admin/users");
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
  const disapproveDocs = () => {
    disapproveDocument(record._id)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Documents disapproved successfully",
            })
          );
          navigate("/admin/users");
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
  const onChangeRole = () => {
    let data = {id: record._id, data: {
      epron_admin: record.epron_admin === "read" ? "write" : "read"
    }}
    changeUserRole(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Admin role has been changed",
            })
          );
          setChangeRole(false);
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
  return (
    <div>
      <div className="text-sm">
        <div className="flex justify-between mb-5 border-b">
          <div>
            <h1 className="text-2xl">{record.name}</h1>
            <p className="capitalize text-base">{record.role}</p>
          </div>
          {user_role === "write" && (
            <div className="flex">
              {/* {record.role === "epron" ? (
              <button
                onClick={() => {}}
                className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block"
              >
                Edit
              </button>
            ) : null} */}
              {record.role === "manufacturer" && !record.approved_documents ? (
                <button
                  onClick={() => {
                    setShowApproveModal(true);
                  }}
                  className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block"
                >
                  Approve Documents
                </button>
              ) : record.role === "manufacturer" &&
                record.approved_documents ? (
                <button
                  onClick={() => {
                    setShowApproveModal(true);
                  }}
                  className="bg-red-500 text-white px-5 h-10 rounded-md ml-5 shadow-md block"
                >
                  Disapprove Documents
                </button>
              ) : null}
              {user.role === "epron" && record.epron_admin !== "superadmin" && (
                <button
                  onClick={() => {
                    setChangeRole(true);
                  }}
                  className="bg-main text-white px-5 h-10 rounded-md ml-5 shadow-md block"
                >
                  Change Role
                </button>
              )}
              <button
                onClick={() => {
                  disableUser();
                }}
                className={`${
                  record.blocked ? "bg-green-500" : "bg-red-500"
                } text-white px-5 h-10 rounded-md ml-5 shadow-md block`}
              >
                {loading ? <Spinner /> : record.blocked ? "Activate" : "Block"}
              </button>
            </div>
          )}
        </div>
        <section className="grid grid-cols-2 gap-5 shadow bg-white p-5">
          <div className="border-r">
            <p className="py-3">
              <span className="font-semibold">Email: </span> {record.email}
            </p>
            
              <p className="py-3">
                <span className="font-semibold">User Role: </span>{" "}
                <span className="capitalize">{record.role}</span>
              </p>
            
            {record.role === "epron" && (
              <p className="py-3">
                <span className="font-semibold">Epron Access: </span>{" "}
                <span className="capitalize">{record.epron_admin}</span>
              </p>
            )}
            <p className="py-3">
              <span className="font-semibold">Phone: </span>{" "}
              {record.phoneNumber}
            </p>
            <p className="py-3">
              <span className="font-semibold">Created At: </span>{" "}
              {new Date(record.created_at).toDateString()}
            </p>
            <p className="py-3">
              <span className="font-semibold">Verification status: </span>{" "}
              {record.verified ? "Verified" : "Unverified"}
            </p>
            {record.role !== "epron" && (
              <p className="py-3">
                <span className="font-semibold">Approved Documents: </span>{" "}
                {record.approved_documents ? "True" : "False"}
              </p>
            )}
            <p className="py-3">
              <span className="font-semibold">Status: </span>
              {record.blocked ? "Blocked" : "Active"}
            </p>
          </div>
          {(record.role === "collector" || record.role === "recycler") && (
            <div>
              <p className="py-3">
                <span className="font-semibold">State: </span> {record.state}
              </p>
              <p className="py-3">
                <span className="font-semibold">LGA: </span> {record.lga}
              </p>
              <p className="py-3">
                <span className="font-semibold">Address: </span>{" "}
                {record.address}
              </p>
            </div>
          )}
        </section>
      </div>
      {changeRole && (
        <div className="modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl py-16 px-10 rounded-md relative">
            <i
              className="fas fa-times absolute top-5 right-5 cursor-pointer text-red-500"
              onClick={() => {
                setChangeRole(false);
              }}
            ></i>
            <p className="mb-10 text-center">
              Are you sure you want to change user's role to {record.epron_admin === "read" ? "write" : "read"}?
            </p>
            <div className="flex justify-center mt-5">
              <button
                onClick={() => onChangeRole(record._id)}
                className="px-10 py-2 bg-green-600  text-white mx-2 rounded-md cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setChangeRole(false)}
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
                onClick={() => onDisableUser(record._id)}
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
      {showApproveModal && (
        <div className="modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl py-16 px-10 rounded-md relative">
            <i
              className="fas fa-times absolute top-5 right-5 cursor-pointer text-red-500"
              onClick={() => {
                setShowApproveModal(false);
              }}
            ></i>
            <p className="mb-10 text-center">
              Are you sure you want to{" "}
              {record.approved_documents ? "disapprove" : "approve"} this user's
              documents?
            </p>
            <div className="flex justify-center mt-5">
              <button
                onClick={() =>
                  record.approved_documents ? disapproveDocs() : approveDocs()
                }
                className="px-10 py-2 bg-green-600  text-white mx-2 rounded-md cursor-pointer"
              >
                {loading ? <Spinner /> : "Yes"}
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-10 py-2 bg-red-600  text-white mx-2 rounded-md cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
