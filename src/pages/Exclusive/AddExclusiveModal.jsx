import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Modal from "../../components/Modal/Modal";
import AddExclusiveData from "./components/AddExclusiveData";
import { BASE_URL } from "../../utils/Element";

const initialData = {
  client_name: "",
  client_id: "",
  client_type: "contact",
  property_id: "",
  current_list_date: "",
  initial_list_date: "",
  expiration_date: "",
  gross_commission_company: "",
};

const AddExclusiveModal = ({ showModal, onClose, onCallApi }) => {
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
      property_id: formData?.property_id,
      contact_id: formData?.client_type === "contact" ? formData?.client_id : "",
      company_id: formData?.client_type === "company" ? formData?.client_id : "",
      gross_commission_company: formData?.gross_commission_company,
      current_list_date: formData?.current_list_date,
      initial_list_date: formData?.initial_list_date,
      expiration_date: formData?.expiration_date,
    };

    axios
      .post(`${BASE_URL}/add-exclusive`, dataToSend, config)
      .then((res) => {
        handleClose();
        onCallApi();
      })
      .catch((err) => {
        setError(err.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setDisable(false));
  };

  return (
    <Modal title={`Add Exclusive`} desc={`Add the offer information.`} show={showModal} onClose={handleClose}>
      <AddExclusiveData
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

export default AddExclusiveModal;
