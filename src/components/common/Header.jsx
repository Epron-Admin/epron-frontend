import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

function Header() {
  const [showNav, setShowNav] = useState(false);
  const onOpenNav = () => setShowNav(!showNav);
  let [headerStyles, setHeaderStyles] = useState(false);
  window.onscroll = function () {
    if (
      document.body.clientWidth >= 1280 &&
      (document.body.scrollTop >= 20 ||
        document.documentElement.scrollTop >= 20)
    ) {
      if (!headerStyles) {
        return setHeaderStyles(true);
      }
    } else {
      return setHeaderStyles(false);
    }
  };
  const navigate = useNavigate();
  const isAuth = sessionStorage.getItem("isAuth");
  return (
    <div>
      <header
        className={`z-20 fixed top-0 w-full flex items-center justify-between h-16 lg:h-20 pad-y ${
          headerStyles ? "xl:bg-white border shadow" : "main-header"
        }`}
      >
        <div
          onClick={() => navigate("/")}
          className="logo w-28 lg:w-36 cursor-pointer"
        >
          <img src={logo} alt="" />
        </div>
        <nav
          className={`hidden xl:flex items-center justify-between text-white ${
            headerStyles ? "xl:text-gray-600" : ""
          }`}
        >
          <NavLink
            to="/pick-up"
            className={({
              isActive,
            }) => (isActive ? `nav-link active ${headerStyles ? "activeHeader" : ""}` : "nav-link")}
          >
            <div className="nav-icon">
              <i className="fa-solid fa-handshake mr-2 text-sm"></i>
            </div>
            <p>Request E-waste pickup</p>
          </NavLink>
          <NavLink
            to="/drop-off"
            className={({
              isActive,
            }) => (isActive ? `nav-link active ${headerStyles ? "activeHeader" : ""}` : "nav-link")}
          >
            <div className="nav-icon">
              <i className="fa-solid fa-home mr-2 text-sm"></i>
            </div>
            <p>Drop Off E-waste</p>
          </NavLink>
          <NavLink
          to="/contact"
            className={({
              isActive,
            }) => (isActive ? `nav-link active ${headerStyles ? "activeHeader" : ""}` : "nav-link")}
          >
            <div className="nav-icon">
              <i className="fa-solid fa-phone mr-2 text-sm"></i>
            </div>
            <p>Contact Us</p>
          </NavLink>
          {!isAuth ? (
            <Link to="/signin">
              <button className="mx-5 home-btn green-btn">Sign In</button>
            </Link>
          ) : (
            <Link to="/dashboard">
              <button className="mx-5 home-btn green-btn">Dashboard</button>
            </Link>
          )}
        </nav>
        <i
          onClick={onOpenNav}
          className={`fas ${showNav ? "fa-times" : "fa-bars"} xl:hidden`}
        ></i>
      </header>
      <div
        className={`z-10 mobile-nav xl:hidden flex flex-col w-full top-16 lg:top-20 fixed bg-sec transition-all ${
          showNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <Link
          to="/pick-up"
          className="flex items-center border-b-2 border-gray-100 text-white px-5 py-5"
        >
          <div className="nav-icon">
            <i className="fas fa-handshake text-white mr-2 text-sm"></i>
          </div>
          <p>Request E-waste pickup</p>
        </Link>
        <Link
          to="/drop-off"
          className="flex items-center border-b-2 border-gray-100 text-white px-5 py-5"
        >
          <div className="nav-icon">
            <i className="fas fa-home text-white mr-2 text-sm"></i>
          </div>
          <p>Drop Off E-waste</p>
        </Link>
        <Link to="/contact" className="flex items-center border-b-2 border-gray-100 text-white px-5 py-5">
          <div className="nav-icon">
            <i className="fas fa-phone text-white mr-2 text-sm"></i>
          </div>
          <p>Contact Us</p>
        </Link>
      </div>
    </div>
  );
}

export default Header;
