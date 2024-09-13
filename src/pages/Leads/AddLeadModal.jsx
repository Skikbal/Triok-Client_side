import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";
import AddLeadData from "./components/AddLeadData";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { BASE_URL } from "../../utils/Element";
import { NotificationManager } from "react-notifications";

const initialData = {
  bds: "",
  broker: "",
  lead_source: "",
  contact: "",
  lead_type: "",
  link: "",
  contact_name: "",
};

// sell=0, buy=1

const AddLeadModal = ({ showModal, onClose, from, onCallApi }) => {
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
    const dataToSend = {
      bds: formData.bds,
      broker: formData.broker,
      lead_source_id: formData.lead_source,
      contact_id: formData.contact,
      link_id: formData.link,
      lead_type: formData?.lead_type === "acquisition" ? 1 : 0,
      type: from === "lead" ? 0 : 1,
    };

    axios
      .post(`${BASE_URL}/add-lead`, dataToSend, config)
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
    <Modal title={`Add ${from}`} desc={`Add the ${from} information.`} show={showModal} onClose={handleClose}>
      <AddLeadData
        formData={formData}
        error={error}
        onSetFormData={(value) => {
          setFormData(value);
        }}
        onSetError={(value) => setError(value)}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
        showModal={showModal}
        from={from}
        disable={disable}
      />
    </Modal>
  );
};

export default AddLeadModal;
