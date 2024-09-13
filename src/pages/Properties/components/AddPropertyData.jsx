import React, { useEffect, useState } from "react";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { NotificationManager } from "react-notifications";
import Dropdown from "react-dropdown";
import Select from "react-select";
import moment from "moment";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import sqft from "../../../assets/icons/sq ft.svg";
import dollor from "../../../assets/icons/dollar.svg";
import { landlordOptions } from "../../../utils/options";
import InputWithIcon from "../../../components/InputWithIcon";
import percentage from "../../../assets/icons/percentage.svg";
import SearchDropdown from "../../../components/Dropdowns/SearchDropdown";

const AddPropertyData = ({ from, error, propertyInfo, handleSubmit, handleChange, handleClose, onSetFormData, clearError }) => {
  const [config] = useAuth();
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [propertyTagOptions, setPropertyTagOptions] = useState([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);

  const fetchPropertyTypes = () => {
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
      });
  };

  const fetchPropertyTags = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=property_tag`, config)
      .then((res) => {
        const value = res?.data?.data?.property_tag;
        setPropertyTagOptions(value?.map((el) => ({ value: el?.id, label: el?.tag_name })));
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    fetchPropertyTypes();
    fetchPropertyTags();
  }, []);

  const fetchSuggestions = (inputValue) => {
    const type = propertyInfo?.ownerType === "company" ? "companies" : "contacts";
    axios
      .get(`${BASE_URL}/get-datalisting?list=${type}&search=${inputValue}`, config)
      .then((res) => {
        const data = res.data;
        const options = propertyInfo?.ownerType === "company" ? data.data.company_list.map((company) => ({ value: company.id, label: company.company_name })) : data.data.contact_list.map((contact) => ({ value: contact.id, label: `${contact.first_name} ${contact.last_name}` }));
        setOwnerOptions(options);
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (propertyInfo.annualRent !== "" && propertyInfo.askingCapRate !== "") {
      const val = (propertyInfo.annualRent / propertyInfo.askingCapRate) * 100;
      handleChange(val?.toFixed(0), "askingPrice");
    }
  }, [propertyInfo.annualRent, propertyInfo.askingCapRate]);

  // useEffect(() => {
  //   if (propertyInfo.annualRent !== "" && propertyInfo.askingPrice !== "") {
  //     const val = (propertyInfo.annualRent / propertyInfo.askingPrice) * 100;
  //     handleChange(val?.toFixed(0), "askingCapRate");
  //   }
  // }, [propertyInfo.annualRent, propertyInfo.askingPrice]);

  return (
    <form className="contact-details light-bg-L h-screen overflow-y-auto hide-scrollbar" onSubmit={handleSubmit}>
      <p className="dark-M body-L">PROPERTY INFORMATION</p>
      <div className="md:flex gap-5 mt-6">
        <div className="w-[100%]">
          <label className="dark-H head-4 mb-2">
            Property Name<span className="red-D">*</span>
          </label>
          <input
            className="body-N capitalize"
            name="propertyName"
            type="text"
            placeholder="Write property name here"
            value={propertyInfo?.propertyName}
            onChange={(e) => {
              clearError("property_name");
              handleChange(e.target.value, "propertyName");
            }}
          />
          {error?.property_name && <p className="body-S red-D pt-1">{error?.property_name}</p>}
        </div>

        <div className="w-[100%] mt-6 md:mt-0">
          <label className="dark-H head-4 mb-2">
            Store #<span className="red-D">*</span>
          </label>
          <input
            className="body-N"
            type="text"
            name="storeNumber"
            placeholder="Write store number"
            value={propertyInfo.storeNumber}
            onChange={(e) => {
              clearError("store");
              handleChange(e.target.value, "storeNumber");
            }}
          />
          {error?.store && <p className="body-S red-D">{error?.store}</p>}
        </div>

        <div className="w-[100%] mt-6 md:mt-0">
          <label className="dark-H head-4">
            Property Type<span className="red-D">*</span>
          </label>
          <div className="mt-1.5">
            <Select
              className="body-N"
              // isMulti
              // className="service-area"
              options={propertyTypeOptions}
              placeholder={"Select property type"}
              value={propertyTypeOptions.find((option) => option.value === propertyInfo.propertyType)}
              // value={propertyTypeOptions?.filter((el) => propertyInfo.propertyType?.includes(el?.value))}
              onChange={(option) => {
                clearError("property_type");
                // const values = options?.map((el) => el.value);
                handleChange(option.value, "propertyType");
              }}
            />
          </div>
          {error?.property_type && <p className="body-S red-D">{error?.property_type}</p>}
        </div>
      </div>

      <div className="md:flex gap-5 mt-6">
        <div className="w-[100%]">
          <label className="dark-H head-4 mb-2">
            Street Address<span className="red-D">*</span>
          </label>
          <input
            className="body-N"
            name="streetAddress"
            type="text"
            placeholder="Street Address"
            value={propertyInfo.streetAddress}
            onChange={(e) => {
              clearError("street_address");
              handleChange(e.target.value, "streetAddress");
            }}
          />
          {error?.street_address && <p className="body-S red-D">{error?.street_address}</p>}
        </div>

        <div className="w-[65%] mt-6 md:mt-0">
          <label className="dark-H head-4 mb-2">
            City<span className="red-D">*</span>
          </label>
          <input
            className="body-N"
            type="text"
            placeholder="City"
            value={propertyInfo.city}
            onChange={(e) => {
              clearError("city");
              handleChange(e.target.value, "city");
            }}
          />
          {error?.city && <p className="body-S red-D pt-1">{error?.city}</p>}
        </div>

        <div className="w-[65%] mt-6 md:mt-0">
          <label className="dark-H head-4 mb-2">
            State<span className="red-D">*</span>
          </label>
          <input
            className="body-N"
            name="state"
            type="text"
            placeholder="State"
            value={propertyInfo.state}
            onChange={(e) => {
              clearError("state");
              handleChange(e.target.value, "state");
            }}
          />
          {error?.state && <p className="body-S red-D pt-1">{error?.state}</p>}
        </div>

        <div className="w-[65%] mt-6 md:mt-0">
          <label className="dark-H head-4 mb-2">
            Zipcode<span className="red-D">*</span>
          </label>
          <input
            className="body-N"
            name="zipcode"
            type="text"
            placeholder="Zipcode"
            value={propertyInfo.zipcode}
            maxLength={6}
            onChange={(e) => {
              clearError("zipcode");
              handleChange(e.target.value, "zipcode");
            }}
          />
          {error?.zipcode && <p className="body-S red-D pt-1">{error?.zipcode}</p>}
        </div>
      </div>

      <div className="md:flex gap-5 mt-6">
        <div className="w-[100%] mt-6 md:mt-0">
          <label className="dark-H head-4">
            Property Tag<span className="red-D">*</span>
          </label>
          <div className="mt-1.5">
            <Select
              className="body-N service-area"
              isMulti
              options={propertyTagOptions}
              placeholder={"Select property tag"}
              // value={propertyTypeOptions.find((option) => option.value === propertyInfo.propertyType)}
              value={propertyTagOptions?.filter((el) => propertyInfo.propertyTag?.includes(el?.value))}
              onChange={(options) => {
                clearError("propertytag_id");
                const values = options?.map((el) => el.value);
                handleChange(values, "propertyTag");
              }}
            />
          </div>
          {error?.property_type && <p className="body-S red-D">{error?.property_type}</p>}
        </div>

        <div className="w-[100%]">
          <label className="dark-H head-4 mb-2">Google Maps Link</label>
          <input
            className="body-N"
            name="googleMapsLink"
            type="text"
            placeholder="Link to property in Google Maps"
            value={propertyInfo.googleMapsLink}
            onChange={(e) => {
              clearError("google_map_link");
              handleChange(e.target.value, "googleMapsLink");
            }}
          />
          {error?.google_map_link && <p className="body-S red-D">{error?.google_map_link}</p>}
        </div>

        <div className="w-[100%] mt-6 md:mt-0">
          <label className="dark-H head-4 mb-2">RPR Link</label>
          <input
            className="body-N"
            name="rprLink"
            type="text"
            placeholder="Write property RPR link"
            value={propertyInfo.rprLink}
            onChange={(e) => {
              clearError("rpr_link");
              handleChange(e.target.value, "rprLink");
            }}
          />
          {error?.rpr_link && <p className="body-S red-D">{error?.rpr_link}</p>}
        </div>
      </div>

      <div className="md:flex gap-5 mt-6">
        <div className="mt-6 md:mt-0" style={{ width: "100%" }}>
          <label className="dark-H head-4 mb-2">Comments</label>
          <textarea
            rows={5}
            className="body-N"
            name="comment"
            type="text"
            placeholder="Write comments here..."
            value={propertyInfo.comment}
            onChange={(e) => {
              clearError("comment");
              handleChange(e.target.value, "comment");
            }}
          />
          {error?.comment && <p className="body-S red-D">{error?.comment}</p>}
        </div>
      </div>

      <hr className="my-8" />

      <p className="dark-M body-L">LEASE INFORMATION</p>

      <div className="mt-6 md:flex gap-5">
        <div className="md:w-[50%]">
          <p className="head-4 dark-H mb-2">Lease Type</p>
          <Dropdown
            className="company-select body-N"
            options={landlordOptions}
            placeholder="Select Option"
            value={landlordOptions.find((option) => option.value === propertyInfo.leaseType)}
            onChange={(option) => {
              clearError("lease_type");
              handleChange(option.value, "leaseType");
            }}
          />
          {error?.lease_type && <p className="body-S red-D">{error?.lease_type}</p>}
        </div>

        <div className="mt-6 md:mt-0">
          <label className="dark-H head-4 mb-2">Lease Commencement Date</label>
          <input
            className="body-N"
            type="date"
            value={propertyInfo.leaseCommencementDate}
            onChange={(e) => {
              clearError("lease_commencement_date");
              handleChange(e.target.value, "leaseCommencementDate");
            }}
          />
          {error?.lease_commencement_date && <p className="body-S red-D">{error?.lease_commencement_date}</p>}
        </div>

        <div className="mt-6 md:mt-0">
          <label className="dark-H head-4 mb-2">Lease Expiration Date</label>
          <input
            className="body-N"
            type="date"
            min={propertyInfo.leaseCommencementDate !== "" ? moment(propertyInfo.leaseCommencementDate).format("YYYY-MM-DD") : moment(propertyInfo.leaseCommencementDate).format("YYYY-MM-DD")}
            value={propertyInfo.leaseExpirationDate}
            onChange={(e) => {
              clearError("lease_expiration_date");
              handleChange(e.target.value, "leaseExpirationDate");
            }}
          />
          {error?.lease_expiration_date && <p className="body-S red-D">{error?.lease_expiration_date}</p>}
        </div>
      </div>

      <div className="mt-6 md:flex gap-5">
        <div className="w-[100%]">
          <label className="dark-H head-4 mb-2">Annual Rent/NOI</label>
          <InputWithIcon
            icon={dollor}
            type="text"
            placeholder="Annual rent"
            value={propertyInfo.annualRent}
            onChange={(e) => {
              clearError("anual_rent");
              handleChange(e.target.value, "annualRent");
            }}
          />
          {error?.anual_rent && <p className="body-S red-D">{error?.anual_rent}</p>}
        </div>

        <div className="w-[100%] mt-6 md:mt-0">
          <label className="dark-H head-4 mb-2">Asking Cap Rate</label>
          <InputWithIcon
            icon={percentage}
            type="text"
            maxLength={3}
            placeholder="Asking cap rate"
            value={propertyInfo.askingCapRate}
            onChange={(e) => {
              clearError("asking_cap_rate");
              if (e.target.value > 100) {
                return;
              } else {
                handleChange(e.target.value, "askingCapRate");
              }
            }}
          />
          {error?.asking_cap_rate && <p className="body-S red-D">{error?.asking_cap_rate}</p>}
        </div>

        <div className="w-[100%] mt-6 md:mt-0">
          <label className="dark-H head-4 mb-2">Asking Price</label>
          <InputWithIcon
            icon={dollor}
            type="text"
            placeholder="Asking price"
            value={propertyInfo.askingPrice}
            onChange={(e) => {
              clearError("asking_price");
              handleChange(e.target.value, "askingPrice");
            }}
          />
          {error?.asking_price && <p className="body-S red-D">{error?.asking_price}</p>}
        </div>
      </div>

      <div className="mt-6 md:flex gap-5">
        <div className="w-[100%]">
          <label className="dark-H head-4 mb-2">Building Size</label>
          <InputWithIcon
            icon={sqft}
            type="text"
            placeholder="Building size"
            value={propertyInfo.buildingSize}
            onChange={(e) => {
              clearError("building_size");
              handleChange(e.target.value, "buildingSize");
            }}
          />
          {error?.building_size && <p className="body-S red-D">{error?.building_size}</p>}
        </div>

        <div className="w-[100%] mt-6 md:mt-0">
          <label className="dark-H head-4 mb-2">Land Size</label>
          <InputWithIcon
            icon={sqft}
            type="text"
            placeholder="Land size"
            value={propertyInfo.landSize}
            onChange={(e) => {
              clearError("land_size");
              handleChange(e.target.value, "landSize");
            }}
          />
          {error?.land_size && <p className="body-S red-D">{error?.land_size}</p>}
        </div>
      </div>

      <hr className="my-8" />
      <p className="dark-M body-L">
        OWNER INFORMATION<span className="red-D">*</span>
      </p>

      <div className="mt-6">
        <RadioGroup
          onChange={(value) => {
            // handleChange(value, "ownerType");
            onSetFormData({ ...propertyInfo, ownerType: value, owner_name: "", owner_id: "" });
            setOwnerOptions([]);
          }}
          value={propertyInfo.ownerType}
        >
          <Stack direction="row" gap={5}>
            <Radio value="company">Company</Radio>
            <Radio value="contact">Contact</Radio>
          </Stack>
        </RadioGroup>
      </div>

      <div className="mt-6 md:w-[50%]">
        <SearchDropdown
          isTop={true}
          text={propertyInfo?.owner_name}
          options={ownerOptions}
          placeholder={`Search ${propertyInfo.ownerType} here`}
          fetchSuggestions={fetchSuggestions}
          onSetOptions={(value) => setOwnerOptions(value)}
          handleSelect={(option) => {
            clearError("owner_contact_id");
            clearError("owner_company_id");
            onSetFormData({ ...propertyInfo, owner_name: option?.label, owner_id: option?.value });
            setOwnerOptions([]);
          }}
        />
        {error?.owner_company_id && <p className="body-S red-D pt-1">{error?.owner_company_id}</p>}
      </div>

      <div className="mt-6">
        <button type="submit" className="save-button light-L head-5 green-bg-H">
          {from === "edit" ? "Edit" : "Add"} Property
        </button>

        <button type="button" onClick={handleClose} className="green-H ml-5">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddPropertyData;
