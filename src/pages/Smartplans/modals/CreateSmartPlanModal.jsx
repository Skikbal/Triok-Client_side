import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../utils/Element";
import Modal from "../../../components/Modal/Modal";
import { NotificationManager } from "react-notifications";

const CreateSmartPlanModal = ({ showModal, onClose, from, id }) => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState();
  const [disable, setDisable] = useState(false);

  const handleClose = () => {
    setName("");
    setError();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      name: name,
    };

    const url = from === "contact" ? `create-smartplan?contact_id=${id}` : from === "company" ? `create-smartplan?company_id=${id}` : "create-smartplan";
    setDisable(true);
    axios
      .post(`${BASE_URL}/${url}`, dataToSend, config)
      .then((res) => {
        const id = res.data?.smartplan?.id;
        navigate(`/touch-plan/${id}`);
        handleClose();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(error.response.data.message);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setDisable(true));
  };

  return (
    <Modal title={"Create TouchPlan"} desc={"Enter a name for the plan."} show={showModal} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="dark-H head-4 mb-2 ">
            TouchPlan Name<span className="red-D">*</span>
          </label>
          <input
            className="body-N capitalize"
            name="name"
            type="text"
            placeholder="write name here"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          {error?.name && <span className=" red-D">{error?.name}</span>}
        </div>

        <div className="mt-6">
          <button type="submit" disabled={name === "" || disable} className="save-button light-L head-5 green-bg-H">
            Add TouchPlan
          </button>
          <button type="button" onClick={handleClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSmartPlanModal;
