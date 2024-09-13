import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import moment from "moment";
import useAuth from "../hooks/useAuth";
import map from "../assets/svgs/map.svg";
import Menu from "../assets/svgs/Menu.svg";
import chat from "../assets/svgs/chat.png";
import { BASE_URL } from "../utils/Element";
import Tasks from "../assets/icons/tasks.svg";
import mail from "../assets/svgs/message 2.svg";
import note from "../assets/svgs/clipboard.svg";
import Buyers from "../assets/icons/buyers.svg";
import Contacts from "../assets/icons/contacts.svg";
import Smart from "../assets/icons/smart-plans.svg";
import { handleDropdownClose } from "../utils/utils";
import Companies from "../assets/icons/companies.svg";
import Properties from "../assets/icons/properties.svg";
import conversation from "../assets/svgs/conversation.png";
import TaskDetailsModal from "../pages/Tasks/TaskDetailsModal";
import { useSelectedOptions } from "../context/selectedOptionsContext";
import EditMassageModal from "./DetailTabsData/Modals/EditMessageModal";
import DeleteConfirmationModal from "./ConfirmationModals/DeleteConfirmationModal";

const MessageBox = ({ title, activityId, activity }) => {
  const [config] = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { setIsDeletedactivity } = useSelectedOptions();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);

  const mapIcon = (interactionType) => {
    switch (interactionType) {
      case "Meeting":
        return location;
      case "Conversation":
        return conversation;
      case "Left Message":
        return map;
      case "Email":
        return mail;
      case "Gmail":
        return mail;
      case "Text":
        return chat;
      case "Note":
        return note;
      case "Mail":
        return mail;
      case "Acquisition":
        return Buyers;
      case "Contact":
        return Contacts;
      case "Company":
        return Companies;
      case "Property":
        return Properties;
      case "Task":
        return Tasks;
      case "SmartPlan":
        return Smart;
      default:
        return note;
    }
  };

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const handleEditClick = () => {
    setShowModal(true);
    setIsOpen(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setIsOpen(false);
  };

  const handleDelete = () => {
    axios
      .get(`${BASE_URL}/delete-activity/${activityId}`, config)
      .then((res) => {
        if (res.data.success) {
          setIsDeletedactivity(true);
        }
        setShowDeleteModal(false);
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

  const type = activity?.integration_id ? "Gmail" : activity?.interaction_type;

  return (
    <div className="updates-message mt-6">
      <div className="flex justify-between  items-start gap-3 p-4">
        <div className="flex gap-2 items-start">
          <img src={mapIcon(type)} alt="icon" className="sidebar-icons" />
          <div>
            <p className="dark-H head-4 capitalize">{type}</p>
            <p className="dark-M body-S">{`${moment(activity?.created_at).format("hh:mm A")}  ${activity?.user ? `| By ${activity?.user?.first_name} ${activity?.user?.last_name}` : ""} `}</p>
          </div>
        </div>

        <div ref={dropdownRef} className=" custom-dropdown">
          <div role="button" className="light-bg-L body-N dark-M" onClick={() => setIsOpen(!isOpen)}>
            <img src={Menu} alt="icon" className="sidebar-icons" />
          </div>
          {isOpen && (
            <div className="dropdown-list-container dropdown-end light-bg-L dark-M body-N  shadow rounded-box " style={{ width: "130px" }}>
              <ul className="dropdown-list">
                {(activity?.interaction_type === "Acquisition" || (location.pathname.includes("contact") == false && activity?.interaction_type === "Contact") || (location.pathname.includes("company") == false && activity?.interaction_type === "Company") || activity?.interaction_type === "Property" || activity?.interaction_type === "Task" || activity?.interaction_type === "SmartPlan" || activity?.integration_id) && (
                  <li
                    role="button"
                    onClick={() => {
                      if (activity?.integration_id) {
                        window.open(`https://mail.google.com/mail/u/0/#inbox/${activity?.integration_id}`, "_blank");
                      } else if (activity?.interaction_type === "Acquisition") {
                        navigate(`/buyer/${activity?.origional_data?.id}`);
                      } else if (activity?.interaction_type === "Contact") {
                        navigate(`/contact/${activity?.origional_data?.id}`);
                      } else if (activity?.interaction_type === "Company") {
                        navigate(`/company/${activity?.origional_data?.id}`);
                      } else if (activity?.interaction_type === "Property") {
                        navigate(`/property/${activity?.origional_data?.id}`);
                      } else if (activity?.interaction_type === "Task") {
                        setShowTaskDetailModal(true);
                        setIsOpen(false);
                      } else if (activity?.interaction_type === "SmartPlan") {
                        navigate(`/touch-plan/${activity?.origional_data?.id}`);
                      }
                    }}
                  >
                    View Details
                  </li>
                )}
                <li role="button" onClick={handleEditClick}>
                  Edit
                </li>
                <li className="red-D" role="button" onClick={handleDeleteClick}>
                  Delete
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="green-bg-L px-6 py-3" style={{ borderRadius: "0px 0px 4px 4px" }}>
        {title && <p className="head-5 dark-H">{title}</p>}
        {activity?.integration_id && activity?.modified_data?.sender ? (
          <div className="body-S dark-M">
            {activity?.modified_data?.sender?.subject && (
              <p className="head-6">
                {activity?.modified_data?.sender?.isForwarded ? "Fwd:" : activity?.modified_data?.sender?.isReply ? "Re:" : ""}
                <span className="body-S">{activity?.modified_data?.sender?.subject}</span>
              </p>
            )}
            <p className="head-6">
              From: <span className="body-S">{activity?.modified_data?.sender?.from}</span>
            </p>
            <div className="flex flex-wrap">
              <p className="head-6 mr-1">To:</p>
              {activity?.modified_data?.sender?.to?.flatMap((el, i) => (
                <p key={i}>
                  {el}
                  {activity?.modified_data?.sender?.to?.length - 1 === i ? "" : ","}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <p className="body-S dark-M">{activity?.description}</p>
        )}
      </div>

      <TaskDetailsModal
        from="activity"
        showModal={showTaskDetailModal}
        onClose={() => {
          setShowTaskDetailModal(false);
        }}
        id={activity?.origional_data?.id}
      />

      <EditMassageModal
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        activityId={activityId}
      />

      <DeleteConfirmationModal
        showModal={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default MessageBox;
