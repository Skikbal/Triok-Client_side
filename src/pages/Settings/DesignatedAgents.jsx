import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import DesignatedDropdown from "./components/DesignatedDropdown";
import AddLeadSourceModal from "./modals/LeadSourceModals/AddLeadSourceModal";

const initialFormData = {
  task_agent: "",
  email_agent: "",
  message_agent: "",
  rainmaker_agent: "",
};

const DesignatedAgents = () => {
  const [config] = useAuth();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [userOptions, setUserOptions] = useState([]);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/get-datalisting?list=users`, config)
      .then((res) => {
        const data = res?.data?.data;
        const options = data?.map((el) => ({ value: el?.id, label: `${el?.first_name} ${el?.last_name}`, role: el?.role_id }));
        setUserOptions(options);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleSave = () => {
    axios
      .post(`${BASE_URL}/create-designatedagents`, formData, config)
      .then((res) => {
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/designated-listing`, config)
      .then((res) => {
        const data = res?.data?.designatedlisting;
        setFormData({
          task_agent: data?.task_agent,
          email_agent: data?.email_agent,
          message_agent: data?.message_agent,
          rainmaker_agent: data?.rainmaker_agent,
        });
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);

  return (
    <BaseLayout>
      <div className="flex justify-between items-center">
        <p className="head-1 dark-H">Designated Agents</p>
        <button className="add-contact-button green-bg-H light-L body-S mr-4" onClick={handleSave}>
          Save
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="light-bg-L p-4 body-L dark-M table-container h-[78vh] overflow-y-auto">
          <p>With your admin permissions you can set assignees for these steps on a Team TouchPlan.</p>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="w-[32%]">
              <DesignatedDropdown
                title="Email"
                desc="Always send emails from this person"
                icon="email"
                options={userOptions}
                selectedOption={formData?.email_agent}
                onSetSelectOption={(value) => {
                  setFormData({ ...formData, email_agent: value });
                }}
              />
            </div>

            <div className="w-[32%]">
              <DesignatedDropdown
                title="Task"
                desc="Always assign tasks to this person"
                icon="task"
                options={userOptions}
                selectedOption={formData?.task_agent}
                onSetSelectOption={(value) => {
                  setFormData({ ...formData, task_agent: value });
                }}
              />
            </div>

            <div className="w-[32%]">
              <DesignatedDropdown
                title="Send Message"
                desc="Always send messages from this person"
                icon="message"
                options={userOptions}
                selectedOption={formData?.message_agent}
                onSetSelectOption={(value) => {
                  setFormData({ ...formData, message_agent: value });
                }}
              />
            </div>
          </div>

          <hr className="my-8" />

          <div>
            <p className="mb-6">With your admin permissions you can set assignees for these steps on a Team TouchPlan.</p>

            <div className="w-[32%]">
              <DesignatedDropdown
                title="Rainmaker"
                desc="Will act as default if the contact is team owned"
                icon="rainmaker"
                options={userOptions}
                selectedOption={formData?.rainmaker_agent}
                onSetSelectOption={(value) => {
                  setFormData({ ...formData, rainmaker_agent: value });
                }}
              />
            </div>
          </div>
        </div>
      )}

      <AddLeadSourceModal showModal={showModal} onClose={() => setShowModal(false)} />
    </BaseLayout>
  );
};

export default DesignatedAgents;
