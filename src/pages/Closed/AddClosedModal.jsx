import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";
import AddClosedData from "./components/AddClosedData";
import { BASE_URL } from "../../utils/Element";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { NotificationManager } from "react-notifications";

const initialData = {
  under_contract_id: "",
};

const AddClosedModal = ({ showModal, onClose, onCallApi }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const [disable, setDisable] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleClose = () => {
    setFormData(initialData);
    onClose();
    setError();
    setDisable(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);
    axios
      .post(`${BASE_URL}/mark-contract/${formData?.under_contract_id}`, { mark_contract: true }, config)
      .then((res) => {
        handleClose();
        onCallApi();
      })
      .catch((err) => {
        setDisable(false);
        setError(err.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <Modal title={`Add Closed`} desc={`Add the contract closed information.`} show={showModal} onClose={handleClose}>
      <AddClosedData
        formData={formData}
        error={error}
        onSetFormData={(value) => {
          setFormData(value);
        }}
        onSetError={(value) => setError(value)}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
        showModal={showModal}
        disable={disable}
      />
    </Modal>
  );
};

export default AddClosedModal;
