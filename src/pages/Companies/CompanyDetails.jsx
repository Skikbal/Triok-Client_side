import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import CompanyTaskTab from "./components/CompanyTaskTab";
import { useNavigate, useParams } from "react-router-dom";
import LeftIcon from "../../assets/svgs/leftArrowIcon.svg";
import CompanyUpdateTab from "./components/CompanyUpdateTab";
import RightIcon from "../../assets/svgs/rightArrowIcon.svg";
import CompanyContactTab from "./components/CompanyContactTab";
import CompanyPropertyTab from "./components/CompanyPropertyTab";
import CompanyDetailHeader from "./components/CompanyDetailHeader";
import CompanySmartPlanTab from "./components/CompanySmartPlanTab";
import CompanyAcquisitionTab from "./components/CompanyAcquisitionTab";
import SearchDropdownList from "../../components/SearchDropdownList";
import { NotificationManager } from "react-notifications";

const CompanyDetails = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("updates");
  const [companyDetails, setCompanyDetails] = useState();

  const fetchCompanyDetails = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/company-getbyid/${id}`, config)
      .then((res) => {
        setCompanyDetails(res?.data?.data);
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  return (
    <BaseLayout>
      <div className="flex justify-between items-center">
        <p role="button" className="green-H head-5 underline" onClick={() => navigate("/companies")}>
          Back to Companies
        </p>

        <div className="body-S dark-M flex items-center gap-5">
          {companyDetails?.previous_id !== null && (
            <div role="button" onClick={() => navigate(`/company/${companyDetails?.previous_id}`)} className="flex items-center gap-2">
              <img src={LeftIcon} alt="" />
              Previous Company
            </div>
          )}

          {companyDetails?.next_id !== null && (
            <div role="button" onClick={() => navigate(`/company/${companyDetails?.next_id}`)} className="flex items-center gap-2">
              Next Company
              <img src={RightIcon} alt="" />
            </div>
          )}
        </div>

        <SearchDropdownList from="company" />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <CompanyDetailHeader companyDetails={companyDetails} onSetCallApiAgain={fetchCompanyDetails} />

          <div className="contact-details light-bg-L" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
            <div className="flex justify-between header-tabs">
              <p role="button" onClick={() => setActiveTab("updates")} className={`${activeTab === "updates" ? "head-5 dark-H active" : "body-S dark-M "} tab`}>
                Updates
              </p>
              <p role="button" onClick={() => setActiveTab("contacts")} className={`${activeTab === "contacts" ? "head-5 dark-H active" : "body-S dark-M"} tab`}>
                Contacts
              </p>
              <p role="button" onClick={() => setActiveTab("properties")} className={`${activeTab === "properties" ? "head-5 dark-H active" : "body-S dark-M"} tab`}>
                Properties
              </p>
              <p role="button" onClick={() => setActiveTab("acquisition")} className={`${activeTab === "acquisition" ? "head-5 dark-H active" : "body-S dark-M"} tab`}>
                Acquisition Criteria
              </p>
              <p role="button" onClick={() => setActiveTab("tasks")} className={`${activeTab === "tasks" ? "head-5 dark-H active" : "body-S dark-M"} tab`}>
                Tasks
              </p>
              <p role="button" onClick={() => setActiveTab("smartPlans")} className={`${activeTab === "smartPlans" ? "head-5 dark-H active" : "body-S dark-M"} tab`}>
                TouchPlans
              </p>
            </div>

            <div className="p-4">
              {activeTab === "updates" && <CompanyUpdateTab />}
              {activeTab === "contacts" && <CompanyContactTab />}
              {activeTab === "properties" && <CompanyPropertyTab />}
              {activeTab === "acquisition" && <CompanyAcquisitionTab />}
              {activeTab === "tasks" && <CompanyTaskTab />}
              {activeTab === "smartPlans" && <CompanySmartPlanTab />}
            </div>
          </div>
        </>
      )}
    </BaseLayout>
  );
};

export default CompanyDetails;
