import React, { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { navLinks } from "../navigation";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../../../reducers/authSlice";

function SideNav({ role }) {
  const { sideNavStatus } = useSelector((state) => state.dashboard);
  const user = useSelector((state) => state.user.user.user);
  const navigate = useNavigate();
  let links = navLinks[role === "producer" ? "manufacturer" : role];
  if (role === "epron") {
    if (user.epron_admin === "read")
      links = links.filter((link) => link.link !== "settings");
  }
  const dispatch = useDispatch();
  useEffect(() => {
    if (!role || role === "") {
      navigate("/signin");
    }
  }, [role, navigate]);
  return (
    <div
      className={`side-nav-wrap bg-white fixed overflow-scroll h-full left-0 top-20 md:top-24 text-sm z-10  ${
        sideNavStatus ? "side-nav-open" : null
      }`}
    >
      <div className="side-nav relative block h-full ">
        <NavLink
          to=""
          end
          className={`nav-item mx-auto text-center py-3 mb-2 cursor-pointer flex items-center justify-center relative ${({
            isActive,
          }) => (isActive ? "active" : null)}`}
        >
          <i className="fa-solid fa-home text-xl"></i>
          <p className="w-24  text-left ml-3 text-sm">Dashboard</p>
          <i className="fa-solid fa-caret-left absolute z-0 top-pos -right-1 text-xl text-main pointer"></i>
        </NavLink>
        {role &&
          links.map((link, index) => (
            <NavLink
              key={index}
              to={link.link}
              className={`nav-item mx-auto text-center py-3 mb-2 cursor-pointer flex items-center justify-center relative ${({
                isActive,
              }) => (isActive ? "active" : null)}`}
            >
              <i className={`fa-solid ${link.icon} text-xl`}></i>
              <p className="w-24 text-left ml-3 text-sm leading">{link.name}</p>
              <i className="fa-solid fa-caret-left absolute top-pos -right-1 text-xl text-main pointer"></i>
            </NavLink>
          ))}
        <div
          onClick={() => dispatch(openModal())}
          className={`nav-item text-center py-3 mb-2 cursor-pointer flex item-center justify-center absolute left-pos bottom-14 w-full`}
        >
          <i className="fa-solid fa-arrow-right-from-bracket text-xl"></i>
          <p className="w-24 text-left ml-3 text-sm">Logout</p>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
