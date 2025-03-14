import React, { useState, useCallback } from "react";
// Import the dropzone component
import Dropzone from "../features/Dropzone";
import { useDispatch, useSelector } from "react-redux";
import {
  useUploadEquipmentMutation,
  useUploadEwasteMutation,
} from "../../../../services/bulkService";
import { showToast } from "../../../../reducers/toastSlice";
import PageSpinner from "../../../common/PageSpinner";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { formatNumber, generatePaymentObj } from "../../../../utils/helper";
import { utils, read } from "xlsx";
import {
  useGetAllTypesMutation,
  useGetCategoriesMutation,
} from "../../../../services/globalService";
import { useEffect } from "react";
import PaymentButton from "../features/PaymentButton";
// import template from "/log.xlsx";

// import "./App.css";

function AddBulkEquipment() {
  let [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState("");
  const [equipmentPin, setEquipmentPin] = useState();
  const [pageLoading, setPageLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate("/dashboard");
  const [file, setFile] = useState();
  const user = useSelector((state) => state.user.user.user);
  const categoryData = useSelector((state) => state.global.categories);
  const typeData = useSelector((state) => state.global.types);
  const [data, setData] = useState("");
  const [type, setType] = useState("");
  const [getCategories] = useGetCategoriesMutation();
  const [getTypes] = useGetAllTypesMutation();
  const [error, setError] = useState(false);
  const [uploadEquipment] = useUploadEquipmentMutation();
  const [uploadEwaste] = useUploadEwasteMutation();

  // const fileDownload = require("react-file-download");

  const getCategoryId = (name, index) => {
    if (error) return;
    if (!name) {
      setError(true);
      return dispatch(
        showToast({
          status: "error",
          title: "Empty Cell",
          message: `No category selected on row ${index + 1}`,
        })
      );
    }
    let temp = categoryData.filter(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    let tempObj = temp[0];
    return tempObj._id;
  };

  const getTypeId = (name, categoryName, index) => {
    if (error) return;
    if (!name) {
      setError(true);
      return dispatch(
        showToast({
          status: "error",
          title: "Empty Cell",
          message: `No type selected on row ${index + 1}`,
        })
      );
    }

    let tempCategory = categoryData.filter(
      (item) => item.name.toLowerCase() === categoryName.toLowerCase()
    );
    let tempObjCategory = tempCategory[0];
    let temp = typeData.filter(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    let tempObj = temp[0];

    if (tempObj.category_id === tempObjCategory._id) return tempObj._id;
    else {
      setError(true);
      dispatch(
        showToast({
          status: "error",
          title: "Wrong Entry",
          message: `Category and type do not match on row ${index + 1}`,
        })
      );
    }
  };

  const getPrice = (name) => {
    if (error) return;
    let temp = typeData.filter(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    console.log(name, temp);
    let tempObj = temp[0];
    return tempObj.price;
  };

  const getWeight = (value, index) => {
    if (error) return;
    if (user.role === "manufacturer" && value < 1) {
      setError(true);
      return dispatch(
        showToast({
          status: "error",
          title: "Invalid Weight",
          message: `Weight must be at least 1,000 kg on row ${index + 1}`,
        })
      );
    }
    return value;
  };

  useEffect(() => {
  }, [error]);

  let csvFormat = "text/csv";
  let xlsxFormat =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const onDrop = useCallback(async (acceptedFiles) => {
    setError(false);
    setFile(null);
    if (
      acceptedFiles[0].type !== xlsxFormat &&
      acceptedFiles[0].type !== csvFormat
    ) {
      return dispatch(
        showToast({
          status: "error",
          title: "File does not match",
          message:
            "File must be in xlsx or csv format. Kindly use the template provided",
        })
      );
    }
    const data = await acceptedFiles[0].arrayBuffer();
    const workbook = read(data);
    const wb = workbook.Sheets[workbook.SheetNames[0]];
    const sheetArray = utils.sheet_to_json(wb, { header: 1 });
    getValues(sheetArray);
    if (error) return;
    else return setFile(acceptedFiles);
  }, []);

  const getValues = (sheetArray) => {
    try {
      const finalData = [];
      let uploadPrice = 0;
      for (let i = 0; i < sheetArray.length; i++) {
        if (error) break;
        if (i === 0) continue;
        if (sheetArray[i].length !== 5) {
          dispatch(
            showToast({
              status: "error",
              title: "File does not match",
              message: `Fill the sheet correctly on row ${i + 1}`,
            })
          );
          return setError(true);
        }
        if (
          typeof sheetArray[i][3] !== "number" ||
          typeof sheetArray[i][2] !== "number"
        ) {
          dispatch(
            showToast({
              status: "error",
              title: "Quantity or Weight is not a number",
              message: `Fill the sheet with the right data type on row ${
                i + 1
              }`,
            })
          );
          return setError(true);
        }
        let tempPrice = getPrice(sheetArray[i][1]);
        let tempUnit = sheetArray[i][4];
        let tempWeight =
          tempUnit === "kg"
            ? sheetArray[i][3] * 0.00110231
            : tempUnit === "g"
            ? sheetArray[i][3] * 0.00000110231
            : sheetArray[i][3];
        let temp = {
          category_id: getCategoryId(sheetArray[i][0], i),
          sub_category_id: getTypeId(sheetArray[i][1], sheetArray[i][0], i),
          price: tempPrice,
          total: tempPrice * tempWeight,
          quantity: sheetArray[i][2],
          weight: getWeight(tempWeight, i),
          unit_weight: sheetArray[i][3],
          unit: tempUnit,
          user_id: user._id,
        };
        console.log(tempPrice);
        uploadPrice = uploadPrice + +tempPrice;
        finalData.push(temp);
      }
      let equipment_pin = Math.random().toString(36).slice(2);
      setEquipmentPin(equipment_pin);
      setPrice(uploadPrice);
      return setData(finalData);
    } catch (err) {
      console.log("get values", err);
      setFile("");
      dispatch(
        showToast({
          status: "error",
          title: "Error",
          message: "Error occured. Check the file and try again",
        })
      );
    }
  };

  const uploadBulk = () => {
    try {
      if (user.role === "manufacturer") {
        setShowModal(true);
        localStorage.setItem("bulkData", JSON.stringify(data));
      } else {
        setPageLoading(true);
        data.forEach((item) =>
          // user.role === "manufacturer"
          //   ? onUploadEquipment({ ...item, equipmentPin })
          onUploadEwaste({ ...item, ewaste_pin: equipmentPin })
        );
        setPageLoading(false);
      }
      setFile("");
    } catch (err) {
      console.log("upload bulk", err);
      setFile("");
      setPageLoading(false);
      dispatch(
        showToast({
          status: "error",
          title: "Error",
          message: "Error occured. Check the file and try again",
        })
      );
    }
  };

  const onUploadEquipment = (data) => {
    uploadEquipment(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Equipment uploaded successfully",
            })
          );
          // navigate("/dashboard")
        } else {
          dispatch(
            showToast({
              status: "error",
              title: "Error",
              message: `${res.message}`,
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

  const onUploadEwaste = (data) => {
    uploadEwaste(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPageLoading(false);
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Ewaste uploaded successfully",
            })
          );
          // navigate("/dashboard")
        } else {
          dispatch(
            showToast({
              status: "error",
              title: "Error",
              message: `${res.message}`,
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

  const onCloseModal = () => {
    localStorage.clearItem("bulkData")
    setShowModal(false);
  }

  return (
    <main className="max-w-4xl mx-auto">
      <h1 className="text-main text-center font-semibold text-xl md:text-2xl mb-5">
        Add Bulk {user.role === "manufacturer" ? "Equipment" : "E-wastes"}
      </h1>
      <div className=" flex flex-col items-center mb-10">
        <p className="text-center">
          All files must be in csv or xlsx format. You can download the template
          and log your {user.role === "manufacturer" ? "equipment" : "e-wastes"}{" "}
          before uploading
        </p>
        <Link
          to="/docs/EPRON_bulk_equipment_template.xlsx"
          target="_blank"
          download
        >
          <button className="green-btn mt-3">Download Template</button>
        </Link>
      </div>
      <Dropzone onDrop={onDrop} />
      {!error && file && (
        <div className="mt-5">
          <p>
            <span className="font-semibold">Selected File Name:</span>{" "}
            {file[0].name}
          </p>
          <button
            onClick={() => {
              uploadBulk();
            }}
            className="green-btn mt-3"
          >
            Upload
          </button>
        </div>
      )}
      {showModal && (
        <div className="modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl py-16 px-10 rounded-md relative">
            {/* <i
              className="fas fa-times absolute top-5 right-5 cursor-pointer text-red-500"
              onClick={() => {
                setShowModal(false);
              }}
            ></i> */}
            {/* <i className="fas fa-check-double green-text text-5xl text-center block"></i> */}
            <h1 className="text-lg font-semibold green-text text-center">
              Payment is required to complete the upload.
            </h1>
            <p className="text-lg text-center mt-5">
              The total amount to pay is ₦{formatNumber(price)}
            </p>
            <div className="flex justify-center mt-5">
              <PaymentButton
                data={generatePaymentObj(
                  { total: price, equipment_pin: equipmentPin },
                  user
                )} text="Proceed"
              />
              {/* <button
                onClick={() => onMakePayment("yes")}
                className="px-10 py-2 bg-green-600  text-white mx-2 rounded-md cursor-pointer"
              >
                Yes
              </button> */}
              <button
                onClick={() => onCloseModal()}
                className="px-10 py-2 bg-red-600  text-white mx-2 rounded-md cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {pageLoading ? <PageSpinner /> : null}
    </main>
  );
}

export default AddBulkEquipment;
