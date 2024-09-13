import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import Modal from "../../components/Modal/Modal";
import AddAcquisitionData from "./components/AddAcquisitionData";
import Loader from "../../components/Loader";

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

const EditBuyersModal = ({ showModal, onClose, onCallApi, id }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [acquisitionData, setAcquisitionsData] = useState(initialData);

  const handleClose = () => {
    onClose();
    setError();
    setAcquisitionsData(initialData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      property_type_ids: acquisitionData?.propertyType,
      min_price: acquisitionData?.minPrice,
      max_price: acquisitionData?.maxPrice,
      min_asking_cap_rate: acquisitionData?.minAskingCapRate,
      min_lease_term_reamaining: acquisitionData?.minLeaseTermRemaining,
      landlord_responsibilities: acquisitionData?.landlordType,
      tenant_name: acquisitionData.tenantName,
      state: acquisitionData.state,
      criteria_update_date: acquisitionData.updateDate,
      comment: acquisitionData.comment,
      contact_id: acquisitionData.contactId,
      availability_status: acquisitionData?.availabilityStatus === "Off Market" ? 0 : 1,
      buyer_status: acquisitionData?.buyerStatus === "Pipeline" ? 0 : acquisitionData?.buyerStatus,
    };

    axios
      .post(`${BASE_URL}/acquisition-edit/${id}`, dataToSend, config)
      .then((res) => {
        handleClose();
        onCallApi();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(err.response.data.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const fetchDetails = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/acquisition-getbyid/${id}`, config)
      .then((res) => {
        const buyerData = res?.data?.data;
        setAcquisitionsData({
          minPrice: buyerData?.min_price,
          maxPrice: buyerData?.max_price,
          minAskingCapRate: buyerData?.min_asking_cap_rate,
          minLeaseTermRemaining: buyerData?.min_lease_term_reamaining,
          tenantName: buyerData?.tenant_details?.map((el) => el?.id),
          updateDate: buyerData?.criteria_update_date,
          comment: buyerData?.comment,
          contactId: buyerData?.contact?.id,
          state: buyerData?.state,
          propertyType: buyerData?.property_type?.map((el) => el?.id),
          landlordType: buyerData?.landlord_responsibilities,
          availabilityStatus: buyerData?.availability_status === 0 ? "Off Market" : "On Market",
          buyerStatus: buyerData?.buyer_status === 0 ? "Pipeline" : buyerData?.buyerStatus,
        });
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id && showModal) {
      fetchDetails();
    }
  }, [id, showModal]);

  return (
    <Modal title="Edit Acquisition Criteria" desc="Edit the Acquisition Criteria information." show={showModal} onClose={handleClose}>
      {loading ? (
        <Loader />
      ) : (
        <AddAcquisitionData
          from={"buyers"}
          error={error}
          acquisitionData={acquisitionData}
          onSetAcquisitionsData={(value) => {
            setAcquisitionsData(value);
          }}
          onSetError={(value) => setError(value)}
          onClose={handleClose}
          handleSubmit={handleSubmit}
          showModal={showModal}
          type="Edit"
        />
      )}
    </Modal>
  );
};

export default EditBuyersModal;
