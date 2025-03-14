import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, userLogout } from "../../reducers/authSlice";

function LogoutModal({ type }) {
  const [showModal, setShowModal] = useState(false);
  const { activeModal } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(userLogout());
    sessionStorage.removeItem("isAuth");
  };
  const onCancel = () => {
    dispatch(closeModal());
  };
  useEffect(() => {
    if (activeModal) {
      setShowModal(true);
    } else setShowModal(false);
  }, [activeModal, dispatch]);
  return (
    <div>
      {showModal ? (
        <div className="bg-black bg-opacity-80 w-full h-screen flex items-center justify-center fixed top-0 px-5 z-10">
          <div className="bg-white relative py-16 px-24">
            <i
              onClick={() => onCancel()}
              className="fa-regular fa-times-circle text-lg cursor-pointer absolute top-5 right-5"
            ></i>
            <p className="mb-8">Are you sure you want to logout?</p>
            <div className="flex justify-center">
              <button
                onClick={() => onLogout()}
                className="px-10 py-2 bg-red-600  text-white mx-2 rounded-md cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => onCancel()}
                className="px-10 py-2 bg-green-600  text-white mx-2 rounded-md cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LogoutModal;
