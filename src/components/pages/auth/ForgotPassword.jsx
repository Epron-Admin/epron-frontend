import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import loginPic from "../../../assets/login.png";
import "./auth.css";
import { Formik } from "formik";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../../services/authService";
import { showToast } from "../../../reducers/toastSlice";

function ForgotPassword() {
  const navigate = useNavigate();
  const onNavigate = (link, reset) => {
    reset();
    navigate(`/${link}`);
  };
  const dispatch = useDispatch();
  const [forgotPassword] = useForgotPasswordMutation();
  const [submitEmail, setSubmitEmail] = useState(false);
  const [resetPassword] = useResetPasswordMutation();
  const closeForgotPassword = () => {
    setSubmitEmail(false);
    navigate("/");
  };
  const onForgotPassword = (email) => {
    const data = { email };
    // handle empty email
    if (!email) {
      dispatch(
        showToast({
          status: "error",
          title: "Error",
          message: `Enter your email and try again`,
        })
      );
    } else {
      forgotPassword(data)
        .unwrap()
        .then((res) => {
          if (!res.error) {
          console.log(res)
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
      navigate("/forgot-password");
    }
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
            {submitEmail ? (
              <div className="flex flex-col items-center justify-center">
                <p className="text-center">
                  An email with the password reset link has been sent to you.
                  Check your mail to reset your password.
                </p>
                <button
                  onClick={() => {
                    closeForgotPassword();
                  }}
                  type="button"
                  //   disabled={isSubmitting}
                  className="h-10 bg-green-600 rounded-md px-4 mx-auto text-white my-4 uppercase"
                >
                  Back to home
                </button>
              </div>
            ) : (
              <div>
                <div className="form-title mb-4 text-center">
                  <h1 className="text-2xl font-semibold">Forgot Password</h1>
                  <p className="text-base">
                    Please enter your email address to continue.
                  </p>
                </div>
                <div className="form-wrap mx-auto w-full">
                  <Formik
                    initialValues={{
                      email: "",
                    }}
                    validate={(values) => {
                      const errors = {};
                      if (!values.email) {
                        errors.email = "Email is required";
                      } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                          values.email
                        )
                      ) {
                        errors.email = "Invalid email address";
                      }
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      // handle empty values.email
                      if (!values.email) {
                        dispatch(
                          showToast({
                            status: "error",
                            title: "Error",
                            message: `Enter your email and try again`,
                          })
                        );
                      } else {
                        forgotPassword(values)
                          .unwrap()
                          .then((res) => {
                            setSubmitEmail(true)
                          })
                          .catch((err) => {
                            dispatch(
                              showToast({
                                status: "error",
                                title: "Error",
                                message: `An error occured`,
                              })
                            );
                          });
                      }
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
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            className={`px-3 w-full rounded-md text-sm ${
                              errors.email && touched.email && errors.email
                                ? "border-2 border-red-500"
                                : null
                            }`}
                          />
                          <p className="text-red-500 text-xs error-text">
                            {errors.email && touched.email && errors.email}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
