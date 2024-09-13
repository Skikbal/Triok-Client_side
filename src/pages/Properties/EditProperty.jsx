import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import AddPropertyData from "./components/AddPropertyData";

const initialPropertyInfo = {
  propertyName: "",
  storeNumber: "",
  propertyType: "",
  streetAddress: "",
  city: "",
  state: "",
  zipcode: "",
  googleMapsLink: "",
  rprLink: "",
  lastUpdateDate: "",
  comment: "",
  leaseType: null,
  leaseCommencementDate: "",
  leaseExpirationDate: "",
  annualRent: "",
  askingCapRate: "",
  askingPrice: "",
  buildingSize: "",
  landSize: "",
  availabilityStatusUpdateDate: "",
  owner_name: "",
  owner_id: "",
  ownerType: "company",
  propertyTag: [],
};

const EditProperty = () => {
  const [config] = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [propertyInfo, setPropertyInfo] = useState(initialPropertyInfo);

  const propertydetailsdata = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/property-getbyid/${id}`, config)
      .then((res) => {
        const propertyEditdata = res?.data?.data;
        setPropertyInfo({
          propertyName: propertyEditdata?.property_name,
          storeNumber: propertyEditdata?.store,
          propertyType: propertyEditdata?.property_type?.id,
          streetAddress: propertyEditdata?.street_address,
          city: propertyEditdata?.city,
          state: propertyEditdata?.state,
          zipcode: propertyEditdata?.zipcode,
          googleMapsLink: propertyEditdata?.google_map_link,
          rprLink: propertyEditdata?.rpr_link,
          lastUpdateDate: propertyEditdata?.last_update_date,
          comment: propertyEditdata?.comment,
          leaseType: propertyEditdata?.lease_type,
          leaseCommencementDate: propertyEditdata?.lease_commencement_date,
          leaseExpirationDate: propertyEditdata?.lease_expiration_date,
          annualRent: propertyEditdata?.anual_rent,
          askingCapRate: propertyEditdata?.asking_cap_rate,
          askingPrice: propertyEditdata?.asking_price,
          buildingSize: propertyEditdata?.building_size,
          landSize: propertyEditdata?.land_size,
          availabilityStatusUpdateDate: propertyEditdata?.availability_status_date,
          owner_name: propertyEditdata?.owner?.name,
          owner_id: propertyEditdata?.owner?.id,
          ownerType: propertyEditdata?.owner_info_type,
          propertyTag: propertyEditdata?.propertytag_id,
        });
        setLoading(false);
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          NotificationManager.error(error.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    propertydetailsdata();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      property_name: propertyInfo.propertyName,
      store: propertyInfo.storeNumber,
      property_type: propertyInfo?.propertyType,
      street_address: propertyInfo.streetAddress,
      city: propertyInfo.city,
      comment: propertyInfo.comment,
      state: propertyInfo.state,
      zipcode: propertyInfo.zipcode,
      google_map_link: propertyInfo.googleMapsLink,
      rpr_link: propertyInfo.rprLink,
      last_update_date: propertyInfo.lastUpdateDate,
      lease_type: propertyInfo?.leaseType,
      lease_commencement_date: propertyInfo.leaseCommencementDate,
      lease_expiration_date: propertyInfo.leaseExpirationDate,
      anual_rent: propertyInfo.annualRent,
      asking_cap_rate: propertyInfo.askingCapRate,
      asking_price: propertyInfo.askingPrice,
      building_size: propertyInfo.buildingSize,
      land_size: propertyInfo.landSize,
      availability_status_date: propertyInfo.availabilityStatusUpdateDate,
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
      .post(`${BASE_URL}/property-edit/${id}`, payload, config)
      .then((res) => {
        setPropertyInfo(initialPropertyInfo);
        navigate(`/property/${id}`);
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          NotificationManager.error(error.response?.data?.message);
        }
      });
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

    // Update the property information state
    setPropertyInfo((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleClose = () => {
    setPropertyInfo(initialPropertyInfo);
    navigate(`/property/${id}`);
  };

  return (
    <BaseLayout>
      <div className="contact-header">
        <p className="head-1 dark-H md:px-0 px-3">Edit Property</p>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <AddPropertyData
          from="edit"
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
      )}
    </BaseLayout>
  );
};

export default EditProperty;
