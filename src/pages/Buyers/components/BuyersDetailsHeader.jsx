import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import EditBuyersModal from "../EditBuyersModal";
import phone from "../../../assets/svgs/call.svg";
import { BASE_URL } from "../../../utils/Element";
import ActionsMenu from "../../../components/ActionsMenu";
import DeleteConfirmationModal from "../../../components/ConfirmationModals/DeleteConfirmationModal";
import BuyerDetailModal from "../BuyerDetailModal";

const BuyersDetailsHeader = ({ buyerData, onCallApi }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/delete-acquisition/${id}`, config)
      .then((res) => {
        navigate("/buyers");
        setShowDeleteModal(false);
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
          <p className="head-2 dark-H">{buyerData?.contact?.name}</p>
          <p className="body-N dark-M">Last contact on {moment(buyerData?.updated_at).fromNow()}</p>
        </div>

        <div className="flex items-center gap-3 mt-5 md:mt-0">
          <ActionsMenu
            handleEdit={() => {
              setShowModal(true);
            }}
            handleDelete={() => {
              setShowDeleteModal(true);
            }}
            showOtherOption={true}
            otherOptionTitle={"View"}
            handleOtherOption={() => {
              setShowDetailModal(true);
            }}
          />
        </div>
      </div>

      <div className="mt-6 md:flex justify-between">
        <div>
          <p className="body-N dark-M">Last Update</p>
          <p className="body-N dark-H">{moment(buyerData?.updated_at).format("MM/DD/YYYY")}</p>
        </div>

        <div className="mt-5 md:mt-0">
          <p className="body-N dark-M">Address</p>
          <p className="body-N dark-H">{buyerData?.contact?.address?.[0]?.address ? buyerData?.contact?.address?.[0]?.address : "N/A"}</p>
        </div>

        <div className="mt-5 md:mt-0">
          <p className="head-5 green-H underline">Crestview Realty</p>
          <div className="flex items-center gap-2 mt-1 ">
            <img src={phone} alt="icon" />
            {buyerData?.contact?.phone?.[0]?.phone_number ? (
              <p className="head-5 dark-H">
                {buyerData?.contact?.phone?.[0]?.country_code} {buyerData?.contact?.phone?.[0]?.phone_number}
                {buyerData?.contact?.phone?.[0]?.phone_category && <span className="body-XS green-H tag-data">{buyerData?.contact?.phone?.[0]?.phone_category}</span>}
              </p>
            ) : (
              "N/A"
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 body-N">
        <p className="dark-M">Comments</p>
        <p className="dark-H">{buyerData?.comment}</p>
      </div>

      <div className="md:flex justify-between">
        <div className="mt-6 body-N md:w-[50%]">
          <p className="dark-M">Landlord Responsibilities</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {buyerData?.landlord_responsibilities?.map((el, i) => (
              <p key={i} className="tags green-H body-S">
                {el}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-6 body-N md:w-[50%]">
          <p className="dark-M">State</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {buyerData?.state?.map((el, i) => (
              <p key={i} className="tags green-H body-S">
                {el}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="md:flex justify-between">
        <div className="mt-6 body-N md:w-[50%]">
          <p className="dark-M">Property Type</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {buyerData?.property_type?.map((el, i) => (
              <p key={i} className="tags green-H body-S">
                {el?.type}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-6 body-N md:w-[50%]">
          <p className="dark-M">Tenant Name</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {buyerData?.tenant_details?.map((el, i) => (
              <p key={i} className="tags green-H body-S">
                {el?.tenant_name}
              </p>
            ))}
          </div>
        </div>
      </div>

      <BuyerDetailModal showModal={showDetailModal} onClose={() => setShowDetailModal(false)} id={id} />

      <EditBuyersModal showModal={showModal} onClose={() => setShowModal(false)} onCallApi={onCallApi} id={id} />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </div>
  );
};

export default BuyersDetailsHeader;
