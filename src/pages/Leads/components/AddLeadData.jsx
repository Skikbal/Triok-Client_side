import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { BASE_URL } from "../../../utils/Element";
import { NotificationManager } from "react-notifications";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import SearchDropdown from "../../../components/Dropdowns/SearchDropdown";

const AddLeadData = ({ showModal, formData, disable, error, onSetFormData, onSetError, handleSubmit, handleClose, from }) => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const selectRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [bdsOptions, setBdsOptions] = useState([]);
  const [linkOptions, setLinkOptions] = useState([]);
  const [brokerOptions, setBrokerOptions] = useState([]);
  const [contactOptions, setContactOptions] = useState([]);
  const [leadSourceOptions, setLeadSourceOptions] = useState([]);

  const onSelectClear = () => {
    selectRef.current.clearValue();
  };

  const handleChange = (value, name) => {
    onSetError({ ...error, [name]: "" });
    onSetFormData({ ...formData, [name]: value });
  };

  const handleLeadTypeChange = (value) => {
    onSetError({ ...error, lead_type: "" });
    onSetFormData({ ...formData, lead_type: value, link: "" });
  };

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/get-datalisting?list=users`, config)
      .then((res) => {
        const data = res?.data?.data;
        const options = data?.map((el) => ({ value: el?.id, label: `${el?.first_name} ${el?.last_name}`, role: el?.role_id }));
        setBdsOptions(options);
        setBrokerOptions(options?.filter((el) => el.role === 3));
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchLeadSources = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/get-datalisting?list=lead_sources`, config)
      .then((res) => {
        const data = res?.data?.data;
        const options = data?.lead_sources?.map((el) => ({ value: el?.id, label: el.name }));
        setLeadSourceOptions(options);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchLinks = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/get-ContactData/${formData?.contact}`, config)
      .then((res) => {
        const data = res?.data?.data;
        const properties = data?.properties;
        const acquisitions = data?.acquisitions;
        const propertyOptions = properties?.map((el) => ({ value: el?.id, label: el?.property_name, desc: `${el.street_address}, ${el.city}, ${el.state}` }));
        const acquisitionOptions = acquisitions?.map((el) => ({ value: el?.id, label: el?.property_type?.[0]?.type, minPrice: el?.min_price, maxPrice: el?.max_price }));
        if (formData.lead_type === "acquisition") {
          setLinkOptions(acquisitionOptions);
        } else {
          setLinkOptions(propertyOptions);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (showModal) {
      if (formData?.contact !== "") {
        fetchLinks();
      }
    }
  }, [showModal, formData?.contact, formData?.lead_type]);

  useEffect(() => {
    if (showModal) {
      fetchUsers();
      fetchLeadSources();
    }
  }, [showModal]);

  const fetchSuggestions = (inputValue) => {
    if (inputValue !== "") {
      axios
        .get(`${BASE_URL}/get-datalisting?list=contacts&search=${inputValue}`, config)
        .then((res) => {
          const data = res?.data?.data;
          const contactOptions = data?.contact_list?.map((el) => ({ value: el?.id, label: `${el?.first_name} ${el?.last_name}` }));
          setContactOptions(contactOptions);
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    } else {
      setContactOptions([]);
    }
  };

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
    <>
      {/* {loading ? (
        <Loader />
      ) : ( */}
      <form onSubmit={handleSubmit}>
        <div>
          <label className="dark-H head-4 mb-2 required:*:">
            BDS<span className="red-D">*</span>
          </label>
          <Select
            ref={selectRef}
            className="body-N"
            options={bdsOptions}
            placeholder={"Select"}
            value={bdsOptions.find((option) => option?.value === formData.bds)}
            onChange={(option) => {
              handleChange(option?.value, "bds");
            }}
          />
        </div>

        <div className="mt-6">
          <label className="dark-H head-4 mb-2 required:*:">
            Broker<span className="red-D">*</span>
          </label>
          <Select
            ref={selectRef}
            className="body-N"
            options={brokerOptions}
            placeholder={"Select"}
            value={brokerOptions?.find((option) => option?.value === formData.broker)}
            onChange={(option) => {
              handleChange(option?.value, "broker");
            }}
          />
        </div>

        <div className="mt-6">
          <label className="dark-H head-4 mb-2 required:*:">
            Contact<span className="red-D">*</span>
          </label>
          <div className="flex-1">
            <SearchDropdown
              isTop={false}
              placeholder="search contact here"
              text={formData?.contact_name}
              options={contactOptions}
              fetchSuggestions={fetchSuggestions}
              onSetOptions={(value) => setContactOptions(value)}
              handleSelect={(option) => {
                onSetError({ ...error, contact_id: "" });
                onSetFormData({ ...formData, contact_name: option?.label, contact: option?.value });
                setContactOptions([]);
              }}
            />
          </div>
          {error?.contact_id && <span className="body-S red-D">{error?.contact_id}</span>}
        </div>

        {formData?.contact !== "" && (
          <>
            <div className="mt-6">
              <label className="dark-H head-4 required:*:">
                Lead Type<span className="red-D">*</span>
              </label>
              <div className="mt-2">
                <RadioGroup
                  onChange={(value) => {
                    handleLeadTypeChange(value);
                  }}
                  value={formData?.lead_type}
                >
                  <Stack direction="row" gap={5}>
                    <Radio value="disposition">Disposition</Radio>
                    <Radio value="acquisition">Acquisition</Radio>
                  </Stack>
                </RadioGroup>
                {error?.lead_type && <span className="body-S red-D">{error?.lead_type}</span>}
              </div>
            </div>

            {formData?.lead_type !== "" && (
              <div className="mt-6">
                <label className="dark-H head-4 mb-2 required:*:">
                  Link<span className="red-D">*</span>
                </label>
                <div className="mt-1.5">
                  <Select
                    className="body-N"
                    options={linkOptions}
                    formatOptionLabel={formatOptionLabel}
                    placeholder={"Select"}
                    value={linkOptions.find((option) => option.value === formData.link)}
                    onChange={(option) => {
                      onSetError({ ...error, link_id: "" });
                      handleChange(option.value, "link");
                    }}
                  />
                </div>

                {linkOptions?.length === 0 && (
                  <p className="body-S red-D">
                    No {formData?.lead_type === "disposition" ? "property" : "acquisition criteria"} found under this contact.{" "}
                    <span role="button" className="underline green-H" onClick={() => navigate(`/contact/${formData?.contact}`)}>
                      Click here to add
                    </span>
                  </p>
                )}
                {error?.link_id && <span className="body-S red-D">{error?.link_id}</span>}
              </div>
            )}
          </>
        )}

        <div className="mt-6">
          <label className="dark-H head-4 mb-2 required:*:">
            Lead Source<span className="red-D">*</span>
          </label>
          <div className="mt-1.5">
            <Select
              className="body-N"
              options={leadSourceOptions}
              placeholder={"Select"}
              value={leadSourceOptions?.find((option) => option.value === formData.lead_source)}
              onChange={(option) => {
                onSetError({ ...error, lead_source_id: "" });
                handleChange(option.value, "lead_source");
              }}
            />
          </div>
          {error?.lead_source_id && <span className="body-S red-D">{error?.lead_source_id}</span>}
        </div>

        <div className="mt-6">
          <button type="submit" disabled={disable} className="save-button light-L head-5 green-bg-H">
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectClear();
              handleClose();
            }}
            className="green-H ml-5"
          >
            Cancel
          </button>
        </div>
      </form>
      {/* )} */}
    </>
  );
};

export default AddLeadData;
