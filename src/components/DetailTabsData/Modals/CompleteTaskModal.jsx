import React, { useState } from "react";
import Modal from "../../Modal/Modal";
import axios from "axios";
import { BASE_URL } from "../../../utils/Element";
import useAuth from "../../../hooks/useAuth";
import { NotificationManager } from "react-notifications";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

const CompleteTaskModal = ({ showModal, onClose, taskData, onTaskCompleted }) => {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [config] = useAuth();

  const handleAddActivity = () => {
    const currentDate = new Date().toISOString().split("T")[0];

    const dataToSend = {
      interaction_type: taskData?.task_type,
      description: description,
      date: currentDate,
      contact_id: taskData?.contact_id,
    };

    axios
      .post(`${BASE_URL}/add-activity`, dataToSend, config)
      .then((res) => {
        const success = res?.data?.success;
        if (success) {
          setDescription("");
          setType("");
          onClose();
          onTaskCompleted();
        }
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

  const handleCompleteTask = () => {
    axios
      .post(`${BASE_URL}/perform-Action?action=is_complete&task_id=${taskData?.id}`, {}, config)
      .then((res) => {
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
        setDescription("");
        setType("");
        onClose();
        onTaskCompleted();
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleSubmit = () => {
    if (type === "yes") {
      handleAddActivity();
    }
    handleCompleteTask();
  };

  const handleClose = () => {
    setDescription("");
    setType("");
    onClose();
  };

  return (
    <Modal title={"Complete Task"} desc={"Before completing this task, make a selection below."} show={showModal} onClose={handleClose}>
      <form className="py-3">
        <p className="head-4 dark-H mb-2">
          Would you like to add activity to <span className="green-H">{`${taskData?.contact?.first_name} ${taskData?.contact?.last_name}`}'s</span> timeline?
        </p>

        <RadioGroup
          onChange={(value) => {
            setType(value);
          }}
          value={type}
        >
          <Stack direction="column" gap={2}>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Stack>
        </RadioGroup>

        {type === "yes" && (
          <>
            <div className="mt-6">
              <p className="head-4 dark-H">Add an activity to the contact timeline.</p>
              <p className="body-S dark-M mt-2">Interaction Type</p>
              <p className="head-4 pt-1 dark-H capitalize">{taskData?.task_type}</p>
            </div>

            <div className="flex-1 mt-6">
              <p className="head-4 dark-H">
                Description <span className="body-S dar-M">(optional)</span>
              </p>
              <textarea
                rows={4}
                placeholder="Enter description here..."
                className="mt-2 w-full body-N"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
          </>
        )}

        <div className="mt-6">
          <button type="button" onClick={handleSubmit} className="save-button light-L head-5 green-bg-H">
            Complete
          </button>
          <button type="button" onClick={handleClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CompleteTaskModal;
