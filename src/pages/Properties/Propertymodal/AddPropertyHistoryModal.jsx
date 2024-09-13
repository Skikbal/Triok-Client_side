import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import Modal from "../../../components/Modal/Modal";
import AddPropertyHistoryData from "../components/AddPropertyHistoryData";
import { NotificationManager } from "react-notifications";

const initialFormData = {
  sold_price: "",
  sold_date: "",
};

const AddPropertyHistoryModal = ({ showModal, onClose, onPropertyHistoryAdded }) => {
  const [config] = useAuth();
  const { id } = useParams();
  const [error, setError] = useState();
  const [formData, setFormData] = useState(initialFormData);

  const handleCancel = () => {
    onClose();
    setError();
    setFormData(initialFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      sold_price: formData?.sold_price,
      sold_date: formData?.sold_date,
      property_id: id,
    };
    axios
      .post(`${BASE_URL}/add-property-history`, dataToSend, config)
      .then(() => {
        onClose();
        handleCancel();
        onPropertyHistoryAdded();
      })
      .catch((err) => {
        setError(err?.response?.data?.errors || {});
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const clearError = (field) => {
    setError((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <Modal title={"Add Property Value"} desc={"Add the historical values of this property"} show={showModal} onClose={handleCancel}>
      <AddPropertyHistoryData
        formData={formData}
        error={error}
        onSetFormData={(value) => {
          setFormData(value);
        }}
        clearError={clearError}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </Modal>
  );
};

export default AddPropertyHistoryModal;
