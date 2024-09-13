import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import axios from "axios";
import Modal from "../../Modal/Modal";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import AddAcquisitionData from "../../../pages/Buyers/components/AddAcquisitionData";

const initialData = {
  minPrice: "",
  maxPrice: "",
  minAskingCapRate: "",
  minLeaseTermRemaining: "",
  updateDate: "",
  comment: "",
  contactId: "",
  state: [],
  propertyType: [],
  landlordType: [],
  tenantName: [],
  availabilityStatus: "",
  buyerStatus: "",
};

const AddAcquisitionModal = ({ showModal, onClose, from, fetchAcquisitions }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const [error, setError] = useState();
  const [acquisitionData, setAcquisitionsData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();

    const values = {
      property_type_ids: acquisitionData?.propertyType,
      min_price: acquisitionData?.minPrice,
      max_price: acquisitionData?.maxPrice,
      min_asking_cap_rate: acquisitionData?.minAskingCapRate,
      min_lease_term_reamaining: acquisitionData?.minLeaseTermRemaining,
      landlord_responsibilities: acquisitionData?.landlordType,
      tenant_name: acquisitionData.tenantName,
      state: acquisitionData.state,
      // criteria_update_date: acquisitionData.updateDate,
      comment: acquisitionData.comment,
      // availability_status: acquisitionData?.availabilityStatus === "Off Market" ? 0 : 1,
      availability_status: acquisitionData?.availabilityStatus === "Off Market" ? 0 : (acquisitionData?.availabilityStatus === "" ? "" : 1),
      buyer_status: acquisitionData?.buyerStatus === "Pipeline" ? 0 : acquisitionData?.buyerStatus,
    };

    const companyData = { ...values, company_id: id, contact_id: acquisitionData.contactId };

    const contactData = { ...values, contact_id: id };

    const dataToSend = from === "contact" ? contactData : companyData;

    axios
      .post(`${BASE_URL}/add-acquisition`, dataToSend, config)
      .then((res) => {
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
        handleClose();
        fetchAcquisitions();
      })
      .catch((err) => {
        setError(err.response.data.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleClose = () => {
    setAcquisitionsData(initialData);
    onClose();
    setError();
  };

  return (
    <Modal title="Add New Acquisition Criteria" desc="Add the Acquisition Criteria information." show={showModal} onClose={handleClose}>
      <AddAcquisitionData
        from={from}
        error={error}
        acquisitionData={acquisitionData}
        onSetAcquisitionsData={(value) => {
          setAcquisitionsData(value);
        }}
        onSetError={(value) => setError(value)}
        onClose={handleClose}
        handleSubmit={handleSubmit}
        showModal={showModal}
        type="Add"
      />
    </Modal>
  );
};

export default AddAcquisitionModal;
