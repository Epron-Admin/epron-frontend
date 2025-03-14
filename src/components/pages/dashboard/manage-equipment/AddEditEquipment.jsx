import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../../../../reducers/toastSlice";
import {
  useGetCategoriesMutation,
  useGetTypesMutation,
} from "../../../../services/globalService";
import InputGroup from "../../../common/InputGroup";
import SearchSelect from "../../../common/SearchSelect";
import { useSelector } from "react-redux";
import {
  useLogSingleEquipmentMutation,
  useUpdateSingleEquipmentMutation,
} from "../../../../services/logService";
import { useNavigate, useLocation } from "react-router-dom";
import { capitalize, formatNumber, generatePaymentObj } from "../../../../utils/helper";
import Spinner from "../../../common/Spinner";
import PageSpinner from "../../../common/PageSpinner";
import {
  useLogSingleEwasteMutation,
  useUpdateSingleEwasteMutation,
} from "../../../../services/ewasteService";
import { useUpdateTransactionMutation } from "../../../../services/paymentService";
import { PaystackButton } from 'react-paystack'
import PaymentButton from "../features/PaymentButton";

function AddEditEquipment({ page }) {
  let [showModal, setShowModal] = useState(false);
  let [pageLoading, setPageLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [resData, setResData] = useState([]);
  const categoryData = useSelector((state) => state.global.categories);
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryError, setCategoryError] = useState();
  const [type, setType] = useState("");
  const [typeError, setTypeError] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [typeDisabled, setTypeDisabled] = useState(true);
  const [getCategories] = useGetCategoriesMutation();
  const [getTypes] = useGetTypesMutation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user.user);
  const [loading, setLoading] = useState();
  const [logSingleEquipment] = useLogSingleEquipmentMutation();
  const [logSingleEwaste] = useLogSingleEwasteMutation();
  const [updateSingleEquipment] = useUpdateSingleEquipmentMutation();
  const [updateSingleEwaste] = useUpdateSingleEwasteMutation();
  const { state } = useLocation();
  const [equipmentPin, setEquipmentPin] = useState("")
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();
  const [updateTransaction] = useUpdateTransactionMutation();

  const updateEquipment = (data) => {
    updateSingleEquipment(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setLoading(false);
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Equipment was updated successfully",
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
        setLoading(false);
        let errMsg;
        if (err.data) {
          errMsg = err.data;
        } else if (err.status === 'FETCH_ERROR') errMsg = "Check your network and try again";
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

  const updateEwaste = (data) => {
    updateSingleEwaste(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setLoading(false);
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Ewaste was updated successfully",
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
        setLoading(false);
        let errMsg;
        if (err.data) {
          errMsg = err.data;
        } else if (err.status === 'FETCH_ERROR') errMsg = "Check your network and try again";
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

  const logEquipment = (data, setSubmitting, resetForm) => {
    logSingleEquipment(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setPrice(res.log.total);
          setEquipmentPin(res.log.equipment_pin)
          setLoading(false);
          setShowModal(true);
          setSubmitting(false);
          resetForm();
          setCategory("");
          setType("");
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
        setLoading(false);
        let errMsg;
        if (err.data) {
          errMsg = err.data;
        } else if (err.status === 'FETCH_ERROR') errMsg = "Check your network and try again";
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

  const logEwaste = (data, setSubmitting, resetForm) => {
    logSingleEwaste(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setLoading(false);
          setSubmitting(false);
          resetForm();
          setCategory("");
          setType("");
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
        setLoading(false);
        let errMsg;
        if (err.data) {
          errMsg = err.data;
        } else if (err.status === 'FETCH_ERROR') errMsg = "Check your network and try again";
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
      setPageLoading(true);
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
            setPageLoading(false);
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
    }
    else {
      // dispatch(
      //   showToast({
      //     status: "error",
      //     title: "Error",
      //     message: "Pick a category and try again",
      //   })
      // );
    }
  };

  useEffect(() => {
    if (!state) getType(resData);
  }, [category, resData]);

  useEffect(() => {
    if (!state && page === "edit") return navigate("/dashboard");
    if (categoryData.length > 0) {
      setResData(categoryData)
      return getCategory(categoryData);
    }
    setPageLoading(true);
    getCategories()
      .unwrap()
      .then((res) => {
        setPageLoading(false);
        if (!res.error) {
          setResData(res.categories);
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
  }, []);

  useEffect(() => {
    setPageLoading(true);
    if (state && resData.length !== 0) {
      let currEdit = resData.filter(
        (item) => state.record.category_id.name === item.name
      );
      setCategory({
        value: currEdit[0].name,
        label: currEdit[0].name,
        id: currEdit[0]._id,
      });
      setTypeDisabled(false);
      getTypes(currEdit[0]._id)
        .unwrap()
        .then((res) => {
          if (!res.error) {
            let currType = res.types.filter(
              (item) => item.name === state.record.sub_category_id.name
            );
            setType({
              value: currType[0].name,
              label: currType[0].name,
              id: currType[0]._id,
              price: currType[0].price,
            });
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
          // redirect user back to home
        });
      setQuantity(state.record.quantity);
      setWeight(state.record.unit_weight);
      setEquipmentPin(state.record.equipment_pin)
      setWeightUnit(state.record.unit)
      setPageLoading(false);
    }
    setPageLoading(false);
  }, [resData]);

  const getWeight = (weight, weightUnit) => {
    if (weightUnit === "g") return weight * 0.0000011023;
    if (weightUnit === "kg") return weight * 0.0011023;
    if (weightUnit === "ton") return weight;
  };

  const onCategoryChange = (selectedOption) => {
    setCategory(selectedOption);
    if (!selectedOption) {
      setCategoryError(true);
      setType("");
      setTypeDisabled(true);
    } else {
      setCategoryError(false);
      setTypeDisabled(false);
      if (type) setType("");
    }
  };

  const onTypeChange = (selectedOption) => {
    setType(selectedOption);
    if (!selectedOption) {
      setTypeError(true);
    } else setTypeError(false);
  };

  useEffect(() => {}, [formErrors]);

  const updatePayment = (reference) => {
    let data = {
      pin: equipmentPin,
      reference,
    }
    setLoading(true);
    updateTransaction(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setLoading(false);
          setShowModal(false);
          // show confirmation modal
          dispatch(
            showToast({
              status: "success",
              title: "Success",
              message: "Payment completed successfully",
            })
          );
          navigate("/dashboard")
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
        setLoading(false);
        let errMsg;
        if (err.data) {
          errMsg = err.data;
        } else if (err.status === 'FETCH_ERROR') errMsg = "Check your network and try again";
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

  const paystackKey = process.env.REACT_APP_PAYSTACK_KEY

  const componentProps = {
    email: user.email,
    amount: +(price) * 100,
    publicKey: paystackKey,
    text: "Yes",
    onSuccess: (data) => {
      updatePayment(data.reference)
      navigate("/dashboard")
    },
    onClose: () => {
      dispatch(
        showToast({
          status: "error",
          title: "Error",
          message: "Payment canceled",
        })
      );
    },
  }

  const onMakePayment = (type) => {
    if (type === "yes") {
      dispatch(
        showToast({
          status: "success",
          title: "Success",
          message: "Payment module not set up",
        })
      );
      setShowModal(false);
      navigate("/dashboard");
    } else {
      setShowModal(false);
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h1 className="font-semibold text-xl mb-5 md:mb-10">
        {capitalize(page)}{" "}
        {(user.role === "manufacturer" || user.role === "producer") ? "Equipment" : "E-waste"}
      </h1>
      <div className="add-edit bg-white py-5 px-3 md:py-14 md:px-10 mx-auto">
        <Formik
          initialValues={{
            quantity: "",
            weight: "",
          }}
          validate={(values) => {
            const errors = {};
            Object.keys(values).map((value) =>
              !values[value] ? (errors[value] = "This field is required") : ""
            );
            setFormErrors(errors);
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            if (page === "edit" && (user.role === "manufacturer" || user.role === "producer") && getWeight(weight, weightUnit) < 1) {
              dispatch(
                showToast({
                  status: "error",
                  title: "Error",
                  message: "Logged weight can not be less than one ton",
                })
              );
              return;
            }
            if (page === "edit" && state) {
              let data = {
                data: {
                  category_id: category.id,
                  sub_category_id: type.id,
                  // price: type.price,
                  quantity: quantity,
                  weight: weight,
                  unit: weightUnit,
                  user_id: user._id,
                },
                id: state.record._id,
              };
              setLoading(true);
              (user.role === "manufacturer" || user.role === "producer")
                ? updateEquipment(data)
                : updateEwaste(data);
              return;
            } else if (Object.keys(formErrors).length > 0) {
              if (!category) setCategoryError(true);
              if (!type) setTypeError(true);
              dispatch(
                showToast({
                  status: "error",
                  title: "Error",
                  message: "Please fill all fields",
                })
              );
              return;
            } else if ((user.role === "manufacturer" || user.role === "producer") && getWeight(values.weight, weightUnit) < 1) {
              dispatch(
                showToast({
                  status: "error",
                  title: "Error",
                  message: "Logged weight can not be less than one ton",
                })
              );
              return;
            } else {
              let data = {
                category_id: category.id,
                category_name: category.value,
                sub_category_id: type.id,
                sub_category_name: type.value,
                // price: type.price,
                quantity: values.quantity,
                weight: values.weight,
                unit: weightUnit,
                user_id: user._id,
              };
              setLoading(true);
              (user.role === "manufacturer" || user.role === "producer")
                ? logEquipment(data, setSubmitting, resetForm)
                : logEwaste(data, setSubmitting, resetForm);
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
              {/*  */}
              <div className="lg:grid lg:grid-cols-2 lg:gap-8">
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
                {/* <InputGroup
                values={values}
                errors={formErrors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                shortName={"type"}
                name={"Equipment Type"}
                required={true}
              /> */}
              </div>
              {state ? (
                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                  <div>
                    <label htmlFor="">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="px-3 w-full h-10 text-sm rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="">Total Weight</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => {
                          setWeight(e.target.value);
                        }}
                        className="px-3 w-full h-10 text-sm rounded-md"
                      />
                      <select
                        name="unit"
                        id="unit"
                        value={weightUnit}
                        onChange={(e) => setWeightUnit(e.target.value)}
                        className="px-3 weight-select h-10 text-sm rounded-md border"
                      >
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        {/* <option value="ton">ton</option> */}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
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
                  <div className="flex">
                    <InputGroup
                      values={values}
                      errors={formErrors}
                      touched={touched}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      shortName={"weight"}
                      name={"Total Weight"}
                      required={true}
                    />
                    <select
                      name="unit"
                      id="unit"
                      value={weightUnit}
                      onChange={(e) => setWeightUnit(e.target.value)}
                      className="px-3 unit-select h-10 text-sm rounded-md border"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      {/* <option value="ton">ton</option> */}
                    </select>
                  </div>
                </div>
              )}
              <button
                type="submit"
                //   disabled={isSubmitting}
                className="uppercase bg-main px-5 h-10 block rounded-md ml-auto mt-5 text-white"
              >
                {loading ? <Spinner /> : "Submit"}
              </button>
            </form>
          )}
        </Formik>
      </div>
      {showModal && (
        <div className="modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg mx-5 lg:max-w-2xl py-16 px-10 rounded-md relative">
            {/* <i
              className="fas fa-times absolute top-5 right-5 cursor-pointer text-red-500"
              onClick={() => {
                setShowModal(false);
              }}
            ></i> */}
            {/* <i className="fas fa-check-double green-text text-5xl text-center block"></i> */}
            <h1 className="text-lg font-semibold green-text text-center">
              Equipment was logged successfully
            </h1>
            <p className="text-lg text-center mt-5">
              The total amount to pay is ₦{formatNumber(price)}
            </p>
            <p className="font-semibold green-text mt-3 text-center">
              Do you wish to make payment now?
            </p>
            <div className="flex justify-center mt-5">
              {/* <button
                onClick={() => onMakePayment("yes")}
                className="px-10 py-2 bg-green-600  text-white mx-2 rounded-md cursor-pointer"
              >
                Yes
              </button> */}
              <PaymentButton data={generatePaymentObj({total: price, equipment_pin: equipmentPin}, user)} />
              <button
                onClick={() => onMakePayment("no")}
                className="px-10 py-2 bg-red-600 text-white mx-2 rounded-md cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {pageLoading ? <PageSpinner /> : null}
    </div>
  );
}

export default AddEditEquipment;
