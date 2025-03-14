import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { showToast } from "../../../../reducers/toastSlice";
import { useUpdatePasswordMutation } from "../../../../services/authService";

function ChangePassword() {
  const dispatch = useDispatch();
  const [updatePassword] = useUpdatePasswordMutation();
  const user = useSelector((state) => state.user.user.user);
  const email = user.email;
  let [oldPassword, setOldPassword] = useState("");
  let [newPassword, setNewPassword] = useState("");
  const submitForm = () => {
    const data = {
      oldPassword,
      newPassword,
      email,
    };
    if (!oldPassword || !newPassword) {
      return dispatch(
        showToast({
          status: "error",
          title: "Error",
          message: "Fill all fields",
        })
      );
    }
    updatePassword(data)
      .unwrap()
      .then((res) => {
        if (!res.error) {
        dispatch(
          showToast({
            status: "success",
            title: "Success",
            message: res.message,
          })
        );
        setOldPassword('')
        setNewPassword('')
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
  };
  return (
    <div>
      <h1 className="font-semibold text-xl mb-5">Change Password</h1>
      <div className="bg-white px-5 py-8">
        <label>Password</label>
        <input
          type="text"
          value={oldPassword}
          onChange={(e) => {
            setOldPassword(e.target.value);
          }}
          placeholder="Enter your password"
          className="w-full mb-5 h-12 px-3"
        />
        <label>New Password</label>
        <input
          type="text"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
          placeholder="Enter new password"
          className="w-full mb-10 h-12 px-3"
        />
        <div className="flex justify-end">
          <button
            onClick={() => {
              submitForm();
            }}
            className="px-10 py-2 bg-green-600 text-white mx-2 rounded-md cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
