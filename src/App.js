import "./App.css";
import Toast from "./components/common/Toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/pages/home/Home";
import Auth from "./components/pages/auth/Auth";
import Dashboard from "./components/pages/dashboard/Dashboard";
import PaymentHistory from "./components/pages/dashboard/payments/PaymentHistory";
import PageNotFound from "./components/pages/errorPages/PageNotFound";
import LogEquipment from "./components/pages/dashboard/manage-equipment/LogEquipment";
import EquipmentHome from "./components/pages/dashboard/manage-equipment/EquipmentHome";
import DashboardHome from "./components/pages/dashboard/DashboardHome";
import AddEditEquipment from "./components/pages/dashboard/manage-equipment/AddEditEquipment";
import UserType from "./components/pages/auth/UserType";
import PickUp from "./components/pages/home/PickUp";
import DropOff from "./components/pages/home/DropOff";
import Verify from "./components/pages/auth/Verify";
import ForgotPassword from "./components/pages/auth/ForgotPassword";
import VerifyEmail from "./components/pages/auth/VerifyEmail";
import AddBulkEquipment from "./components/pages/dashboard/manage-equipment/AddBulkEquipment";
import Details from "./components/pages/dashboard/manage-equipment/Details";
import PaymentDetails from "./components/pages/dashboard/payments/PaymentDetails";
import PaymentHome from "./components/pages/dashboard/payments/PaymentHome";
import RequestHome from "./components/pages/dashboard/requests/RequestHome";
import Requests from "./components/pages/dashboard/requests/Requests";
import RequestDetails from "./components/pages/dashboard/requests/RequestDetails";
import AdminPaymentHistory from "./components/pages/dashboard/admin/payments/AdminPaymentHistory";
import AdminHome from "./components/pages/dashboard/admin/AdminHome";
import UserHome from "./components/pages/dashboard/admin/user/UserHome";
import UserManagement from "./components/pages/dashboard/admin/user/UserManagement";
import PickupsHome from "./components/pages/dashboard/admin/pickups/PickupsHome";
import AdminPickups from "./components/pages/dashboard/admin/pickups/AdminPickups";
import Settings from "./components/pages/dashboard/admin/settings/Settings";
import SettingsHome from "./components/pages/dashboard/admin/settings/SettingsHome";
import SettingsCategories from "./components/pages/dashboard/admin/settings/SettingsCategories";
import SettingsCategoriesDetails from "./components/pages/dashboard/admin/settings/SettingsCategoriesDetails";
import AdminSettings from "./components/pages/dashboard/admin/settings/AdminSettings";
import UserDetails from "./components/pages/dashboard/admin/user/UserDetails";
import { useSelector } from "react-redux";
import Profile from "./components/pages/dashboard/settings/Profile";
import DashboardSettings from "./components/pages/dashboard/settings/DashboardSettings";
import ChangePassword from "./components/pages/dashboard/settings/ChangePassword";
import ResetPassword from "./components/pages/auth/ResetPassword";
import Centres from "./components/pages/dashboard/requests/Centres";
import AssignRecyclers from "./components/pages/dashboard/admin/settings/AssignRecyclers";
import RecyclerHome from "./components/pages/dashboard/RecyclerHome";
import AdminEquipmentHome from "./components/pages/dashboard/admin/equipment/AdminEquipmentHome";
import AdminEquipment from "./components/pages/dashboard/admin/equipment/AdminEquipment";
import AdminEquipmentDetails from "./components/pages/dashboard/admin/equipment/AdminEquipmentDetails";
import AdminEwasteHome from "./components/pages/dashboard/admin/ewaste/AdminEwasteHome";
import AdminEwaste from "./components/pages/dashboard/admin/ewaste/AdminEwaste";
import AdminEwasteDetails from "./components/pages/dashboard/admin/ewaste/AdminEwasteDetails";
import AdminRecycleHome from "./components/pages/dashboard/admin/recycle/AdminRecycleHome";
import AdminRecycle from "./components/pages/dashboard/admin/recycle/AdminRecycle";
import AdminRecycleDetails from "./components/pages/dashboard/admin/recycle/AdminRecycleDetails";
import AssignRecyclerDetails from "./components/pages/dashboard/admin/settings/AssignRecyclerDetails";
import AdminPickupsDetails from "./components/pages/dashboard/admin/pickups/AdminPickupsDetails";
import CentreDetails from "./components/pages/dashboard/recycler/CentreDetails";
import Contact from "./components/pages/home/Contact";
import PaymentVerification from "./components/pages/home/PaymentVerification";
import CentreDetailsHome from "./components/pages/dashboard/recycler/CentreDetailsHome";

function App() {
  const user = useSelector((state) => state.user.user.user) || null;
  const role = user?.role || null;
  return (
    <div className="App">
      {/* <Outlet /> */}
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path="pick-up" element={<PickUp />} />
          <Route path="drop-off" element={<DropOff />} />
          <Route path="user" element={<UserType />} />
          <Route path="verify-payment" element={<PaymentVerification />} />
          <Route path="contact" element={<Contact />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="verify/:token" element={<Verify />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="signin" element={<Auth type={"signin"} />} />
          <Route path="signup" element={<Auth type={"signup"} />} />
          <Route
            path="dashboard"
            element={
              !role ? (
                <Navigate to="/signin" />
              ) : role === "epron" ? (
                <Navigate to="/admin" />
              ) : (
                <Dashboard />
              )
            }
          >
            <Route
              index
              element={
                role === "recycler" ? <RecyclerHome /> : <DashboardHome />
              }
            />
            <Route
              path="log"
              element={
                role === "manufacturer" && !user.approved_documents ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <EquipmentHome />
                )
              }
            >
              <Route index element={<LogEquipment />} />
              <Route path="add" element={<AddEditEquipment page={"add"} />} />
              <Route path="edit" element={<AddEditEquipment page={"edit"} />} />
              <Route path="bulk" element={<AddBulkEquipment page={"edit"} />} />
            </Route>
            <Route path="payments" element={<PaymentHome />}>
              <Route index element={<PaymentHistory />} />
              <Route path="details" element={<PaymentDetails />} />
            </Route>
            <Route path="requests" element={<RequestHome />}>
              <Route index element={<Requests />} />
              <Route path="details" element={<RequestDetails />} />
            </Route>
            <Route path="centres" element={<RequestHome />}>
              <Route index element={<Centres />} />
              <Route path=":name" element={<CentreDetailsHome />}>
                <Route index element={<CentreDetails />} />
                <Route path="details" element={<Details />} />
              </Route>
            </Route>
            <Route path="settings" element={<SettingsHome />}>
              <Route index element={<DashboardSettings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
            <Route path="details" element={<Details />} />
          </Route>
          <Route
            path="admin"
            element={
              !role ? (
                <Navigate to="/signin" />
              ) : role === "epron" ? (
                <Dashboard />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="equipment" element={<AdminEquipmentHome />}>
              <Route index element={<AdminEquipment />} />
              <Route path="details" element={<AdminEquipmentDetails />} />
            </Route>
            <Route path="ewastes" element={<AdminEwasteHome />}>
              <Route index element={<AdminEwaste />} />
              <Route path="details" element={<AdminEwasteDetails />} />
            </Route>
            <Route path="recycle-logs" element={<AdminRecycleHome />}>
              <Route index element={<AdminRecycle />} />
              <Route path="details" element={<AdminRecycleDetails />} />
            </Route>
            <Route path="users" element={<UserHome />}>
              <Route index element={<UserManagement />} />
              <Route path="details" element={<UserDetails />} />
            </Route>
            <Route path="payments" element={<PaymentHome />}>
              <Route index element={<AdminPaymentHistory />} />
              <Route path="details" element={<PaymentDetails />} />
            </Route>
            <Route path="pickups" element={<PickupsHome />}>
              <Route index element={<AdminPickups />} />
              <Route path="details" element={<AdminPickupsDetails />} />
            </Route>
            <Route
              path="settings"
              element={
                user && user.epron_admin === "read" ? (
                  <Navigate to="/admin" />
                ) : (
                  <SettingsHome />
                )
              }
            >
              <Route index element={<Settings />} />
              <Route path="categories" element={<SettingsCategories />} />
              <Route
                path="categories/types"
                element={<SettingsCategoriesDetails />}
              />
              <Route
                path="admin"
                element={
                  user && (user.epron_admin === "read" || user.epron_admin === "writ") ? (
                    <Navigate to="/admin" />
                  ) : (
                    <AdminSettings />
                  )
                }
              />
              <Route path="admin/details" element={<UserDetails />} />
              <Route path="assign-centres" element={<AssignRecyclers />} />
              <Route
                path="assign-centres/details"
                element={<AssignRecyclerDetails />}
              />
            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toast />
    </div>
  );
}

export default App;
