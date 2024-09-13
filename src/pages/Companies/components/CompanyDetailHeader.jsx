import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import phone from "../../../assets/svgs/call.svg";
import EditCompanyModal from "../EditCompanyModal";
import { NotificationManager } from "react-notifications";
import ActionsMenu from "../../../components/ActionsMenu";
import DeleteConfirmationModal from "../../../components/ConfirmationModals/DeleteConfirmationModal";

const CompanyDetailHeader = ({ companyDetails, onSetCallApiAgain }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    axios
      .get(`${BASE_URL}/delete-company/${id}`, config)
      .then((res) => {
        if (res.data.success) {
          navigate("/companies");
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
    <div className="contact-details light-bg-L">
      <div className="md:flex items-start justify-between">
        <div>
          <p className="head-2 dark-H capitalize">{companyDetails?.company_name}</p>
          <p className="body-N dark-M">Last contact on {moment(companyDetails?.updated_at).fromNow()}</p>
        </div>

        <div className="mt-5 md:mt-0">
          {companyDetails?.communication?.length !== 0 && (
            <div className="flex items-center gap-2">
              {companyDetails?.communication
                ?.filter((el) => el !== "")
                ?.flatMap((tag, i) => (
                  <p key={i} className="tags green-H body-S capitalize">
                    {tag}
                  </p>
                ))}
            </div>
          )}
        </div>

        <div className="mt-5 md:mt-0">
          <ActionsMenu
            handleEdit={() => {
              setShowModal(true);
            }}
            handleDelete={() => {
              setShowDeleteModal(true);
            }}
          />
        </div>
      </div>

      <div className="mt-6 md:flex justify-between">
        <div>
          <p className="body-N dark-M">Tax Record Letter Sent</p>
          <p className="body-N dark-H">{companyDetails?.tax_record_sent}</p>
        </div>

        <div className="mt-5 md:mt-0">
          <p className="body-N dark-M">Website URL</p>
          <p
            role="button"
            className="body-N green-H"
            onClick={() => {
              window.open(companyDetails?.website_link, "_blank");
            }}
          >
            {companyDetails?.website_link}
          </p>
        </div>

        <div className="mt-5 md:mt-0">
          <p className="body-N dark-M">Address</p>

          {companyDetails?.address?.[0]?.street ? (
            <p className="body-N dark-H ">
              {companyDetails?.address !== null ? `${companyDetails?.address?.[0]?.street}, ${companyDetails?.address?.[0]?.city}, ${companyDetails?.address?.[0]?.state} ${companyDetails?.address?.[0]?.zip_code}` : "N/A"}
              {companyDetails?.address?.[0]?.address_category && <span className="body-XS green-H tag-data capitalize ml-1">{companyDetails?.address?.[0]?.address_category}</span>}
            </p>
          ) : (
            "N/A"
          )}
        </div>

        <div className="flex items-center gap-2 mt-5 md:mt-0">
          <img src={phone} alt="icon" />
          {companyDetails?.phone?.[0]?.phone_number ? (
            <p className="head-5 dark-H">
              {companyDetails?.phone?.[0]?.country_code} {companyDetails?.phone?.[0]?.phone_number} {companyDetails?.phone?.[0]?.ext && <span className="body-S dark-M">ext. {companyDetails?.phone?.[0]?.ext}</span>}
              {companyDetails?.phone?.[0]?.phone_category && <span className="body-XS green-H tag-data capitalize ml-1">{companyDetails?.phone?.[0]?.phone_category}</span>}
            </p>
          ) : (
            "N/A"
          )}
        </div>
      </div>

      <div className="mt-6 body-N">
        <p className="dark-M">Comments</p>
        <p className="dark-H">{companyDetails?.comment}</p>
      </div>

      <EditCompanyModal
        showModal={showModal}
        onSetCallApiAgain={onSetCallApiAgain}
        onClose={() => {
          setShowModal(false);
        }}
      />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </div>
  );
};

export default CompanyDetailHeader;
