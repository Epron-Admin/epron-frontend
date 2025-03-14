import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user.user)
  return (
    <div>
      <h1 className="font-semibold text-xl mb-5">General Settings</h1>
      <div className="bg-white">
        <div
          onClick={() => navigate("categories")}
          className="flex items-center border-b border-0 p-5 log-item cursor-pointer"
        >
          <i className="fa-solid fa-cogs text-xl w-10"></i>
          <div>
            <h1 className="text-base font-semibold">Categories & Types</h1>
          </div>
        </div>
        {user.epron_admin !== "read" && user.epron_admin !== "writ" && (
          <div
            onClick={() => navigate("admin")}
            className="flex items-center border-b border-0 p-5 log-item cursor-pointer"
          >
            <i className="fa-solid fa-credit-card text-xl w-10"></i>
            <div>
              <h1 className="text-base font-semibold">Admin Settings</h1>
            </div>
          </div>
        )}
        <div
          onClick={() => navigate("assign-centres")}
          className="flex items-center border-b border-0 p-5 log-item cursor-pointer"
        >
          <i className="fa-solid fa-credit-card text-xl w-10"></i>
          <div>
            <h1 className="text-base font-semibold">
              Assign Collection Centres
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
