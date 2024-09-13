import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import Modal from "../../components/Modal/Modal";
import RightModal from "../../components/Modal/RightModal";
import { handleDropdownClose } from "../../utils/utils";

const BuyerDetailModal = ({ showModal, onClose, id }) => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [buyerDetails, setBuyerDetails] = useState();

  useEffect(() => {
    const handleClose = () => {
      onClose();
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const fetchDetails = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/acquisition-getbyid/${id}`, config)
      .then((res) => {
        const buyerData = res?.data?.data;
        setBuyerDetails(buyerData);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id && showModal) {
      fetchDetails();
    }
  }, [id, showModal]);

  return (
    // <Modal title="Buyer Details" desc="Get buyer details and track progress." show={showModal} onClose={onClose}>
    <RightModal isOpen={showModal} onClose={onClose} ref={dropdownRef} from="view" title={"Buyer Details"} desc={"Get buyer details and track progress."}>
      {loading ? (
        <Loader />
      ) : (
        <div className="body-S dark-M">
          <div>
            <p className="uppercase">Buyer Name</p>
            <p
              className="head-4 green-H underline"
              role="button"
              onClick={() => {
                if (buyerDetails?.contact_id) {
                  navigate(`/contact/${buyerDetails?.contact_id}`);
                } else {
                  navigate(`/company/${buyerDetails?.company_id}`);
                }
              }}
            >
              {buyerDetails?.contact_id !== null ? `${buyerDetails?.contact?.first_name} ${buyerDetails?.contact?.last_name}` : buyerDetails?.company.name}
            </p>
          </div>

          <div className="mt-6">
            <p className="uppercase">Last Update</p>
            <p className="head-4 dark-H">{moment(buyerDetails?.updated_at).format("MM/DD/YYYY")}</p>
          </div>

          <div className="mt-6">
            <p className="uppercase">Address</p>
            <p className="head-4 dark-H">{buyerDetails?.contact_id !== null ? (buyerDetails?.contact?.address?.[0]?.address ? buyerDetails?.contact?.address?.[0]?.address : "N/A") : buyerDetails?.company?.address?.[0]?.address ? buyerDetails?.company?.address?.[0]?.address : "N/A"}</p>
          </div>

          <div className="mt-6">
            <p className="uppercase">Comments</p>
            <p className="head-4 dark-H">{buyerDetails?.comment}</p>
          </div>

          <div className="mt-6">
            <p className="uppercase">Availability Status</p>
            <p className="head-4 dark-H">{buyerDetails?.availability_status === 0 ? "Off Market" : "On Market"}</p>
          </div>

          <div className="mt-6">
            <p className="uppercase">Buyer Status</p>
            <p className="head-4 dark-H">{buyerDetails?.buyer_status === 0 ? "Pipeline" : buyerDetails?.buyerStatus}</p>
          </div>

          <div className="mt-6">
            <p className="uppercase">Criteria Update Date</p>
            <p className="head-4 dark-H">{buyerDetails?.updated_at ? moment(buyerDetails?.updated_at).format("MM/DD/YYYY") : "N/A"}</p>
          </div>

          <div className="mt-6">
            <p className="uppercase">Min Lease Term Reamaining</p>
            <p className="head-4 dark-H">{buyerDetails?.min_lease_term_reamaining}</p>
          </div>

          <div className="mt-6">
            <p className="uppercase">Min Price</p>
            <p className="head-4 dark-H">${buyerDetails?.min_price?.toLocaleString()}</p>
          </div>

          <div className="mt-6">
            <p className="uppercase">Max Price</p>
            <p className="head-4 dark-H">${buyerDetails?.max_price?.toLocaleString()}</p>
          </div>

          <div className="mt-6">
            <p className="uppercase">Asking Cap Rate</p>
            <p className="head-4 dark-H">{buyerDetails?.min_asking_cap_rate}%</p>
          </div>

          <div className="mt-6">
            <p className="dark-M">Landlord Responsibilities</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {buyerDetails?.landlord_responsibilities?.map((el, i) => (
                <p key={i} className="tags green-H body-S">
                  {el}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="dark-M">State</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {buyerDetails?.state?.map((el, i) => (
                <p key={i} className="tags green-H body-S">
                  {el}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="dark-M">Property Type</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {buyerDetails?.property_type?.map((el, i) => (
                <p key={i} className="tags green-H body-S">
                  {el?.type}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="dark-M">Tenant Name</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {buyerDetails?.tenant_details?.map((el, i) => (
                <p key={i} className="tags green-H body-S">
                  {el?.tenant_name}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* </Modal> */}
    </RightModal>
  );
};

export default BuyerDetailModal;
