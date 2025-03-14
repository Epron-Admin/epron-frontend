import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../reducers/toastSlice";
import { useGetAssignedCollectionCentresMutation } from "../../../../services/recycleService";
import { formatUrl } from "../../../../utils/helper";
import PageSpinner from "../../../common/PageSpinner";
import Table from "../features/Table";

function Centres() {
  const user = useSelector((state) => state.user.user.user);
  const [centers, setCenters] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState();
  const [getCentres] = useGetAssignedCollectionCentresMutation();

  useEffect(() => {
    setPageLoading(true);
    getCentres(user._id)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setCenters(res.recyceler.collection_center);
        }
        else {
          dispatch(
            showToast({
              status: "error",
              title: "Error",
              message: res.message,
            })
          );
        }
        setPageLoading(false);
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
  }, []);
  
  return (
    <div>
      <h1 className="font-semibold text-xl mt-5 mb-5">Collection Centres</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {centers &&
          centers.map((item, index) => (
            <div
              key={index}
              onClick={() =>
                navigate(`${formatUrl(item.name)}`, {
                  state: { id: item._id, name: item.name },
                })
              }
              className="bg-white border-b border-0 p-5 log-item cursor-pointer rounded shadow-md"
            >
              <div className="flex items-center">
                <i className="fa-solid fa-recycle text-xl w-10"></i>
                <h1 className="text-base font-semibold">{item.name}</h1>
              </div>
              <p className="text-sm py-1">Email: {item.email}</p>
              <p className="text-sm py-1">Phone: {item.phoneNumber}</p>
              <p className="text-sm py-1">Address: {item.address || "nil"}</p>
            </div>
          ))}
      </div>
      {pageLoading ? <PageSpinner /> : null}
    </div>
  );
}

export default Centres;
