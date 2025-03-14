import { Formik } from "formik";
import React, { useState } from "react";
import { showToast } from "../../../reducers/toastSlice";
import { useDispatch } from "react-redux";
import GoToTop from "../../common/GoToTop";
import Header from "../../common/Header";
import { useContactMutation } from "../../../services/globalService";
import Spinner from "../../common/Spinner";
import { Link } from "react-router-dom";

function Contact() {
  const dispatch = useDispatch();
  const [submitContactForm] = useContactMutation();
  let [loading, setLoading] = useState(false);
  return (
    <div>
      <GoToTop />
      <Header />
      <div className="contact-hero hero-bg grid grid-cols-1 lg:grid-cols-2 items-center bg-gray-400 p-side">
        <div className="px-3 mb-5">
          <h1 className="text-xl sm:text-2xl lg:text-4xl my-3">
            You can reach out to us here
          </h1>
          <div className="md:text-lg">
            <div className="flex items-center gap-4 mb-5">
              <i className="fa-solid fa-map-pin"></i>
              <p>13b, Ikorodu Road, Maryland, Lagos, Nigeria</p>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <i className="fa-solid fa-envelope"></i>
              <p>info@epron.org.ng</p>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <i className="fa-solid fa-phone"></i>
              <p>+2349061935560</p>
            </div>
            <h1 className="text-xl my-3">Connect With Us</h1>
            <div className="flex items-center gap-4 mb-5">
              <a
                href="https://web.facebook.com/epronnigeria/"
                rel="noreferrer"
                target="_blank"
              >
                <i className="text-2xl fa-brands fa-facebook"></i>
              </a>
              <a
                href="https://twitter.com/EpronNg"
                rel="noreferrer"
                target="_blank"
              >
                <i className="text-2xl fa-brands fa-twitter"></i>
              </a>
              <a
                href="https://www.instagram.com/epronng/?utm_source=ig_embed"
                rel="noreferrer"
                target="_blank"
              >
                <i className="text-2xl fa-brands fa-instagram"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/e-waste-producer-responsibility-organization-of-nigeria/"
                rel="noreferrer"
                target="_blank"
              >
                <i className="text-2xl fa-brands fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="form justify-self-center bg-white flex flex-col justify-center px-3 py-8 text-gray-700 sm:px-10 max-w-xl">
          <div className="form-title mb-4 text-center">
            <h1 className="text-xl sm:text-2xl font-semibold">Contact Us</h1>
            <p className="">
              Fill the form below and we will get back to you as soon as
              possible.
            </p>
          </div>
          <div className=" w-full">
            <Formik
              initialValues={{
                name: "",
                company: "",
                email: "",
                phone: "",
                message: "",
              }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Email is required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address";
                }
              }}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                // handle empty values.email
                if (
                  !values.name ||
                  !values.company ||
                  !values.email ||
                  !values.phone ||
                  !values.message
                ) {
                  return dispatch(
                    showToast({
                      status: "error",
                      title: "Error",
                      message: `Fill all fields and try again`,
                    })
                  );
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  return dispatch(
                    showToast({
                      status: "error",
                      title: "Invalid Email",
                      message: `Enter a valid email`,
                    })
                  );
                } else {
                setLoading(true);
                  submitContactForm(values)
                    .unwrap()
                    .then((res) => {
                      setLoading(false);
                      if (!res.error) {
                        resetForm();
                        return dispatch(
                          showToast({
                            status: "success",
                            title: "Form Submitted",
                            message: `We will get back to you shortly`,
                          })
                        );
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
                  <div>
                    <label htmlFor="email">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      className={`px-3 w-full rounded-md text-sm ${
                        errors.name && touched.name && errors.name
                          ? "border-2 border-red-500"
                          : null
                      }`}
                    />
                    <p className="text-red-500 text-xs error-text">
                      {errors.name && touched.name && errors.name}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="email">Company</label>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.company}
                      className={`px-3 w-full rounded-md text-sm ${
                        errors.company && touched.company && errors.company
                          ? "border-2 border-red-500"
                          : null
                      }`}
                    />
                    <p className="text-red-500 text-xs error-text">
                      {errors.company && touched.company && errors.company}
                    </p>
                  </div>
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
                  <div>
                    <label htmlFor="email">Phone</label>
                    <input
                      type="phone"
                      name="phone"
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
                  <div>
                    <label htmlFor="email">Message</label>
                    <input
                      type="message"
                      name="message"
                      placeholder="Message"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.message}
                      className={`px-3 w-full rounded-md text-sm ${
                        errors.message && touched.message && errors.message
                          ? "border-2 border-red-500"
                          : null
                      }`}
                    />
                    <p className="text-red-500 text-xs error-text">
                      {errors.message && touched.message && errors.message}
                    </p>
                  </div>
                  <button
                    type="submit"
                    //   disabled={isSubmitting}
                    className="h-10 bg-green-600 rounded-md w-full text-white my-4 uppercase"
                  >
                    {loading ? <Spinner /> : "Submit"}
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
