import React, { useEffect, useState } from "react";
import Select from "react-select";
import useAuth from "../../../hooks/useAuth";
import { NotificationManager } from "react-notifications";
import { BASE_URL } from "../../../utils/Element";
import axios from "axios";

const AddClosedData = ({ showModal, formData, disable, error, onSetFormData, onSetError, handleSubmit, handleClose }) => {
  const [config] = useAuth();
  const [underContractOptions, setUnderContractOptions] = useState([]);

  const handleChange = (value, name) => {
    onSetError({ ...error, [name]: "" });
    onSetFormData({ ...formData, [name]: value });
  };

  const fetchUnderContract = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=contract`, config)
      .then((res) => {
        const data = res?.data?.data?.contract;
        const options = data?.map((el) => ({ value: el?.id, label: el?.offer?.lead?.link?.property_name }));
        setUnderContractOptions(options);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (showModal) {
      fetchUnderContract();
    }
  }, [showModal]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="dark-H head-4">
          Under Contract<span className="red-D">*</span>
        </label>
        <div className="mt-1.5">
          <Select
            className="body-N"
            options={underContractOptions}
            placeholder={"Select"}
            value={underContractOptions?.find((option) => option.value === formData?.under_contract_id)}
            onChange={(option) => {
              handleChange(option.value, "under_contract_id");
            }}
          />
        </div>
        {error?.under_contract_id && <span className="body-S red-D">{error?.under_contract_id}</span>}
      </div>

      <div className="mt-6">
        <button type="submit" disabled={disable} className="save-button light-L head-5 green-bg-H">
          Save
        </button>
        <button type="button" onClick={handleClose} className="green-H ml-5">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddClosedData;
