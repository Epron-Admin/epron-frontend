import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { showToast } from "../../../reducers/toastSlice";
import {
  useUpdateBulkTransactionMutation,
  useVerifyTransactionMutation,
} from "../../../services/paymentService";
import { useDispatch } from "react-redux";
import Spinner from "../../common/Spinner";
import { useUploadEquipmentMutation } from "../../../services/bulkService";

function PaymentVerification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("paymentReference");
  const [loading, setLoading] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [updateBulkTransaction] = useUpdateBulkTransactionMutation();
  const [verifyTransaction] = useVerifyTransactionMutation();
  const [uploadEquipment] = useUploadEquipmentMutation();
  let bulkData = JSON.parse(localStorage.getItem("bulkData"));

  const getEquipmentPin = (ref) => {
    return ref.substring(7);
  };

  const onUploadEquipment = (data) => {
    uploadEquipment(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
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
        console.log("Upload Bulk ==>", err)
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

  const updatePayment = (pin, reference) => {
    let data = {
      pin,
      reference,
    };
    setLoading(true);
    updateBulkTransaction(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          if(bulkData) {
            localStorage.clear("bulkData")
          }
          setLoading(false);
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Payment completed successfully",
            })
          );
          navigate("/dashboard");
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
        console.log("Update Transaction ==>", err)
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

  const verifyPayment = () => {
    setLoading(true);
    verifyTransaction(reference)
      .unwrap()
      .then((res) => {
        if (res.requestSuccessful) {
          let ref = res.responseData.merchantReference;
          let pin = getEquipmentPin(ref);
          setVerifyStatus(true);
          if (bulkData) {
            bulkData.forEach((item) =>
              onUploadEquipment({ ...item, equipmentPin: pin})
            );
            updatePayment(pin, ref)
          }
          else updatePayment(pin, ref)
        } else {
          setLoading(false);
          setVerifyStatus(false);
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
        console.log("Verify Transaction ==>", err)
        setLoading(false);
        setVerifyStatus(false);
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

  useEffect(() => {
    if(verifyStatus === null) {
      verifyPayment()
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center pt-40">
      <Link to={"/"} className="logo w-32 lg:w-60 cursor-pointer mb-10">
        <img src={logo} alt="" />
      </Link>
      {loading ? (
        <div className="h-44 flex items-center justify-center">
          <Spinner />
        </div>
      ) : verifyStatus === true ? (
        <div className="h-44 flex items-center justify-center">
          <i className="fas fa-check-circle text-7xl text-green-600"></i>
        </div>
      ) : verifyStatus === false ? (
        <div className="h-44 flex items-center justify-center">
          <i className="fas fa-times-circle text-7xl text-red-500"></i>
        </div>
      ) : (
        ""
      )}
      {loading ? (
        <p className="mt-5 text-lg text-gray-700">
          Verifying transaction. Please wait...
        </p>
      ) : verifyStatus === true ? (
        <p className="mt-5 text-lg text-gray-700">Transaction successful</p>
      ) : verifyStatus === false ? (
        <p className="mt-5 text-lg text-gray-700">
          Transaction was not successful or does not exist
        </p>
      ) : (
        ""
      )}
    </div>
  );
}

export default PaymentVerification;
