import React, { useEffect, useState } from "react";
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

const EditPropertyHistoryModal = ({ showModal, onClose, selectedPropertyHistory, onPropertyHistoryAdded }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (selectedPropertyHistory) {
      setFormData({
        sold_date: selectedPropertyHistory?.sold_date || "",
        sold_price: selectedPropertyHistory?.sold_price || "",
      });
    }
  }, [selectedPropertyHistory]);

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
    };
    axios
      .post(`${BASE_URL}/property-history-edit/${selectedPropertyHistory?.id}`, dataToSend, config)
      .then(() => {
        handleCancel();
        onPropertyHistoryAdded();
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const clearError = (field) => {
    setError((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <Modal title={"Edit Property Value"} desc={"Edit historical values of this property"} show={showModal} onClose={handleCancel}>
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

export default EditPropertyHistoryModal;
