import React, { useEffect, useState } from "react";
import Select from "react-select";
import useAuth from "../../../hooks/useAuth";
import { NotificationManager } from "react-notifications";
import { BASE_URL } from "../../../utils/Element";
import axios from "axios";

const AddUnderContractData = ({ showModal, formData, disable, error, onSetFormData, onSetError, handleSubmit, handleClose }) => {
  const [config] = useAuth();
  const [offerOptions, setOfferOptions] = useState([]);

  const handleChange = (value, name) => {
    onSetError({ ...error, [name]: "" });
    onSetFormData({ ...formData, [name]: value });
  };

  const fetchOffers = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=offer`, config)
      .then((res) => {
        const data = res?.data?.offer;
        const options = data?.map((el) => ({ value: el?.id, label: el?.lead?.link?.property_name }));
        setOfferOptions(options);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (showModal) {
      fetchOffers();
    }
  }, [showModal]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="dark-H head-4">
          Offer<span className="red-D">*</span>
        </label>
        <div className="mt-1.5">
          <Select
            className="body-N"
            options={offerOptions}
            placeholder={"Select"}
            value={offerOptions?.find((option) => option.value === formData?.offer_id)}
            onChange={(option) => {
              handleChange(option.value, "offer_id");
            }}
          />
        </div>
        {error?.offer_id && <span className="body-S red-D">{error?.offer_id}</span>}
      </div>

      <div className="mt-6">
        <label className="dark-H head-4 mb-2 required:*:">
          Contract Price<span className="red-D">*</span>
        </label>
        <input
          className="body-N"
          name="contact"
          type="number"
          placeholder="write here"
          value={formData?.contract_price}
          onChange={(e) => {
            handleChange(e.target.value, "contract_price");
          }}
          onWheel={(e) => e.target.blur()}
        />
        {error?.contract_price && <span className="body-S red-D">{error?.contract_price}</span>}
      </div>

      <div className="mt-6">
        <label className="dark-H head-4 mb-2 required:*:">
          Gross Comission to Company<span className="red-D">*</span>
        </label>
        <input
          className="body-N"
          name="contact"
          type="number"
          placeholder="write here"
          value={formData?.gross_commission_company}
          onChange={(e) => {
            handleChange(e.target.value, "gross_commission_company");
          }}
          onWheel={(e) => e.target.blur()}
        />
        {error?.gross_commission_company && <span className="body-S red-D">{error?.gross_commission_company}</span>}
      </div>

      <div className="mt-6">
        <label className="dark-H head-4 mb-2 required:*:">
          Gross Comission to Agent<span className="red-D">*</span>
        </label>
        <input
          className="body-N"
          name="contact"
          type="number"
          placeholder="write here"
          value={formData?.gross_commission_agent}
          onChange={(e) => {
            handleChange(e.target.value, "gross_commission_agent");
          }}
          onWheel={(e) => e.target.blur()}
        />
        {error?.gross_commission_agent && <span className="body-S red-D">{error?.gross_commission_agent}</span>}
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

export default AddUnderContractData;
