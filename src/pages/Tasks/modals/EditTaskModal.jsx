import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import Modal from "../../../components/Modal/Modal";
import AddTaskData from "../components/AddTaskData";
import { NotificationManager } from "react-notifications";
import { taskRepeatOptions } from "../../../utils/options";
import moment from "moment";

const initialData = {
  task_name: "",
  description: "",
  hyperlink: "",
  task_type: "call",
  priority: "none",
  due_date: "",
  repeat: "",
  repeat_date: "",
};

const EditTaskModal = ({ showModal, from, onClose, onTaskEdited, taskInitialData }) => {
  const [config] = useAuth();
  const [error, setError] = useState({});
  const [taskData, setTaskData] = useState(initialData);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const handleCloseModal = () => {
    onClose();
    // setSelectedContacts([]);
    // setTaskData(initialData);
    setError({});
  };

  useEffect(() => {
    if (taskInitialData) {
      if (taskInitialData?.contact_id) {
        setSelectedContacts([{ id: taskInitialData?.contact_id, name: `${taskInitialData?.contact?.first_name} ${taskInitialData?.contact?.last_name}` }]);
      } else {
        setSelectedContacts([]);
      }
      setTaskData({
        task_name: taskInitialData?.task_name || "",
        description: taskInitialData?.description || "",
        hyperlink: taskInitialData?.hyperlink || "",
        task_type: taskInitialData?.task_type === "phone" ? "call" : taskInitialData?.task_type,
        priority: taskInitialData?.priority || "none",
        due_date: taskInitialData?.due_date ? moment(taskInitialData?.due_date).format("YYYY-MM-DD") : "",
        repeat: taskRepeatOptions.find((el) => el.value === taskInitialData?.repeat)?.label === "Custom" ? "custom" : taskInitialData?.repeat,
        repeat_date: taskRepeatOptions.findIndex((el) => el.value === taskInitialData?.repeat) === -1 ? taskInitialData?.repeat : "",
      });
    }
  }, [taskInitialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskPayload = {
      task_name: taskData.task_name,
      contact_id: selectedContacts?.[0]?.id,
      priority: taskData.priority,
      task_type: taskData.task_type,
      description: taskData.description,
      due_date: taskData.due_date,
      hyperlink: taskData.hyperlink,
      repeat: taskData.repeat === "custom" ? taskData?.repeat_date : taskData.repeat,
    };

    axios
      .post(`${BASE_URL}/perform-Action?action=edit&task_id=${taskInitialData?.id}`, taskPayload, config)
      .then((res) => {
        onTaskEdited(true);
        handleCloseModal();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.errors || {});
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleInputChange = (value, name) => {
    setError((prev) => ({ ...prev, [name]: "" }));
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSelectedContacts = (contacts) => {
    setSelectedContacts(contacts);
  };

  return (
    <Modal title={"Edit Task"} desc={"Edit the task information."} show={showModal} onClose={handleCloseModal}>
      <form className="py-3" onSubmit={handleSubmit}>
        <AddTaskData from={from} error={error} taskData={taskData} selectedContacts={selectedContacts} handleInputChange={handleInputChange} handleSelectedContacts={handleSelectedContacts} />
        <div className="mt-6">
          <button type="submit" className="save-button light-L head-5 green-bg-H">
            Edit Task
          </button>
          <button type="button" onClick={handleCloseModal} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
