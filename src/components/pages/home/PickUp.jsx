import React, { useState, useEffect } from "react";
import Header from "../../common/Header";
import { Formik } from "formik";
import InputGroup from "../../common/InputGroup";
import SearchSelect from "../../common/SearchSelect";
import Footer from "../../common/Footer";
import { useFetchLgasMutation } from "../../../services/location";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../reducers/toastSlice";
import { useRequestPickupMutation } from "../../../services/pickupService";
import GoToTop from "../../common/GoToTop";
import Spinner from "../../common/Spinner";
import {
  useGetCategoriesMutation,
  useGetTypesMutation,
} from "../../../services/globalService";

function PickUp() {
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  let [showModal, setShowModal] = useState(false);
  const [state, setState] = useState("");
  const [location, setLocation] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [cityError, setCityError] = useState(false);
  const [requestDate, setRequestDate] = useState();
  const [requestTime, setRequestTime] = useState();
  const [requestPickup] = useRequestPickupMutation();
  const categoryData = useSelector((state) => state.global.categories);
  const [allCategories, setAllCategories] = useState("");
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryError, setCategoryError] = useState();
  const [type, setType] = useState("");
  const [typeError, setTypeError] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [typeDisabled, setTypeDisabled] = useState(true);
  const [finalCategory, setFinalCategory] = useState("");
  const [finalType, setFinalType] = useState("");
  const [getCategories] = useGetCategoriesMutation();
  const [getTypes] = useGetTypesMutation();

  const onLocationChange = (selectedOption) => {
    setLocation(selectedOption);
    if (!selectedOption) {
      setCityError(true);
    } else setCityError(false);
  };

  const [fetchLgas] = useFetchLgasMutation();
  const locationData = { country: "NG", state: "Lagos" };

  const getLgas = (data) => {
    let cityArr = [];
    data.map((item, key) =>
      cityArr.push({ value: item, label: item, id: key })
    );
    setLocationOptions(cityArr);
  };

  const onConfirmPickup = () => {
    setLoading(true);
    requestPickup(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setLoading(false);
          setState("");
          setShowModal(false);
          setLocation("");
          setFinalCategory("");
          setFinalType("");
          dispatch(
            showToast({
              status: "success",
              title: "Request successful",
              message: "Your pickup request has been received",
            })
          );
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

  const getCategory = (data) => {
    let arr = [];
    data.map((item) =>
      arr.push({ value: item.name, label: item.name, id: item._id })
    );
    setCategoryOptions(arr);
  };

  const getType = (data) => {
    if (category) {
      let selectedCategory = data.filter(
        (item) => item.name === category.value
      );
      getTypes(selectedCategory[0]._id)
        .unwrap()
        .then((res) => {
          setType(res.types);
          if (!res.error) {
            let arr = [];
            res.types.map((item) =>
              arr.push({
                value: item.name,
                label: item.name,
                id: item._id,
                price: item.price,
              })
            );
            setTypeOptions(arr);
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
  };

  const fetchCategories = () => {
    getCategories()
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setAllCategories(res.categories);
          getCategory(res.categories);
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

  useEffect(() => {}, [formErrors]);

  useEffect(() => {
    fetchCategories();
    fetchLgas(locationData)
      .unwrap()
      .then((res) => {
        getLgas(res.data.lgas);
      });
  }, []);

  useEffect(() => {
    if (!state) getType(allCategories);
  }, [category, allCategories]);

  const onCategoryChange = (selectedOption) => {
    setCategory(selectedOption);
    if (!selectedOption) {
      setCategoryError(true);
      setType("");
      setTypeDisabled(true);
    } else {
      setCategoryError(false);
      setTypeDisabled(false);
      setFinalCategory(selectedOption.value);
      if (type) setType("");
    }
  };

  const onTypeChange = (selectedOption) => {
    setType(selectedOption);
    if (!selectedOption) {
      setTypeError(true);
    } else {
      setTypeError(false);
      setFinalType(selectedOption.value);
    }
  };

  return (
    <div>
      <GoToTop />
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-screen p-side lg:py-20 hero-bg pt-32 lg:pt-40 pb-20">
        <div className="text-white">
          <h1 className="text-xl md:text-3xl lg:text-4xl mb-5 font-semibold">
            Thank you for helping us to build a sustainable environment
          </h1>
          <p>
            Electronic wastes pose a great threat to our environemnt. It can
            pollute the envoironment & in years to come make the environment
            inhabitable for the future generations to come. The decision to
            dispose this waste properly is a decision not just to declutter your
            space but to make the environemnt safer for the future generations
            to come. For your children yet unborn.
          </p>
        </div>
        <div className="">
          <Formik
            initialValues={{
              name: "",
              phoneNumber: "",
              address: "",
              pickup_date: "",
              quantity: "",
            }}
            validate={(values) => {
              const errors = {};
              Object.keys(values).map((value) =>
                !values[value] ? (errors[value] = "This field is required") : ""
              );
              setFormErrors(errors);
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              if (Object.keys(formErrors).length > 0) {
                dispatch(
                  showToast({
                    status: "error",
                    title: "Error",
                    message: "Please fill all fields",
                  })
                );
                return;
              } else if (!location) {
                setCityError(true);
              } else {
                let data = {
                  ...values,
                  state: "Lagos",
                  stateid: location.id,
                  lga: location.value,
                  category_id: category.id,
                  sub_category_id: type.id,
                };
                setData(data);
                setShowModal(true);
                resetForm();
                setLocation("");
                setCategory("");
                setType("");
                setRequestDate(new Date(data.pickup_date).toDateString());
                setRequestTime(new Date(data.pickup_date).toLocaleTimeString());
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
              <form
                onSubmit={handleSubmit}
                className="bg-white px-3 sm:px-5 py-10 rounded-md form-w"
              >
                <h1 className="text-lg md:text-2xl font-semibold mb-5 text-center">
                  Let us know where to pick up from
                </h1>
                <InputGroup
                  values={values}
                  errors={formErrors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  shortName={"name"}
                  name={"Full Name"}
                  required={true}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                  <InputGroup
                    values={values}
                    errors={formErrors}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    shortName={"phoneNumber"}
                    name={"Phone Number"}
                    inputType={"tel"}
                    required={true}
                  />
                  <InputGroup
                    values={values}
                    errors={formErrors}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    shortName={"pickup_date"}
                    name={"Schedule Pick up date & time"}
                    inputType={"datetime-local"}
                    required={true}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                  {/* <SearchSelect
                  value={state}
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
                    value={location}
                    name={"LGA"}
                    selectData={locationOptions}
                    onChange={onLocationChange}
                    isDisabled={false}
                    defaultValue={"Choose one"}
                    hasLabel={"true"}
                    hasError={cityError}
                  />
                </div>
                <InputGroup
                  values={values}
                  errors={formErrors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  shortName={"address"}
                  name={"Address"}
                  required={true}
                />
                {/* <InputGroup
                  values={values}
                  errors={formErrors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  shortName={"description"}
                  name={"Description"}
                  required={true}
                /> */}
                <div className="lg:grid lg:grid-cols-2 md:gap-5">
                  <SearchSelect
                    value={category}
                    name={"Category"}
                    selectData={categoryOptions}
                    onChange={onCategoryChange}
                    isDisabled={false}
                    defaultValue={"Choose one"}
                    hasLabel={"true"}
                    hasError={categoryError}
                  />
                  <SearchSelect
                    value={type}
                    name={"Type"}
                    selectData={typeOptions}
                    onChange={onTypeChange}
                    isDisabled={typeDisabled}
                    defaultValue={"Choose one"}
                    hasLabel={"true"}
                    hasError={typeError}
                  />
                </div>
                {/* Add quantity to the form data once ready */}
                <InputGroup
                  values={values}
                  errors={formErrors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  shortName={"quantity"}
                  name={"Quantity"}
                  required={true}
                />
                <button
                  type="submit"
                  // disabled={isSubmitting}
                  className="h-10 bg-green-600 rounded-md w-full text-white my-4 uppercase"
                >
                  Submit
                </button>
              </form>
            )}
          </Formik>
        </div>
        {showModal && (
          <div className="modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl py-16 px-10 rounded-md relative">
              <i
                className="fas fa-times absolute top-5 right-5 cursor-pointer text-red-500"
                onClick={() => {
                  setShowModal(false);
                }}
              ></i>
              {/* <i className="fas fa-check-double green-text text-5xl text-center block"></i> */}
              <h1 className="text-xl md:text-3xl font-semibold green-text">
                Pickup Summary
              </h1>
              <p className="my-2">Confirm the details of the pickup</p>
              <p className="my-2">
                <span className="font-semibold mr-2">Name:</span> {data.name}
              </p>
              <p className="my-2">
                <span className="font-semibold mr-2">Phone:</span>
                {data.phoneNumber}
              </p>
              <p className="my-2">
                <span className="font-semibold mr-2">Pickup Date:</span>{" "}
                {requestDate}
              </p>
              <p className="my-2">
                <span className="font-semibold mr-2">Pickup Time:</span>{" "}
                {requestTime}
              </p>
              <p className="my-2">
                <span className="font-semibold mr-2">Address:</span>{" "}
                {data.address}
              </p>
              <p className="my-2">
                <span className="font-semibold mr-2">Location:</span> {data.lga}
                , {data.state}
              </p>
              {/* Make updates */}
              <p className="my-2">
                <span className="font-semibold mr-2">Category:</span>{" "}
                {finalCategory}
              </p>
              <p className="my-2">
                <span className="font-semibold mr-2">Type:</span> {finalType}
              </p>
              <p className="my-2">
                <span className="font-semibold mr-2">Quantity:</span>{" "}
                {data.quantity}
              </p>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => onConfirmPickup()}
                  className="h-10 bg-green-600 rounded-md text-white w-24 uppercase"
                >
                  {loading ? <Spinner /> : "Confirm"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="h-10 bg-red-600 rounded-md text-white w-24 uppercase"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default PickUp;
