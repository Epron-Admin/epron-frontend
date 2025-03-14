import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import loginPic from "../../../assets/login.png";
import "./auth.css";
import { useVerifyEmailMutation } from "../../../services/authService";
import { showToast } from "../../../reducers/toastSlice";
import Spinner from "../../common/Spinner";

function Verify() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  console.log(token);
  const [verifyEmail] = useVerifyEmailMutation();
  const navigate = useNavigate();
  const onVerifyEmail = () => {
    setLoading(true);
    verifyEmail(token)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: `Email verified successfully`,
            })
          );
          navigate("/signin");
        } else {
          setLoading(false);
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
      <Header />
      <div className="auth min-h-screen flex justify-center items-center pt-20 pb-10">
        <div className="auth-wrap flex justify-center">
          <div className="auth-side relative text-white px-8 py-10 hidden xl:block bg-gray-200 lg:w-1/2">
            <div className="flex flex-col justify-end h-full text-center auth-side-text relative">
              <h1 className="text-2xl">
                Electronic Waste Management Made Easy!
              </h1>
              <p className="text-base">
                OEMs, Importers and Producers play a critical role in ensuring
                this process is a success
              </p>
            </div>
            <img
              src={loginPic}
              alt=""
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <div className="form bg-white flex flex-col justify-center px-3 py-8 text-gray-700 sm:px-10 w-full lg:w-1/2 max-w-xl verify-form">
            <div className="form-title mb-4 text-center">
              <h1 className="text-lg md:text-2xl font-semibold">
                Verify your email address
              </h1>
              <p className="text-base">
                Please confirm that you want to use this email for your account.
              </p>
            </div>
            <button
              className="h-10 bg-green-600 rounded-md w-full text-white my-4 uppercase"
              onClick={() => onVerifyEmail()}
            >
              {loading ? <Spinner /> : "Verify My Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;
