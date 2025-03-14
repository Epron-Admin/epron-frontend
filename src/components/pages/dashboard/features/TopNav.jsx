import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { showSideNav } from "../../../../reducers/dashboardSlice";

function TopNav({ name, email, role }) {
  const { sideNavStatus } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const userRole = role === "manufacturer" ? "producer" : role;
  useEffect(() => {
    if (document.body.clientWidth >= 1280 && sideNavStatus) {
      console.log("Rendered", sideNavStatus);
      dispatch(
        showSideNav({
          status: false,
        })
      );
    }
  }, [document.body.clientWidth]);
  const showNav = () => {
    dispatch(
      showSideNav({
        status: !sideNavStatus,
      })
    );
  };
  return (
    <div className="fixed top-0 w-full border-b-2 h-20 z-50 md:h-24 bg-white flex justify-between items-center">
      <div className="logo-wrap flex items-center justify-center">
        <div className="xl:hidden">
          <i
            className={`fa-solid ${
              sideNavStatus ? "fa-times" : "fa-bars"
            } text-2xl`}
            onClick={() => showNav()}
          ></i>
        </div>
        <Link to="/">
          <div className="logo w-24 lg:w-36 cursor-pointer">
            <img src={logo} alt="" />
          </div>
        </Link>
      </div>
      <div className="top-nav-icons flex items-center justify-between">
        {/* <div className=''>
                <i className="fa-regular fa-bell mr-8 md:mr-0 text-main text-2xl"></i>
            </div> */}
        <div className="hidden md:flex h-20 md:h-24 flex-col justify-center items-center text-center border-r-2 border-l-2 px-10">
          <p className="name text-main">{name}</p>
          <p className="email text-sm">{userRole.toUpperCase()}</p>
        </div>
        {/* <div className="flex items-center justify-center">
          <i className="fas fa-user-circle text-main text-3xl mr-3"></i>
          <i className="fas fa-caret-down"></i>
        </div> */}
      </div>
    </div>
  );
}

export default TopNav;
