import React from "react";
import { useSelector } from "react-redux";

function Profile() {
  const user = useSelector((state) => state.user.user.user);
  return (
    <div>
      <div className="text-sm">
        <div className="flex justify-between mb-5">
          <div className="flex items-center">
            <h1 className="font-semibold text-xl">Profile</h1>
          </div>
          <div className="flex">
            {/* <button
              // onClick={() => {disableUser()}}
              className={`bg-green-500 text-white px-5 h-10 rounded-md ml-5 shadow-md block`}
            >
              Edit Profile
            </button> */}
          </div>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 md:gap-5 shadow bg-white p-5">
          <div className="md:border-r">
            <p className="py-3">
              <span className="font-semibold">Name: </span> {user.name}
            </p>
            <p className="py-3">
              <span className="font-semibold">Email: </span> {user.email}
            </p>
            <p className="py-3">
              <span className="font-semibold">Phone: </span>{" "}
              {user.phoneNumber}
            </p>
            <p className="py-3">
              <span className="font-semibold">Verification status: </span>{" "}
              {user.verified ? "Verified" : "Unverified"}
            </p>
            <p className="py-3">
              <span className="font-semibold">Status: </span>
              {user.blocked ? "Blocked" : "Active"}
            </p>
          </div>
          {(user.role === "collector" || user.role === "recycler") && (
            <div>
              <p className="py-3">
                <span className="font-semibold">State: </span> {user.state}
              </p>
              <p className="py-3">
                <span className="font-semibold">City: </span> {user.city}
              </p>
              <p className="py-3">
                <span className="font-semibold">Address: </span>{" "}
                {user.address}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;
