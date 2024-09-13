import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { BASE_URL } from "../../../utils/Element";
import InputWithIcon from "../../../components/InputWithIcon";
import percentage from "../../../assets/icons/percentage.svg";
import { landlordOptions, stateOptions } from "../../../utils/options";
import AddTenantModal from "../../Settings/modals/TenantModals/AddTenantModal";
import MultiSelectDropdown from "../../../components/Dropdowns/MultiSelectDropdown";
import MultipleInputField from "../../../components/AddDataComponents/MultipleInputField";

const availabilityStatusOptions = [
  { label: "Off Market", value: "Off Market" },
  { label: "On Market", value: "On Market" },
];

const buyerStatusOptions = [{ label: "Pipeline", value: "Pipeline" }];

const AddAcquisitionData = ({ showModal, from, type, error, acquisitionData, onSetAcquisitionsData, handleSubmit, onClose, onSetError }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const [loading, setLoading] = useState(true);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [contactOptions, setContactData] = useState([]);
  const [tenantOptions, setTenantOptions] = useState([]);
  const [propertiesOptions, setPropertiesOptions] = useState([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  const [input, setInput] = useState(acquisitionData?.tenantName ?? "");

  const fetchTenants = () => {
    // setLoading(true);
    axios
      .get(`${BASE_URL}/get-datalisting?list=tenant`, config)
      .then((res) => {
        const value = res?.data?.data?.tenant;
        setTenantOptions(value?.map((el) => ({ value: el?.id, label: el?.tenant_name })));
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchPropertyTypes = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/get-datalisting?list=property_types`, config)
      .then((res) => {
        const value = res?.data?.data?.property_types;
        setPropertyTypeOptions(value?.map((el) => ({ value: el?.id, label: el?.type })));
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchContactData = () => {
    setLoading(true);
    const url = from === "company" ? `get-datalisting?list=contacts&company_id=${id}` : `get-datalisting?list=contacts`;
    axios
      .get(`${BASE_URL}/${url}`, config)
      .then((res) => {
        const contact = res?.data?.data?.contact_list;
        const contactOptions = contact?.map((el) => ({ label: `${el?.first_name} ${el?.last_name}`, value: el?.id }));
        setContactData(contactOptions);
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
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
      fetchPropertyTypes();
      fetchContactData();
      fetchTenants();
    }
  }, [showModal]);

  useEffect(() => {
    if (acquisitionData?.tenantName !== "") {
      setInput(acquisitionData?.tenantName);
    } else {
      setInput("");
    }
  }, [acquisitionData?.tenantName]);

  const fetchSuggestions = (inputValue) => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=properties&search=${inputValue}`, config)
      .then((res) => {
        const data = res?.data?.data;
        const propertyOptions = data?.properties?.map((el) => ({ value: el?.id, label: el?.property_name, desc: `${el.street_address}, ${el.city}, ${el.state}` }));
        setPropertiesOptions(propertyOptions);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onSetAcquisitionsData({ ...acquisitionData, [name]: value });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <form className="py-3" onSubmit={handleSubmit}>
          <div className="mb-6">
            <p className="head-4 dark-H mb-2">
              Availability Status<span className="red-D">*</span>
            </p>
            <Select
              isSearchable
              className="company-select body-N"
              options={availabilityStatusOptions}
              placeholder="Select Availability Status"
              value={availabilityStatusOptions?.find((el) => el.value === acquisitionData?.availabilityStatus)}
              onChange={(option) => {
                onSetError({ ...error, availability_status: "" });
                onSetAcquisitionsData({ ...acquisitionData, availabilityStatus: option.value });
              }}
            />
            {error?.availability_status && <span className="body-S red-D">{error?.availability_status}</span>}
          </div>

          {/* <div className="mb-6">
            <p className="head-4 dark-H mb-2">
              Buyer Status<span className="red-D">*</span>
            </p>
            <Select
              isSearchable
              className="company-select"
              options={buyerStatusOptions}
              placeholder="Select Buyer Status"
              value={buyerStatusOptions?.find((el) => el.value === acquisitionData?.buyerStatus)}
              onChange={(option) => {
                onSetError({ ...error, buyer_status: "" });
                onSetAcquisitionsData({ ...acquisitionData, buyerStatus: option.value });
              }}
            />
            {error?.buyer_status && <span className="body-S red-D">{error?.buyer_status}</span>}
          </div> */}

          {from !== "contact" && (
            <div className="mb-6">
              <p className="head-4 dark-H mb-2">
                Contact Name<span className="red-D">*</span>
              </p>
              <Select
                isSearchable
                className="company-select body-N"
                options={contactOptions}
                placeholder="Select Contact"
                value={contactOptions?.find((el) => el.value === acquisitionData?.contactId)}
                onChange={(option) => {
                  onSetError({ ...error, contact_id: "" });
                  onSetAcquisitionsData({ ...acquisitionData, contactId: option.value });
                }}
              />
              {error?.contact_id && <span className="body-S red-D">{error?.contact_id}</span>}
            </div>
          )}

          <MultiSelectDropdown
            label="Property Type"
            placeholder="select property type"
            options={propertyTypeOptions}
            selectOptions={acquisitionData?.propertyType}
            onSetSelectOptions={(value) => {
              onSetError({ ...error, property_type_ids: "" });
              onSetAcquisitionsData({ ...acquisitionData, propertyType: value });
            }}
          />
          {error?.property_type_ids && <span className="body-S red-D">{error?.property_type_ids}</span>}

          <div className="mt-6">
            <label className="dark-H head-4 mb-2">
              Price Range<span className="red-D">*</span>
            </label>
            <div className="flex">
              <input
                className="body-N"
                type="number"
                min="0"
                placeholder="min price"
                name="minPrice"
                value={acquisitionData.minPrice}
                onChange={(e) => {
                  onSetError({ ...error, min_price: "" });
                  handleChange(e);
                }}
                onWheel={(e) => e.target.blur()}
              />
              <input
                className="body-N"
                type="number"
                min="0"
                placeholder="max price"
                name="maxPrice"
                value={acquisitionData.maxPrice}
                onChange={(e) => {
                  onSetError({ ...error, max_price: "" });
                  handleChange(e);
                }}
                onWheel={(e) => e.target.blur()}
              />
            </div>
            <div className="flex justify-between">
              {error?.min_price && <span className="body-S red-D">{error?.min_price}</span>}

              {error?.max_price && <span className="body-S red-D">{error?.max_price}</span>}
            </div>
          </div>

          <div className="mt-6 ">
            <label className="dark-H head-4 mb-2">
              Minimum Asking Cap Rate<span className="red-D">*</span>
            </label>
            <InputWithIcon
              icon={percentage}
              type="number"
              min="0"
              placeholder="min asking cap rate"
              name="minAskingCapRate"
              value={acquisitionData.minAskingCapRate}
              onChange={(e) => {
                onSetError({ ...error, min_asking_cap_rate: "" });
                if (e.target.value > 100) {
                  return;
                } else {
                  handleChange(e);
                }
              }}
              onWheel={(e) => e.target.blur()}
            />
            {error?.min_asking_cap_rate && <span className="body-S red-D">{error?.min_asking_cap_rate}</span>}
          </div>

          <div className="mt-6">
            <label className="dark-H head-4 mb-2">
              Minimum Lease Term Remaining<span className="red-D">*</span>
            </label>
            <input
              className="body-N"
              type="number"
              placeholder="min lease term remaining"
              name="minLeaseTermRemaining"
              value={acquisitionData.minLeaseTermRemaining}
              onChange={(e) => {
                onSetError({ ...error, min_lease_term_reamaining: "" });
                handleChange(e);
              }}
              onWheel={(e) => e.target.blur()}
            />
            {error?.min_lease_term_reamaining && <span className="body-S red-D">{error?.min_lease_term_reamaining}</span>}
          </div>

          <div className="mt-6">
            <MultiSelectDropdown
              label="Landlord Responsibility"
              placeholder="select landlord responsibilities"
              options={landlordOptions}
              selectOptions={acquisitionData?.landlordType}
              onSetSelectOptions={(value) => {
                onSetError({ ...error, landlord_responsibilities: "" });
                onSetAcquisitionsData({ ...acquisitionData, landlordType: value });
              }}
            />
            {error?.landlord_responsibilities && <span className="body-S red-D">{error?.landlord_responsibilities}</span>}
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center">
              <label className="dark-H head-4">Tenant Name</label>
              <button
                type="button"
                className="green-H body-N underline"
                onClick={() => {
                  setShowAddTenantModal(true);
                }}
              >
                +Add New Tenant
              </button>
            </div>

            <div className="mt-2">
              <Select
                isMulti
                className="service-area"
                placeholder="select tenant"
                options={tenantOptions}
                value={tenantOptions?.filter((el) => acquisitionData?.tenantName?.includes(el.value))}
                onChange={(options) => {
                  const values = options?.map((el) => el?.value);
                  onSetError({ ...error, state: "" });
                  onSetAcquisitionsData({ ...acquisitionData, tenantName: values });
                }}
              />
            </div>
            {error?.tenant_name && <span className="body-S red-D">{error?.tenant_name}</span>}
          </div>

          <div className="mt-6">
            <p className="head-4 dark-H mb-2 ">
              State<span className="red-D">*</span>
            </p>

            <Select
              isMulti
              className="service-area"
              placeholder="select state"
              options={stateOptions}
              value={stateOptions?.filter((el) => acquisitionData?.state?.includes(el.value))}
              onChange={(options) => {
                const values = options?.map((el) => el?.value);
                onSetError({ ...error, state: "" });
                if (values?.[values?.length - 1] === "Nationwide") {
                  onSetAcquisitionsData({ ...acquisitionData, state: ["Nationwide"] });
                } else {
                  onSetAcquisitionsData({ ...acquisitionData, state: values?.filter((el) => el !== "Nationwide") });
                }
              }}
            />
            {error?.state && <span className="body-S red-D">{error?.state}</span>}
          </div>

          {/* <div className="mt-6">
            <label className="dark-H head-4 mb-2">
              Acquisition Criteria Update Date<span className="red-D">*</span>
            </label>
            <input
              className="body-N"
              type="date"
              placeholder="acquisition criteria update date"
              name="updateDate"
              value={acquisitionData.updateDate}
              onChange={(e) => {
                onSetError({ ...error, criteria_update_date: "" });
                handleChange(e);
              }}
            />
            {error?.criteria_update_date && <span className="body-S red-D">{error?.criteria_update_date}</span>}
          </div> */}

          <div className="flex-1 mt-6">
            <p className="head-4 dark-H">
              Comments <span className="body-S dar-M">(optional)</span>
            </p>
            <textarea
              rows={4}
              placeholder="write contact description"
              className="mt-2 w-full body-N"
              name="comment"
              value={acquisitionData.comment}
              onChange={(e) => {
                onSetError({ ...error, comment: "" });
                handleChange(e);
              }}
            />
          </div>

          <div className="mt-6">
            <button type="submit" className="save-button light-L head-5 green-bg-H">
              {type} Acquisition Criteria
            </button>
            <button type="button" onClick={onClose} className="green-H ml-5">
              Cancel
            </button>
          </div>
        </form>
      )}

      <AddTenantModal showModal={showAddTenantModal} onClose={() => setShowAddTenantModal(false)} onCallApi={fetchTenants} />
    </>
  );
};

export default AddAcquisitionData;
