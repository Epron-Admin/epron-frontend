import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userLogout } from "../../../reducers/authSlice";

function ErrorComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const goHome = () => {
    navigate('/')
    dispatch(userLogout())
    sessionStorage.removeItem("isAuth")
  }
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl">Something went wrong in the dashboard.</h1>
      <p>If the issue persists, reach out to the site admin.</p>
      <div>
          <button onClick={() => goHome()} className="home-btn green-btn mt-5">Go Back Home</button>
      </div>
    </div>
  );
}

export default ErrorComponent;
