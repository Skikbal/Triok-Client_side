import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import phone from "../../../assets/svgs/call.svg";
import ActionsMenu from "../../../components/ActionsMenu";
import DeleteConfirmationModal from "../../../components/ConfirmationModals/DeleteConfirmationModal";

const PropertyDetailHeader = ({ propertydata }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    axios
      .get(`${BASE_URL}/delete-property/${id}`, config)
      .then((res) => {
        if (res.data.success) {
          navigate("/properties");
        }
        setShowDeleteModal(false);
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <div>
      <div className="md:flex items-start justify-between">
        <div>
          <p className="head-2 dark-H capitalize">{propertydata?.property_name ? propertydata?.property_name : "N/A"}</p>
          <p className="body-N dark-M capitalize">{propertydata?.property_type ? propertydata?.property_type?.type : "N/A"}</p>
        </div>

        <div className="mt-5 md:mt-0">
          <ActionsMenu
            handleEdit={() => {
              navigate(`/edit-property/${id}`);
            }}
            handleDelete={() => {
              setShowDeleteModal(true);
            }}
          />
        </div>
      </div>

      <div className="mt-6 md:flex justify-between">
        <div>
          <p className="body-N dark-M">Last Update</p>
          <p className="body-N dark-H">{propertydata?.last_update_date ? propertydata?.last_update_date : "N/A"}</p>
        </div>

        <div className="mt-5 md:mt-0">
          <p className="body-N dark-M">Store #</p>
          <p className="body-N dark-H">{propertydata?.store ? propertydata?.store : "N/A"}</p>
        </div>

        <div className="mt-5 md:mt-0">
          <p className="body-N dark-M">Address</p>
          <p className="body-N dark-H">{propertydata?.street_address ? `${propertydata?.street_address}, ${propertydata?.city}, ${propertydata?.state}, ${propertydata?.zipcode}` : "N/A"}</p>
        </div>

        <div className="mt-5 md:mt-0">
          <div className="flex flex-col">
            <span className="head-5 green-H underline">Google Maps Link</span>
            <a href={propertydata?.google_map_link ? propertydata?.google_map_link : ""} className="body-N dark-H underline">
              {propertydata?.google_map_link ? propertydata?.google_map_link?.substring(0, 25) : "N/A"}
            </a>
          </div>

          <div className=" flex flex-col">
            <span className="head-5 green-H underline">RPR Link</span>
            <a href={propertydata?.rpr_link} className="body-N dark-H underline">
              {propertydata?.rpr_link ? propertydata?.rpr_link : "N/A"}
            </a>
          </div>
        </div>

        <div className="mt-5 md:mt-0">
          <p
            role="button"
            onClick={() => {
              if (propertydata?.owner_company_id) {
                navigate(`/company/${propertydata?.owner_company_id}`);
              } else {
                navigate(`/contact/${propertydata?.owner_contact_id}`);
              }
            }}
            className="head-5 green-H underline"
          >
            {propertydata?.owner?.name}
          </p>
          <div className="flex items-center gap-2 mt-1 ">
            <img src={phone} alt="icon" />
            {propertydata?.owner_phone?.length > 0 ? (
              <p className="head-5 dark-H">
                {propertydata?.owner_phone ? `${propertydata?.owner_phone?.[0]?.country_code} ${propertydata?.owner_phone?.[0]?.phone_number}` : "N/A"} <span className="body-S dark-M">{propertydata?.owner_phone?.length > 0 ? `${propertydata?.owner_phone?.[0]?.ext}` : "N/A"}</span> <span className="body-XS green-H tag-data">{propertydata?.owner_phone?.length > 0 ? `${propertydata?.owner_phone?.[0]?.phone_category}` : "N/A"}</span>
              </p>
            ) : (
              "N/A"
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 body-N">
        <p className="dark-M">Comments</p>
        <p className="dark-H">{propertydata?.comment ? propertydata?.comment : "N/A"}</p>
      </div>

      <div className="md:flex justify-between">
        <div className="mt-6 body-N md:w-[50%]">
          <p className="dark-M">Property Type</p>
          <p className="tags green-H body-S mt-1">{propertydata?.property_type?.type}</p>
        </div>

        <div className="mt-6 body-N md:w-[50%]">
          <p className="dark-M">Property Tags</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {propertydata?.propertytag_details?.map((el, i) => (
              <p key={i} className="tags green-H body-S">
                {el?.tag_name}
              </p>
            ))}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </div>
  );
};

export default PropertyDetailHeader;
