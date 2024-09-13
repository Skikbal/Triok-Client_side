import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import Reshedule from "../../assets/svgs/watch.svg";
import Archive from "../../assets/svgs/download.svg";
import Priority from "../../assets/svgs/Connection.svg";
import { AiOutlineDelete as DeleteIcon } from "react-icons/ai";
import { MdOutlineFileUpload as UnarchiveIcon } from "react-icons/md";
import ResheduleTaskModal from "../DetailTabsData/Modals/ResheduleTaskModal";
import ChangePriorityModal from "../DetailTabsData/Modals/ChangePriorityModal";
import DeleteConfirmationModal from "../ConfirmationModals/DeleteConfirmationModal";
import ArchiveConfirmationModal from "../ConfirmationModals/ArchiveConfirmationModal";
import UnarchiveConfirmationModal from "../ConfirmationModals/UnarchieveConfirmationModal";
import { FaArrowLeft as LeftArrowIcon, FaArrowRight as RightArrowIcon } from "react-icons/fa";
import { NotificationManager } from "react-notifications";

const TaskPagination = ({ selectedItem, paginationData, handlePrev, handleNext, handleUpdated, activeTab }) => {
  const [config] = useAuth();
  const [date, setDate] = useState();
  const [priority, setPriority] = useState("none");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [showResheduleTaskModal, setShowResheduleTaskModal] = useState(false);

  const handleDelete = () => {
    const dataToSend = {
      action: "delete_tasks",
      task_ids: selectedItem,
    };
    axios
      .post(`${BASE_URL}/bulkUpdate-Tasks`, dataToSend, config)
      .then(() => {
        handleUpdated();
        setShowDeleteModal(false);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleUnarchieve = () => {
    const dataToSend = {
      action: "unarchive_tasks",
      task_ids: selectedItem,
    };
    axios
      .post(`${BASE_URL}/bulkUpdate-Tasks`, dataToSend, config)
      .then(() => {
        handleUpdated();
        setShowUnarchiveModal(false);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleArchieve = () => {
    const dataToSend = {
      action: "archive_tasks",
      task_ids: selectedItem,
      archive: "yes",
    };
    axios
      .post(`${BASE_URL}/bulkUpdate-Tasks`, dataToSend, config)
      .then(() => {
        handleUpdated();
        setShowArchiveModal(false);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleResheduleTask = () => {
    const dataToSend = {
      action: "reschedule_date",
      task_ids: selectedItem,
      reschedule_date: date,
    };
    axios
      .post(`${BASE_URL}/bulkUpdate-Tasks`, dataToSend, config)
      .then(() => {
        handleUpdated();
        setPriority("none");
        setShowResheduleTaskModal(false);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handlePriorityChange = () => {
    const dataToSend = {
      action: "new_priority",
      task_ids: selectedItem,
      new_priority: priority,
    };
    axios
      .post(`${BASE_URL}/bulkUpdate-Tasks`, dataToSend, config)
      .then(() => {
        handleUpdated();
        setShowPriorityModal(false);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <div className="flex justify-between mt-3 px-4">
      <div>
        {selectedItem?.length >= 1 && (
          <>
            {activeTab === 2 ? (
              <div className="green-H head-5 flex items-center gap-4">
                <p role="button" className="flex items-center gap-1 tags" onClick={() => setShowUnarchiveModal(true)}>
                  <UnarchiveIcon size={18} />
                  Unarchive
                </p>
                <p role="button" className="red-D flex items-center gap-1 tags" style={{ borderColor: "#FF0000" }} onClick={() => setShowDeleteModal(true)}>
                  <DeleteIcon size={18} /> Delete
                </p>
              </div>
            ) : activeTab === 1 ? (
              <div className="green-H head-5 flex items-center gap-4">
                <p role="button" className="red-D flex items-center gap-1 tags" style={{ borderColor: "#FF0000" }} onClick={() => setShowArchiveModal(true)}>
                  <img src={Archive} alt="" /> Archive
                </p>
              </div>
            ) : (
              <div className="green-H head-5 flex items-center gap-4">
                <p role="button" className="flex items-center gap-1 tags" onClick={() => setShowResheduleTaskModal(true)}>
                  <img src={Reshedule} alt="" />
                  Reshedule
                </p>
                <p role="button" className="flex items-center gap-1 tags" onClick={() => setShowPriorityModal(true)}>
                  <img src={Priority} alt="" />
                  Change Priority
                </p>
                <p role="button" className="red-D flex items-center gap-1 tags" style={{ borderColor: "#FF0000" }} onClick={() => setShowArchiveModal(true)}>
                  <img src={Archive} alt="" /> Archive
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="body-L dark-H flex items-center gap-2">
        <LeftArrowIcon role="button" className="dark-M" onClick={handlePrev} />
        <p>
          <span className="green-H">
            {paginationData?.from}-{paginationData?.to}
          </span>{" "}
          of {paginationData?.totalItems}
        </p>
        <RightArrowIcon role="button" className="dark-M" onClick={handleNext} />
      </div>

      <ResheduleTaskModal
        showModal={showResheduleTaskModal}
        onClose={() => {
          setShowResheduleTaskModal(false);
        }}
        onDateChange={(date) => {
          setDate(date);
        }}
        handleResheduleTask={handleResheduleTask}
      />

      <ChangePriorityModal
        showModal={showPriorityModal}
        onClose={() => {
          setShowPriorityModal(false);
        }}
        setPriority={setPriority}
        priority={priority}
        handlePriorityChange={handlePriorityChange}
      />

      <ArchiveConfirmationModal
        showModal={showArchiveModal}
        onClose={() => {
          setShowArchiveModal(false);
        }}
        handleAction={handleArchieve}
      />

      <UnarchiveConfirmationModal showModal={showUnarchiveModal} onClose={() => setShowUnarchiveModal(false)} handleAction={handleUnarchieve} />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </div>
  );
};

export default TaskPagination;
