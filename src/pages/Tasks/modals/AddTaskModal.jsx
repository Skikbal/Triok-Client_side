import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import AddTaskData from "../components/AddTaskData";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";

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

const AddTaskModal = ({ showModal, onClose, onTaskAdded, from, data }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const [error, setError] = useState({});
  const [taskData, setTaskData] = useState(initialData);
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    if (from === "contact" && data?.id) {
      setSelectedContacts([{ id: data.id, name: `${data?.first_name} ${data?.last_name}` }]);
    }
  }, [from, data]);

  const handleCloseModal = () => {
    onClose();
    setSelectedContacts([]);
    setTaskData(initialData);
    setError({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let companyIdToSend = from === "contact" ? null : id;
    const taskPayload = {
      task_name: taskData.task_name,
      company_id: companyIdToSend,
      contact_id: selectedContacts?.map((el) => el.id),
      priority: taskData.priority,
      task_type: taskData.task_type,
      description: taskData.description,
      due_date: taskData.due_date,
      hyperlink: taskData.hyperlink,
      repeat: taskData.repeat === "custom" ? taskData?.repeat_date : taskData.repeat,
    };

    axios
      .post(`${BASE_URL}/tasks`, taskPayload, config)
      .then((res) => {
        onTaskAdded(true);
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
    setTaskData({ ...taskData, [name]: value });
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectedContacts = (contacts) => {
    setSelectedContacts(contacts);
  };

  return (
    <Modal title={"Create Task"} desc={"Enter information for the task."} show={showModal} onClose={handleCloseModal}>
      <form className="py-3" onSubmit={handleSubmit}>
        <AddTaskData from={from} type="add" data={data} error={error} taskData={taskData} selectedContacts={selectedContacts} handleInputChange={handleInputChange} handleSelectedContacts={handleSelectedContacts} />

        <div className="mt-6">
          <button type="submit" className="save-button light-L head-5 green-bg-H">
            Create Task
          </button>
          <button type="button" onClick={handleCloseModal} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTaskModal;
