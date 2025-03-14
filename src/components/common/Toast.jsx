import React, { useEffect, useState } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../../reducers/toastSlice";
import { capitalize } from "../../utils/helper"

export default function Toast() {
  const [showToast, setShowToast] = useState(false);
  const { status, title, message } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (message && message !== "" && message !== null) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        dispatch(hideToast());
      }, 7000);
    } else setShowToast(false);
    return () => clearTimeout(4000);
  }, [message, dispatch]);

  return (
    <div>
      {showToast && status ? (
        <div className="fixed top-10 right-2 alert z-50">
          <Alert variant="filled" severity={status} className="toast-wrap lg:w-80">
            <AlertTitle size="small">{title}</AlertTitle>
            {capitalize(message)}
          </Alert>
        </div>
      ) : null}
    </div>
  );
}
