import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import dollor from "../../../assets/icons/dollar.svg";
import { NotificationManager } from "react-notifications";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import percentage from "../../../assets/icons/percentage.svg";
import InputWithIcon from "../../../components/InputWithIcon";
import SearchDropdown from "../../../components/Dropdowns/SearchDropdown";

const AddOfferData = ({ showModal, formData, disable, error, onSetFormData, onSetError, handleSubmit, handleClose, from }) => {
  const [config] = useAuth();
  const [listOptions, setListOptions] = useState([]);
  const [selectedOptionData, setSelectedOptionData] = useState();

  const handleChange = (value, name) => {
    onSetError({ ...error, [name]: "" });
    onSetFormData({ ...formData, [name]: value });
  };

  const handleLeadTypeChange = (value) => {
    onSetError({ ...error, list_type: "" });
    onSetFormData({ ...formData, list_type: value, type_id: "" });
  };

  const handleUserTypeChange = (value) => {
    onSetError({ ...error, type: "" });
    onSetFormData({ ...formData, user_type: value });
  };

  const fetchSuggestions = (inputValue) => {
    if (inputValue !== "") {
      axios
        .get(`${BASE_URL}/get-datalisting?list=${formData?.list_type === "exclusive" ? "exclusive" : "leads"}&search=${inputValue}`, config)
        .then((res) => {
          const data = res?.data?.data;
          const exclusiveOptions = data?.exclusive?.map((el) => ({ value: el?.id, label: el?.property?.property_name, noi: el?.property?.anual_rent, asking_cap_rate: el?.property?.asking_cap_rate, asking_price: el?.property?.asking_price }));
          const proposalOptions = data?.proposals?.map((el) => ({ value: el?.id, label: el?.link?.property_name, noi: el?.link?.anual_rent, asking_cap_rate: el?.link?.asking_cap_rate, asking_price: el?.link?.asking_price }));
          const leadOptions = data?.leads?.map((el) => ({ value: el?.id, label: el?.link?.property_name, noi: el?.link?.anual_rent, asking_cap_rate: el?.link?.asking_cap_rate, asking_price: el?.link?.asking_price }));
          const options = formData?.list_type === "exclusive" ? exclusiveOptions : leadOptions;
          setListOptions(options);
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    } else {
      setListOptions([]);
      setSelectedOptionData();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {from !== "update" && (
        <div className="mb-6">
          <div>
            <label className="dark-H head-4 ">
              From<span className="red-D">*</span>
            </label>
            <div className="mt-2">
              <RadioGroup
                onChange={(value) => {
                  handleLeadTypeChange(value);
                }}
                value={formData?.list_type}
              >
                <Stack direction="row" gap={5}>
                  <Radio value="exclusive">Exclusive</Radio>
                  <Radio value="lead">Lead</Radio>
                </Stack>
              </RadioGroup>
              {error?.list_type && <span className="body-S red-D">{error?.list_type}</span>}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex-1">
              <SearchDropdown
                isTop={false}
                placeholder={`search ${formData?.list_type} here`}
                text={formData?.property_name}
                options={listOptions}
                fetchSuggestions={fetchSuggestions}
                onSetOptions={(value) => setListOptions(value)}
                handleSelect={(option) => {
                  onSetError({ ...error, type_id: "" });
                  onSetFormData({ ...formData, property_name: option?.label, type_id: option?.value, asking_price: option?.asking_price });
                  setSelectedOptionData(option);
                  setListOptions([]);
                }}
              />
            </div>

            {formData?.type_id !== "" && (
              <div className="flex justify-between items-center head-6 dark-H mt-1">
                <p>
                  NOI: <span className="body-S">{selectedOptionData?.noi ? `$ ${selectedOptionData?.noi?.toLocaleString()}` : "N/A"}</span>
                </p>
                <p>
                  Asking Cap Rate: <span className="body-S">{selectedOptionData?.asking_cap_rate ? `${selectedOptionData?.asking_cap_rate?.toLocaleString()} %` : "N/A"}</span>
                </p>
                <p>
                  Asking Price: <span className="body-S">{selectedOptionData?.asking_price ? `$ ${selectedOptionData?.asking_price?.toLocaleString()}` : "N/A"}</span>
                </p>
              </div>
            )}
            {error?.type_id && <span className="body-S red-D">{error?.type_id}</span>}
          </div>
        </div>
      )}

      <div className=" flex gap-4">
        <div>
          <label className="dark-H head-4 mb-2 ">
            Offer Cap Rate<span className="red-D">*</span>
          </label>
          <InputWithIcon
            icon={percentage}
            type="number"
            maxLength={3}
            placeholder="Offer Cap Rate"
            value={formData?.offer_cap_rate}
            onChange={(e) => {
              if (e.target.value > 100) {
                return;
              } else {
                handleChange(e.target.value, "offer_cap_rate");
              }
            }}
            onWheel={(e) => e.target.blur()}
          />

          {error?.offer_cap_rate && <span className="body-S red-D">{error?.offer_cap_rate}</span>}
        </div>

        <div>
          <label className="dark-H head-4 mb-2 ">
            Offer Price<span className="red-D">*</span>
          </label>

          <InputWithIcon
            icon={dollor}
            type="number"
            placeholder="Offer Price"
            value={formData?.offer_price}
            onChange={(e) => {
              handleChange(e.target.value, "offer_price");
            }}
            onWheel={(e) => e.target.blur()}
          />

          {error?.offer_price && <span className="body-S red-D">{error?.offer_price}</span>}
        </div>
      </div>

      <div className="mt-6">
        <label className="dark-H head-4">
          Offer from<span className="red-D">*</span>
        </label>
        <div className="mt-2">
          <RadioGroup
            onChange={(value) => {
              handleUserTypeChange(value);
            }}
            value={formData?.user_type}
          >
            <Stack direction="row" gap={5}>
              <Radio value="buyer">Buyer</Radio>
              <Radio value="seller">Seller</Radio>
            </Stack>
          </RadioGroup>

          {error?.type && <span className="body-S red-D">{error?.type}</span>}
        </div>
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

export default AddOfferData;
