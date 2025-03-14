import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import { useDispatch } from "react-redux";
import { showToast } from "../../../reducers/toastSlice";
import signupPic from "../../../assets/signup.png";

function UserType() {
  const [userCategory, setUserCategory] = useState("nil");
  const dispatch = useDispatch()
  const handleOnChange = (event) => {
    setUserCategory(event.target.value);
  };
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (userCategory !== "nil") {
      //store the choice in the store
      navigate("/signup", {state: {userType: userCategory}});
    } else {
      dispatch(
        showToast({
          status: "error",
          title: "Error",
          message: 'Choose a category',
        })
      );
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
              src={signupPic}
              alt=""
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        <main className=" pt-16 lg:pt-20 bg-white text-gray-700 text-center w-full lg:w-1/2 max-w-xl pad-y flex items-center justify-center flex-col">
          <h1 className="text-xl font-semibold md:text-2xl">
            Welcome, Glad To Have You Here!
          </h1>
          <p className="mt-3">
            Select your user category from the options below to get started.
          </p>
          <div className="mt-5 flex items-center justify-center flex-col w-full">
            <div className="mt-5 relative max-w-md w-full">
              <select
                name="category"
                value={userCategory}
                onChange={handleOnChange}
                id="category"
                className="h-12 border rounded-md px-3 w-full text-black block appearance-none"
              >
                <option value="nil" disabled>Select one</option>
                <option value="manufacturer">Producer</option>
                <option value="recycler">Recycler</option>
                <option value="collector">Collection Center</option>
              </select>
              <i className="fas fa-caret-down text-black absolute top-pos right-5 pointer-events-none"></i>
            </div>
            <button
              onClick={handleSubmit}
              className="h-12 rounded-md w-full block max-w-md uppercase bg-green-700 text-white mt-5"
            >
              CONTINUE
            </button>
          </div>
        </main>
        </div>
      </div>
    </div>
  );
}

export default UserType;
