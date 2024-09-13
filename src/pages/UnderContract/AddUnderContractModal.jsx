import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Modal from "../../components/Modal/Modal";
import AddUnderContractData from "./components/AddUnderContractData";
import { BASE_URL } from "../../utils/Element";

const initialData = {
  offer_id: "",
  contract_price: "",
  gross_commission_company: "",
  gross_commission_agent: "",
};

const AddUnderContractModal = ({ showModal, onClose, onCallApi }) => {
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
      offer_id: formData?.offer_id,
      contract_price: formData.contract_price,
      gross_commission_company: formData.gross_commission_company,
      gross_commission_agent: formData.gross_commission_agent,
    };

    axios
      .post(`${BASE_URL}/add-undercontract`, dataToSend, config)
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
    <Modal title={`Add Under Contract`} desc={`Add the Under Contract information.`} show={showModal} onClose={handleClose}>
      <AddUnderContractData
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

export default AddUnderContractModal;
