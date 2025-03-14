import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../../reducers/toastSlice";
import { useGetUsersByRoleMutation } from "../../../../../services/usersService";
import PageSpinner from "../../../../common/PageSpinner";

function AssignRecyclers() {
  const [pageLoading, setPageLoading] = useState(false);
  const [recyclers, setRecyclers] = useState([]);
  const [getUsersByRole] = useGetUsersByRoleMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getRecyclers = () => {
    setPageLoading(true);
    getUsersByRole("recycler")
      .unwrap()
      .then((res) => {
        if (!res.error) setRecyclers(res.user);
        else {
          dispatch(
            showToast({
              status: "error",
              title: "Error",
              message: res.message,
            })
          );
        }
        setPageLoading(false)
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
  useEffect(() => {
    getRecyclers();
  }, []);
  return (
    <div>
      <h1 className="font-semibold text-xl mb-10">All Recyclers</h1>
      <div className="grid grid-cols-3 gap-5">
        {recyclers.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate("details", { state: { record: item } })}
            className="bg-white border-b border-0 p-5 log-item cursor-pointer rounded shadow-md"
          >
            <div className="flex items-center">
              <i className="fa-solid fa-recycle text-xl w-10"></i>
              <h1 className="text-base font-semibold">{item.name}</h1>
            </div>
            <p className="text-sm">
              Assigned Centers: {item.collection_center.length}
            </p>
          </div>
        ))}
      </div>
      {pageLoading ? <PageSpinner /> : null}
    </div>
  );
}

export default AssignRecyclers;
