import React, { useEffect, useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import axios from "axios";
import { BASE_URL } from "../../../../utils/Element";
import useAuth from "../../../../hooks/useAuth";
import { NotificationManager } from "react-notifications";

const EditTenantModal = ({ showModal, onClose, id, onCallApi, name }) => {
  const [config] = useAuth();
  const [tenantName, setTenantName] = useState("");
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState();

  const handleClose = () => {
    onClose();
    setTenantName("");
    setError();
    setDisable(false);
  };

  useEffect(() => {
    setTenantName(name);
  }, [name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);
    axios
      .post(`${BASE_URL}/update-Tenant/${id}`, { tenant_name: tenantName }, config)
      .then((res) => {
        onCallApi();
        handleClose();
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
      })
      .finally(() => {
        setDisable(false);
      });
  };

  return (
    <Modal title={"Edit Tenant"} desc={"Edit information of tenant."} show={showModal} onClose={onClose}>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div>
          <label className="dark-H head-4 mb-2 required:*:">
            Tenant Name
            <span className="red-D">*</span>
          </label>
          <input
            className="body-N capitalize"
            name="tenantName"
            type="text"
            placeholder="enter name here....."
            value={tenantName}
            onChange={(e) => {
              setError();
              const onlyAlphabets = e.target.value.replace(/[^a-zA-Z ]/g, "");
              setTenantName(onlyAlphabets);
            }}
          />
          {error?.tenant_name && <span className="body-S red-D">{error?.tenant_name}</span>}
        </div>

        <div className="mt-8">
          <button type="submit" disabled={disable || tenantName === ""} className="save-button light-L head-5 green-bg-H">
            Edit
          </button>
          <button type="button" onClick={handleClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTenantModal;
