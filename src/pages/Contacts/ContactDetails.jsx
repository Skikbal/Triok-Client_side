import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import TasksTabData from "./components/TasksTabData";
import OffersTabData from "./components/OffersTabData";
import DetailsHeader from "./components/DetailsHeader";
import UpdateTabData from "./components/UpdateTabData";
import { useNavigate, useParams } from "react-router-dom";
import LeftIcon from "../../assets/svgs/leftArrowIcon.svg";
import RightIcon from "../../assets/svgs/rightArrowIcon.svg";
import SmartPlansTabData from "./components/SmartPlansTabData";
import PropertiesTabData from "./components/PropertiesTabData";
import AcquisitionTabData from "./components/AcquisitionTabData";
import SearchDropdownList from "../../components/SearchDropdownList";
import { NotificationManager } from "react-notifications";

const ContactDetails = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("updates");
  const [contactDetails, setContactDetails] = useState();

  const fetchContactDetails = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/contact-getbyid/${id}`, config)
      .then((res) => {
        setContactDetails(res?.data?.data);
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
    fetchContactDetails();
  }, [id]);

  return (
    <BaseLayout>
      <div className="flex justify-between items-center">
        <p role="button" className="green-H head-5 underline" onClick={() => navigate("/contacts")}>
          Back to Contacts
        </p>

        <div className="body-S dark-M flex items-center gap-5">
          {contactDetails?.previous_id !== null && (
            <div role="button" onClick={() => navigate(`/contact/${contactDetails?.previous_id}`)} className="flex items-center gap-2">
              <img src={LeftIcon} alt="" />
              Previous Contact
            </div>
          )}

          {contactDetails?.next_id !== null && (
            <div role="button" onClick={() => navigate(`/contact/${contactDetails?.next_id}`)} className="flex items-center gap-2">
              Next Contact
              <img src={RightIcon} alt="" />
            </div>
          )}
        </div>

        <SearchDropdownList from="contact" />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <DetailsHeader contactDetails={contactDetails} onSetCallApiAgain={fetchContactDetails} />

          <div className="contact-details light-bg-L" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
            <div className="flex justify-between header-tabs">
              <p role="button" onClick={() => setActiveTab("updates")} className={`${activeTab === "updates" ? "head-5 dark-H active" : "body-S dark-M "} tab`}>
                Updates
              </p>
              <p role="button" onClick={() => setActiveTab("properties")} className={`${activeTab === "properties" ? "head-5 dark-H active" : "body-S dark-M"} tab`}>
                Properties
              </p>
              <p role="button" onClick={() => setActiveTab("acquisition")} className={`${activeTab === "acquisition" ? "head-5 dark-H active" : "body-S dark-M"} tab`}>
                Acquisition Criteria
              </p>
              <p role="button" onClick={() => setActiveTab("offers")} className={`${activeTab === "offers" ? "head-5 dark-H active" : "body-S dark-M"} tab`}>
                Offers
              </p>
              <p role="button" onClick={() => setActiveTab("tasks")} className={`${activeTab === "tasks" ? "head-5 dark-H active" : "body-S dark-M"} tab`}>
                Tasks
              </p>
              <p role="button" onClick={() => setActiveTab("smartPlans")} className={`${activeTab === "smartPlans" ? "head-5 dark-H active" : "body-S dark-M"} tab`}>
                TouchPlans
              </p>
            </div>

            <div className="p-4">
              {activeTab === "updates" && <UpdateTabData />}
              {activeTab === "properties" && <PropertiesTabData />}
              {activeTab === "acquisition" && <AcquisitionTabData />}
              {activeTab === "offers" && <OffersTabData />}
              {activeTab === "tasks" && <TasksTabData data={contactDetails} />}
              {activeTab === "smartPlans" && <SmartPlansTabData />}
            </div>
          </div>
        </>
      )}
    </BaseLayout>
  );
};

export default ContactDetails;
