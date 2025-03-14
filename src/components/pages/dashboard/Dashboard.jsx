import React, { useEffect } from "react";
import SideNav from "./features/SideNav";
import TopNav from "./features/TopNav";
import { useNavigate, Outlet } from "react-router-dom";
import "./dashboard.css";
import GoToTop from "../../common/GoToTop";
import { useSelector } from "react-redux";
import { getFirstWord } from "../../../utils/helper";
import LogoutModal from "../../common/LogoutModal";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import BreadCrumbs from "./features/BreadCrumbs";
import DashboardErrorBoundary from "../errorPages/DashboardErrorBoundary";

function Dashboard() {
  const user = useSelector((state) => state.user.user.user);
  const { userLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userLoggedIn) navigate("/signin");
  }, [user, userLoggedIn, navigate]);
  const dashboardData = {
    name: user.name,
    role: user.role,
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-600">
      <GoToTop />
      <DashboardErrorBoundary>
        <TopNav name={user.name} email={user.email} role={user.role} />
        <div className="dash-wrap flex h-full pt-10 pb-3">
          <SideNav role={user.role} />
          <div className="dash-main">
            <BreadCrumbs />
            <div className="p-side">
              <Outlet context={[dashboardData]} />
            </div>
          </div>
        </div>
        <LogoutModal />
      </DashboardErrorBoundary>
    </div>
  );
}

export default Dashboard;
