import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { showToast } from "../../../../reducers/toastSlice";
import { useGetEwastesReadyForPickupMutation } from "../../../../services/recycleService";
import Table from "../features/Table";
import { useGetAllTypesMutation, useGetCategoriesMutation } from "../../../../services/globalService";

function CentreDetails() {
  const { state } = useLocation();
  const { id, name } = state;
  // const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [dataTotal, setDataTotal] = useState("");
  const categories = useSelector((state) => state.global.categories);
  const types = useSelector((state) => state.global.types);
  const dispatch = useDispatch();
  const [getEwaste] = useGetEwastesReadyForPickupMutation();

  const getCenterEwaste = (data) => {
    getEwaste({id: data.id})
      .unwrap()
      .then((res) => {
        if (!res.error) {
          let temp = []
          setPageLoading(false);
          setDataTotal(res.total_logged_ewaste);
          // setData(res.ewaste);
          res.ewaste.forEach(waste => {
            let tempCategory = categories.filter(item => item._id === waste.category_id)
            let categoryName = tempCategory[0].name
            let tempType = types.filter(item => item._id === waste.sub_category_id)
            let typeName = tempType[0].name
            temp.push({...waste, category: categoryName, type: typeName})
          })
          setTableData(temp);
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

  

  // filter each waste based on these

  useEffect(() => {
    getCenterEwaste({id, pagination: true})
  }, []);

  const columns = [
    {
      title: "E-waste Category",
      index: "category",
    },
    {
      title: "E-waste Type",
      index: "type"
    },
    {
      title: "Quantity",
      index: "quantity",
    },
    {
      title: "Weight (kg)",
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

  const changePage = (page) => {getCenterEwaste({id, page})};

  return (
    <div>
      <h1>{name}</h1>
      <p className="mt-5">
        All e-waste that are ready for pickup at this collection centre.
      </p>
      <Table
        columns={columns}
        data={tableData}
        hasRedirect={true}
        change={changePage}
        total={dataTotal}
      />
    </div>
  );
}

export default CentreDetails;
