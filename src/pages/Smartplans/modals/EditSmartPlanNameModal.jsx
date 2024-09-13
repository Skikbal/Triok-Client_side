import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../../../components/Modal/Modal";
import { CreateSmartPlanContext } from "../../../context/CreateSmartPlanContext";
import axios from "axios";
import { BASE_URL } from "../../../utils/Element";
import useAuth from "../../../hooks/useAuth";
import { NotificationManager } from "react-notifications";

const EditSmartPlanNameModal = ({ showModal, onClose }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState();
  const { smartPlanInfo, onSuccess } = useContext(CreateSmartPlanContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { name: name };
    axios
      .put(`${BASE_URL}/update-smartplan/${id}`, dataToSend, config)
      .then((res) => {
        onClose();
        onSuccess();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
        setError(error.response.data.message);
      });
  };

  useEffect(() => {
    if (smartPlanInfo?.name) {
      setName(smartPlanInfo?.name);
    }
  }, [smartPlanInfo?.name]);

  return (
    <Modal title={"Edit TouchPlan"} desc={"Enter a name for the plan."} show={showModal} onClose={onClose}>
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
          <button type="submit" onClick={onClose} className="save-button light-L head-5 green-bg-H">
            Edit TouchPlan
          </button>
          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSmartPlanNameModal;
