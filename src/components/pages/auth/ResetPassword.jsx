import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import loginPic from "../../../assets/login.png";
import "./auth.css";
import usePasswordToggle from "../../hooks/PasswordToggle";
import TooltipComp from "../../common/Tooltip";
import { Formik } from "formik";
import { useResetPasswordMutation } from "../../../services/authService";
import { showToast } from "../../../reducers/toastSlice";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onNavigate = (link, reset) => {
    reset();
    navigate(`/${link}`);
  };
  const [passwordInputType, passwordIcon] = usePasswordToggle();
  const [confirmPasswordInputType, confirmPasswordIcon] = usePasswordToggle();
  const [resetPassword] = useResetPasswordMutation();
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
          <div className="form bg-white flex flex-col justify-center px-3 py-8 text-gray-700 sm:px-10 w-full lg:w-1/2 max-w-xl">
            <div className="form-title mb-4 text-center">
              <h1 className="text-2xl font-semibold">Reset Password</h1>
              <p className="text-base">Please enter the new password.</p>
            </div>
            <div className="form-wrap mx-auto w-full">
              <Formik
                initialValues={{
                  password: "",
                  confirmPassword: "",
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.password)
                    errors.password = "Password is required";
                  if (
                    values.password &&
                    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
                      values.password
                    )
                  ) {
                    errors.password =
                      "Password must be up to 8 characters and must contain at least 1 upper case, 1 lower case, 1 special character and 1 number.";
                  }
                  if (values.password !== values.confirmPassword)
                    errors.confirmPassword = "Passwords do not match";
                  return errors;
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    const data = {
                        token,
                        data: values,
                    }
                  resetPassword(data)
                    .unwrap()
                    .then((res) => {
                      if (!res.error) {
                        resetForm();
                        navigate("/signin");
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
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  resetForm,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="password">Password</label>
                      <div className="relative">
                        <input
                          type={passwordInputType}
                          name="password"
                          placeholder={"Enter Password"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          className={`px-3 w-full rounded-md text-sm ${
                            errors.password &&
                            touched.password &&
                            errors.password
                              ? "border-2 border-red-500"
                              : null
                          }`}
                        />
                        {passwordIcon}
                        <div className="absolute top-pos -right-5 hidden sm:block">
                          <TooltipComp title="Password must be up to 8 characters and must contain at least 1 upper case, 1 lower case, 1 special character and 1 number.">
                            <i className="fas fa-exclamation text-small text-white h-4 w-4 rounded-full flex items-center justify-center bg-sec"></i>
                          </TooltipComp>
                        </div>
                      </div>
                      <p
                        className={`text-red-500 text-xs error-text leading-3 ${
                          errors.password && touched.password && errors.password
                            ? "lg:mb-5"
                            : ""
                        }`}
                      >
                        {errors.password && touched.password && errors.password}
                      </p>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={confirmPasswordInputType}
                          name="confirmPassword"
                          placeholder="Confirm password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.confirmPassword}
                          className={`px-3 w-full rounded-md text-sm ${
                            errors.confirmPassword &&
                            touched.confirmPassword &&
                            errors.confirmPassword
                              ? "border-2 border-red-500"
                              : null
                          }`}
                        />
                        {confirmPasswordIcon}
                      </div>
                      <p className="text-red-500 text-xs error-text">
                        {errors.confirmPassword &&
                          touched.confirmPassword &&
                          errors.confirmPassword}
                      </p>
                    </div>
                    <button
                      type="submit"
                      //   disabled={isSubmitting}
                      className="h-10 bg-green-600 rounded-md w-full text-white my-4 uppercase"
                    >
                      Submit
                    </button>
                    <p className="text-center text-sm">
                      Already have an account?{" "}
                      <span
                        onClick={() => onNavigate("signin", resetForm)}
                        className="text-blue-500 cursor-pointer"
                      >
                        Sign In
                      </span>
                    </p>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
