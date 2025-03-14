import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../../../../reducers/toastSlice";
import { useDashboardCountMutation } from "../../../../services/globalService";
import PageSpinner from "../../../common/PageSpinner";
import Card from "../features/Card";

function AdminHome() {
  const [pageLoading, setPageLoading] = useState(false);
  const [countData, setCountData] = useState("");
  const [dashboardCount] = useDashboardCountMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    setPageLoading(true);
    dashboardCount()
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          setCountData(res.data);
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
  }, []);
  return (
    <div className="pb-10">
      <h1 className="font-semibold text-xl mt-5 mb-5 md:mb-10">
        Welcome back, Admin
      </h1>
      <div>
        <div className="cards grid grid-cols-3">
          <Card
            val={Math.ceil(countData.total_payment_reciceved) || 0}
            text={"Payments received (₦)"}
          />
          <Card
            val={countData.toal_requested_pickups || 0}
            text={"Pickups requested"}
          />
          <Card
            val={countData.manufacturers_logged_ewaste_weight || 0}
            text={"Weight of equipment logged (tons)"}
          />
          <Card
            val={countData.collection_centers_logged_ewaste_weight || 0}
            text={"Weight of E-wastes logged (tons)"}
          />
          <Card
            val={countData.recyclers_logged_ewaste_weight || 0}
            text={"Weight of recycled E-wastes (tons)"}
          />
          <Card val={countData.admin || 0} text={"Admin Users"} />
          <Card val={countData.manufacturers || 0} text={"OEMs registered"} />
          <Card
            val={countData.collectors || 0}
            text={"Collection Centres registered"}
          />
          <Card val={countData.recyclers || 0} text={"Recyclers registered"} />
        </div>
      </div>
      {pageLoading ? <PageSpinner /> : null}
    </div>
  );
}

export default AdminHome;
