import React, { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { Tooltip } from "@chakra-ui/react";
import useAuth from "../../../../hooks/useAuth";
import { BASE_URL } from "../../../../utils/Element";
import account from "../../../../assets/svgs/account.svg";
import { AiOutlineClose as CrossIcon } from "react-icons/ai";
import { EditIcon, RepeatIcon } from "../../../../utils/icons";
import addContact from "../../../../assets/svgs/add-contact.svg";
import { MdPersonAddAlt1 as AddPersonIcon } from "react-icons/md";
import LinkContactsModal from "../../../Tasks/modals/LinkContactsModal";
import EditSmartPlanNameModal from "../../modals/EditSmartPlanNameModal";
import SmartPlanStartDateModal from "../../modals/SmartPlanStartDateModal";
import { CreateSmartPlanContext } from "../../../../context/CreateSmartPlanContext";
import ConfirmationModal from "../../../../components/ConfirmationModals/ConfirmationModal";

const PlanBaseDetails = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const { setActive, smartPlanInfo, fetchSmartPlanDetails } = useContext(CreateSmartPlanContext);
  const [startDate, setStartDate] = useState({
    type: "today",
    selectedDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      contact: selectedContacts?.map((el) => el.id),
      start_date: startDate.type === "today" ? moment().format("YYYY-MM-DD") : startDate.selectedDate,
    };
    axios
      .put(`${BASE_URL}/update-smartplan/${id}`, dataToSend, config)
      .then((res) => {
        setShowDateModal(false);
        fetchSmartPlanDetails();
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleLinkContacts = (value) => {
    const dataToSend = { contact: value.map((el) => el.id) };
    axios
      .put(`${BASE_URL}/update-smartplan/${id}`, dataToSend, config)
      .then((res) => {
        fetchSmartPlanDetails();
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (smartPlanInfo?.contact) {
      setSelectedContacts(smartPlanInfo?.contact_details?.map((el) => ({ id: el?.id, name: `${el?.first_name} ${el?.last_name}` })));
    }
  }, [smartPlanInfo]);

  const handleRemove = (id) => {
    const filteredData = selectedContacts.filter((el) => el.id !== id);
    setSelectedContacts(filteredData);
    handleLinkContacts(filteredData);
  };

  const handleConfirm = () => {
    setSelectedContacts([]);
    setShowDateModal(false);
    setShowConfirmModal(false);
  };

  return (
    <div>
      <p className="head-2 dark-H">TouchPlan Details</p>
      <div className="flex justify-between pt-6">
        <div>
          <p className="head-6 dark-M">TouchPlan Name</p>
          <p className="dark-H body-N capitalize">{smartPlanInfo?.name}</p>
        </div>

        <div role="button" onClick={() => setShowEditNameModal(true)} className="green-H body-N flex items-center gap-1">
          <EditIcon size="20" color="#2D5B30" />
          <p>Edit</p>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <div>
          <p className="head-6 dark-M">Duration</p>
          <p className="dark-H body-N">
            {smartPlanInfo?.duration} {smartPlanInfo?.duration > 1 ? "Days" : "Day"}
          </p>
        </div>

        <div>
          <p className="head-6 dark-M">Steps</p>
          <p className="dark-H body-N">
            {smartPlanInfo?.step_count} {smartPlanInfo?.step_count > 1 ? "Steps" : "Step"}
          </p>
        </div>

        <div>
          <p className="head-6 dark-M">Touches</p>
          <p className="dark-H body-N">
            {smartPlanInfo?.touches_count} {smartPlanInfo?.touches_count ? "Touches" : "Touch"}
          </p>
        </div>
      </div>

      <div role="button" onClick={() => setActive("repeat")} className="py-6 flex gap-1">
        <RepeatIcon />
        <p className="green-H body-N"> Add Repeat</p>
      </div>

      <hr />

      <div className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="dark-H head-2">Contacts</p>
            <p className="dark-M body-N">{selectedContacts?.length ?? 0} contacts on TouchPlan</p>
          </div>

          <Tooltip label="Link Contact">
            <div
              role="button"
              onClick={() => {
                setShowContactModal(true);
              }}
              className="green-H rounded-full p-2.5"
              style={{ border: "1px solid" }}
            >
              <AddPersonIcon size={20} />
            </div>
          </Tooltip>
        </div>

        {selectedContacts?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedContacts?.map((el, index) => (
              <div key={index} className="head-5 green-H flex items-center gap-2 tags p-2 rounded-full bg-light-bg-L dark:bg-dark-bg-D">
                <img src={account} alt="" /> {el?.name} <CrossIcon role="button" onClick={() => handleRemove(el.id)} />
              </div>
            ))}
          </div>
        )}
      </div>

      <EditSmartPlanNameModal showModal={showEditNameModal} onClose={() => setShowEditNameModal(false)} />

      <LinkContactsModal
        showModal={showContactModal}
        onClose={() => setShowContactModal(false)}
        onLink={(value) => {
          setSelectedContacts(value);
          if (smartPlanInfo.start_date === null) {
            setShowDateModal(true);
            setShowConfirmModal(false);
          }
        }}
        selectedIds={selectedContacts}
        isWidth={true}
      />

      <SmartPlanStartDateModal
        startDate={startDate}
        onSetStartDate={(value) => {
          setStartDate(value);
        }}
        handleSubmit={handleSubmit}
        showModal={showDateModal}
        onClose={() => {
          setShowConfirmModal(true);
        }}
      />

      <ConfirmationModal
        from="smartPlan"
        showModal={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        handleConfirm={handleConfirm}
      />
    </div>
  );
};

export default PlanBaseDetails;
