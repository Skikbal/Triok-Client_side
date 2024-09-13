import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoutes } from "./ProtectedRoutes";
import Login from "../pages/Login/Login";
import Contacts from "../pages/Contacts/Contacts";
import Dashboard from "../pages/Dashboard/Dashboard";
import NewPassword from "../pages/Login/NewPassword";
import Companies from "../pages/Companies/Companies";
import Properties from "../pages/Properties/Properties";
import ForgotPassword from "../pages/Login/ForgotPassword";
import OtpVerification from "../pages/Login/OtpVerification";
import PageNotFound from "../pages/PageNotFound/PageNotFound";
import PasswordChangeSuccess from "../pages/Login/PasswordChangeSuccess";
import Buyers from "../pages/Buyers/Buyers";
import ContactDetails from "../pages/Contacts/ContactDetails";
import CompanyDetails from "../pages/Companies/CompanyDetails";
import AddProperty from "../pages/Properties/AddProperty";
import EditProperty from "../pages/Properties/EditProperty";
import PropertyDetails from "../pages/Properties/PropertyDetails";
import BuyersDetails from "../pages/Buyers/BuyersDetails";
import Tasks from "../pages/Tasks/Tasks";
import Smartplan from "../pages/Smartplans/Smartplan";
import Profile from "../pages/MyProfile/Profile";
import Users from "../pages/Users/Users";
import UserProfileDetail from "../pages/Users/UserProfileDetail";
import SuperAdminProfile from "../pages/MyProfile/SuperAdminProfile";
import Leads from "../pages/Leads/Leads";
import Offers from "../pages/Offers/Offers";
import CreateSmartPlan from "../pages/Smartplans/CreateSmartPlan";
import { useSelector } from "react-redux";
import Exclusives from "../pages/Exclusive/Exclusives";
import UnderContract from "../pages/UnderContract/UnderContract";
import Closed from "../pages/Closed/Closed";
import ContractToClosed from "../pages/ContractToClosed/ContractToClosed";
import DesignatedAgents from "../pages/Settings/DesignatedAgents";
import LeadSources from "../pages/Settings/LeadSources";
import ContactTag from "../pages/Settings/ContactTag";
import ContactArchive from "../pages/Settings/ContactArchive";
import Proposals from "../pages/Proposals/Proposals";
import PropertyTypes from "../pages/Settings/PropertyTypes";
import BuyerArchive from "../pages/Settings/BuyerArchive";
import PropertyArchive from "../pages/Settings/PropertyArchive";
import CompanyArchive from "../pages/Settings/CompanyArchive";
import Tenants from "../pages/Settings/Tenants";
import PropertyTags from "../pages/Settings/PropertyTags";
import ConnectedApp from "../pages/Settings/ConnectedApp";

const AppRoutes = () => {
  const userType = useSelector((state) => state.userType);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" index element={<Login />} />
        <Route path="/forgot-password" index element={<ForgotPassword />} />
        <Route path="/otp-verify" index element={<OtpVerification />} />
        <Route path="/new-password" index element={<NewPassword />} />
        <Route path="/password-success" index element={<PasswordChangeSuccess />} />
        <Route path="*" element={<PageNotFound />} />

        {/* Protected Routes  */}
        <Route element={<ProtectedRoutes />}>
          {(userType === 1 || userType === 2) && <Route path="/users" index element={<Users />} />}
          <Route path="/" index element={<Dashboard />} />
          <Route path="/user/:id" index element={<UserProfileDetail />} />
          <Route path="/contacts" index element={<Contacts />} />
          <Route path="/contact/:id" index element={<ContactDetails />} />
          <Route path="/companies" index element={<Companies />} />
          <Route path="/company/:id" index element={<CompanyDetails />} />
          <Route path="/properties" index element={<Properties />} />
          <Route path="/property/:id" index element={<PropertyDetails />} />
          <Route path="/add-property" index element={<AddProperty />} />
          <Route path="/edit-property/:id" index element={<EditProperty />} />
          <Route path="/buyers" index element={<Buyers />} />
          <Route path="/buyer/:id" index element={<BuyersDetails />} />
          <Route path="/tasks" index element={<Tasks />} />
          <Route path="/touch-plans" index element={<Smartplan />} />
          <Route path="/touch-plan/:id" index element={<CreateSmartPlan />} />
          <Route path="/leads" index element={<Leads />} />
          <Route path="/proposals" index element={<Proposals />} />
          <Route path="/offers" index element={<Offers />} />
          <Route path="/exclusives" index element={<Exclusives />} />
          <Route path="/under-contract" index element={<UnderContract />} />
          <Route path="/closed" index element={<Closed />} />
          <Route path="/contact-close" index element={<ContractToClosed />} />

          {/* Settings Routes */}
          <Route path="/settings/contact-archive" index element={<ContactArchive />} />
          <Route path="/settings/company-archive" index element={<CompanyArchive />} />
          <Route path="/settings/property-archive" index element={<PropertyArchive />} />
          <Route path="/settings/buyer-archive" index element={<BuyerArchive />} />
          <Route path="/settings/contact-tags" index element={<ContactTag />} />
          <Route path="/settings/lead-sources" index element={<LeadSources />} />
          <Route path="/settings/designated-agents" index element={<DesignatedAgents />} />
          <Route path="/settings/property-types" index element={<PropertyTypes />} />
          <Route path="/settings/property-tags" index element={<PropertyTags />} />
          <Route path="/settings/tenant" index element={<Tenants />} />
          <Route path="/settings/connected-app" index element={<ConnectedApp />} />
          <Route path="/settings/profile" index element={userType === 1 ? <SuperAdminProfile /> : <Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
