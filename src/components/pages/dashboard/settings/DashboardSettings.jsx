import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardSettings() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="font-semibold text-xl mb-5">General Settings</h1>
      <div className="bg-white">
        <div
          onClick={() => navigate("profile")}
          className="flex items-center border-b border-0 p-5 log-item cursor-pointer"
        >
          <i className="fa-solid fa-user text-xl w-10"></i>
          <div>
            <h1 className="text-base font-semibold">Profile</h1>
          </div>
        </div>
        <div
          onClick={() => navigate("change-password")}
          className="flex items-center border-b border-0 p-5 log-item cursor-pointer"
        >
          <i className="fa-solid fa-lock text-xl w-10"></i>
          <div>
            <h1 className="text-base font-semibold">Change Password</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSettings;
