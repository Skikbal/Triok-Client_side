import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import AddUnderContractData from "./components/AddUnderContractData";
import Loader from "../../components/Loader";
import useAuth from "../../hooks/useAuth";
import { NotificationManager } from "react-notifications";
import { BASE_URL } from "../../utils/Element";
import axios from "axios";

const initialData = {
  offer_id: "",
  contract_price: "",
  gross_commission_company: "",
  gross_commission_agent: "",
};

const EditUnderContractModal = ({ showModal, onClose, onCallApi, id }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleClose = () => {
    setFormData(initialData);
    onClose();
    setError();
    setDisable(false);
  };

  useEffect(() => {
    if (id && showModal) {
      setLoading(true);
      axios
        .get(`${BASE_URL}/contract-getby-Id/${id}`, config)
        .then((res) => {
          const data = res?.data?.contract;
          setFormData({
            offer_id: data?.offer_id,
            contract_price: data?.contract_price,
            gross_commission_company: data?.gross_commission_company,
            gross_commission_agent: data?.gross_commission_agent,
          });
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, showModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);
    const dataToSend = {
      offer_id: formData?.offer_id,
      contract_price: formData.contract_price?.toString(),
      gross_commission_company: formData.gross_commission_company?.toString(),
      gross_commission_agent: formData.gross_commission_agent?.toString(),
    };

    axios
      .put(`${BASE_URL}/update-contract/${id}`, dataToSend, config)
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
    <Modal title={`Edit Under Contract`} desc={`Edit the Under Contract information.`} show={showModal} onClose={handleClose}>
      {loading ? (
        <Loader />
      ) : (
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
      )}
    </Modal>
  );
};

export default EditUnderContractModal;
