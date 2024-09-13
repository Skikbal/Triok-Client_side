import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import AddPropertyData from "./components/AddPropertyData";

const initialPropertyData = {
  propertyName: "",
  storeNumber: "",
  propertyType: "",
  streetAddress: "",
  city: "",
  state: "",
  zipcode: "",
  googleMapsLink: "",
  rprLink: "",
  comment: "",
  leaseType: null,
  leaseCommencementDate: "",
  leaseExpirationDate: "",
  annualRent: "",
  askingCapRate: "",
  askingPrice: "",
  buildingSize: "",
  landSize: "",
  owner_name: "",
  owner_id: "",
  ownerType: "company",
  propertyTag: [],
};

const AddProperty = () => {
  const navigate = useNavigate();
  const [config] = useAuth();
  const [error, setError] = useState();
  const [propertyInfo, setPropertyInfo] = useState(initialPropertyData);

  const handleClose = () => {
    setPropertyInfo(initialPropertyData);
    navigate("/properties");
  };

  const clearError = (name) => {
    setError({ ...error, [name]: "" });
  };

  const handleChange = (value, fieldName) => {
    if (fieldName === "owner_id") {
      setError((prevErrors) => ({
        ...prevErrors,
        owner_contact_id: "",
        owner_company_id: "",
      }));
    }

    if (["storeNumber", "zipcode", "annualRent", "askingCapRate", "askingPrice", "buildingSize", "landSize"].includes(fieldName)) {
      value = value.replace(/[^\d]/g, "");

      if (fieldName === "askingCapRate" && value.length > 3) {
        value = value.slice(0, 3);
      }
    }

    setPropertyInfo((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      property_name: propertyInfo.propertyName,
      store: propertyInfo.storeNumber,
      property_type: propertyInfo.propertyType,
      street_address: propertyInfo.streetAddress,
      city: propertyInfo.city,
      comment: propertyInfo.comment,
      state: propertyInfo.state,
      zipcode: propertyInfo.zipcode,
      google_map_link: propertyInfo.googleMapsLink,
      rpr_link: propertyInfo.rprLink,
      lease_type: propertyInfo.leaseType,
      lease_commencement_date: propertyInfo.leaseCommencementDate,
      lease_expiration_date: propertyInfo.leaseExpirationDate,
      anual_rent: propertyInfo.annualRent,
      asking_cap_rate: propertyInfo.askingCapRate,
      asking_price: propertyInfo.askingPrice,
      building_size: propertyInfo.buildingSize,
      land_size: propertyInfo.landSize,
      owner_info_type: propertyInfo?.ownerType,
      propertytag_id: propertyInfo?.propertyTag,
    };

    if (propertyInfo?.ownerType === "contact") {
      payload.owner_contact_id = propertyInfo?.owner_id;
    }

    if (propertyInfo?.ownerType === "company") {
      payload.owner_company_id = propertyInfo?.owner_id;
    }

    axios
      .post(`${BASE_URL}/add-property`, payload, config)
      .then((res) => {
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
        setPropertyInfo(initialPropertyData);
        navigate("/properties");
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          NotificationManager.error(error.response?.data?.message);
        }
        setError(error?.response?.data?.errors);
      });
  };

  return (
    <BaseLayout>
      <div className="contact-header">
        <p className="head-1 dark-H md:px-0 px-3">Add Property</p>
      </div>

      <AddPropertyData
        error={error}
        propertyInfo={propertyInfo}
        onSetFormData={(value) => {
          setPropertyInfo(value);
        }}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleClose={handleClose}
        clearError={clearError}
      />
    </BaseLayout>
  );
};

export default AddProperty;
