import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import usePasswordToggle from "../../hooks/PasswordToggle";
import "./auth.css";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useSendVerifyTokenMutation,
} from "../../../services/authService";
import { showToast } from "../../../reducers/toastSlice";
import Spinner from "../../common/Spinner";
import { capitalizeEachWord, capitalize } from "../../../utils/helper";
import loginPic from "../../../assets/login.png";
import signupPic from "../../../assets/signup.png";
import { setUserData } from "../../../reducers/userSlice";
import { userLogin } from "../../../reducers/authSlice";
import SearchSelect from "../../common/SearchSelect";
import { useFetchLgasMutation } from "../../../services/location";

function Auth({ type }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("");
  const [passwordInputType, passwordIcon] = usePasswordToggle();
  const [confirmPasswordInputType, confirmPasswordIcon] = usePasswordToggle();
  const [loading, setLoading] = useState(false);
  const [lstate, setState] = useState("Lagos");
  // const [stateOptions, setStateOptions] = useState([]);
  const [city, setCity] = useState("");
  // const [showCity, setShowCity] = useState(true);
  const [cityOptions, setCityOptions] = useState([]);
  const [cityError, setCityError] = useState(false);
  const [registerUser] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();
  const [sendVerifyToken] = useSendVerifyTokenMutation();
  const [fetchLgas] = useFetchLgasMutation();
  const locationData = { country: "NG", state: "Lagos" };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const onNavigate = (link, reset) => {
    reset();
    navigate(`/${link}`);
  };

  const getLgas = (data) => {
    fetchLgas(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setLgas(res.data.lgas);
        } 
      })
  }
  
  useEffect(() => {
    if (type === "signup" && state) {
      let { userType } = state;
      userType = userType === 'manufacturer' ? 'producer' : userType
      setUser(userType);
      setUserType(capitalize(userType));
    } else if (type === "signup" && !state) navigate("/user");
  }, [user, type, navigate, state]);

  useEffect(() => {
    getLgas(locationData)
  }, []);

  const setLgas = (data) => {
    let cityArr = [];
    data.map((item, key) =>
      cityArr.push({ value: item, label: item, id: key })
    );
    setCityOptions(cityArr);
  };

  // const onStateChange = (selectedOption) => {
  //   setState(selectedOption);
  //   setShowCity(false);
  // };

  const onCityChange = (selectedOption) => {
    setCity(selectedOption);
    if (!selectedOption) {
      setCityError(true);
    } else setCityError(false);
  };

  const sendToken = (email) => {
    let data = { email };
    sendVerifyToken(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          navigate("/verify-email");
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
        if (err.data) {
          errMsg = err.data.message;
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
              src={type === "signin" ? loginPic : signupPic}
              alt=""
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <div className="form bg-white flex flex-col justify-center px-3 py-8 text-gray-700 sm:px-5 w-full lg:w-1/2 max-w-xl">
            {type === "signin" ? (
              <div className="form-title mb-4 text-center">
                <h1 className="text-xl md:text-2xl font-semibold">Welcome!</h1>
                <p className="text-sm md:text-base">Great to have you back.</p>
              </div>
            ) : (
              <div className="form-title mb-4 text-center">
                <h1 className="text-xl md:text-2xl font-semibold">
                  Create your account today
                </h1>
                <p className="text-base">
                  Sign up as a {userType}
                  <Link to="/user" className="text-blue-500 ml-2">
                    Change
                  </Link>
                </p>
              </div>
            )}
            <div className="form-wrap mx-auto w-full">
              <Formik
                initialValues={
                  type === "signup"
                    ? {
                        fullName: "",
                        email: "",
                        phone: "",
                        password: "",
                        confirmPassword: "",
                        address: "",
                        terms: false,
                      }
                    : {
                        email: "",
                        password: "",
                      }
                }
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
                  if (!values.password)
                    errors.password = "Password is required";
                  if (
                    type === "signup" &&
                    values.password &&
                    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
                      values.password
                    )
                  ) {
                    errors.password =
                      "Password must be up to 8 characters and must contain at least 1 upper case, 1 lower case, 1 special character and 1 number.";
                  }
                  if (type === "signup" && !values.phone)
                    errors.phone = "Phone is required";
                  if (type === "signup" && !values.confirmPassword)
                    errors.confirmPassword = "Password is required";
                  if (
                    type === "signup" &&
                    !values.address &&
                    user !== "producer"
                  )
                    errors.address = "Address is required";
                  if (type === "signup" && !values.terms)
                    errors.terms = "Read and accept the terms";
                  if (type === "signup" && !values.fullName)
                    errors.fullName = "Name is required";
                  if (
                    type === "signup" &&
                    values.password !== values.confirmPassword
                  )
                    errors.confirmPassword = "Passwords do not match";
                  return errors;
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setLoading(true);
                  let data;
                  if (type === "signup") {
                    if (!city && user !== "producer") {
                      setCityError(true);
                      setLoading(false);
                      dispatch(
                        showToast({
                          status: "error",
                          title: "Error",
                          message: "City is required",
                        })
                      );
                    } else {
                      data = {
                        name: capitalizeEachWord(values.fullName),
                        email: values.email.toLowerCase(),
                        phoneNumber: values.phone,
                        password: values.password,
                        role: user === "producer" ? "manufacturer" : user,
                        state: lstate ? lstate : null,
                        stateid: city ? city.id : null,
                        lga: city ? city.value : null,
                        cityid: "",
                        address: values.address ? values.address : null,
                      };
                      registerUser(data)
                        .unwrap()
                        .then((res) => {
                          if (!res.error) {
                            setLoading(false);
                            dispatch(
                              showToast({
                                status: "success",
                                title: "Success",
                                message: `${res.message}`,
                              })
                            );
                            resetForm();
                            navigate("/verify-email");
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
                          setLoading(false);
                          let errMsg;
                          if (err.data) {
                            errMsg = err.data.message;
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
                    }
                  } else if (type === "signin") {
                    data = {
                      email: values.email.toLowerCase(),
                      password: values.password,
                    };
                    loginUser(data)
                      .unwrap()
                      .then((res) => {
                        setLoading(false);
                        if (!res.error) {
                          dispatch(
                            setUserData({
                              user: res.user,
                            })
                          );
                          sessionStorage.setItem("isAuth", true);
                          dispatch(
                            showToast({
                              status: "success",
                              title: "Success",
                              message: `${res.message}`,
                            })
                          );
                          dispatch(userLogin());
                          resetForm();
                          navigate(
                            res.user.role === "epron" ? "/admin" : "/dashboard"
                          );
                        } else {
                          dispatch(
                            showToast({
                              status: "error",
                              title: "Error",
                              message: `${res.message}`,
                            })
                          );
                          if (res.message === "you are not verified") {
                            sendToken(data.email);
                          }
                        }
                      })
                      .catch((err) => {
                        setLoading(false);
                        let errMsg;
                        if (err.data) {
                          errMsg = err.data.message;
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
                    {type === "signup" ? (
                      <div>
                        <label htmlFor="fullName">Name</label>
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full Name or Company name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.fullName}
                          className={`px-3 w-full rounded-md text-sm ${
                            errors.fullName &&
                            touched.fullName &&
                            errors.fullName
                              ? "border-2 border-red-500"
                              : null
                          }`}
                        />
                        <p className="text-red-500 text-xs error-text">
                          {errors.fullName &&
                            touched.fullName &&
                            errors.fullName}
                        </p>
                      </div>
                    ) : null}
                    <div
                      className={`${
                        type === "signup"
                          ? "md:grid md:grid-cols-2 md:gap-3"
                          : null
                      }`}
                    >
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
                      {type === "signup" ? (
                        <div>
                          <label htmlFor="phone">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            pattern="^[+0-9]{3,45}$"
                            title="You can only enter numbers, with a minimal of 3 characters 
      upto 45 characters are accepted."
                            placeholder="Phone"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.phone}
                            className={`px-3 w-full rounded-md text-sm ${
                              errors.phone && touched.phone && errors.phone
                                ? "border-2 border-red-500"
                                : null
                            }`}
                          />
                          <p className="text-red-500 text-xs error-text">
                            {errors.phone && touched.phone && errors.phone}
                          </p>
                        </div>
                      ) : null}
                    </div>
                    {type === "signup" &&
                    (userType === "Recycler" || userType === "Collector") ? (
                      <div className="md:grid md:grid-cols-2 md:gap-3">
                        {/* <SearchSelect
                          value={lstate}
                          name={"State"}
                          selectData={stateOptions}
                          onChange={onStateChange}
                          isDisabled={false}
                          defaultValue={"Lag"}
                          hasLabel={"true"}
                        /> */}
                        <div>
                          <label className="filter-label text-xs">State</label>
                          <input
                            value="Lagos"
                            className="px-3 w-full h-10 text-sm rounded-md"
                            disabled
                          />
                        </div>
                        <SearchSelect
                          value={city}
                          name={"LGA"}
                          selectData={cityOptions}
                          onChange={onCityChange}
                          isDisabled={false}
                          defaultValue={"Choose one"}
                          hasLabel={"true"}
                          hasError={cityError}
                        />
                      </div>
                    ) : null}
                    {type === "signup" &&
                    (userType === "Recycler" || userType === "Collector") ? (
                      <div>
                        <label htmlFor="fullName">Address</label>
                        <input
                          type="text"
                          name="address"
                          placeholder="Address"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.address}
                          className={`px-3 w-full rounded-md text-sm ${
                            errors.address && touched.address && errors.address
                              ? "border-2 border-red-500"
                              : null
                          }`}
                        />
                        <p className="text-red-500 text-xs error-text">
                          {errors.address && touched.address && errors.address}
                        </p>
                      </div>
                    ) : null}
                    <div>
                      <div>
                        <label htmlFor="password">Password</label>
                        <div className="relative">
                          <input
                            type={passwordInputType}
                            name="password"
                            placeholder={
                              type === "signup"
                                ? "Choose a password"
                                : "Enter Password"
                            }
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
                        </div>
                        <p
                          className={`text-red-500 text-xs error-text leading-3 ${
                            type === "signup" &&
                            errors.password &&
                            touched.password &&
                            errors.password
                              ? "lg:mb-5"
                              : ""
                          }`}
                        >
                          {errors.password &&
                            touched.password &&
                            errors.password}
                        </p>
                      </div>
                      {type === "signup" ? (
                        <div>
                          <label htmlFor="confirmPassword">
                            Confirm Password
                          </label>
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
                      ) : null}
                    </div>
                    {type === "signin" ? (
                      <p
                        className="text-xs text-right text-green-600 cursor-pointer"
                        onClick={() => {
                          navigate("/forgot-password");
                        }}
                      >
                        Forgot Password?
                      </p>
                    ) : null}
                    {type === "signup" ? (
                      <div>
                        <div className="flex items-center text-sm">
                          <div>
                            <input
                              type="checkbox"
                              name="terms"
                              id="terms"
                              className="cursor-pointer mr-2"
                              checked={values.terms}
                              onChange={handleChange}
                            />
                          </div>
                          <p>
                            I have read and accept the{" "}
                            <span className="text-blue-500 cursor-pointer">
                              Terms Of Use
                            </span>{" "}
                            and{" "}
                            <span className="text-blue-500 cursor-pointer">
                              Privacy Policy Agreement
                            </span>
                          </p>
                        </div>
                        <p className="text-red-500 text-xs error-text">
                          {errors.terms && touched.terms && errors.terms}
                        </p>
                      </div>
                    ) : null}
                    <button
                      type="submit"
                      className="h-10 bg-green-600 rounded-md w-full text-white my-4 uppercase"
                    >
                      {loading ? (
                        <Spinner />
                      ) : type === "signup" ? (
                        "Submit"
                      ) : (
                        "Continue"
                      )}
                    </button>
                    {type === "signup" ? (
                      <p className="text-center text-sm">
                        Already have an account?{" "}
                        <span
                          onClick={() => onNavigate("signin", resetForm)}
                          className="text-blue-500 cursor-pointer"
                        >
                          Sign In
                        </span>
                      </p>
                    ) : (
                      <p className="text-center text-sm">
                        Don't have an account?{" "}
                        <span
                          onClick={() => onNavigate("user", resetForm)}
                          className="text-blue-500 cursor-pointer"
                        >
                          Signup
                        </span>
                      </p>
                    )}
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

export default Auth;
