import React, { useEffect, useState } from "react";
import Select from "react-select";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { BASE_URL } from "../../../utils/Element";
import { NotificationManager } from "react-notifications";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import SearchDropdown from "../../../components/Dropdowns/SearchDropdown";

const AddExclusiveData = ({ showModal, formData, disable, error, onSetFormData, onSetError, handleSubmit, handleClose }) => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const [listOptions, setListOptions] = useState([]);
  const [propertyOptions, setPropertyOptions] = useState([]);

  const handleChange = (value, name) => {
    onSetError({ ...error, [name]: "" });
    onSetFormData({ ...formData, [name]: value });
  };

  const handleClientTypeChange = (value) => {
    onSetError({ ...error, client_type: "" });
    onSetFormData({ ...formData, client_type: value, client_id: "", client_name: "", property_id: "" });
  };

  const fetchSuggestions = (inputValue) => {
    if (inputValue !== "") {
      axios
        .get(`${BASE_URL}/get-datalisting?list=${formData?.client_type === "contact" ? "contacts" : "companies"}&search=${inputValue}`, config)
        .then((res) => {
          const data = res?.data?.data;
          const contactOptions = data?.contact_list?.map((el) => ({ value: el?.id, label: `${el?.first_name} ${el?.last_name}` }));
          const companyOptions = data?.company_list?.map((el) => ({ value: el?.id, label: el?.company_name }));
          const options = formData?.client_type === "contact" ? contactOptions : companyOptions;
          setListOptions(options);
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    } else {
      setListOptions([]);
    }
  };

  const fetchProperties = () => {
    const url = formData?.client_type === "contact" ? `get-ContactData/${formData?.client_id}` : `get-property/${formData?.client_id}`;
    axios
      .get(`${BASE_URL}/${url}`, config)
      .then((res) => {
        if (formData?.client_type === "contact") {
          const data = res?.data?.data;
          const properties = data?.properties;
          const propertyOptions = properties?.map((el) => ({ value: el?.id, label: el?.property_name, desc: `${el.street_address}, ${el.city}, ${el.state}` }));
          setPropertyOptions(propertyOptions);
        } else {
          const data = res?.data?.property;
          const propertyOptions = data?.map((el) => ({ value: el?.id, label: el?.property_name, desc: `${el.street_address}, ${el.city}, ${el.state}` }));
          setPropertyOptions(propertyOptions);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (showModal && formData?.client_id !== "") {
      fetchProperties();
    }
  }, [showModal, formData?.client_type, formData?.client_id]);

  const formatOptionLabel = ({ value, label, minPrice, maxPrice, desc }) => (
    <div>
      <div>{label}</div>
      {desc && <p className="dark-M">{desc}</p>}
      {(minPrice || maxPrice) && (
        <div className="flex gap-2 dark-M">
          {minPrice && <div>Min Price-{minPrice}</div>}/{maxPrice && <div>Max Price-{maxPrice}</div>}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <RadioGroup
        onChange={(value) => {
          handleClientTypeChange(value);
          setListOptions([]);
        }}
        value={formData?.client_type}
      >
        <Stack direction="row" gap={5}>
          <Radio value="contact">Contact</Radio>
          <Radio value="company">Company</Radio>
        </Stack>
      </RadioGroup>

      <div className="mt-3 flex-1">
        <SearchDropdown
          isTop={false}
          placeholder={`search ${formData?.client_type} here`}
          text={formData?.client_name}
          options={listOptions}
          fetchSuggestions={fetchSuggestions}
          onSetOptions={(value) => setListOptions(value)}
          handleSelect={(option) => {
            onSetError({ ...error, client_id: "" });
            onSetFormData({ ...formData, client_name: option?.label, client_id: option?.value });
            setListOptions([]);
          }}
        />
        {error?.client_id && <span className="body-S red-D">{error?.client_id}</span>}
      </div>

      {formData?.client_id !== "" && (
        <div className="mt-6">
          <label className="dark-H head-4">
            Property Name<span className="red-D">*</span>
          </label>
          <div className="mt-1.5">
            <Select
              className="body-N"
              options={propertyOptions}
              formatOptionLabel={formatOptionLabel}
              placeholder={"Select property"}
              value={propertyOptions?.find((option) => option.value === formData?.property_id)}
              onChange={(option) => {
                handleChange(option.value, "property_id");
              }}
            />
          </div>

          {propertyOptions.length === 0 && formData.client_id !== "" && (
            <p className="body-S red-D">
              No property found under this {formData?.client_type}.{" "}
              <span role="button" className="underline green-H" onClick={() => navigate(`/${formData?.client_type}/${formData?.contact}`)}>
                Click here to add
              </span>
            </p>
          )}
          {error?.client_id && <span className="body-S red-D">{error?.client_id}</span>}
        </div>
      )}

      <div className="mt-6">
        <label className="dark-H head-4 mb-2 required:*:">
          Initial Date<span className="red-D">*</span>
        </label>
        <input
          className="body-N"
          name="contact"
          type="date"
          placeholder="write here"
          max={moment().format("YYYY-MM-DD")}
          value={formData?.initial_list_date}
          onChange={(e) => {
            handleChange(e.target.value, "initial_list_date");
          }}
        />
        {error?.initial_list_date && <span className="body-S red-D">{error?.initial_list_date}</span>}
      </div>

      <div className="mt-6">
        <label className="dark-H head-4 mb-2 required:*:">
          Current List<span className="red-D">*</span>
        </label>
        <input
          className="body-N"
          name="contact"
          type="date"
          placeholder="write here"
          value={formData?.current_list_date}
          onChange={(e) => {
            handleChange(e.target.value, "current_list_date");
          }}
        />
        {error?.current_list_date && <span className="body-S red-D">{error?.current_list_date}</span>}
      </div>

      <div className="mt-6">
        <label className="dark-H head-4 mb-2 required:*:">
          List Expiration Date<span className="red-D">*</span>
        </label>
        <input
          className="body-N"
          name="contact"
          type="date"
          placeholder="write here"
          value={formData?.expiration_date}
          onChange={(e) => {
            handleChange(e.target.value, "expiration_date");
          }}
        />
        {error?.expiration_date && <span className="body-S red-D">{error?.expiration_date}</span>}
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

export default AddExclusiveData;
