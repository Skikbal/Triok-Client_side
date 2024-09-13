import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { BASE_URL } from "../../utils/Element";
import Loader from "../../components/Loader";
import { NotificationManager } from "react-notifications";
import AddLeadData from "./components/AddLeadData";

const initialData = {
  bds: "",
  broker: "",
  lead_source: "",
  contact: "",
  lead_type: "",
  link: "",
  contact_name: "",
  status: 0,
};

const EditLeadModal = ({ showModal, onClose, id, from, onCallApi }) => {
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
        .get(`${BASE_URL}/getby-Id/${id}`, config)
        .then((res) => {
          const data = res?.data?.LeadsList;
          setFormData({
            bds: data?.bds,
            broker: data?.broker,
            lead_source: data?.lead_source_id,
            contact: data?.contact?.id,
            lead_type: data?.lead_type === 1 ? "acquisition" : "disposition",
            link: data?.link?.id,
            contact_name: `${data?.contact?.first_name} ${data?.contact?.last_name}`,
            status: data?.status,
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
      bds: formData.bds,
      broker: formData.broker,
      lead_source_id: formData.lead_source,
      contact_id: formData.contact,
      link_id: formData.link,
      lead_type: formData?.lead_type === "acquisition" ? 1 : 0,
      type: from === "lead" ? 0 : 1,
      status: formData?.status,
    };

    axios
      .put(`${BASE_URL}/update-lead/${id}`, dataToSend, config)
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
    <Modal title={`Edit ${from}`} desc={`Edit the ${from} information.`} show={showModal} onClose={handleClose}>
      {loading ? (
        <Loader />
      ) : (
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
        />
      )}
    </Modal>
  );
};

export default EditLeadModal;
