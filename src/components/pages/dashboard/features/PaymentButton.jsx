import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../../common/Spinner";
import { useDispatch } from "react-redux";
import { useInitTransactionMutation } from "../../../../services/paymentService";
import { showToast } from "../../../../reducers/toastSlice";

function PaymentButton({ data, text }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [startPayment, setStartPayment] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [initTransaction] = useInitTransactionMutation();

//   navigate user to dashboard when link is clicked
const onPay = () => {
  console.log("clicked")
  navigate("/dashboard")
}

  const onStart = () => {
    setLoading(true);
    initTransaction(data)
      .unwrap()
      .then((res) => {
        setLoading(false);
        if (res.requestSuccessful) {
          console.log("res", res);
          // get payment URL
          setUrl(res.responseData.paymentUrl);
          setStartPayment(true);
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
      {!startPayment ? (
        <button
          className="bg-main text-white px-10 py-2 rounded-md shadow-md block"
          onClick={onStart}
        >
          {loading ? <Spinner /> : text || "Yes"}
        </button>
      ) : (
        <div onClick={onPay}>
        <a href={url} rel="noreferrer" target="_blank">
          <button className="bg-main text-white px-10 py-2 rounded-md shadow-md block">
            Pay Now
          </button>
        </a></div>
      )}
    </div>
  );
}

export default PaymentButton;
