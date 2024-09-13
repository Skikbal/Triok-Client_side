import React, { useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import axios from "axios";
import { BASE_URL } from "../../../../utils/Element";
import useAuth from "../../../../hooks/useAuth";
import { NotificationManager } from "react-notifications";

const AddPropertyTypeModal = ({ showModal, onClose, onCallApi }) => {
  const [config] = useAuth();
  const [type, setType] = useState("");
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState();

  const handleClose = () => {
    onClose();
    setType("");
    setError();
    setDisable(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);
    axios
      .post(`${BASE_URL}/add-property-type`, { type: type }, config)
      .then((res) => {
        onCallApi();
        handleClose();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => {
        setDisable(false);
      });
  };

  return (
    <Modal title={"Add Property Type"} desc={"This property type will be accessible for item owned by Tri-Oak Consulting Group"} show={showModal} onClose={handleClose}>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div>
          <label className="dark-H head-4 mb-2 required:*:">
            Property Type
            <span className="red-D">*</span>
          </label>
          <input
            className="body-N capitalize"
            name="type"
            type="text"
            placeholder="enter here....."
            value={type}
            onChange={(e) => {
              setError();
              const onlyAlphabets = e.target.value.replace(/[^a-zA-Z ]/g, "");
              setType(onlyAlphabets);
            }}
          />
          {error?.type && <span className="body-S red-D">{error?.type}</span>}
        </div>

        <div className="mt-8">
          <button type="submit" disabled={disable || type === ""} className="save-button light-L head-5 green-bg-H">
            Add
          </button>
          <button type="button" onClick={handleClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPropertyTypeModal;
